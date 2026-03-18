/**
 * Live Lottery Data Fetching Module
 * 
 * Fetches real-time jackpot data from official lottery APIs:
 * - Mega Millions: Official API (megamillions.com)
 * - Powerball: NY Open Data API (data.ny.gov) for numbers + JSON fallback for jackpot
 */

// ============================================================
// CACHE
// ============================================================

const CACHE_DURATION_MS = 5 * 60 * 1000 // 5 minutes
let cachedData = null
let lastFetchTime = 0

// ============================================================
// HELPERS
// ============================================================

function formatDrawDate(dateStr) {
  try {
    const d = new Date(dateStr)
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    return `${days[d.getDay()]}, ${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`
  } catch {
    return dateStr
  }
}

function getStateFullName(code) {
  const states = {
    AL: 'Alabama', AK: 'Alaska', AZ: 'Arizona', AR: 'Arkansas', CA: 'California',
    CO: 'Colorado', CT: 'Connecticut', DE: 'Delaware', FL: 'Florida', GA: 'Georgia',
    HI: 'Hawaii', ID: 'Idaho', IL: 'Illinois', IN: 'Indiana', IA: 'Iowa',
    KS: 'Kansas', KY: 'Kentucky', LA: 'Louisiana', ME: 'Maine', MD: 'Maryland',
    MA: 'Massachusetts', MI: 'Michigan', MN: 'Minnesota', MS: 'Mississippi', MO: 'Missouri',
    MT: 'Montana', NE: 'Nebraska', NV: 'Nevada', NH: 'New Hampshire', NJ: 'New Jersey',
    NM: 'New Mexico', NY: 'New York', NC: 'North Carolina', ND: 'North Dakota', OH: 'Ohio',
    OK: 'Oklahoma', OR: 'Oregon', PA: 'Pennsylvania', RI: 'Rhode Island', SC: 'South Carolina',
    SD: 'South Dakota', TN: 'Tennessee', TX: 'Texas', UT: 'Utah', VT: 'Vermont',
    VA: 'Virginia', WA: 'Washington', WV: 'West Virginia', WI: 'Wisconsin', WY: 'Wyoming',
    DC: 'District of Columbia', PR: 'Puerto Rico', VI: 'Virgin Islands'
  }
  return states[code] || code
}

function getNextPowerballDate() {
  const now = new Date()
  // Adjust to ET (UTC-5 or UTC-4) for logic simplicity if needed, 
  // but for a simple "next day" check, we can use local or UTC base
  const next = new Date(now)
  next.setHours(23, 0, 0, 0) // Drawings are at 11 PM ET

  // Drawing days: 1 (Mon), 3 (Wed), 6 (Sat)
  const drawDays = [1, 3, 6]
  
  // If it's already a draw day and past 11 PM, move to tomorrow
  if (drawDays.includes(now.getDay()) && now.getHours() >= 23) {
    next.setDate(next.getDate() + 1)
  }

  // Find the next drawing day
  while (!drawDays.includes(next.getDay())) {
    next.setDate(next.getDate() + 1)
  }

  return formatDrawDate(next.toISOString())
}

// ============================================================
// MEGA MILLIONS — Official API
// ============================================================

async function fetchMegaMillionsLive() {
  // Try Vite proxy first (dev), then CORS proxy (prod)
  const urls = [
    '/api/megamillions',
    'https://api.allorigins.win/raw?url=' + encodeURIComponent('https://www.megamillions.com/cmspages/utilservice.asmx/GetLatestDrawData')
  ]

  for (const url of urls) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(8000) })
      if (!res.ok) continue

      const text = await res.text()

      // The API returns XML-wrapped JSON: <string xmlns="...">{ JSON }</string>
      let jsonStr = text
      // Try to extract JSON from XML wrapper
      const match = text.match(/<string[^>]*>([\s\S]*?)<\/string>/i)
      if (match && match[1]) {
        jsonStr = match[1]
      }

      const data = JSON.parse(jsonStr)
      if (!data || !data.Jackpot) continue

      const jackpot = data.Jackpot
      const drawing = data.Drawing
      const nextDate = data.NextDrawingDate

      // Find jackpot winner info
      const jackpotWinnerLocations = (data.MatchWinnersLocation || [])
        .filter(w => w.PrizeLevel && w.PrizeLevel.toLowerCase().includes('jackpot'))

      const hasJackpotWinner = jackpot.Winners > 0 || jackpotWinnerLocations.length > 0

      // Determine current jackpot amount to display
      // We always show the NEXT prize pool (the upcoming estimated jackpot) 
      // as that is what users are currently playing for and what is shown on official sites.
      const currentAmount = Math.round(jackpot.NextPrizePool / 1_000_000)
      const currentCash = Math.round(jackpot.NextCashValue / 1_000_000 * 10) / 10

      // Extract top non-jackpot winner info from PrizeTiers and MatchWinnersLocation
      const prizeTiers = data.PrizeTiers || []
      const prizeMatrix = data.PrizeMatrix?.PrizeTiers || []
      const matchWinnersLocation = data.MatchWinnersLocation || []

      // Find the highest non-jackpot tier that has winners
      // Tier 0 = jackpot, Tier 1 = Match 5+0 ($1M), Tier 2 = Match 4+1 ($10K), etc.
      let topNonJackpotWinner = null
      for (let tier = 1; tier <= 2; tier++) {
        const tierWinners = prizeTiers.filter(t => t.Tier === tier && !t.IsMegaplier)
        const totalWinners = tierWinners.reduce((sum, t) => sum + (t.Winners || 0), 0)
        if (totalWinners > 0) {
          // Find the prize amount from the matrix
          const matrixRow = prizeMatrix.find(m => m.PrizeTier === tier)
          const baseAmount = matrixRow ? matrixRow.PrizeAmount : (tier === 1 ? 1000000 : 10000)

          // Find the highest multiplied winner
          let highestPrize = baseAmount
          for (const tw of tierWinners) {
            if (tw.Winners > 0 && tw.Multiplier) {
              const mult = parseInt(tw.Multiplier.replace('x', ''))
              if (!isNaN(mult) && baseAmount * mult > highestPrize) {
                highestPrize = baseAmount * mult
              }
            }
          }

          // Try to find the state from MatchWinnersLocation
          // Prize levels like "5X" (Match 5 no MB), "4X" (Match 4+MB)
          const tierLevelKey = tier === 1 ? '5' : '4'
          const locationMatch = matchWinnersLocation.find(
            w => w.PrizeLevel && w.PrizeLevel.startsWith(tierLevelKey) && !w.PrizeLevel.toLowerCase().includes('jackpot')
          )

          topNonJackpotWinner = {
            tier,
            amount: highestPrize,
            amountFormatted: '$' + highestPrize.toLocaleString('en-US'),
            totalWinners,
            state: locationMatch ? getStateFullName(locationMatch.StateCode) : null,
            date: drawing ? formatDrawDate(drawing.PlayDate) : null
          }
          break // Found the highest tier with winners
        }
      }

      const result = {
        amount: currentAmount,
        cashOption: currentCash,
        nextDrawing: nextDate ? formatDrawDate(nextDate) : 'Next Draw',
        ticketPrice: data.PrizeMatrix?.TicketPrice || 5,
        // Extra live data
        _live: true,
        _lastDrawDate: drawing ? formatDrawDate(drawing.PlayDate) : null,
        _winningNumbers: drawing ? [drawing.N1, drawing.N2, drawing.N3, drawing.N4, drawing.N5].join(', ') + ' | MB: ' + drawing.MBall : null,
        _hadJackpotWinner: hasJackpotWinner,
        _jackpotWinnerState: jackpotWinnerLocations.length > 0
          ? getStateFullName(jackpotWinnerLocations[0].StateCode)
          : null,
        _previousJackpot: Math.round(jackpot.CurrentPrizePool / 1_000_000),
        _previousJackpotFormatted: '$' + Math.round(jackpot.CurrentPrizePool / 1_000_000) + ' Million',
        _previousCashValue: Math.round(jackpot.CurrentCashValue / 1_000_000 * 10) / 10,
        _topNonJackpotWinner: topNonJackpotWinner
      }

      console.log('[LotteryAPI] ✅ Mega Millions live data fetched:', {
        amount: result.amount + 'M',
        nextDraw: result.nextDrawing,
        hadWinner: result._hadJackpotWinner,
        winnerState: result._jackpotWinnerState
      })

      return result
    } catch (err) {
      console.warn('[LotteryAPI] Mega Millions fetch attempt failed:', err.message)
      continue
    }
  }

  console.warn('[LotteryAPI] ⚠️ All Mega Millions fetch attempts failed')
  return null
}

// ============================================================
// POWERBALL — NY Open Data + fallback
// ============================================================

async function fetchPowerballLive(fallback) {
  // URLs: Vite proxy (dev), then AllOrigins (prod)
  const urls = [
    '/api/powerball',
    'https://api.allorigins.win/raw?url=' + encodeURIComponent('https://www.calottery.com/api/DrawGameApi/DrawGamePastDrawResults/12/1/1')
  ]

  for (const url of urls) {
    try {
      const res = await fetch(url, { 
        signal: AbortSignal.timeout(8000),
        headers: { 'Accept': 'application/json' }
      })
      if (!res.ok) continue

      const data = await res.json()
      if (!data || !data.NextDraw) continue

      const next = data.NextDraw
      const recent = data.MostRecentDraw

      // Format winning numbers from the CA API structure
      let winningNumbers = ''
      if (recent && recent.WinningNumbers) {
        const nums = []
        for (let i = 0; i < 5; i++) {
          if (recent.WinningNumbers[i]) nums.push(recent.WinningNumbers[i].Number)
        }
        const pb = recent.WinningNumbers[5]?.Number
        winningNumbers = nums.join(' ') + (pb ? ' ' + pb : '')
      }

      const result = {
        amount: Math.round(next.JackpotAmount / 1_000_000),
        cashOption: Math.round(next.EstimatedCashValue / 1_000_000 * 10) / 10,
        nextDrawing: next.DrawDate ? formatDrawDate(next.DrawDate) : getNextPowerballDate(),
        ticketPrice: 2,
        _live: true,
        _lastDrawDate: recent ? formatDrawDate(recent.DrawDate) : null,
        _winningNumbers: winningNumbers
      }

      console.log('[LotteryAPI] ✅ Powerball live data fetched (CA API):', {
        amount: result.amount + 'M',
        nextDraw: result.nextDrawing,
        numbers: result._winningNumbers
      })

      return result
    } catch (err) {
      console.warn('[LotteryAPI] Powerball fetch attempt failed:', err.message)
      continue
    }
  }

  // Final fallback if all else fails
  console.warn('[LotteryAPI] ⚠️ All Powerball fetch attempts failed. Using static fallback.')
  return {
    amount: fallback?.amount || 101,
    cashOption: fallback?.cashOption || 46,
    nextDrawing: getNextPowerballDate(),
    ticketPrice: fallback?.ticketPrice || 2,
    _live: false,
    _lastDrawDate: null,
    _winningNumbers: null
  }
}

// ============================================================
// COMBINED FETCH
// ============================================================

export async function fetchAllLotteryData(fallback) {
  // Check cache
  const now = Date.now()
  if (cachedData && (now - lastFetchTime) < CACHE_DURATION_MS) {
    return cachedData
  }

  console.log('[LotteryAPI] 🔄 Fetching live lottery data...')

  const [mmData, pbData] = await Promise.allSettled([
    fetchMegaMillionsLive(),
    fetchPowerballLive(fallback?.powerball)
  ])

  const mm = mmData.status === 'fulfilled' && mmData.value ? mmData.value : null
  const pb = pbData.status === 'fulfilled' && pbData.value ? pbData.value : null

  const result = {
    megaMillions: mm || fallback?.megaMillions || { amount: 50, cashOption: 22.9, nextDrawing: 'Next Draw', ticketPrice: 5 },
    powerball: pb || fallback?.powerball || { amount: 58, cashOption: 26.1, nextDrawing: 'Next Draw', ticketPrice: 2 },
    _lastUpdated: new Date().toISOString(),
    _megaMillionsLive: !!mm?._live,
    _powerballLive: !!pb?._live
  }

  // Build dynamic last jackpot winners from live data
  if (mm && mm._hadJackpotWinner) {
    result._megaMillionsJackpotWinner = {
      date: mm._lastDrawDate,
      state: mm._jackpotWinnerState || 'Unknown',
      amount: mm._previousJackpotFormatted,
      tickets: '1 winning ticket'
    }
  }

  // Build dynamic non-jackpot winner data
  if (mm && mm._topNonJackpotWinner) {
    result._megaMillionsTopWinner = mm._topNonJackpotWinner
  }

  cachedData = result
  lastFetchTime = now

  console.log('[LotteryAPI] ✅ Lottery data ready:', {
    megaMillions: result.megaMillions.amount + 'M',
    powerball: result.powerball.amount + 'M',
    mmLive: result._megaMillionsLive,
    pbLive: result._powerballLive
  })

  return result
}

/**
 * Force refresh by clearing cache
 */
export function clearLotteryCache() {
  cachedData = null
  lastFetchTime = 0
}
