import React, { useState, useEffect, useCallback, useMemo, useRef, createContext, useContext } from 'react'
import { SpeedInsights } from '@vercel/speed-insights/react'
import OddsBreakdown from './OddsBreakdown.jsx'
import ZodiacFortune from './ZodiacFortune.jsx'
import LotterySimulator from './lottery_simulator.jsx'
import LotteryHistory from './LotteryHistory.jsx'
import JackpotChecklist from './JackpotChecklist.jsx'
import LumpSumAnnuity from './LumpSumAnnuity.jsx'
import LuckyNumbers from './LuckyNumbers.jsx'
import { t, tRaw } from './translations.js'
import html2canvas from 'html2canvas'
import { STATE_TAX_RATES } from './data/stateTaxRates'
import USMap from './USMap'

// Shared Resources
import { formatNumber } from './utils/formatters.js'
import { 
  TwitterIcon, 
  FacebookIcon, 
  WhatsAppIcon, 
  InstagramIcon, 
  TikTokIcon, 
  HomeIcon, 
  BackArrow, 
  ChevronDown, 
  ArrowRight 
} from './components/Icons.jsx'
import { useThemeStyles } from './hooks/useThemeStyles.js'

// ============================================================
// THEME CONTEXT
// ============================================================

export const ThemeContext = createContext({ theme: 'dark', toggle: () => { } })

export function useTheme() {
  return useContext(ThemeContext)
}

// ============================================================
// LANGUAGE CONTEXT
// ============================================================

const LangContext = createContext({ lang: 'en', setLang: () => { } })

export function useLang() {
  return useContext(LangContext)
}

// ============================================================
// DATA & CONSTANTS
// ============================================================

import JACKPOTS from './data/jackpots.json'
import { fetchAllLotteryData } from './lotteryApi.js'

const DEFAULT_LAST_WINNERS = {
  megaMillions: { date: "Mar 4, 2026", state: "New York", amount: "$20,000" },
  powerball: { date: "Mar 14, 2026", state: "Texas", amount: "$1,000,000" }
}

const DEFAULT_LAST_JACKPOT_WINNERS = {
  megaMillions: { date: "Nov 14, 2025", state: "Georgia", amount: "$980 Million", tickets: "1 winning ticket (Publix, Newnan)" },
  powerball: { date: "Mar 2, 2026", state: "Arkansas", amount: "$251 Million", tickets: "1 winning ticket" }
}


const ODDS_PER_TICKET = {
  megaMillions: 302575350,
  powerball: 292201338
}

const DRAWINGS_PER_YEAR = {
  megaMillions: 104,
  powerball: 156
}

const GAME_TICKET_PRICE = {
  megaMillions: 5,
  powerball: 2
}

const TIERS = [
  { id: 1, count: 1, label: "1", nameKey: "smallDream", image: "/images/tier-small-dream.png", alt: "A lone dreamer holding a tiny glowing star in a vast desert" },
  { id: 2, count: 5, label: "5", nameKey: "wildAttempt", image: "/images/tier-wild-attempt.png", alt: "A group of people at the base of a glowing golden pyramid" },
  { id: 3, count: 10, label: "10", nameKey: "cosmicHope", image: "/images/tier-cosmic-hope.png", alt: "A massive crowd under a cosmic golden pyramid in space" }
]

// ============================================================
// RESULT VISUALIZATIONS — matched by ODDS (not ticket count)
// ============================================================
// VISUALIZATIONS array removed in favor of unified COMPARISON_POOL

// Fool meme tiers — triggered by total $ spent, overrides normal viz
const FOOL_TIERS = [
  { minSpend: 1_000_000, image: "/images/result-fool-1m.png", alt: "Golden clown trophy on pedestal - World's Biggest Fool Award", titleKey: "vizFool1mTitle", descKey: "vizFool1mDesc" },
  { minSpend: 100_000, image: "/images/result-fool-100k.png", alt: "Person facepalming surrounded by worthless lottery tickets", titleKey: "vizFool100kTitle", descKey: "vizFool100kDesc" },
  { minSpend: 10_000, image: "/images/result-fool-10k.png", alt: "Person with snotty nose staring at chalkboard with 1+1=67", titleKey: "vizFool10kTitle", descKey: "vizFool10kDesc" },
]

// Icons for comparison mapping
const Icons = {
  Plane: () => <span className="text-2xl">✈️</span>,
  Lightning: () => <span className="text-2xl">⚡</span>,
  Asteroid: () => <span className="text-2xl">☄️</span>,
  Vending: () => <span className="text-2xl">🥫</span>,
  Antarctica: () => <span className="text-2xl">❄️</span>,
  Dog: () => <span className="text-2xl">🐕</span>,
  Bed: () => <span className="text-2xl">🛌</span>,
  Bowling: () => <span className="text-2xl">🎳</span>,
  Medal: () => <span className="text-2xl">🥇</span>,
  Users: () => <span className="text-2xl">🤱</span>,
  Golf: () => <span className="text-2xl">⛳</span>,
  Chess: () => <span className="text-2xl">♟️</span>,
  Snake: () => <span className="text-2xl">🐍</span>,
  Cards: () => <span className="text-2xl">🃏</span>,
  Mountain: () => <span className="text-2xl">🏔️</span>,
  Bug: () => <span className="text-2xl">🐝</span>,
  Wave: () => <span className="text-2xl">🌊</span>,
  Gem: () => <span className="text-2xl">💎</span>,
  Coins: () => <span className="text-2xl">🪙</span>,
  Monkey: () => <span className="text-2xl">🐒</span>,
  Bathtub: () => <span className="text-2xl">🛁</span>,
  Trending: () => <span className="text-2xl">📈</span>,
  Graduation: () => <span className="text-2xl">🎓</span>,
  Heart: () => <span className="text-2xl">❤️</span>
}

const COMPARISON_POOL = [
  // Low Prob (< 1%)
  // Probability Scale: 1/100,000 to 1/1,000,000 in 100k increments
  { prob: 1 / 100_000, factKey: 'factAntarctica', source: 'NSF', icon: 'Antarctica', isHigh: false, image: "/images/fact_antarctica_100k_1773746697903.png", alt: "Lost in Antarctica" },
  { prob: 1 / 200_000, factKey: 'factDogBite', source: 'NSC', icon: 'Dog', isHigh: false, image: "/images/fact_dog_bite_fatality_1773746553360.png", alt: "Dog bite fatality" },
  { prob: 1 / 300_000, factKey: 'factLightningYear', source: 'NWS', icon: 'Lightning', isHigh: false, image: "/images/fact_struck_by_lightning_1773746568322.png", alt: "Lightning bolt strike" },
  { prob: 1 / 400_000, factKey: 'factFallingBed', source: 'CDC', icon: 'Bed', isHigh: false, image: "/images/fact_falling_out_of_bed_1773746580604.png", alt: "Falling out of bed" },
  { prob: 1 / 500_000, factKey: 'factBowling300', source: 'USBC', icon: 'Bowling', isHigh: false, image: "/images/fact_bowling_300_game_1773746593465.png", alt: "Bowling a perfect 300" },
  { prob: 1 / 600_000, factKey: 'factOlympicGold', source: 'SDA', icon: 'Medal', isHigh: false, image: "/images/fact_olympic_gold_600k_1773746667300.png", alt: "Olympic Gold Medal" },
  { prob: 1 / 700_000, factKey: 'factQuadruplets', source: 'JRM', icon: 'Users', isHigh: false, image: "/images/fact_quadruplets_700k_1773746683472.png", alt: "Birth of quadruplets" },
  { prob: 1 / 800_000, factKey: 'factHoleInOnePar4', source: 'NGF', icon: 'Golf', isHigh: false, image: "/images/fact_golf_hole_in_one_par4_1773746641998.png", alt: "Hole-in-one on Par 4" },
  { prob: 1 / 900_000, factKey: 'factChessGM', source: 'FIDE', icon: 'Chess', isHigh: false, image: "/images/fact_chess_grandmaster_1773746607914.png", alt: "Chess Grandmaster" },
  { prob: 1 / 1_000_000, factKey: 'factVenomousSnake', source: 'UF', icon: 'Snake', isHigh: false, image: "/images/fact_venomous_snake_bite_1773746622028.png", alt: "Venomous snake bite" },

  // Other Low Prob (< 1%)
  { prob: 1 / 11_000_000, factKey: 'factPlane', source: 'ASN', icon: 'Plane', isHigh: false, image: "/images/fact_plane.png", alt: "Plane in storm" },
  { prob: 1 / 1_222_000, factKey: 'factLightning', source: 'NWS', icon: 'Lightning', isHigh: false, image: "/images/fact_lightning.png", alt: "Lightning strike" },
  { prob: 1 / 1_600_000, factKey: 'factAsteroid', source: 'NASA', icon: 'Asteroid', isHigh: false, image: "/images/fact_asteroid.png", alt: "Asteroid impact" },
  { prob: 1 / 112_000_000, factKey: 'comparisonVending', source: 'CPSC', icon: 'Vending', isHigh: false, image: "/images/fact_vending.png", alt: "Vending machine catastrophe" },
  { prob: 1 / 649_740, factKey: 'factRoyalFlush', source: 'SPT', icon: 'Cards', isHigh: false, image: "/images/fact_poker.png", alt: "Royal flush" },
  { prob: 1 / 12_500, factKey: 'factHoleInOne', source: 'NGF', icon: 'Golf', isHigh: false, image: "/images/fact_golf.png", alt: "Hole in one" },
  { prob: 1 / 100, factKey: 'factEverest', source: 'Himalayan Database', icon: 'Mountain', isHigh: false, image: "/images/fact_everest.png", alt: "Climbing Everest" },
  { prob: 1 / 54_000, factKey: 'factBee', source: 'NSC', icon: 'Bug', isHigh: false, image: "/images/fact_bee.png", alt: "Bee sting" },
  { prob: 1 / 3_700_000, factKey: 'factShark', source: 'ISAF', icon: 'Wave', isHigh: false, image: "/images/fact_shark.png", alt: "Great White Shark" },
  { prob: 1 / 10_000, factKey: 'factPearl', source: 'GIA', icon: 'Gem', isHigh: false, image: "/images/fact_pearl.png", alt: "Pearl in oyster" },
  { prob: 1 / 268_435_456, factKey: 'comparisonCoin', source: 'Math', icon: 'Coins', isHigh: false, image: "/images/fact_coin.png", alt: "28 heads in a row" },
  { prob: 1 / 1_000_000_000, factKey: 'factMonkey', source: 'Math', icon: 'Monkey', isHigh: false, image: "/images/fact_monkey.png", alt: "Monkey at typewriter" },
  { prob: 1 / 840_000, factKey: 'factBathtub', source: 'CDC', icon: 'Bathtub', isHigh: false, image: "/images/fact_bathtub.png", alt: "Slipped in bathtub" },

  // High Prob (>= 1%)
  { prob: 1.0, factKey: 'factSP500', source: 'Vanguard', icon: 'Trending', isHigh: true, image: "/images/fact_coin.png", alt: "Market growth" },
  { prob: 1 / 8, factKey: 'factMasters', source: 'Census Bureau', icon: 'Graduation', isHigh: true, image: "/images/fact_coin.png", alt: "Master's degree" },
  { prob: 1 / 2, factKey: 'factHealthy', source: 'WHO', icon: 'Heart', isHigh: true, image: "/images/fact_coin.png", alt: "Healthy life" },
]

function getComparisonLogic(winProb, tickets) {
  let isHigh = winProb >= 0.01;
  let pool = COMPARISON_POOL.filter(item => item.isHigh === isHigh);

  // Find the closest fact in the filtered pool
  // Using log difference to handle varied scales gracefully
  const sortedPool = [...pool].sort((a, b) => {
    const diffA = Math.abs(Math.log10(a.prob) - Math.log10(winProb));
    const diffB = Math.abs(Math.log10(b.prob) - Math.log10(winProb));
    return diffA - diffB;
  });

  // Pick the closest one that is MORE likely than user if possible (for the "X times more likely" format)
  const moreLikelyClosest = sortedPool.find(item => item.prob >= winProb);

  // Final item selection
  let item = moreLikelyClosest || sortedPool[0];

  // If we can't find a low-prob fact that is more likely, shift to high prob
  if (!isHigh && !moreLikelyClosest) {
    isHigh = true;
    const highPool = COMPARISON_POOL.filter(i => i.isHigh);
    item = highPool[tickets % highPool.length];
  }

  return { ...item, forcedHigh: isHigh };
}

function ComparisonCard({ item, odds, tickets, lang }) {
  const winProb = 1 / odds
  
  // Detection for FOOL_TIER (minSpend) vs standard comparison (factKey)
  const isFoolTier = item?.minSpend !== undefined
  const IconComp = Icons[item?.icon] || (() => isFoolTier ? <span className="text-4xl">🤡</span> : null)

  // Use the forced state from the item if it exists, otherwise check winProb
  const displayHigh = item?.forcedHigh || winProb >= 0.01

  if (!item) return null

  // CASE 1: FOOL TIER (The user spent too much money)
  if (isFoolTier) {
    return (
      <div className="flex flex-col items-center bg-black/60 backdrop-blur-xl border-2 border-gold/50 rounded-2xl p-6 text-center animate-dropIn shadow-[0_0_30px_rgba(255,215,0,0.2)]">
        <div className="mb-4 p-4 bg-gold/10 rounded-full border border-gold/20">
          <IconComp />
        </div>
        <h3 className="text-gold font-black text-xl mb-2 tracking-tight uppercase">
          {t(item.titleKey, lang)}
        </h3>
        <p className="text-white font-medium text-sm leading-relaxed mb-1">
          {t(item.descKey, lang)}
        </p>
        <p className="text-gold/40 text-[9px] uppercase tracking-[0.2em] font-bold mt-2">
          {t('certifiedDefeat', lang) || 'CERTIFIED DEFEAT'}
        </p>
      </div>
    )
  }

  const factText = t(item.factKey, lang)

  // CASE 2: Normal Probability Comparison (High - e.g. 1 in 100)
  if (displayHigh) {
    const winProbPct = (winProb * 100).toFixed(1)
    return (
      <div className="flex flex-col items-center bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-6 text-center animate-dropIn">
        <div className="mb-4 p-4 bg-white/10 rounded-full">
          <IconComp />
        </div>
        <h3 className="text-white font-bold mb-2">
          {t('highProbMessage', lang, {
            count: formatNumber(tickets),
            winProb: winProbPct,
            fact: factText
          })}
        </h3>
        <p className="text-gray-500 text-[10px] uppercase tracking-widest italic">
          {t('sourceLabel', lang, { source: item.source })}
        </p>
      </div>
    )
  }

  // CASE 3: Normal Probability Comparison (Low - e.g. 1 in 1M)
  const rawMultiplier = item.prob / winProb
  const multiplier = rawMultiplier >= 10 ? Math.round(rawMultiplier) : rawMultiplier.toFixed(1)
  const isNearEqual = rawMultiplier >= 0.85 && rawMultiplier <= 1.15
  const exactOdds = item.prob < 1 ? formatNumber(Math.round(1 / item.prob)) : '1'

  return (
    <div className="flex flex-col items-center bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-6 text-center animate-dropIn">
      <div className="mb-4 p-4 bg-white/10 rounded-full">
        <IconComp />
      </div>
      <h3 className="text-white font-bold mb-1">
        {t('yourOddsAre', lang, {
          odds: odds >= 1_000_000 ? (odds / 1_000_000).toFixed(1) + 'M' : formatNumber(odds)
        })}
      </h3>
      <p className="text-white font-bold mb-3">
        {isNearEqual ? (
          t('aboutAsLikely', lang, { fact: factText })
        ) : (
          t('lowProbMessage', lang, {
            multiplier: rawMultiplier < 1 ? multiplier : formatNumber(multiplier),
            fact: factText
          })
        )}
        {" "}
        <span className="text-gray-400 font-normal">
          {t('about1in', lang, {
            exact: exactOdds
          })
        }</span>
      </p>
      <p className="text-gray-500 text-[10px] uppercase tracking-widest italic">
        {t('sourceLabel', lang, { source: item.source })}
      </p>
    </div>
  )
}

function getVisualization(game, tickets) {
  const odds = calculateOdds(game, tickets)
  const winProb = 1 / odds
  const totalSpent = tickets * JACKPOTS[game].ticketPrice

  // Check fool tiers first (based on $ spent)
  const foolViz = FOOL_TIERS.find(f => totalSpent >= f.minSpend)
  if (foolViz && odds > 10) return foolViz

  // Use unified COMPARISON_POOL logic
  return getComparisonLogic(winProb, tickets)
}

// formatNumber now imported from ./utils/formatters.js

function formatFullDollars(millions) {
  return '$' + (millions * 1_000_000).toLocaleString('en-US')
}

function calculateOdds(game, tickets) {
  const base = ODDS_PER_TICKET[game]
  return Math.ceil(base / tickets)
}

// ============================================================
// AUDIO SYSTEM (Optimized Singleton)
// ============================================================

const SOUND_URLS = {
  click: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3',
  whoosh: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3',
  sad: 'https://assets.mixkit.co/active_storage/sfx/2800/2800-preview.mp3',
  heartbeat: 'https://assets.mixkit.co/active_storage/sfx/2190/2190-preview.mp3',
  crowd: 'https://assets.mixkit.co/active_storage/sfx/10/10-preview.mp3',
  wind: 'https://assets.mixkit.co/active_storage/sfx/1101/1101-preview.mp3',
  crinkle: 'https://assets.mixkit.co/active_storage/sfx/2385/2385-preview.mp3'
};

let globalAudioCtx = null;
const lastPlayTimes = {};

function getSharedAudioCtx() {
  if (!globalAudioCtx) {
    globalAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (globalAudioCtx.state === 'suspended') {
    globalAudioCtx.resume();
  }
  return globalAudioCtx;
}

function playSound(type) {
  const now = Date.now();
  // Rapid click throttle (30ms) to prevent UI thread blocking
  if (lastPlayTimes[type] && now - lastPlayTimes[type] < 30) return;
  lastPlayTimes[type] = now;

  // Synthesis-based Pop (Low-latency)
  if (type === 'pop') {
    try {
      const ctx = getSharedAudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    } catch (e) { /* silent fail */ }
    return;
  }

  // Sample-based sounds
  if (SOUND_URLS[type]) {
    const audio = new Audio(SOUND_URLS[type]);
    audio.volume = type === 'heartbeat' ? 0.4 : type === 'crinkle' ? 0.25 : 0.2;
    audio.play().catch(() => { });
  }
}

function calculateWinYear(odds, game) {
  const drawsPerYear = DRAWINGS_PER_YEAR[game] || 104
  const yearsToWin = Math.floor(odds / drawsPerYear)
  const currentYear = new Date().getFullYear()
  return currentYear + yearsToWin
}

function useCountUp(end, duration = 2000, start = 0, shouldStart = true, delay = 0) {
  const [count, setCount] = React.useState(start)

  React.useEffect(() => {
    if (!shouldStart) {
      setCount(start)
      return
    }

    let startTime = null
    let animationFrame = null
    let timeoutId = null

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)
      setCount(Math.floor(ease * (end - start) + start))

      if (progress < 1) {
        animationFrame = requestAnimationFrame(step)
      }
    }

    timeoutId = setTimeout(() => {
      animationFrame = requestAnimationFrame(step)
    }, delay)

    return () => {
      cancelAnimationFrame(animationFrame)
      clearTimeout(timeoutId)
    }
  }, [end, start, duration, shouldStart, delay])

  return count
}

// ============================================================
// HALL OF DELUSION: CELEBRITY TICKER
// ============================================================

function RealityCheckTicker() {
  const { lang } = useLang()

  // Entire pool of all quote keys (existing + 20 new)
  const allQuoteKeys = useMemo(() => [
    'delusionElon', 'delusionTrump', 'delusionJordan', 'delusionZuck', 'delusionCelebrityFail',
    'legendQuote1', 'legendQuote2', 'legendQuote3', 'legendQuote4', 'legendQuote5',
    'legendQuote6', 'legendQuote7', 'legendQuote8', 'legendQuote9', 'legendQuote10',
    'legendQuote11', 'legendQuote12', 'legendQuote13', 'legendQuote14', 'legendQuote15',
    'legendQuote16', 'legendQuote17', 'legendQuote18', 'legendQuote19', 'legendQuote20'
  ], [])

  // Shuffle and pick 12-15 random quotes on every refresh
  const selectedQuotes = useMemo(() => {
    const shuffled = [...allQuoteKeys].sort(() => 0.5 - Math.random())
    const count = Math.floor(Math.random() * (15 - 12 + 1)) + 12
    return shuffled.slice(0, count).map(key => t(key, lang))
  }, [allQuoteKeys, lang])

  return (
    <div className="w-full bg-yellow-400/10 border-y border-yellow-400/20 py-1.5 overflow-hidden whitespace-nowrap relative z-50">
      <div className="inline-block animate-ticker">
        <span className="text-[10px] font-black text-yellow-400 mr-8">{t('realityCheckTitle', lang)}</span>
        {selectedQuotes.map((q, i) => (
          <span key={i} className="text-[10px] font-bold text-yellow-500/80 mr-12 uppercase tracking-tight">
            • {q}
          </span>
        ))}
        {/* Duplicate for seamless loop */}
        <span className="text-[10px] font-black text-yellow-400 mr-8">{t('realityCheckTitle', lang)}</span>
        {selectedQuotes.map((q, i) => (
          <span key={`dup-${i}`} className="text-[10px] font-bold text-yellow-500/80 mr-12 uppercase tracking-tight">
            • {q}
          </span>
        ))}
      </div>
    </div>
  )
}

// ============================================================
// RANDOM SITUATIONAL GIF (VIRAL FEATURE)
// ============================================================

// Curated Giphy GIF IDs — verified to work via iframe/media embed
const GIF_DATA = {
  lose: [
    { id: 'H7uNToH7c6999K5yX3', keyword: 'sad cat' },
    { id: 'd2lcHJTGfC2YVPz2', keyword: 'crying' },
    { id: '3o7TKVun7XYYhZG8mI', keyword: 'shrug' },
    { id: '9Y5BbDSkSTiY8', keyword: 'facepalm' },
    { id: '26BRzoV8E4hA3554Y', keyword: 'wasted' },
    { id: 'MOffS9d0Qv03u', keyword: 'lose' },
  ],
  hope: [
    { id: 'l0NwNrl4BtRQcjhWw', keyword: 'fingers crossed' },
    { id: 'tXL4FHPSnVJ0A', keyword: 'waiting' },
    { id: 'l4pTdcifPZLpDjL1e', keyword: 'praying' },
    { id: '3orieTfp78fKWB50uI', keyword: 'hope' },
  ],
  jackpot: [
    { id: 'xT0xeJpnrWC3XWblEk', keyword: 'mind blown' },
    { id: 'LdOyjZ7io5Msw', keyword: 'money rain' },
    { id: '67ThRZlYBvibtdF9JH', keyword: 'rich' },
    { id: 'g9582DNuQppxC', keyword: 'champagne' },
    { id: 'lptjRBxRK7VZe', keyword: 'winning' },
  ]
}

// Hardcoded manifest to avoid fetch delays and broken Giphy fallbacks
const LOCAL_GIF_MANIFEST = {
  "lose": [
    "/gifs/lose/chicago-med-natalie-manning.gif",
    "/gifs/lose/listen-to-me-guys-fred-pye.gif",
    "/gifs/lose/no-way-jesse.gif",
    "/gifs/lose/rare-but-not-never-rare.gif",
    "/gifs/lose/the-office-declare.gif",
    "/gifs/lose/this-is-a-real-possibility-adam.gif",
    "/gifs/lose/trust-trust-me.gif",
    "/gifs/lose/why-do-you-want-to-waste-money-mazet copy.gif",
    "/gifs/lose/why-do-you-want-to-waste-money-mazet.gif",
    "/gifs/lose/you-handled-the-decision-perfectly-house-party.gif"
  ],
  "hope": [
    "/gifs/hope/a-strong-possibility-sir-david-attenborough.gif",
    "/gifs/hope/arc-balance.gif",
    "/gifs/hope/arnie-grape-young.gif",
    "/gifs/hope/batman-thinking.gif",
    "/gifs/hope/buy-a-mega-millions-mega-millions.gif",
    "/gifs/hope/high-probability-sir-tag-cr.gif",
    "/gifs/hope/hope-mikaelson-hope-legacies.gif",
    "/gifs/hope/hope.gif",
    "/gifs/hope/i-got-hope-believe.gif",
    "/gifs/hope/i-hope-hoping.gif",
    "/gifs/hope/karylle-hope.gif",
    "/gifs/hope/kim-kardashian.gif",
    "/gifs/hope/magic-johnson-happy.gif",
    "/gifs/hope/money-rain.gif",
    "/gifs/hope/mr-bean-mr-beans-holiday.gif",
    "/gifs/hope/rent-throwing-away.gif",
    "/gifs/hope/rng copy.gif",
    "/gifs/hope/sonny-carisi-carisibot.gif",
    "/gifs/hope/the-muppets-kermit-the-frog.gif",
    "/gifs/hope/trust-me.gif",
    "/gifs/hope/you-might-be-correct-possibility copy.gif"
  ],
  "jackpot": [
    "/gifs/jackpot/good-decision-mr-miyagi.gif",
    "/gifs/jackpot/its-called-talent-talent.gif",
    "/gifs/jackpot/kisses-delavin-kirsten-delavin.gif",
    "/gifs/jackpot/no-reaction-win.gif",
    "/gifs/jackpot/we-did-the-right-thing-zayto.gif",
    "/gifs/jackpot/you-did-the-right-thing-shea-brennan.gif",
    "/gifs/jackpot/you-made-the-right-decision-dumisani-mbebe.gif"
  ],
  "good-luck": [
    "/gifs/good-luck/1in1000-low-chance.gif",
    "/gifs/good-luck/allenxandria-zero-percent-chance.gif",
    "/gifs/good-luck/brave-face-michael-scott.gif",
    "/gifs/good-luck/dancing-dance.gif",
    "/gifs/good-luck/good-juju.gif",
    "/gifs/good-luck/good-luck-to-everybody-brian-hull.gif",
    "/gifs/good-luck/good-luck.gif",
    "/gifs/good-luck/han-solo-never.gif",
    "/gifs/good-luck/i-wish-you-all-the-best-manjit-minhas.gif",
    "/gifs/good-luck/it's-like-winning-the-lottery-max-mitchell.gif",
    "/gifs/good-luck/it's-your-decision-ant-mcpartlin.gif",
    "/gifs/good-luck/let-me-pick-liga-profesional-de-fútbol-de-la-afa.gif",
    "/gifs/good-luck/lottery-ticket.gif",
    "/gifs/good-luck/magic-johnson-pointing.gif",
    "/gifs/good-luck/no-reaction-win copy.gif",
    "/gifs/good-luck/no-way-jesse copy.gif",
    "/gifs/good-luck/pretty-limited-derek-muller.gif",
    "/gifs/good-luck/rare-but-not-never-rare copy.gif",
    "/gifs/good-luck/rng.gif",
    "/gifs/good-luck/sam-supernatural.gif",
    "/gifs/good-luck/schitt's-creek-ithinkyourebrave.gif",
    "/gifs/good-luck/were-gonna-be-rich-dude-tolkien-black.gif",
    "/gifs/good-luck/whats-the-probability-josh-sundquist.gif",
    "/gifs/good-luck/you-might-be-correct-possibility.gif"
  ]
}

// Fallback emoji if no GIF is found in folders
const CATEGORY_EMOJI = {
  lose: '😭',
  hope: '🤞',
  jackpot: '🤑',
  'good-luck': '🍀'
}

function getGifCategory(odds) {
  const probability = 1 / odds
  if (probability >= 0.0001) return 'jackpot'
  if (probability >= 0.0000001) return 'hope'
  return 'lose'
}

function useRandomGif(category) {
  // We use the hardcoded manifest immediately for speed.
  // We can still fetch for updates if we want to support dynamic adding.
  const [manifest, setManifest] = useState(LOCAL_GIF_MANIFEST)

  useEffect(() => {
    fetch('/gifs/manifest.json')
      .then(res => res.json())
      .then(setManifest)
      .catch(err => console.warn('Manifest fetch failed, using fallback:', err))
  }, [])

  const gif = useMemo(() => {
    // 0. Logical mapping (e.g. 'good-luck' should look in 'hope' folder if available)
    const folder = category === 'good-luck' ? 'hope' : category
    
    // 1. Try manifest first (prioritizing local assets)
    if (manifest && manifest[folder] && manifest[folder].length > 0) {
      const pool = manifest[folder]
      return { url: pool[Math.floor(Math.random() * pool.length)], isLocal: true }
    }

    // 2. Fallback to Giphy curated IDs only if local folders are empty
    const key = folder // already mapped
    const gPool = GIF_DATA[key]
    if (gPool) {
      const gGif = gPool[Math.floor(Math.random() * gPool.length)]
      return { url: `https://media.giphy.com/media/${gGif.id}/giphy.gif`, keyword: gGif.keyword, isLocal: false }
    }

    return null
  }, [manifest, category])

  return {
    gifUrl: gif?.url || null,
    keyword: gif?.keyword || category,
    isLocal: gif?.isLocal || false,
    emoji: CATEGORY_EMOJI[category]
  }
}

// ============================================================
// TRANSITION SCREEN: GOOD LUCK!
// ============================================================

function TransitionScreen({ onComplete }) {
  const { gifUrl, emoji } = useRandomGif('good-luck')
  const [visible, setVisible] = useState(false)
  const [imgError, setImgError] = useState(false)

  useEffect(() => {
    // Soundscape: Heartbeat starts
    const heartbeatInterval = setInterval(() => playSound('heartbeat'), 800)

    // Fade in
    setTimeout(() => setVisible(true), 100)
    // Hold and fade out
    setTimeout(() => {
      setVisible(false)
      clearInterval(heartbeatInterval)
    }, 2600)
    // Complete
    setTimeout(onComplete, 3000)

    return () => clearInterval(heartbeatInterval)
  }, [onComplete])

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center transition-all duration-700 bg-black"
      style={{ opacity: visible ? 1 : 0 }}
    >
      <h2 className="text-3xl md:text-5xl font-black text-gold mb-8 animate-pulse tracking-widest uppercase">
        Good Luck!
      </h2>
      <div className="w-full max-w-sm px-4">
        {gifUrl && !imgError ? (
          <img
            src={gifUrl}
            alt="Good Luck"
            className="w-full rounded-2xl shadow-2xl border-4 border-gold/30"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="text-9xl text-center">{emoji}</div>
        )}
      </div>
      <p className="mt-8 text-gold/60 font-bold uppercase tracking-widest text-sm">
        Calculating your reality...
      </p>
    </div>
  )
}
// SELECTION GIF COMPONENT (Shows a random 'hope' GIF below the Check Odds button)
function SelectionGif() {
  const { gifUrl, emoji } = useRandomGif('hope')
  const [imgError, setImgError] = useState(false)
  return (
    <div className="flex flex-col items-center mb-6 transition-all duration-500 animate-in fade-in zoom-in">
      <div className="w-full max-w-lg h-64 md:h-72 rounded-2xl overflow-hidden shadow-2xl border-4 border-white/5 flex items-center justify-center bg-black/20">
        {gifUrl && !imgError ? (
          <img src={gifUrl} alt="Visualizing your hope" className="w-full h-full object-contain" loading="lazy" onError={() => setImgError(true)} />
        ) : (
          <div className="text-7xl">{emoji}</div>
        )}
      </div>
      <p className="mt-2 text-[10px] font-bold tracking-widest text-muted uppercase opacity-40">
        Visualizing your hope
      </p>
    </div>
  )
}

// ============================================================
// ICONS
// ============================================================

// Icons now imported from ./components/Icons.jsx

const LinkIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </svg>
)

const SunIcon = () => {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5" fill={isDark ? '#ffffff' : '#1a1a1a'} />
      <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  )
}

const MoonIcon = () => {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill={isDark ? '#ffffff' : '#1a1a1a'} />
    </svg>
  )
}

// HomeIcon now imported from ./components/Icons.jsx

// ============================================================
// SOCIAL SHARE COMPONENT
// ============================================================

function SocialShare({ shareText, shareUrl = 'https://whatschance.com', platforms = ['twitter', 'facebook', 'instagram', 'tiktok', 'copy'], lang }) {
  const [copied, setCopied] = useState(false)
  const s = useThemeStyles()

  const shareToTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  const shareToFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  const shareToWhatsApp = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  const shareToInstagram = () => {
    navigator.clipboard.writeText(shareText + ' ' + shareUrl).catch(() => { })
    window.open('https://www.instagram.com/', '_blank', 'noopener,noreferrer')
  }

  const shareToTikTok = () => {
    navigator.clipboard.writeText(shareText + ' ' + shareUrl).catch(() => { })
    window.open('https://www.tiktok.com/', '_blank', 'noopener,noreferrer')
  }

  const copyLink = async () => {
    const fullText = shareText + ' ' + shareUrl
    try {
      await navigator.clipboard.writeText(fullText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      const textarea = document.createElement('textarea')
      textarea.value = fullText
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-3 mb-4" aria-label="Share your results on social media">
      {platforms.includes('twitter') && (
        <button className="share-btn flex items-center gap-2" onClick={shareToTwitter} aria-label="Share on X (Twitter)"
          style={{ background: s.cardBg, border: `1px solid ${s.cardBorder}`, color: s.text }}
        >
          <TwitterIcon /> X / Twitter
        </button>
      )}
      {platforms.includes('facebook') && (
        <button className="share-btn flex items-center gap-2" onClick={shareToFacebook} aria-label="Share on Facebook"
          style={{ background: s.cardBg, border: `1px solid ${s.cardBorder}`, color: s.text }}
        >
          <FacebookIcon /> Facebook
        </button>
      )}
      {platforms.includes('whatsapp') && (
        <button className="share-btn flex items-center gap-2" onClick={shareToWhatsApp} aria-label="Share on WhatsApp"
          style={{ background: s.cardBg, border: `1px solid ${s.cardBorder}`, color: s.text }}
        >
          <WhatsAppIcon /> WhatsApp
        </button>
      )}
      {platforms.includes('instagram') && (
        <button className="share-btn flex items-center gap-2" onClick={shareToInstagram} aria-label="Share on Instagram"
          style={{ background: s.cardBg, border: `1px solid ${s.cardBorder}`, color: s.text }}
        >
          <InstagramIcon /> Instagram
        </button>
      )}
      {platforms.includes('tiktok') && (
        <button className="share-btn flex items-center gap-2" onClick={shareToTikTok} aria-label="Share on TikTok"
          style={{ background: s.cardBg, border: `1px solid ${s.cardBorder}`, color: s.text }}
        >
          <TikTokIcon /> TikTok
        </button>
      )}
      {platforms.includes('copy') && (
        <button className="share-btn flex items-center gap-2" onClick={copyLink} aria-label="Copy share text to clipboard"
          style={{ background: s.cardBg, border: `1px solid ${s.cardBorder}`, color: s.text }}
        >
          <LinkIcon /> {copied ? t('copied', lang) : t('copy', lang)}
        </button>
      )}
    </div>
  )
}

// ============================================================
// LANGUAGE SWITCHER
// ============================================================

const LANGUAGES = [
  { code: 'en', label: 'ENG' },
  { code: 'ko', label: '한국어' },
  { code: 'es', label: 'ESP' },
]

function LanguageSwitcher() {
  const { lang, setLang } = useLang()
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const [isOpen, setIsOpen] = useState(false)

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.lang-dropdown')) {
        setIsOpen(false)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  const currentLangLabel = LANGUAGES.find(l => l.code === lang)?.label || 'ENG'

  return (
    <div className="fixed top-4 right-16 z-50 lang-dropdown">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-2 rounded-full text-[12px] font-bold transition-all h-10"
        style={{
          background: isDark ? '#1a1a1a' : '#f0f0f0',
          border: `1px solid ${isDark ? '#333' : '#ddd'}`,
          color: isDark ? '#fff' : '#000',
        }}
        aria-label="Toggle language menu"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="2" y1="12" x2="22" y2="12"></line>
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
        </svg>
        {currentLangLabel}
      </button>

      {isOpen && (
        <div
          className="absolute top-full right-0 mt-2 py-1 select-none rounded-xl shadow-xl flex flex-col min-w-[100px]"
          style={{
            background: isDark ? '#1a1a1a' : '#ffffff',
            border: `1px solid ${isDark ? '#333' : '#ddd'}`,
          }}
        >
          {LANGUAGES.map((l) => (
            <button
              key={l.code}
              onClick={() => { setLang(l.code); setIsOpen(false); }}
              className="px-4 py-2 text-[12px] font-bold text-left transition-colors hover:bg-black/5 dark:hover:bg-white/5"
              style={{
                color: lang === l.code ? (isDark ? '#c8ff00' : '#7a8800') : (isDark ? '#ccc' : '#444'),
              }}
            >
              {l.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ============================================================
// THEME TOGGLE COMPONENT
// ============================================================

function ThemeToggle() {
  const { theme, toggle } = useTheme()
  return (
    <button
      onClick={toggle}
      className="fixed top-4 right-4 z-50 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300"
      style={{
        background: theme === 'dark' ? '#1a1a1a' : '#f0f0f0',
        border: `1px solid ${theme === 'dark' ? '#333' : '#ddd'}`,
        color: theme === 'dark' ? '#ffd700' : '#333'
      }}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
    </button>
  )
}

// ============================================================
// AD PLACEHOLDER
// ============================================================

export function AdPlaceholder({ className = "" }) {
  const { theme } = useTheme();
  const { lang } = useLang();
  const isDark = theme === 'dark';
  const adRef = useRef(null);
  const [adLoaded, setAdLoaded] = useState(false);

  useEffect(() => {
    try {
      if (adRef.current && adRef.current.childElementCount === 0) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
      // Check if ad actually rendered after a short delay
      const timer = setTimeout(() => {
        if (adRef.current) {
          const ins = adRef.current.querySelector('ins.adsbygoogle');
          if (ins && ins.dataset.adStatus === 'filled') {
            setAdLoaded(true);
          }
        }
      }, 1500);
      return () => clearTimeout(timer);
    } catch (e) {
      console.error('AdSense Error', e);
    }
  }, []);

  return (
    <div className={`w-full max-w-3xl mx-auto ${className}`}>
      <div
        ref={adRef}
        className="rounded-lg flex flex-col items-center justify-center overflow-hidden"
        style={{
          border: `1px solid ${isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.05)'}`,
          background: isDark ? 'rgba(255,255,255,0.01)' : 'rgba(0,0,0,0.01)',
          maxHeight: '100px',
          padding: '4px 8px',
        }}
      >
        <span
          className="text-[9px] uppercase tracking-[0.2em] font-medium"
          style={{ color: isDark ? '#333' : '#ccc', marginBottom: '2px' }}
        >
          {t('advertisement', lang)}
        </span>
        <div className="w-full flex items-center justify-center overflow-hidden" style={{ height: '70px', maxHeight: '70px' }}>
          <ins
            className="adsbygoogle"
            style={{ display: 'block', width: '100%', height: '70px' }}
            data-ad-client="ca-pub-5455444576155986"
            data-ad-slot="5868515153"
            data-ad-format="horizontal"
            data-full-width-responsive="false"
          />
        </div>
        {/* Dev fallback: visible placeholder when AdSense doesn't load (localhost) */}
        {!adLoaded && (
          <div
            className="w-full flex items-center justify-center rounded"
            style={{
              height: '70px',
              background: isDark
                ? 'linear-gradient(90deg, rgba(255,215,0,0.03) 0%, rgba(255,215,0,0.06) 50%, rgba(255,215,0,0.03) 100%)'
                : 'linear-gradient(90deg, rgba(0,0,0,0.02) 0%, rgba(0,0,0,0.04) 50%, rgba(0,0,0,0.02) 100%)',
              border: `1px dashed ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
              marginTop: '-70px',
            }}
          >
            <span style={{ color: isDark ? '#2a2a2a' : '#ddd', fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em' }}>
              AD BANNER
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// LEGAL MODAL
// ============================================================

function LegalModal({ type, onClose }) {
  const { lang } = useLang()
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div
        className="relative w-full max-w-lg rounded-3xl p-8 md:p-10 shadow-2xl animate-in zoom-in-95 duration-300"
        style={{
          background: isDark ? '#111' : '#fff',
          border: `1px solid ${isDark ? '#333' : '#ddd'}`,
          color: isDark ? '#fff' : '#000'
        }}
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/5 transition-colors"
          aria-label="Close modal"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <h2 className="text-2xl font-black mb-6 flex items-center gap-3">
          {type === 'privacy' ? <span>🛡️</span> : <span>⚖️</span>}
          {type === 'privacy' ? t('privacyPolicy', lang) : t('termsOfService', lang)}
        </h2>

        <div className="text-sm md:text-base leading-relaxed opacity-80 mb-10 space-y-4">
          <p>{type === 'privacy' ? t('privacyContent', lang) : t('tosContent', lang)}</p>
        </div>

        <button
          onClick={onClose}
          className="w-full py-4 rounded-xl font-bold transition-all hover:scale-[1.02] active:scale-[0.98]"
          style={{
            background: isDark ? '#fff' : '#000',
            color: isDark ? '#000' : '#fff'
          }}
        >
          {t('close', lang)}
        </button>
      </div>
    </div>
  )
}

// useThemeStyles now imported from ./hooks/useThemeStyles.js

// ============================================================
// SCREEN 1: START PAGE
// ============================================================

function StartPage({ onStart, onExploreOdds, onGoToHistory, onGoToChecklist, onGoToLucky, onGoToLumpSum, jackpotData, lastWinners, lastJackpotWinners, isLiveData }) {
  const s = useThemeStyles()
  const { theme } = useTheme()
  const { lang } = useLang()
  const LAST_WINNERS = lastWinners
  const LAST_JACKPOT_WINNERS = lastJackpotWinners

  return (
    <main className="screen-enter min-h-screen flex flex-col items-center px-4 py-6 md:py-10" role="main">
      {/* Top Ad Slot */}
      <AdPlaceholder className="mb-6 w-full max-w-3xl" />

      {/* Jackpot Display */}
      <section className="w-full max-w-3xl" aria-label="Current lottery jackpots">
        <div className="flex justify-center items-center gap-2 mb-2">
          <span className="relative flex h-3 w-3">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isLiveData ? 'bg-green-400' : 'bg-yellow-400'} opacity-75`}></span>
            <span className={`relative inline-flex rounded-full h-3 w-3 ${isLiveData ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
          </span>
          <span className={`text-xs font-bold ${isLiveData ? 'text-green-500' : 'text-yellow-500'} tracking-widest`}>{isLiveData ? t('live', lang) : '⏳ CACHED'}</span>
        </div>
        <div
          className="flex justify-center gap-4 md:gap-16 py-6 px-4 rounded-xl relative overflow-hidden"
          style={{ border: `1px solid ${s.isDark ? '#3d3200' : '#d4c97a'}`, background: s.isDark ? '#111' : '#fffef5' }}
        >
          <div className="flex flex-col items-center flex-1">
            <div className="flex flex-col items-center">
              <span className="text-sm font-bold tracking-widest text-[#3b82f6]/70 mb-1">MEGA MILLIONS</span>
              <a
                href="https://www.megamillions.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[9px] font-bold text-[#3b82f6]/50 hover:text-[#3b82f6] transition-colors mb-2 uppercase tracking-tighter"
              >
                Official Site ↗
              </a>
            </div>
            <span className="text-5xl md:text-7xl font-black text-gold mb-1 tracking-tighter whitespace-nowrap relative jackpot-pulse" style={{ fontFamily: 'Impact, sans-serif' }}>
              <span className="text-[#3b82f6] text-3xl md:text-5xl align-top absolute -left-6 md:-left-8 top-1 md:top-2">$</span>
              {formatNumber(jackpotData.megaMillions.amount)}<span className="text-[#3b82f6]">M</span>
            </span>
            <span className="text-xs md:text-sm font-bold text-green-400 mb-2 whitespace-nowrap">
              {t('cashOptionText', lang, { amount: formatNumber(jackpotData.megaMillions.cashOption) })}
            </span>
            <span className="text-xs" style={{ color: 'var(--text-dim)' }}>
              {t('next', lang)}: {jackpotData.megaMillions.nextDrawing}
            </span>
          </div>

          {/* divider */}
          <div className="w-[1px] h-24 bg-gradient-to-b from-transparent via-[#333] to-transparent self-center md:mx-4 mx-2"></div>

          <div className="flex flex-col items-center flex-1">
            <div className="flex flex-col items-center">
              <span className="text-sm font-bold tracking-widest text-[#ef4444]/70 mb-1">POWERBALL</span>
              <a
                href="https://www.powerball.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[9px] font-bold text-[#ef4444]/50 hover:text-[#ef4444] transition-colors mb-2 uppercase tracking-tighter"
              >
                Official Site ↗
              </a>
            </div>
            <span className="text-5xl md:text-7xl font-black text-gold mb-1 tracking-tighter whitespace-nowrap relative jackpot-pulse" style={{ fontFamily: 'Impact, sans-serif' }}>
              <span className="text-[#ef4444] text-3xl md:text-5xl align-top absolute -left-6 md:-left-8 top-1 md:top-2">$</span>
              {formatNumber(jackpotData.powerball.amount)}<span className="text-[#ef4444]">M</span>
            </span>
            <span className="text-xs md:text-sm font-bold text-green-400 mb-2 whitespace-nowrap">
              {t('cashOptionText', lang, { amount: formatNumber(jackpotData.powerball.cashOption) })}
            </span>
            <span className="text-xs" style={{ color: 'var(--text-dim)' }}>
              {t('next', lang)}: {jackpotData.powerball.nextDrawing}
            </span>
          </div>
        </div>

        {/* Last Jackpot Winner Info — directly below the box */}
        <div className="flex justify-center gap-6 md:gap-12 mt-3 px-2">
          <div className="text-center flex-1">
            <p className="text-[10px] md:text-xs" style={{ color: s.textDim }}>
              🏆 {t('lastJackpot', lang, { game: 'Mega Millions' })}: <span className="font-bold" style={{ color: s.isDark ? '#ffd700' : '#b8860b' }}>{LAST_JACKPOT_WINNERS.megaMillions.amount}</span>
              <br />— {LAST_JACKPOT_WINNERS.megaMillions.state}, {LAST_JACKPOT_WINNERS.megaMillions.date}
            </p>
          </div>
          <div className="text-center flex-1">
            <p className="text-[10px] md:text-xs" style={{ color: s.textDim }}>
              🏆 {t('lastJackpot', lang, { game: 'Powerball' })}: <span className="font-bold" style={{ color: s.isDark ? '#ffd700' : '#b8860b' }}>{LAST_JACKPOT_WINNERS.powerball.amount}</span>
              <br />— {LAST_JACKPOT_WINNERS.powerball.state}, {LAST_JACKPOT_WINNERS.powerball.date}
            </p>
          </div>
        </div>

        {/* Non-Jackpot Winner Info — smaller font */}
        <div className="flex justify-center gap-6 md:gap-12 mt-1.5 px-2">
          <div className="text-center flex-1 text-[9px] md:text-[10px]" style={{ color: 'var(--text-dim)', opacity: 0.8 }}>
            {t('lastWinner', lang, { game: 'Mega Millions' })}: <strong style={{ color: '#3b82f6' }}>{LAST_WINNERS.megaMillions.amount}</strong>
            <br />— {LAST_WINNERS.megaMillions.state}, {LAST_WINNERS.megaMillions.date}
          </div>
          <div className="text-center flex-1 text-[9px] md:text-[10px]" style={{ color: 'var(--text-dim)', opacity: 0.8 }}>
            {t('lastWinner', lang, { game: 'Powerball' })}: <strong style={{ color: '#ef4444' }}>{LAST_WINNERS.powerball.amount}</strong>
            <br />— {LAST_WINNERS.powerball.state}, {LAST_WINNERS.powerball.date}
          </div>
        </div>
      </section>

      {/* Tagline */}
      <h1 className="text-xl md:text-3xl font-black text-center mt-6 mb-4 max-w-2xl leading-tight px-4" style={{ color: s.text }}>
        {tRaw('tagline', lang).split('💰').map((part, i) => (
          i === 1 ? <span key={i} className="text-gold" style={{ fontSize: '1.2em' }}>💰{part}💰</span> : part
        ))}
      </h1>

      {/* Hero Image */}
      <section className="w-full max-w-3xl relative mt-2 mb-6" aria-label="Dramatic visualization">
        <div className="relative rounded-xl overflow-hidden">
          <img
            src="/images/hero-lightning-galaxy.png"
            alt="A dramatic split scene of a lightning storm and a cosmic galaxy — representing the astronomical odds"
            className="w-full h-auto object-cover"
            loading="eager"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="piggy-cta-wrap">
              <span className="piggy-bank" aria-hidden="true">🐷</span>
              <span className="money-drop" style={{ left: '-10px', top: '-30px', '--fall-delay': '0.35s', '--fall-duration': '1.1s' }} aria-hidden="true">💵</span>
              <span className="money-drop" style={{ left: '15px', top: '-25px', '--fall-delay': '0.5s', '--fall-duration': '1.3s' }} aria-hidden="true">💰</span>
              <span className="money-drop" style={{ left: '45px', top: '-35px', '--fall-delay': '0.45s', '--fall-duration': '1s' }} aria-hidden="true">💵</span>
              <span className="money-drop" style={{ left: '-25px', top: '-20px', '--fall-delay': '0.6s', '--fall-duration': '1.4s' }} aria-hidden="true">🪙</span>
              <span className="money-drop" style={{ left: '60px', top: '-28px', '--fall-delay': '0.55s', '--fall-duration': '1.2s' }} aria-hidden="true">💸</span>
              <span className="money-drop" style={{ left: '30px', top: '-40px', '--fall-delay': '0.7s', '--fall-duration': '1.5s' }} aria-hidden="true">💰</span>
              <span className="money-drop" style={{ left: '-5px', top: '-45px', '--fall-delay': '0.8s', '--fall-duration': '1.1s' }} aria-hidden="true">💵</span>
              <button
                onClick={onStart}
                className="btn-cta text-base md:text-lg px-8 md:px-12 py-4 shadow-2xl"
                aria-label="Check your lottery odds"
              >
                {t('checkMyOdds', lang)}
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full max-w-2xl mx-auto flex flex-col mt-8 mb-6 px-4">
        <h3 className="text-xl md:text-2xl font-black mb-4 text-center tracking-tight" style={{ color: s.text }}>
          {lang === 'ko' ? "최신 이야기 & 꿀팁 🔥" : "Latest Stories & Tips 🔥"}
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Card 1: History */}
          <button onClick={onGoToHistory} className="group flex flex-col items-start p-5 rounded-2xl text-left transition-all hover:scale-[1.02] shadow-sm hover:shadow-md outline-none focus:ring-2" style={{ background: s.cardBg, border: `1px solid ${s.cardBorder}`, focusRingColor: '#b8860b' }}>
            <span className="text-2xl mb-2" aria-hidden="true">📚</span>
            <h4 className="font-bold text-sm md:text-base leading-tight mb-1" style={{ color: s.text }}>
              {t('historyBtnTitle', lang).replace(' 📚', '')}
            </h4>
            <p className="text-[11px] md:text-xs line-clamp-2" style={{ color: s.textDim }}>
              {lang === 'ko' ? "과거 엄청난 당첨자들의 이야기와 충격적인 사실들을 확인해 보세요." : "Discover crazy stories from past winners and shocking lottery facts."}
            </p>
          </button>

          {/* Card 2: Checklist */}
          <button onClick={onGoToChecklist} className="group flex flex-col items-start p-5 rounded-2xl text-left transition-all hover:scale-[1.02] shadow-sm hover:shadow-md outline-none focus:ring-2" style={{ background: s.cardBg, border: `1px solid ${s.cardBorder}` }}>
            <span className="text-2xl mb-2" aria-hidden="true">✅</span>
            <h4 className="font-bold text-sm md:text-base leading-tight mb-1" style={{ color: s.text }}>
              {lang === 'ko' ? "당첨 시 반드시 해야 할 행동 강령" : "Jackpot Winning Checklist"}
            </h4>
            <p className="text-[11px] md:text-xs line-clamp-2" style={{ color: s.textDim }}>
              {lang === 'ko' ? "당첨 번호를 확인한 순간, 가장 먼저 챙겨야 할 생존 가이드." : "First steps you must take the moment you realize you won the jackpot."}
            </p>
          </button>

          {/* Card 3: Lump Sum vs Annuity */}
          <button onClick={onGoToLumpSum} className="group flex flex-col items-start p-5 rounded-2xl text-left transition-all hover:scale-[1.02] shadow-sm hover:shadow-md outline-none focus:ring-2" style={{ background: s.cardBg, border: `1px solid ${s.cardBorder}` }}>
            <span className="text-2xl mb-2" aria-hidden="true">🏦</span>
            <h4 className="font-bold text-sm md:text-base leading-tight mb-1" style={{ color: s.text }}>
              {lang === 'ko' ? "일시불 vs 연금 수령의 진실" : "Lump Sum vs Annuity Truth"}
            </h4>
            <p className="text-[11px] md:text-xs line-clamp-2" style={{ color: s.textDim }}>
              {lang === 'ko' ? "억만장자 당첨자들이 결국 파산하는 이유와 올바른 수령 방법." : "Why so many winners go bankrupt, and how to choose the right payout."}
            </p>
          </button>

          {/* Card 4: Lucky Numbers */}
          <button onClick={onGoToLucky} className="group flex flex-col items-start p-5 rounded-2xl text-left transition-all hover:scale-[1.02] shadow-sm hover:shadow-md outline-none focus:ring-2" style={{ background: s.cardBg, border: `1px solid ${s.cardBorder}` }}>
            <span className="text-2xl mb-2" aria-hidden="true">🍀</span>
            <h4 className="font-bold text-sm md:text-base leading-tight mb-1" style={{ color: s.text }}>
              {lang === 'ko' ? "행운의 번호라는 환상" : "The Myth of Lucky Numbers"}
            </h4>
            <p className="text-[11px] md:text-xs line-clamp-2" style={{ color: s.textDim }}>
              {lang === 'ko' ? "가족 생일이나 꿈에서 본 번호는 왜 확률을 낮추는 걸까?" : "Why using family birthdays or quick picks actually hurts your payout odds."}
            </p>
          </button>

        </div>
      </section>

      {/* Ad Slot */}
      <AdPlaceholder className="my-6" />

      {/* Sub-tagline */}
      <p className="text-center text-sm md:text-base max-w-lg leading-tight px-4" style={{ color: s.textMuted }}>
        {t('subTagline', lang)}
      </p>

    </main>
  )
}

// ============================================================
// SCREEN 2: TICKET SELECTION
// ============================================================

function PurchasingPowerDashboard({ totalCost, lang, gameAccent }) {
  const animatedCost = useCountUp(totalCost, 2000, 0, true)
  const [activeIndex, setActiveIndex] = useState(0)

  // Use useMemo to avoid re-evaluating the array on every render
  const availableFacts = useMemo(() => {
    const PURCHASING_POWER_FACTS = [
      { key: 'buyNYPenthouse', cost: 250000000, img: '/images/purchasing_power_nyc_penthouse.png', bg: 'from-blue-900 to-black' },
      { key: 'buyMaldivesDefense', cost: 150000000, img: '/images/purchasing_power_maldives_defense_budget.png', bg: 'from-cyan-900 to-blue-950' },
      { key: 'buyOhtaniContract', cost: 70000000 },
      { key: 'buyVegasConstruction', cost: 2300000000 },
      { key: 'buySalvatorMundi', cost: 450000000 },
      { key: 'buyPrivateJet', cost: 5000, img: '/images/purchasing_power_private_jet.png', bg: 'from-indigo-900 to-purple-950' },
      { key: 'buyMansion', cost: 5000000 },
      { key: 'buySportsCar', cost: 150000 },
      { key: 'buyHouse', cost: 80000 },
      { key: 'buyLuxuryWatch', cost: 20000 },
      { key: 'buyUsedCar', cost: 10000 },
      { key: 'buyVacation', cost: 3000 },
      { key: 'buyPhone', cost: 1000 },
      { key: 'buyPS5', cost: 500 },
      { key: 'buySneakers', cost: 150 },
      { key: 'buySteak', cost: 60 },
      { key: 'buyLunch', cost: 15 },
      { key: 'buyCoffee', cost: 5 },
      { key: 'buyGum', cost: 2 }
    ]
    return PURCHASING_POWER_FACTS.filter(fact => totalCost >= fact.cost).sort((a, b) => b.cost - a.cost).slice(0, 4)
  }, [totalCost])

  // Reset index if available facts change
  useEffect(() => {
    setActiveIndex(0)
  }, [availableFacts])

  if (totalCost < 2 || availableFacts.length === 0) return null

  const safeIndex = activeIndex >= availableFacts.length ? 0 : activeIndex
  const currentFact = availableFacts[safeIndex]

  return (
    <div className="w-full mt-4 mb-2 rounded-2xl overflow-hidden shadow-2xl relative transition-all duration-300 hover:scale-[1.01] group" style={{ borderColor: gameAccent, borderWidth: 1, backgroundColor: 'rgba(0,0,0,0.6)' }}>
      {currentFact.img ? (
        <img src={currentFact.img} alt={currentFact.key} className="absolute inset-0 w-full h-full object-cover opacity-50 mix-blend-overlay transition-opacity duration-500 group-hover:opacity-70" crossOrigin="anonymous" />
      ) : (
        <div className={`absolute inset-0 bg-gradient-to-br opacity-80 ${currentFact.bg || 'from-gray-900 to-black'}`} />
      )}

      <div className="relative z-10 p-5 flex flex-col items-center">
        <h3 className="text-xs md:text-sm font-bold uppercase tracking-widest text-gold mb-4 text-center drop-shadow-md">
          {t('purchasingPowerTitle', lang, { amount: `$${formatNumber(animatedCost)}` })}
        </h3>

        <div className="w-full relative min-h-[90px] flex items-center justify-center px-8 transition-all duration-300">
          <p className="text-base md:text-xl font-black text-white text-center drop-shadow-xl leading-snug">
            {t(currentFact.key, lang, { count: formatNumber(Math.floor(totalCost / currentFact.cost)) })}
          </p>

          {availableFacts.length > 1 && (
            <>
              <button onClick={(e) => { e.stopPropagation(); setActiveIndex((i) => i > 0 ? i - 1 : availableFacts.length - 1) }} className="absolute left-0 w-7 h-7 flex items-center justify-center bg-black/50 text-white/70 rounded-full hover:bg-gold/80 hover:text-black transition-all">←</button>
              <button onClick={(e) => { e.stopPropagation(); setActiveIndex((i) => (i + 1) % availableFacts.length) }} className="absolute right-0 w-7 h-7 flex items-center justify-center bg-black/50 text-white/70 rounded-full hover:bg-gold/80 hover:text-black transition-all">→</button>
            </>
          )}
        </div>

        {availableFacts.length > 1 && (
          <div className="flex gap-2 mt-3">
            {availableFacts.map((_, i) => (
              <div key={i} className={`w-1.5 h-1.5 rounded-full transition-all ${i === safeIndex ? 'bg-gold w-3' : 'bg-white/30'}`} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function TicketSelection({ onCheckOdds, selectedGame, setSelectedGame, onExploreOdds, onGoBack, jackpotData }) {
  const s = useThemeStyles()
  const { lang } = useLang()
  const gameAccent = selectedGame === 'megaMillions' ? '#3b82f6' : '#ef4444'
  const gameGlow = selectedGame === 'megaMillions' ? 'rgba(59,130,246,0.12)' : 'rgba(239,68,68,0.12)'
  const [ticketCounts, setTicketCounts] = useState({ megaMillions: 0, powerball: 0 })
  const [selectedTiers, setSelectedTiers] = useState({ megaMillions: null, powerball: null })
  const [lastActionTiers, setLastActionTiers] = useState({ megaMillions: null, powerball: null })
  const [wittyIndex, setWittyIndex] = useState(0)
  const [customInput, setCustomInput] = useState('')
  const [showCustom, setShowCustom] = useState(false)
  const [dollarParticles, setDollarParticles] = useState([])

  // playSound is now a module-level function

  const spawnDollars = useCallback((e, tierId) => {
    playSound('click')
    const newParticles = Array.from({ length: 4 }, (_, i) => ({
      id: Date.now() + i,
      tierId,
      left: 15 + Math.random() * 70,
      delay: i * 0.12,
      symbol: ['$', '💰', '$', '💵'][i % 4]
    }))
    setDollarParticles(prev => [...prev, ...newParticles])
    setTimeout(() => {
      setDollarParticles(prev => prev.filter(p => !newParticles.find(np => np.id === p.id)))
    }, 1500)
  }, [])

  const spawnBurningDollar = useCallback((e, ticketStep) => {
    playSound('click')
    const rect = e.currentTarget.getBoundingClientRect()
    const cost = ticketStep * GAME_TICKET_PRICE[selectedGame]
    const el = document.createElement('div')
    el.className = 'burn-dollar'
    el.textContent = `🔥$${cost}`
    el.style.left = `${rect.left + rect.width / 2 - 24}px`
    el.style.top = `${rect.top - 5}px`
    document.body.appendChild(el)
    setTimeout(() => el.remove(), 1100)
  }, [selectedGame])

  const currentPrice = GAME_TICKET_PRICE[selectedGame];
  const gameName = selectedGame === 'megaMillions' ? 'Mega Millions' : 'Powerball'
  const ticketCount = ticketCounts[selectedGame]
  const selectedTier = selectedTiers[selectedGame]
  const totalCost = ticketCount * currentPrice

  const adjustTickets = useCallback((delta, tierId) => {
    if (tierId !== undefined) {
      setSelectedTiers(prev => ({ ...prev, [selectedGame]: tierId }))
      setLastActionTiers(prev => ({ ...prev, [selectedGame]: tierId }))
    }
    playSound('crinkle')
    const maxTickets = ODDS_PER_TICKET[selectedGame]
    setTicketCounts(prev => {
      // If adding delta from 0, snap to exactly that tier's starting count instead of delta
      const newVal = prev[selectedGame] === 0 && delta > 0 ? tierId === 3 ? 10 : tierId === 2 ? 5 : 1 : prev[selectedGame] + delta
      const finalVal = Math.max(1, Math.min(maxTickets, newVal))

      // Setup a random witty phrase when passing 100 tickets
      if (finalVal >= 100 && prev[selectedGame] < 100) {
        setWittyIndex(Math.floor(Math.random() * 10))
      }
      // Or change it every time they hit a new threshold above 100
      if (finalVal >= 100 && Math.floor(finalVal / 100) > Math.floor(prev[selectedGame] / 100)) {
        setWittyIndex(Math.floor(Math.random() * 10))
      }

      return {
        ...prev,
        [selectedGame]: finalVal
      }
    })
    setShowCustom(false)
    setCustomInput('')
  }, [selectedGame])

  const handleTierClick = useCallback((count, tierId) => {
    // Only selects the tier to highlight it and change the GIF.
    // DOES NOT add tickets — that requires pressing the "+" button.
    setSelectedTiers(prev => ({ ...prev, [selectedGame]: tierId }))
    setShowCustom(false)
    setCustomInput('')
  }, [selectedGame])

  const handleCustomSubmit = useCallback(() => {
    const num = parseInt(customInput.replace(/,/g, ''))
    if (!isNaN(num) && num >= 1) {
      const maxTickets = ODDS_PER_TICKET[selectedGame]
      setTicketCounts(prev => ({ ...prev, [selectedGame]: Math.min(num, maxTickets) }))
      setShowCustom(false)
    }
  }, [customInput, selectedGame])

  const activeTier = selectedTier
  const stepSizes = { 1: 1, 2: 5, 3: 10 }

  const currentJackpotData = jackpotData[selectedGame]

  // Witty copy based on ticket count
  const getWittyCopy = () => {
    if (ticketCount === 0) return ''

    // Easter Eggs
    if (ticketCount === 777) return t('egg777', lang)
    if (ticketCount === 666) return t('egg666', lang)
    if (ticketCount === 42) return t('egg42', lang)
    if (ticketCount === 444) return t('egg444', lang)
    if (ticketCount === 999) return t('egg999', lang)
    if (ticketCount === 1337) return t('eggSatoshi', lang)

    if (ticketCount >= 10_000_000) return t('witty10M', lang)
    if (ticketCount >= 1_000_000) return t('witty1M', lang)
    if (ticketCount >= 1_000) return t('witty1K', lang)
    if (ticketCount >= 100) return t(`wittyRandom${wittyIndex}`, lang)
    return t('wittyDefault', lang)
  }



  // Classic yellow #2 pencil cursor SVG
  const pencilDataUri = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 14 14'%3E%3Cg transform='translate(7,7) rotate(45) translate(-7,-7)'%3E%3Crect x='5.8' y='.5' width='2.4' height='1.4' rx='.6' fill='%23f9a8d4' stroke='%23d97bb0' stroke-width='.3'/%3E%3Crect x='5.8' y='1.9' width='2.4' height='.8' fill='%23c0c0c0' stroke='%23999' stroke-width='.3'/%3E%3Crect x='5.8' y='2.7' width='2.4' height='7' fill='%23fcd34d' stroke='%23d4a200' stroke-width='.3'/%3E%3Cline x1='7' y1='2.7' x2='7' y2='9.7' stroke='%23f6d32d' stroke-width='.4'/%3E%3Cpolygon points='5.8,9.7 8.2,9.7 7,12.2' fill='%23c9956a' stroke='%23a07040' stroke-width='.3'/%3E%3Cpolygon points='6.5,11.2 7.5,11.2 7,13' fill='%23222'/%3E%3C/g%3E%3C/svg%3E"

  // Override cursor on ALL child elements (buttons, inputs, etc.)
  React.useEffect(() => {
    const id = 'pencil-cursor-override'
    if (!document.getElementById(id)) {
      const s = document.createElement('style')
      s.id = id
      s.textContent = `.pencil-screen, .pencil-screen * { cursor: url("${pencilDataUri}") 3 17, auto !important; }`
      document.head.appendChild(s)
    }
    // Inject bubble-fill keyframes
    if (!document.getElementById('bubble-fill-css')) {
      const s2 = document.createElement('style')
      s2.id = 'bubble-fill-css'
      s2.textContent = `
        @keyframes bubbleFill {
          0% { transform: scale(0) rotate(0deg); opacity: 0; }
          30% { transform: scale(1.1) rotate(90deg); opacity: 0.7; }
          60% { transform: scale(0.95) rotate(200deg); opacity: 0.5; }
          100% { transform: scale(0) rotate(360deg); opacity: 0; }
        }
        @keyframes scribbleMark {
          0% { clip-path: circle(0% at 50% 50%); opacity: 0.8; }
          50% { clip-path: circle(50% at 50% 50%); opacity: 0.6; }
          100% { clip-path: circle(50% at 50% 50%); opacity: 0; }
        }
      `
      document.head.appendChild(s2)
    }
    return () => {
      document.getElementById(id)?.remove()
      document.getElementById('bubble-fill-css')?.remove()
    }
  }, [])

  // Spawn lottery ticket flutter effect
  const spawnTicketFlutter = useCallback(() => {
    const tickets = []
    for (let i = 0; i < 12; i++) {
      const el = document.createElement('div')
      el.innerHTML = '\u{1F3AB}'
      el.style.cssText = `
        position: fixed; z-index: 9999; font-size: ${20 + Math.random() * 20}px;
        left: ${Math.random() * window.innerWidth}px;
        top: ${window.innerHeight + 20}px;
        pointer-events: none; opacity: 0.9;
        animation: ticketFlutter ${1.5 + Math.random() * 1.5}s ease-out forwards;
        animation-delay: ${Math.random() * 0.5}s;
      `
      document.body.appendChild(el)
      tickets.push(el)
    }
    if (!document.getElementById('ticket-flutter-css')) {
      const style = document.createElement('style')
      style.id = 'ticket-flutter-css'
      style.textContent = `
        @keyframes ticketFlutter {
          0% { transform: translateY(0) rotate(0deg) scale(1); opacity: 0.9; }
          30% { opacity: 1; }
          100% { transform: translateY(-${window.innerHeight + 200}px) rotate(${360 + Math.random() * 720}deg) scale(0.3); opacity: 0; }
        }
      `
      document.head.appendChild(style)
    }
    setTimeout(() => tickets.forEach(t => t.remove()), 3500)
  }, [])

  // Lottery play slip bubble marking animation
  const spawnInkSplat = useCallback((e) => {
    // Main bubble fill (like darkening a circle on a play slip)
    const bubble = document.createElement('div')
    bubble.style.cssText = `
      position: fixed; z-index: 9998; pointer-events: none;
      width: 14px; height: 14px; border-radius: 50%;
      left: ${e.clientX - 7}px; top: ${e.clientY - 7}px;
      background: radial-gradient(circle, #1f2937 40%, #374151 70%, transparent 100%);
      animation: bubbleFill 0.45s ease-out forwards;
    `
    document.body.appendChild(bubble)
    setTimeout(() => bubble.remove(), 500)

    // Scribble overlay (rotating graphite texture)
    const scribble = document.createElement('div')
    scribble.style.cssText = `
      position: fixed; z-index: 9999; pointer-events: none;
      width: 12px; height: 12px; border-radius: 50%;
      left: ${e.clientX - 6}px; top: ${e.clientY - 6}px;
      background: conic-gradient(from 0deg, #374151, #6b7280, #374151, #6b7280, #374151);
      animation: scribbleMark 0.4s ease-out forwards;
    `
    document.body.appendChild(scribble)
    setTimeout(() => scribble.remove(), 450)
  }, [])

  // Determine visual threshold to trigger GIF update
  const getThresholdLevel = (count) => {
    const thresholds = [0, 30, 100, 200, 300, 330, 400, 500, 600, 700, 800, 900, 1000]
    let level = 0
    for (let t of thresholds) {
      if (count >= t) level = t
    }
    return level
  }

  return (
    <main
      className="screen-enter pencil-screen min-h-screen flex flex-col items-center px-4 py-6 md:py-10"
      role="main"
      onClick={spawnInkSplat}
    >
      {/* Back button */}
      <button
        onClick={onGoBack}
        className="self-start mb-4 flex items-center gap-1.5 text-sm font-medium transition-colors hover:opacity-80"
        style={{ color: 'var(--text-muted)' }}
      >
        <span style={{ fontSize: '18px' }}>←</span> {t('backToHome', lang)}
      </button>

      {/* Game Toggle */}
      <div className="flex items-center gap-4 mb-8" role="radiogroup" aria-label="Select lottery game">
        <span
          className="text-sm font-bold cursor-pointer transition-colors"
          style={{ color: selectedGame === 'megaMillions' ? '#3b82f6' : 'var(--text-dim)' }}
          onClick={() => setSelectedGame('megaMillions')}
        >
          Mega Millions
        </span>
        <button
          className={`toggle-track ${selectedGame === 'powerball' ? 'active' : ''}`}
          onClick={() => setSelectedGame(selectedGame === 'megaMillions' ? 'powerball' : 'megaMillions')}
          role="switch"
          aria-checked={selectedGame === 'powerball'}
          aria-label="Toggle between Mega Millions and Powerball"
        >
          <div className="toggle-thumb"></div>
        </button>
        <span
          className="text-sm font-bold cursor-pointer transition-colors"
          style={{ color: selectedGame === 'powerball' ? '#ef4444' : 'var(--text-dim)' }}
          onClick={() => setSelectedGame('powerball')}
        >
          Powerball
        </span>
      </div>

      {/* Header */}
      <h1 className="text-2xl md:text-4xl font-black text-center mb-2" style={{ color: 'var(--text-primary)' }}>
        {t('howManyTickets', lang)}
      </h1>
      <p className="text-sm mb-1 text-center" style={{ color: 'var(--text-dim)' }}>
        {t('perTicket', lang, { game: gameName, price: currentPrice })}
      </p>
      <p className="text-xs mb-8 text-center" style={{ color: gameAccent, opacity: 0.8 }}>
        🎰 {t('nextDrawing', lang, { date: currentJackpotData.nextDrawing, amount: currentJackpotData.amount })}
      </p>

      {/* Tier Cards */}
      <section className="w-full max-w-3xl grid grid-cols-3 gap-3 md:gap-6 mb-6" aria-label="Ticket tier selection">
        {TIERS.map(tier => {
          const isActive = activeTier === tier.id
          const step = stepSizes[tier.id]
          const displayCount = tier.id === 3 && ticketCount >= 10 ? ticketCount : tier.count
          const cost = displayCount * currentPrice
          const tierParticles = dollarParticles.filter(p => p.tierId === tier.id)
          return (
            <div key={tier.id} className="flex flex-col items-center tier-card-wrap">
              {tierParticles.map(p => (
                <span
                  key={p.id}
                  className="dollar-particle"
                  style={{
                    left: `${p.left}%`,
                    bottom: '60%',
                    animationDelay: `${p.delay}s`,
                    color: gameAccent
                  }}
                >
                  {p.symbol}
                </span>
              ))}
              <button
                className="w-full flex flex-col items-center text-center rounded-xl p-3 md:p-4 transition-all duration-200 cursor-pointer"
                onClick={() => handleTierClick(tier.count, tier.id)}
                onMouseEnter={(e) => spawnDollars(e, tier.id)}
                aria-pressed={isActive}
                style={{
                  background: 'var(--card-bg)',
                  border: `2px solid ${isActive ? gameAccent : 'var(--border-color)'}`,
                  boxShadow: isActive ? `0 0 20px ${gameGlow}` : 'none',
                  transform: isActive ? 'translateY(-2px)' : 'none'
                }}
              >
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center mb-2"
                  style={{
                    border: `2px solid ${isActive ? gameAccent : 'var(--text-dim)'}`,
                    background: isActive ? gameAccent : 'transparent'
                  }}
                >
                  {isActive && <div className="w-2 h-2 rounded-full" style={{ background: 'var(--accent-text)' }}></div>}
                </div>
                <span className="text-lg md:text-xl font-black mb-1 flex items-baseline gap-1" style={{ color: 'var(--text-primary)' }}>
                  {tier.label} <span className="text-[10px] md:text-xs font-bold text-gray-400 uppercase">ticket{tier.id === 1 ? '' : 's'}</span>
                </span>
                <span className="text-xs md:text-sm font-bold mb-2" style={{ color: gameAccent }}>
                  ${formatNumber(tier.count * currentPrice)}
                </span>
                <div className="w-full aspect-square rounded-lg overflow-hidden mb-2">
                  <img src={tier.image} alt={tier.alt} className="w-full h-full object-cover" loading="lazy" />
                </div>
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>({t(tier.nameKey, lang)})</span>
              </button>

              <div className={`flex items-center gap-2 mt-2 transition-opacity duration-200 ${isActive ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                <button
                  className="counter-btn"
                  onClick={(e) => { e.stopPropagation(); adjustTickets(-step, tier.id) }}
                  disabled={ticketCount <= 1}
                  aria-label={`Remove ${step} ticket${step > 1 ? 's' : ''}`}
                >
                  −
                </button>
                <span className="text-[10px] font-mono w-8 text-center" style={{ color: 'var(--text-dim)' }}>
                  ±{step}
                </span>
                <button
                  className="counter-btn"
                  onClick={(e) => { e.stopPropagation(); adjustTickets(step, tier.id); try { spawnBurningDollar(e, step) } catch (_) { } }}
                  aria-label={`Add ${step} ticket${step > 1 ? 's' : ''}`}
                  style={{ background: gameAccent, color: '#000', borderColor: gameAccent }}
                >
                  +
                </button>
              </div>
            </div>
          )
        })}
      </section>

      {/* Current count + cost display */}
      <div
        className="flex items-center gap-2 md:gap-4 mb-4 px-4 md:px-6 py-2.5 rounded-xl border overflow-hidden"
        style={{ background: 'var(--card-bg)', borderColor: 'var(--border-color)' }}
      >
        <span className="text-xs md:text-sm font-medium whitespace-nowrap" style={{ color: 'var(--text-muted)' }}>{t('tickets', lang)}:</span>
        <span className={`font-black whitespace-nowrap ${ticketCount >= 10_000_000 ? 'text-lg md:text-xl' : 'text-xl md:text-2xl'}`} style={{ color: 'var(--text-primary)' }}>{formatNumber(ticketCount)}</span>
        <div className="flex-1 flex items-center gap-1 overflow-hidden">
          {ticketCount === 0
            ? <span className="text-base md:text-lg font-bold whitespace-nowrap" style={{ color: 'var(--text-dim)' }}>= {t('noChance', lang)}</span>
            : <span className={`font-bold whitespace-nowrap truncate ${totalCost >= 10_000_000 ? 'text-base md:text-lg' : 'text-lg md:text-xl'}`} style={{ color: gameAccent }}>= ${formatNumber(totalCost)}</span>
          }
        </div>
        <button
          onClick={() => { setTicketCounts(prev => ({ ...prev, [selectedGame]: 0 })); setShowCustom(false); setCustomInput('') }}
          className="ml-auto w-7 h-7 flex items-center justify-center rounded-full transition-all hover:scale-110"
          style={{ background: 'var(--card-bg)', border: `1px solid ${gameAccent}40`, color: gameAccent, fontSize: '13px' }}
          aria-label={t('reset', lang)}
          title={t('reset', lang)}
        >
          ↺
        </button>
      </div>

      {/* Custom input toggle */}
      {!showCustom ? (
        <button
          onClick={() => setShowCustom(true)}
          className="text-sm font-semibold mb-6 transition-all hover:scale-105 flex items-center gap-2 px-6 py-3 rounded-full shadow-lg"
          style={{
            color: '#fff',
            background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(59, 130, 246, 0.2))',
            border: '1px solid rgba(255,255,255,0.1)'
          }}
        >
          <span>✏️</span> {t('goCrazy', lang)}
        </button>
      ) : (
        <div className="flex items-center gap-2 mb-6">
          <input
            type="text"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            placeholder="e.g. 1,000,000"
            className="px-4 py-2 rounded-lg text-center font-bold text-lg w-48 outline-none"
            style={{ background: 'var(--card-bg)', border: `2px solid ${gameAccent}`, color: 'var(--text-primary)' }}
            onKeyDown={(e) => e.key === 'Enter' && handleCustomSubmit()}
            autoFocus
          />
          <button
            onClick={handleCustomSubmit}
            className="px-4 py-2 rounded-lg font-bold text-sm"
            style={{ background: gameAccent, color: 'var(--accent-text)' }}
          >
            {t('go', lang)}
          </button>
          <button
            onClick={() => { setShowCustom(false); setCustomInput('') }}
            className="px-3 py-2 rounded-lg text-sm"
            style={{ color: 'var(--text-dim)' }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Witty Copy */}
      <p className="text-center text-sm md:text-base max-w-lg mb-4 leading-relaxed px-4" style={{ color: 'var(--text-muted)' }}>
        {getWittyCopy()}
      </p>

      {/* Selection GIF */}
      {ticketCount > 0 && <SelectionGif key={`${lastActionTiers[selectedGame] || 'init'}-${getThresholdLevel(ticketCount)}`} />}

      {/* CTA Box */}
      <div className="cta-box mb-6 w-full max-w-lg" style={{ borderColor: gameAccent }}>
        <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
          {formatNumber(ticketCount)} {t('tickets', lang).toLowerCase()} × ${currentPrice} = <strong style={{ color: 'var(--text-primary)' }}>${formatNumber(totalCost)}</strong> {t('for', lang)} {gameName}
        </p>
        <PurchasingPowerDashboard totalCost={totalCost} lang={lang} gameAccent={gameAccent} />
        <button
          className="btn-cta w-full"
          onClick={(e) => { e.stopPropagation(); playSound('pop'); spawnTicketFlutter(); setTimeout(() => onCheckOdds(ticketCount), 800); }}
          disabled={ticketCount === 0}
          aria-label={`Check odds with ${ticketCount} tickets for ${gameName}`}
          style={{ background: ticketCount === 0 ? 'var(--card-bg)' : gameAccent, color: ticketCount === 0 ? 'var(--text-dim)' : '#000', opacity: ticketCount === 0 ? 0.5 : 1 }}
        >
          {ticketCount === 0 ? t('selectTicketsFirst', lang) : t('checkOdds', lang)}
        </button>
      </div>

      {/* Ad: Bottom placement */}
      <AdPlaceholder className="mb-6" />


      <button
        onClick={() => { playSound('pop'); onExploreOdds(); }}
        className="w-full max-w-md rounded-xl px-6 py-4 text-sm md:text-base font-semibold transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
        style={{
          background: 'var(--card-bg)',
          border: '1px solid var(--border-color)',
          color: gameAccent
        }}
      >
        🎰 {t('seeAllWays', lang, { game: gameName })}
      </button>
    </main>
  )
}

// ============================================================
// TAX INFO BLOG COMPONENT
// ============================================================

function TaxInfoBlog({ lang, onBack }) {
  const s = useThemeStyles();

  const rates = STATE_TAX_RATES || {};

  // Sort taxing states (rate > 0) from highest to lowest
  const rankedStates = Object.entries(rates)
    .filter(([name, rate]) => typeof rate === 'number' && rate > 0 && name !== "Average / Other")
    .sort((a, b) => b[1] - a[1]);

  // States with 0% tax
  const zeroPercentStates = Object.entries(rates)
    .filter(([name, rate]) => rate === 0)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([name]) => name);

  // if (rankedStates.length === 0) return null; // Removed to prevent blank screen if data fails to load

  return (
    <div className="min-h-screen flex flex-col items-center py-12 px-6">
      <div className="w-full max-w-3xl">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="group mb-8 flex items-center gap-2 text-sm font-bold opacity-60 hover:opacity-100 transition-all hover:translate-x-[-4px]"
          style={{ color: 'var(--text-primary)' }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          {t('backToCalculator', lang)}
        </button>

        <div className="bg-white/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-3xl p-6 md:p-10 shadow-lg dark:shadow-none">
          <h1 className="text-3xl md:text-4xl font-black mb-4 bg-gradient-to-r from-gold to-orange-400 bg-clip-text text-transparent leading-tight">
            {t('taxBlogTitle', lang)}
          </h1>
          <p className="text-base md:text-lg text-gray-900 dark:text-white/70 mb-10 leading-relaxed">
            {t('taxBlogIntro', lang)}
          </p>

          {/* 0% Tax Block */}
          {zeroPercentStates.length > 0 && (
            <div className="bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 rounded-2xl p-6 mb-8">
              <h3 className="text-xl font-bold text-green-900 dark:text-green-400 mb-2 flex items-center gap-2">
                <span className="text-2xl">🎉</span> {t('taxBlog0PercentHeader', lang)}
              </h3>
              <p className="text-sm text-green-950 dark:text-white/60 mb-4">{t('taxBlog0PercentDesc', lang)}</p>
              <div className="flex flex-wrap gap-2">
                {zeroPercentStates.map(state => (
                  <span key={state} className="px-3 py-1 bg-white dark:bg-green-500/20 text-green-700 dark:text-green-400 text-xs font-bold rounded-full border border-green-200 dark:border-green-500/30 shadow-sm dark:shadow-none">
                    {state}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Interactive US Map */}
          <USMap />

          {/* Ranking List */}
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <span className="text-2xl">📉</span> {t('taxBlogRankingHeader', lang)}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-3">
            {rankedStates.map(([name, rate], idx) => {
              const pctVal = (rate * 100);
              const displayPct = pctVal.toFixed(rate % 0.01 === 0 ? 1 : 2);
              return (
                <div key={name} className="flex items-center justify-between border-b border-black/5 dark:border-white/5 pb-2 last:border-0 md:[&:nth-last-child(-n+2)]:border-0">
                  <span className="text-sm text-gray-900 dark:text-white/80 font-medium">
                    <span className="text-gray-500 dark:text-white/30 mr-2 font-mono">{String(idx + 1).padStart(2, '0')}</span>
                    {name}
                  </span>
                  <span className={`text-sm font-black ${rate > 0.08 ? 'text-red-700 dark:text-red-400' : rate > 0.05 ? 'text-orange-700 dark:text-orange-400' : 'text-blue-700 dark:text-blue-400'}`}>
                    {displayPct}%
                  </span>
                </div>
              );
            })}
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => onBack('taxTrivia')}
              className="flex items-center justify-between p-4 rounded-2xl border border-gold/30 bg-gold/5 hover:bg-gold/10 transition-all group overflow-hidden relative shadow-[0_0_15px_rgba(255,215,0,0.1)]"
            >
              <div className="flex flex-col items-start gap-1 z-10 text-left">
                <span className="text-[10px] font-black text-gold uppercase tracking-tighter opacity-70">Local Taxes</span>
                <span className="text-sm font-bold text-gray-900 dark:text-white/90">{t('triviaBtnNYC', lang)}</span>
              </div>
              <span className="text-xl group-hover:scale-125 transition-transform z-10">🍎</span>
              <div className="absolute inset-0 bg-gold/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </button>
            <button
              onClick={() => onBack('taxTrivia')}
              className="flex items-center justify-between p-4 rounded-2xl border border-red-500/30 bg-red-500/5 hover:bg-red-500/10 transition-all group overflow-hidden relative shadow-[0_0_15px_rgba(239,68,68,0.1)]"
            >
              <div className="flex flex-col items-start gap-1 z-10 text-left">
                <span className="text-[10px] font-black text-red-500 dark:text-red-400 uppercase tracking-tighter opacity-70">State Restrictions</span>
                <span className="text-sm font-bold text-gray-900 dark:text-white/90">{t('triviaBtnMissing', lang)}</span>
              </div>
              <span className="text-xl group-hover:scale-125 transition-transform z-10">🚫</span>
              <div className="absolute inset-0 bg-red-500/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </button>
          </div>

          <div className="mt-10 pt-10 border-t border-white/10 flex flex-col items-center">
            <p className="text-sm font-bold text-gold mb-6 uppercase tracking-widest">{t('shareTitle', lang) || "Share this Reality Check"}</p>
            <SocialShare
              shareText={t('taxShareText', lang)}
              platforms={['twitter', 'facebook', 'whatsapp', 'copy']}
              lang={lang}
            />
          </div>
        </div>

        {/* Bottom Back Button */}
        <div className="mt-12 flex justify-center">
          <button
            onClick={onBack}
            className="px-10 py-4 rounded-2xl font-bold transition-all hover:scale-105 active:scale-95 flex items-center gap-3 shadow-xl"
            style={{
              background: 'var(--card-bg)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-primary)'
            }}
          >
            {t('backToCalculator', lang)}
          </button>
        </div>
      </div>
    </div>
  );
}
function TaxTrivia({ lang, onBack }) {
  const s = useThemeStyles();

  return (
    <div className="min-h-screen flex flex-col items-center py-12 px-6">
      <div className="w-full max-w-3xl">
        {/* Back Button */}
        <button
          onClick={() => onBack('stateTaxes')}
          className="group mb-8 flex items-center gap-2 text-sm font-bold opacity-60 hover:opacity-100 transition-all hover:translate-x-[-4px]"
          style={{ color: 'var(--text-primary)' }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          {t('backToTaxRankings', lang)}
        </button>

        <div className="grid grid-cols-1 gap-8">
          {/* NYC Card */}
          <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-3xl p-8 md:p-10 shadow-xl transition-all hover:border-gold/30">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-gold/20 flex items-center justify-center text-3xl">🏙️</div>
              <h2 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white">{t('triviaNYCHeader', lang)}</h2>
            </div>
            <p className="text-base md:text-lg text-gray-900 dark:text-white/70 leading-relaxed mb-6">
              {t('triviaNYCDesc', lang)}
            </p>
          </div>

          {/* Missing States Card */}
          <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-3xl p-8 md:p-10 shadow-xl transition-all hover:border-red-500/30">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-red-500/20 flex items-center justify-center text-3xl">🛑</div>
              <h2 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white">{t('triviaMissingHeader', lang)}</h2>
            </div>
            <p className="text-base md:text-lg text-gray-900 dark:text-white/70 leading-relaxed mb-6 font-medium">
              {t('triviaMissingDesc', lang)}
            </p>
            <div className="space-y-3 pl-4 border-l-4 border-red-500/30 py-2 mb-8">
              <p className="text-sm md:text-base font-bold text-gray-900 dark:text-white/80">• {t('triviaNevada', lang)}</p>
              <p className="text-sm md:text-base font-bold text-gray-900 dark:text-white/80">• {t('triviaUtahHawaii', lang)}</p>
              <p className="text-sm md:text-base font-bold text-gray-900 dark:text-white/80">• {t('triviaAlaska', lang)}</p>
              <p className="text-sm md:text-base font-bold text-gray-900 dark:text-white/80">• {t('triviaAlabama', lang)}</p>
            </div>

            {/* "Can they still play?" Highlight Box */}
            <div className="bg-gray-50 dark:bg-white/5 rounded-2xl p-6 border border-gray-200 dark:border-white/10 shadow-inner relative overflow-hidden group/didyouknow">
              <div className="absolute top-0 left-0 w-1 h-full bg-gold/50" />
              <h4 className="text-orange-600 dark:text-gold font-black text-sm md:text-base mb-2 uppercase tracking-tight flex items-center gap-2">
                {t('triviaCanTheyPlayHeader', lang)}
              </h4>
              <p className="text-sm md:text-base text-gray-700 dark:text-white/60 leading-relaxed italic">
                {t('triviaCanTheyPlayDesc', lang)}
              </p>
            </div>

            {/* "What about the taxes?" Section */}
            <div className="mt-8 pt-8 border-t border-gray-200 dark:border-white/10">
              <h4 className="text-gray-900 dark:text-white font-black text-lg mb-3 flex items-center gap-2">
                {t('triviaTaxDetailHeader', lang)}
              </h4>
              <div className="space-y-4">
                <p className="text-sm md:text-base text-gray-900 dark:text-white/70 leading-relaxed font-medium">
                  {t('triviaTaxDetailDesc1', lang)}
                </p>
                <div className="bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 rounded-xl p-4 md:p-5">
                  <p className="text-sm md:text-base text-blue-900 dark:text-blue-300 leading-relaxed font-bold">
                    <span className="text-lg mr-1">💡</span> {t('triviaTaxDetailDesc2', lang)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <SocialShare shareText={t('triviaShareText', lang)} lang={lang} />
        </div>
      </div>
    </div>
  );
}
// ============================================================
// SCREEN 3: RESULTS
// ============================================================

function Results({ ticketCount, selectedGame, onTryAgain, onExploreOdds, onStartOver, onZodiacFortune, jackpotData, selectedState, setSelectedState, onViewTaxes, onGoToSimulator }) {
  const s = useThemeStyles()
  const { lang } = useLang()
  const [copied, setCopied] = useState(false)
  const [showTakeHome, setShowTakeHome] = useState(false)
  const [revealStep, setRevealStep] = useState(0)
  const [receiptSharing, setReceiptSharing] = useState(false)
  const [imgError, setImgError] = useState(false)
  const odds = calculateOdds(selectedGame, ticketCount)
  const jackpot = jackpotData[selectedGame].amount
  const gameName = selectedGame === 'megaMillions' ? 'Mega Millions' : 'Powerball'
  const gameAccent = selectedGame === 'megaMillions' ? '#3b82f6' : '#ef4444'
  const winProb = 1 / odds
  const viz = getVisualization(selectedGame, ticketCount)
  const comparison = getComparisonLogic(winProb, ticketCount)
  const fullDollars = formatFullDollars(jackpot)
  const totalInvestment = ticketCount * GAME_TICKET_PRICE[selectedGame]

  const jackpotDollars = jackpot * 1_000_000
  const roiPercent = totalInvestment > 0 ? Math.round(((jackpotDollars - totalInvestment) / totalInvestment) * 100) : 0
  const roiFormatted = roiPercent >= 1_000_000 ? Math.round(roiPercent / 1_000_000) + 'M' : roiPercent >= 1_000 ? Math.round(roiPercent / 1_000) + 'K' : formatNumber(roiPercent)

  const vizTitle = viz.titleKey ? t(viz.titleKey, lang) : (viz.factKey ? t(viz.factKey, lang) : '')
  const vizDesc = viz.descKey ? t(viz.descKey, lang) : ''
  const vizSource = viz.source || null

  const shareText = t('shareText', lang, { jackpot, game: gameName, odds: formatNumber(odds), title: vizTitle }) + ' #whatschance'

  const captureReceipt = async () => {
    const element = document.getElementById('hidden-receipt')
    if (!element || receiptSharing) return

    setReceiptSharing(true)

    try {
      // Use html2canvas as requested for better compatibility in this environment
      const canvas = await html2canvas(element, {
        backgroundColor: '#ffffff',
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: true
      })

      const dataUrl = canvas.toDataURL('image/png')

      // 1. Open in a new tab for manual saving
      try {
        const newTab = window.open()
        if (newTab) {
          newTab.document.write(`
            <html>
              <head>
                <title>Your Lottery Receipt - WhatsChance</title>
                <style>
                  body { margin: 0; background: #1a1a2e; display: flex; justify-content: center; align-items: center; min-height: 100vh; font-family: sans-serif; }
                  img { max-width: 90%; max-height: 90vh; border-radius: 12px; box-shadow: 0 20px 50px rgba(0,0,0,0.5); }
                  .hint { position: absolute; bottom: 20px; color: #fff; opacity: 0.6; font-size: 14px; }
                </style>
              </head>
              <body>
                <img src="${dataUrl}" alt="Lottery Receipt" />
                <div class="hint">Right-click or Long-press to save image</div>
              </body>
            </html>
          `)
          newTab.document.close()
        }
      } catch (e) {
        console.error('Window open failed:', e)
      }

      // 2. Copy to Clipboard
      canvas.toBlob(async (blob) => {
        if (blob && navigator.clipboard && navigator.clipboard.write) {
          try {
            const item = new ClipboardItem({ 'image/png': blob })
            await navigator.clipboard.write([item])
          } catch (err) {
            console.error('Clipboard write failed:', err)
          }
        }
      }, 'image/png')

      // Feedback delay
      setTimeout(() => setReceiptSharing(false), 3000)
    } catch (err) {
      console.error('Receipt generation failed:', err)
      setReceiptSharing(false)
      alert('Failed to generate receipt. Please try taking a screenshot.')
    }
  }

  const copyLink = async () => {
    const fullText = shareText + ' https://whatschance.com'
    try {
      await navigator.clipboard.writeText(fullText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      const textarea = document.createElement('textarea')
      textarea.value = fullText
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  // Random GIF based on odds (fetched from local manifest or Giphy fallback)
  const category = useMemo(() => getGifCategory(odds), [odds])
  const gifData = useRandomGif(category)

  useEffect(() => {
    // Atmosphere sounds based on result
    if (category === 'jackpot') {
      playSound('crowd')
    } else {
      playSound('sad')
      setTimeout(() => playSound('wind'), 2000)
    }
  }, [category])

  const drawsPerYear = DRAWINGS_PER_YEAR[selectedGame] || 104
  const winYear = calculateWinYear(odds, selectedGame)
  const currentYear = new Date().getFullYear()
  const yearsToWin = odds / drawsPerYear // Use float for more accuracy in loss calc
  const totalInvestmentFuture = Math.max(
    ticketCount * GAME_TICKET_PRICE[selectedGame], // Min cost is today's purchase
    Math.floor(yearsToWin * drawsPerYear * ticketCount * GAME_TICKET_PRICE[selectedGame])
  )
  const gensPassed = Math.floor(yearsToWin / 25)

  // ROI & Opportunity Cost Logic
  const jackpotValues = { megaMillions: jackpotData.megaMillions.amount, powerball: jackpotData.powerball.amount }
  const currentJackpotTotal = jackpotValues[selectedGame] * 1_000_000
  const isNetLoss = totalInvestmentFuture > currentJackpotTotal
  const isInsaneBuyer = ticketCount >= 100_000

  const investedWealthFuture = useMemo(() => {
    if (yearsToWin <= 0) return totalInvestmentFuture
    const annualInvestment = ticketCount * drawsPerYear * GAME_TICKET_PRICE[selectedGame]
    const rate = 0.10 // 10% avg S&P 500 return
    // Future Value of an Annuity formula: PMT * [((1+r)^n - 1) / r]
    const fv = annualInvestment * ((Math.pow(1 + rate, yearsToWin) - 1) / rate)
    return Math.floor(fv)
  }, [yearsToWin, ticketCount, selectedGame, drawsPerYear])

  // Intersection Observer for animation trigger
  const [isWinYearVisible, setIsWinYearVisible] = useState(false)
  const winYearRef = React.useRef(null)

  const animatedWealth = useCountUp(investedWealthFuture, 6000, 0, isWinYearVisible, 2600)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsWinYearVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.6 }
    )
    if (winYearRef.current) observer.observe(winYearRef.current)
    return () => observer.disconnect()
  }, [])

  // Animated values - now slower (half speed) + 2s initial delay + 60% threshold
  const animatedWinYear = useCountUp(winYear, 6000, currentYear, isWinYearVisible, 2000)
  const animatedGens = useCountUp(gensPassed, 5000, 0, isWinYearVisible, 2200)
  const animatedLoss = useCountUp(totalInvestmentFuture, 6000, 0, isWinYearVisible, 2400)

  // Extra "bittersweet" GIF for Time Travel
  const ttGif = useMemo(() => {
    // Prioritize local manifest if available
    if (LOCAL_GIF_MANIFEST.lose && LOCAL_GIF_MANIFEST.lose.length > 0) {
      const pool = [...LOCAL_GIF_MANIFEST.lose, ...LOCAL_GIF_MANIFEST.hope]
      return pool[Math.floor(Math.random() * pool.length)]
    }
    const pool = [...GIF_DATA.lose, ...GIF_DATA.hope]
    const g = pool[Math.floor(Math.random() * pool.length)]
    return `https://media.giphy.com/media/${g.id}/giphy.gif`
  }, [])

  // Opportunity Cost Fact for Receipt
  const receiptOppFact = useMemo(() => {
    const FACTS = [
      { key: 'buyNYPenthouse', cost: 250000000 },
      { key: 'buyMaldivesDefense', cost: 150000000 },
      { key: 'buyVegasConstruction', cost: 2300000000 },
      { key: 'buySalvatorMundi', cost: 450000000 },
      { key: 'buyPrivateJet', cost: 5000 },
      { key: 'buyMansion', cost: 5000000 },
      { key: 'buySportsCar', cost: 150000 },
      { key: 'buyHouse', cost: 80000 },
      { key: 'buyLuxuryWatch', cost: 20000 },
      { key: 'buyUsedCar', cost: 10000 },
      { key: 'buyVacation', cost: 3000 },
      { key: 'buyPhone', cost: 1000 },
      { key: 'buyPS5', cost: 500 },
      { key: 'buySneakers', cost: 150 },
      { key: 'buySteak', cost: 60 },
      { key: 'buyLunch', cost: 15 },
      { key: 'buyCoffee', cost: 5 }
    ]
    const affordable = FACTS.filter(f => investedWealthFuture >= f.cost).sort((a, b) => b.cost - a.cost);
    if (affordable.length === 0) return null;
    const best = affordable[0];
    return t(best.key, lang, { count: formatNumber(Math.floor(investedWealthFuture / best.cost)) });
  }, [investedWealthFuture, lang]);

  return (
    <main className="screen-enter min-h-screen flex flex-col items-center px-4 py-6 md:py-10" role="main">

      {/* Hidden Lotto Paper Receipt — Premium Dark VIP Betting Slip */}
      <div
        id="hidden-receipt"
        style={{
          position: 'absolute',
          left: '-9999px',
          top: '-9999px',
          width: '380px',
          backgroundColor: '#111111',
          color: '#ffffff',
          fontFamily: '"Courier New", Courier, monospace',
          padding: '28px 24px',
          boxSizing: 'border-box',
          lineHeight: '1.5',
          borderLeft: '4px dashed #ffd700',
          borderRight: '4px dashed #ffd700',
          borderTop: '10px solid #ffd700',
          borderBottom: '10px solid #ffd700',
          borderRadius: '2px',
          boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
          overflow: 'hidden'
        }}
      >
        {/* Serrated Edge effect at top and bottom */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '6px', background: 'radial-gradient(circle, transparent 70%, #111111 72%) 0 0/12px 12px', transform: 'translateY(-3px)' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '6px', background: 'radial-gradient(circle, transparent 70%, #111111 72%) 0 0/12px 12px', transform: 'translateY(3px) rotate(180deg)' }} />

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '16px', borderBottom: '2px dashed #ffd700', paddingBottom: '16px' }}>
          <div style={{ fontSize: '11px', fontWeight: '900', letterSpacing: '3px', color: '#ffd700', marginBottom: '4px' }}>★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★</div>
          <h2 style={{ fontSize: '16px', fontWeight: '900', margin: '0 0 2px 0', letterSpacing: '1.5px', color: '#ffffff' }}>OFFICIAL DELUSION TICKET</h2>
          <p style={{ margin: 0, fontSize: '10px', fontWeight: 'bold', color: '#ffd700', letterSpacing: '2px' }}>Verified Reality Check Receipt</p>
          <div style={{ fontSize: '11px', fontWeight: '900', letterSpacing: '3px', color: '#ffd700', marginTop: '4px' }}>★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★</div>

          {/* Delusion Badge -> VOID STAMP */}
          <div style={{
            position: 'absolute',
            top: '25px',
            right: '-10px',
            transform: 'rotate(-20deg)',
            padding: '8px 20px',
            border: '5px double #ef4444',
            backgroundColor: 'transparent',
            borderRadius: '4px',
            color: '#ef4444',
            fontWeight: '900',
            fontSize: '22px',
            letterSpacing: '4px',
            opacity: 0.8,
            textShadow: '0 0 5px rgba(239, 68, 68, 0.3)'
          }}>
            {ticketCount >= 10000 ? 'DECLINED' : ticketCount >= 1000 ? 'VOID' : 'DREAMER'}
          </div>
        </div>

        {/* Date & Game */}
        <div style={{ marginBottom: '16px', fontSize: '11px', color: '#94a3b8' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
            <span>DATE:</span>
            <strong style={{ color: '#ffffff' }}>{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>GAME:</span>
            <strong style={{ color: '#ffffff' }}>{gameName.toUpperCase()}</strong>
          </div>
        </div>

        {/* Ticket Info */}
        <div style={{ marginBottom: '16px', fontSize: '12px', borderTop: '1px dashed #334155', borderBottom: '1px dashed #334155', padding: '12px 0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span>TICKETS:</span>
            <strong style={{ color: '#ffffff' }}>{formatNumber(ticketCount)}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span>INVESTMENT:</span>
            <strong style={{ color: '#ffffff' }}>${formatNumber(totalInvestment)}</strong>
          </div>

          {/* Opportunity Cost Injection */}
          {receiptOppFact && (
            <div style={{ margin: '12px 0', padding: '10px', border: '1px solid #ffd70044', backgroundColor: '#ffd70011', borderRadius: '4px', borderLeft: '4px solid #ffd700' }}>
              <p style={{ margin: 0, fontSize: '9px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold' }}>VIRAL TIP: WHAT YOU COULD HAVE BOUGHT</p>
              <p style={{ margin: '4px 0 0 0', fontSize: '12px', fontWeight: 'black', color: '#ffd700', lineHeight: '1.4' }}>{receiptOppFact.toUpperCase()}</p>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span>EST. TAKE HOME:</span>
            <strong style={{ color: '#ffffff' }}>~${formatNumber(Math.floor(jackpotData[selectedGame].cashOption * 1_000_000 * 0.50))}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>JACKPOT:</span>
            <strong style={{ color: '#ffd700' }}>${jackpot}M</strong>
          </div>
          {totalInvestment >= 1000 && (
            <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px solid #334155', color: '#ef4444', fontSize: '10px', fontWeight: '900', textAlign: 'center' }}>
              ⚠️ WEALTH WARNING: YOU SPENT ${formatNumber(totalInvestment)} ON A 1 IN {formatNumber(odds)} CHANCE.
            </div>
          )}
        </div>

        {/* Odds */}
        <div style={{ textAlign: 'center', marginBottom: '16px', padding: '18px 0', background: '#1e293b', borderRadius: '8px', border: '3px double #ffd700', boxShadow: 'inset 0 0 10px rgba(0,0,0,0.5)' }}>
          <div style={{ fontSize: '10px', marginBottom: '4px', color: '#ffd700', letterSpacing: '3px', fontWeight: 'bold' }}>CALCULATED ODDS</div>
          <div style={{ fontSize: '28px', fontWeight: '900', color: '#ffffff', letterSpacing: '-1px' }}>1 IN {formatNumber(odds)}</div>
        </div>

        {/* Sarcastic Quote Box */}
        <div style={{ marginBottom: '16px', padding: '14px', background: '#000', borderRadius: '6px', borderLeft: '5px solid #ef4444', boxShadow: '5px 5px 0px rgba(239, 68, 68, 0.1)' }}>
          <p style={{ fontSize: '10px', fontWeight: '900', margin: '0 0 6px 0', color: '#ef4444', letterSpacing: '1.5px' }}>💀 REALITY CHECK</p>
          <p style={{ fontSize: '11px', margin: 0, fontStyle: 'italic', color: '#e2e8f0', lineHeight: '1.6' }}>
            "{t(`legendQuote${(ticketCount % 20) + 1}`, lang)}"
          </p>
        </div>

        {/* Faux Barcode */}
        <div style={{ textAlign: 'center', marginTop: '20px', paddingTop: '12px', borderTop: '2px dashed #ffd700' }}>
          <div style={{
            fontSize: '32px',
            letterSpacing: '1px',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            color: '#ffffff',
            fontFamily: 'monospace',
            lineHeight: '1',
            marginBottom: '4px',
            opacity: 0.8
          }}>
            ║│║│║║║│║║│║║│║║║│║│║║
          </div>
          <div style={{ fontSize: '10px', letterSpacing: '2px', color: '#94a3b8', fontWeight: 'bold' }}>#{Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}-VIP-DEFEAT</div>
          <div style={{ fontSize: '8px', color: '#475569', marginTop: '6px', textTransform: 'uppercase' }}>WhatsChance • Premium VIP Receipt • Non-Transferable</div>
          <div style={{ fontSize: '7px', color: '#ffd700', marginTop: '6px', fontWeight: 'bold', letterSpacing: '1px' }}>FOR ENTERTAINMENT ONLY • DON'T QUIT YOUR DAY JOB</div>
        </div>
      </div>

      <div id="receipt-content" className="w-full flex flex-col items-center p-4 rounded-2xl" style={{ background: s.isDark ? '#0a0a0a' : '#f7f5f0' }}>
        <h1 className="text-2xl md:text-4xl font-black text-center mb-6 leading-tight max-w-2xl px-4" style={{ color: s.text }}>
          {t('yourJackpotOdds', lang)}
        </h1>
        <section className="w-full max-w-3xl mb-6" aria-label="Visual odds metaphor">
          <div className="relative rounded-xl overflow-hidden">
            <img
              src={viz.image}
              alt={viz.alt}
              className="w-full h-auto object-cover"
              loading="eager"
              crossOrigin="anonymous"
            />
            {/* Overlay Text: Storytelling Format */}
            {/* Overlay Part 3: Result GIF OVERLAY */}
            <div className="absolute inset-0 flex items-end justify-center pointer-events-none z-10 p-6 pb-[320px] md:pb-[400px]">
              {gifData && gifData.gifUrl && !imgError ? (
                <img
                  src={gifData.gifUrl}
                  alt="Reaction Mood"
                  className="w-48 h-48 md:w-64 md:h-64 object-contain shadow-[0_0_50px_rgba(0,0,0,0.9)] border-4 border-white/20 opacity-95"
                  style={{
                    borderRadius: '16px',
                    transform: 'rotate(-4deg)',
                    animation: 'dropIn 1.6s 2s both, fadeOut 1s 8.6s forwards'
                  }}
                  crossOrigin="anonymous"
                  onError={() => setImgError(true)}
                />
              ) : gifData && gifData.emoji ? (
                <div
                  className="w-40 h-40 md:w-56 md:h-56 flex items-center justify-center bg-black/40 backdrop-blur-md shadow-[0_0_40px_rgba(0,0,0,0.9)] border-4 border-white/20 opacity-95"
                  style={{
                    borderRadius: '16px',
                    transform: 'rotate(-4deg)',
                    animation: 'dropIn 1.6s 2s both, fadeOut 1s 8.6s forwards'
                  }}
                >
                  <span className="text-7xl md:text-8xl animate-pulse">{gifData.emoji}</span>
                </div>
              ) : null}
            </div>

            {/* Comparison Logic Overtly Placed On Bottom of Image */}
            <div className="absolute bottom-0 left-0 w-full p-4 md:p-6 z-20">
              <ComparisonCard 
                item={viz.minSpend !== undefined ? viz : comparison} 
                odds={odds} 
                tickets={ticketCount} 
                lang={lang} 
              />
            </div>
          </div>
        </section>

        {/* Ad: post-image, high viewability */}
        <AdPlaceholder className="mb-4 w-full max-w-xl" />

        {/* Stats Row */}
        <section className="w-full max-w-3xl grid grid-cols-2 md:grid-cols-5 gap-3 mb-8" aria-label="Your lottery odds statistics">
          <div className="text-center px-2 py-4 rounded-lg overflow-hidden" style={{ background: s.cardBg, border: `1px solid ${s.cardBorder}` }}>
            <p className="text-[10px] md:text-xs mb-1" style={{ color: s.textMuted }}>{t('tickets', lang)}</p>
            <p className={`font-black leading-none ${ticketCount >= 10_000_000 ? 'text-lg md:text-xl' : 'text-xl md:text-2xl'}`} style={{ color: s.text }}>
              {formatNumber(ticketCount)}
            </p>
            <p className="text-[9px] mt-1 opacity-70 truncate" style={{ color: s.textDim }}>
              {totalInvestment >= 1_000_000_000 ? `$${(totalInvestment / 1_000_000_000).toFixed(1)}B` : t('invested', lang, { amount: formatNumber(totalInvestment) })}
            </p>
          </div>
          <div className="text-center px-4 py-4 rounded-lg" style={{ background: s.cardBg, border: `1px solid ${s.cardBorder}` }}>
            <p className="text-xs md:text-sm mb-1" style={{ color: s.textMuted }}>{t('yourOdds', lang)}</p>
            <p className="text-base md:text-xl font-black leading-tight" style={{ color: s.text }}>1 / {odds >= 1_000_000 ? (odds / 1_000_000).toFixed(1) + 'M' : formatNumber(odds)}</p>
          </div>
          <div className="text-center px-4 py-4 rounded-lg" style={{ background: s.cardBg, border: `1px solid ${s.cardBorder}` }}>
            <p className="text-xs md:text-sm mb-1" style={{ color: s.textMuted }}>{t('game', lang)}</p>
            <p className="text-lg md:text-xl font-bold" style={{ color: s.text }}>{gameName}</p>
          </div>
          <div className="text-center px-2 py-4 rounded-lg overflow-hidden" style={{ background: s.cardBg, border: `1px solid ${s.cardBorder}` }}>
            <p className="text-[10px] md:text-xs mb-1" style={{ color: s.textMuted }}>{t('jackpot', lang)}</p>
            <p className="text-gold text-xl md:text-2xl font-black">${jackpot}M</p>
            <p className="text-[9px] mt-1 opacity-70 truncate" style={{ color: s.textDim }}>Cash: ~${jackpotData[selectedGame].cashOption}M</p>
          </div>
          {/* Zodiac Box */}
          <div className="text-center px-4 py-4 rounded-lg flex flex-col items-center justify-center cursor-pointer transition-transform hover:scale-105"
            onClick={() => { playSound('pop'); onZodiacFortune(); }}
            style={{
              background: 'rgba(255,215,0,0.08)',
              border: '1px solid rgba(255,215,0,0.3)',
              color: '#FFD700'
            }}
          >
            <p className="text-[10px] md:text-xs mb-1 font-bold tracking-tight">{t('myZodiacFortune', lang).replace('🔮 ', '')}</p>
            <p className="text-2xl md:text-3xl">🔮</p>
            <p className="text-[9px] mt-1 opacity-70">See Your Fate</p>
          </div>
        </section>

        {/* ─── TIME TRAVEL: WIN YEAR SIMULATION ─── */}
        <section
          ref={winYearRef}
          className="w-full max-w-3xl mb-8 overflow-hidden rounded-2xl relative"
          style={{ background: '#000', border: `1px solid ${gameAccent}40` }}
        >
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `radial-gradient(${gameAccent} 1px, transparent 1px)`, backgroundSize: '20px 20px' }} />
          <div className="relative p-6 md:p-10 flex flex-col items-center text-center">

            <div className="mb-6 flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/20">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-[10px] md:text-xs font-black text-red-500 uppercase tracking-widest">{t('currentYear', lang)}</span>
            </div>

            <p className="text-sm md:text-lg max-w-lg font-medium leading-relaxed mb-8" style={{ color: s.text }}>
              {(() => {
                const drawingDays = selectedGame === 'megaMillions' ? t('mmDays', lang) : t('pbDays', lang)
                return isInsaneBuyer
                  ? t('winYearInsaneDesc', lang, { count: formatNumber(ticketCount), days: drawingDays })
                  : t('winYearDesc', lang, { count: formatNumber(ticketCount), cost: formatNumber(ticketCount * GAME_TICKET_PRICE[selectedGame]), days: drawingDays })
              })()}
            </p>

            <div className="text-4xl md:text-8xl font-black mb-8 tracking-tighter shadow-gold" style={{ color: '#fff' }}>
              AD {formatNumber(animatedWinYear)}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-xl">
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <p className="text-[9px] uppercase tracking-widest text-white/40 mb-1">Impact</p>
                <p className="text-sm md:text-base font-bold text-white">
                  {animatedGens >= 1
                    ? t('futureCity', lang, { gens: formatNumber(Math.floor(animatedGens)) })
                    : t('impactImmediate', lang)
                  }
                </p>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <p className="text-[9px] uppercase tracking-widest text-white/40 mb-1">
                  {isNetLoss ? 'ROI Alert' : 'Total Loss'}
                </p>
                <p className={`text-sm md:text-base font-bold ${isNetLoss ? 'text-orange-400' : 'text-red-400'}`}>
                  {isNetLoss
                    ? t('lossBadROI', lang, {
                      years: formatNumber(winYear - new Date().getFullYear()),
                      loss: formatNumber(totalInvestmentFuture)
                    })
                    : `$${formatNumber(totalInvestmentFuture)}`
                  }
                </p>
              </div>
            </div>

            {/* Purchasing Power Dashboard (Wealth vs Waste) */}
            {yearsToWin > 1 && (
              <div className="mt-8 w-full max-w-xl">
                <PurchasingPowerDashboard totalCost={investedWealthFuture} lang={lang} gameAccent={gameAccent} />
              </div>
            )}

            <p className="mt-8 text-[10px] opacity-40 uppercase tracking-[0.2em]" style={{ color: gameAccent }}>
              {t('estWinYear', lang)}
            </p>

            {/* Bittersweet GIF Overlay - Drops in after year starts counting */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20 overflow-hidden">
              {isWinYearVisible && (
                <img
                  src={ttGif}
                  alt="Mood"
                  className="w-48 h-48 md:w-64 md:h-64 object-contain shadow-2xl border-4 border-white/10"
                  style={{
                    borderRadius: '12px',
                    transform: 'rotate(5deg)',
                    animation: 'dropIn 1.5s 3.5s both, fadeOut 1s 10s forwards'
                  }}
                />
              )}
            </div>
          </div>
        </section>

        {/* Ad: between stats and Take Home - REMOVED PER USER REQUEST */}

        {/* ─── INTERACTIVE TAKE HOME PAY BREAKDOWN ─── */}
        {(() => {
          const cashOpt = jackpotData[selectedGame].cashOption;
          const cashDollars = cashOpt * 1_000_000;
          const fedTax = Math.floor(cashDollars * 0.37);
          const stateTaxRate = STATE_TAX_RATES[selectedState] ?? 0.06;
          const stateTax = Math.floor(cashDollars * stateTaxRate);
          const addlWithhold = Math.floor(cashDollars * 0.07);
          const takeHome = cashDollars - fedTax - stateTax - addlWithhold;
          const jackpotFull = jackpot * 1_000_000;
          const fmt = (n) => n >= 1_000_000 ? '$' + (n / 1_000_000).toFixed(1) + 'M' : n >= 1_000 ? '$' + Math.floor(n / 1_000) + 'K' : '$' + formatNumber(n);
          const pct = (n, base) => Math.round((n / base) * 100);

          const funFacts = [
            `That's still ${formatNumber(Math.floor(takeHome / 350000))} median US homes. Not bad for a "haircut." \u{1F3E0}`,
            `Even after Uncle Sam's cut, that's ${formatNumber(Math.floor(takeHome / 85000))} Teslas. Vroom vroom. \u{1F697}`,
            `You could buy ${formatNumber(Math.floor(takeHome / 15))} Chipotle burritos. Extra guac, obviously. \u{1F32F}`,
            `Or retire for ${formatNumber(Math.floor(takeHome / 75000))} years. Start packing. \u{1F3D6}`,
            `That buys ${formatNumber(Math.floor(takeHome / 5))} more lottery tickets. Wait... don't. \u{1F3B0}`,
          ];
          const funFact = funFacts[Math.floor(jackpot % funFacts.length)];

          const startReveal = () => {
            setShowTakeHome(true);
            setRevealStep(0);
            for (let i = 1; i <= 6; i++) {
              setTimeout(() => setRevealStep(i), i * 600);
            }
          };

          const rows = [
            { step: 1, icon: '\u{1F3C6}', label: 'Jackpot', color: s.textMuted, barBg: s.isDark ? 'rgba(255,215,0,0.1)' : 'rgba(255,215,0,0.15)', fillBg: 'linear-gradient(90deg, #ffd700, #ffaa00)', w: '100%', val: fmt(jackpotFull), txtCls: 'text-black', h: 'h-8' },
            { step: 2, icon: '\u{1F4B5}', label: 'Cash Option', color: s.textMuted, barBg: s.isDark ? 'rgba(59,130,246,0.1)' : 'rgba(59,130,246,0.08)', fillBg: 'linear-gradient(90deg, #3b82f6, #2563eb)', w: `${pct(cashDollars, jackpotFull)}%`, val: fmt(cashDollars), txtCls: 'text-white', h: 'h-8', pctLabel: `~${pct(cashDollars, jackpotFull)}%` },
            { step: 3, icon: '\u{1F3DB}', label: '- Federal 37%', color: '#ef4444', barBg: s.isDark ? 'rgba(239,68,68,0.1)' : 'rgba(239,68,68,0.08)', fillBg: 'rgba(239,68,68,0.6)', w: `${pct(fedTax, jackpotFull)}%`, val: fmt(fedTax), txtCls: 'text-white', h: 'h-6' },
            {
              step: 4,
              icon: '\u{1F3E2}',
              label: (
                <div className="flex items-center gap-1.5 overflow-hidden">
                  <span className="whitespace-nowrap">- State</span>
                  <select
                    value={selectedState}
                    onChange={(e) => setSelectedState(e.target.value)}
                    className="bg-white/10 border border-white/20 rounded px-1 py-0 text-[9px] text-white focus:outline-none focus:border-gold/50 cursor-pointer max-w-[80px] md:max-w-none"
                    style={{ appearance: 'none' }}
                  >
                    {Object.entries(STATE_TAX_RATES).map(([state, rate]) => (
                      <option key={state} value={state} className="bg-[#1a1a1a]">
                        {state} ({(rate * 100).toFixed(state === "Indiana" || state === "North Dakota" || state === "Pennsylvania" ? 2 : 1)}%)
                      </option>
                    ))}
                  </select>
                  <span className="whitespace-nowrap text-[9px] opacity-70">~{(stateTaxRate * 100).toFixed(1)}%</span>
                </div>
              ),
              color: '#f97316',
              barBg: s.isDark ? 'rgba(249,115,22,0.1)' : 'rgba(249,115,22,0.08)',
              fillBg: 'rgba(249,115,22,0.6)',
              w: `${pct(stateTax, jackpotFull)}%`,
              val: fmt(stateTax),
              txtCls: 'text-white',
              h: 'h-6'
            },
            { step: 5, icon: '\u{1F4CB}', label: '- Withholding ~7%', color: '#a855f7', barBg: s.isDark ? 'rgba(168,85,247,0.1)' : 'rgba(168,85,247,0.08)', fillBg: 'rgba(168,85,247,0.6)', w: `${pct(addlWithhold, jackpotFull)}%`, val: fmt(addlWithhold), txtCls: 'text-white', h: 'h-6' },
          ];

          return (
            <section className="w-full max-w-3xl mb-8">
              {!showTakeHome ? (
                <button
                  onClick={startReveal}
                  className="w-full rounded-2xl p-6 md:p-8 text-center transition-all hover:scale-[1.01] cursor-pointer group"
                  style={{ background: s.isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)', border: `1px dashed ${s.cardBorder}` }}
                >
                  <p className="text-2xl md:text-3xl mb-2">{'\u{1F4B0}'}</p>
                  <h2 className="text-base md:text-lg font-black mb-2 group-hover:scale-105 transition-transform" style={{ color: s.text }}>
                    {t('takeHomeTitle', lang)}
                  </h2>
                  <p className="text-xs md:text-sm" style={{ color: s.textDim }}>
                    {t('takeHomeSub', lang, { game: gameName })}
                  </p>
                  <div className="mt-4 inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-bold transition-all group-hover:gap-3" style={{ background: gameAccent, color: '#fff' }}>
                    {t('revealBtn', lang)} <span className="transition-transform group-hover:translate-x-1">{'\u2192'}</span>
                  </div>
                </button>
              ) : (
                <div className="rounded-2xl p-5 md:p-8" style={{ background: s.isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)', border: `1px solid ${s.cardBorder}` }}>
                  <h2 className="text-lg md:text-xl font-black text-center mb-1" style={{ color: s.text }}>
                    {t('takeHomeTitle', lang)}
                  </h2>
                  <p className="text-xs text-center mb-6" style={{ color: s.textDim }}>
                    {t('takeHomeSub', lang, { game: gameName })}
                  </p>

                  <div className="flex flex-col gap-3 mb-6">
                    {rows.map((row) => (
                      <div key={row.step} className="flex items-center gap-3 transition-all duration-500" style={{ opacity: revealStep >= row.step ? 1 : 0, transform: revealStep >= row.step ? 'translateY(0)' : 'translateY(12px)' }}>
                        <span className="text-[10px] md:text-xs font-medium w-28 md:w-36 text-right flex items-center justify-end gap-1" style={{ color: row.color }}>
                          <span>{row.icon}</span> {row.label}
                        </span>
                        <div className={`flex-1 ${row.h} rounded-md overflow-hidden relative`} style={{ background: row.barBg }}>
                          <div className="h-full rounded-md flex items-center px-3 transition-all duration-1000 ease-out" style={{ width: revealStep >= row.step ? row.w : '0%', background: row.fillBg }}>
                            <span className={`text-[10px] md:text-xs font-black ${row.txtCls} whitespace-nowrap`}>{row.val}</span>
                          </div>
                          {row.pctLabel && <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-bold" style={{ color: s.textDim }}>{row.pctLabel}</span>}
                        </div>
                      </div>
                    ))}

                    <div className="border-t my-1 transition-opacity duration-500" style={{ borderColor: s.cardBorder, opacity: revealStep >= 6 ? 1 : 0 }} />

                    {/* You Keep */}
                    <div className="flex items-center gap-3 transition-all duration-700" style={{ opacity: revealStep >= 6 ? 1 : 0, transform: revealStep >= 6 ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.95)' }}>
                      <span className="text-xs md:text-sm font-black w-28 md:w-36 text-right flex items-center justify-end gap-1" style={{ color: '#22c55e' }}>
                        <span>{'\u{1F911}'}</span> You Keep
                      </span>
                      <div className="flex-1 h-10 rounded-md overflow-hidden relative" style={{ background: s.isDark ? 'rgba(34,197,94,0.1)' : 'rgba(34,197,94,0.08)' }}>
                        <div className="h-full rounded-md flex items-center px-3 transition-all duration-1000 ease-out" style={{ width: revealStep >= 6 ? `${pct(takeHome, jackpotFull)}%` : '0%', background: 'linear-gradient(90deg, #22c55e, #16a34a)' }}>
                          <span className="text-sm md:text-base font-black text-white">{fmt(takeHome)}</span>
                        </div>
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-black transition-opacity duration-500" style={{ color: '#22c55e', opacity: revealStep >= 6 ? 1 : 0 }}>~{pct(takeHome, jackpotFull)}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Fun consolation */}
                  <div className="text-center transition-all duration-700 mb-4" style={{ opacity: revealStep >= 6 ? 1 : 0, transform: revealStep >= 6 ? 'translateY(0)' : 'translateY(10px)' }}>
                    <p className="text-sm md:text-base font-bold mb-1" style={{ color: s.text }}>{t('taxOuch', lang)}</p>
                    <p className="text-xs md:text-sm" style={{ color: s.textDim }}>{funFact}</p>
                  </div>

                  <p className="text-[9px] text-center italic" style={{ color: s.textDim }}>{t('taxDisclaimer', lang)}</p>
                </div>
              )}
            </section>
          );
        })()}

        {/* Tax Comparison CTA */}
        <div className="w-full max-w-lg mt-4 mb-4">
          <button
            onClick={() => { playSound('pop'); onViewTaxes(); }}
            className="w-full group rounded-2xl p-6 flex items-center justify-between transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg border border-white/10 hover:border-gold/50"
            style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)' }}
          >
            <div className="flex flex-col items-start gap-1">
              <span className="text-xs uppercase tracking-widest text-gold font-black">{t('taxBlogTitle', lang)}</span>
              <span className="text-sm md:text-base font-bold text-white/90">{t('taxPageCTABtn', lang)}</span>
            </div>
            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gold/20 text-gold group-hover:bg-gold group-hover:text-black transition-all">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </div>
          </button>
        </div>

      </div>

      {/* CTAs */}
      <div className="w-full max-w-md flex flex-col gap-3 mb-8 mt-6">
        <button
          onClick={captureReceipt}
          disabled={receiptSharing}
          className="w-full rounded-xl px-6 py-4 text-sm md:text-base font-bold transition-all hover:scale-[1.02] flex items-center justify-center gap-2 disabled:opacity-70"
          style={{ background: receiptSharing ? '#4ade80' : '#ffd700', color: '#000' }}
        >
          {receiptSharing ? '✅ Copied & Opened!' : `🧾 ${t('generateReceipt', lang)}`}
        </button>
        <button
          onClick={() => { playSound('pop'); onGoToSimulator(); }}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
          style={{
            background: 'transparent',
            border: `1px solid ${gameAccent}`,
            color: gameAccent
          }}
          aria-label="Try the 1,000x simulator"
        >
          🎰 {t('goToSimulatorBtn', lang)}
        </button>
        <button
          onClick={() => { playSound('pop'); onStartOver(); }}
          className="flex items-center gap-2 justify-center px-6 py-3 rounded-lg font-semibold text-sm transition-all"
          style={{
            background: 'transparent',
            border: `1px solid ${s.cardBorder}`,
            color: s.textMuted
          }}
          aria-label="Start over from the beginning"
        >
          <HomeIcon /> {t('startOver', lang)}
        </button>
      </div>

      {/* Ad: between CTAs and social */}
      <AdPlaceholder className="my-4 w-full max-w-md" />

      {/* Social Share */}
      <SocialShare shareText={shareText} lang={lang} />

      {/* Explore odds link */}
      <button
        onClick={onExploreOdds}
        className="mt-2 text-xs font-medium underline underline-offset-4 transition-colors flex items-center gap-1"
        style={{ color: gameAccent, opacity: 0.8 }}
      >
        🎰 {t('seeAllWays', lang, { game: gameName })}
      </button>



    </main>
  )
}

// ============================================================
// MAIN APP
// ============================================================

export default function App() {
  // Initialize screen from Hash if present (for SEO and Refresh persistence)
  const [screen, setScreen] = useState(() => window.location.hash.replace('#', '') || 'start')
  const [prevScreen, setPrevScreen] = useState('start')
  const [selectedGame, setSelectedGame] = useState('megaMillions')
  const [ticketCount, setTicketCount] = useState(5)
  const [theme, setTheme] = useState('dark')
  const [lang, setLang] = useState('en')
  const [selectedState, setSelectedState] = useState('Average / Other')
  const [legalModal, setLegalModal] = useState(null) // 'privacy' or 'tos' or null

  // Live Data State
  const [liveJackpots, setLiveJackpots] = useState(JACKPOTS)
  const [isLiveData, setIsLiveData] = useState(false)
  const [lastWinners, setLastWinners] = useState(DEFAULT_LAST_WINNERS)
  const [lastJackpotWinners, setLastJackpotWinners] = useState(DEFAULT_LAST_JACKPOT_WINNERS)

  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark')
  }, [])

  // Apply theme to body
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    document.body.style.background = theme === 'dark' ? '#0a0a0a' : '#f7f5f0'
    document.body.style.color = theme === 'dark' ? '#ffffff' : '#1a1a1a'
  }, [theme])

  // Persist and read lang from document for child components
  useEffect(() => {
    document.documentElement.setAttribute('data-lang', lang)
  }, [lang])

  // Fetch live lottery data on mount and every 5 minutes
  useEffect(() => {
    async function loadLiveData() {
      try {
        const data = await fetchAllLotteryData(JACKPOTS)
        if (data) {
          setLiveJackpots({
            megaMillions: {
              amount: data.megaMillions.amount,
              cashOption: data.megaMillions.cashOption,
              nextDrawing: data.megaMillions.nextDrawing,
              ticketPrice: data.megaMillions.ticketPrice
            },
            powerball: {
              amount: data.powerball.amount,
              cashOption: data.powerball.cashOption,
              nextDrawing: data.powerball.nextDrawing,
              ticketPrice: data.powerball.ticketPrice
            }
          })
          setIsLiveData(data._megaMillionsLive || data._powerballLive)

          // Update jackpot winners if API detected one
          if (data._megaMillionsJackpotWinner) {
            setLastJackpotWinners(prev => ({
              ...prev,
              megaMillions: data._megaMillionsJackpotWinner
            }))
          }

          // Update non-jackpot winners from live data
          if (data._megaMillionsTopWinner) {
            const w = data._megaMillionsTopWinner
            setLastWinners(prev => ({
              ...prev,
              megaMillions: {
                date: w.date || prev.megaMillions.date,
                state: w.state || 'Multiple States',
                amount: w.amountFormatted
              }
            }))
          }
        }
      } catch (err) {
        console.warn('[App] Failed to load live data, using fallback:', err)
      }
    }

    loadLiveData()
    const interval = setInterval(loadLiveData, 5 * 60 * 1000) // Refresh every 5 minutes
    return () => clearInterval(interval)
  }, [])

  // Sync state with Browser Hash changes (Back/Forward buttons)
  useEffect(() => {
    const handleHashChange = () => {
      const h = window.location.hash.replace('#', '') || 'start'
      if (h !== screen) {
        setScreen(h)
      }
    }
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [screen])

  // Dynamic SEO & Document Title
  useEffect(() => {
    if (screen === 'stateTaxes') {
      document.title = t('taxPageTitle', lang);
      let metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', t('taxPageDescription', lang));
      }
    } else if (screen === 'taxTrivia') {
      document.title = t('triviaPageTitle', lang);
      let metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', t('triviaPageDescription', lang));
      }
    } else {
      // Restore default
      document.title = "WhatsChance | The Ultimate Lottery Reality Check";
      let metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', "Find out why you'll never win the Powerball or Mega Millions. Simulate your odds, face the brutal math, and see what you could have bought instead.");
      }
    }
  }, [screen, lang]);


  // Deep droplet bloop — same sound as lottery simulator, plays on every screen transition
  const playAppPop = useCallback(() => {
    playSound('pop');
  }, []);

  const navigateTo = useCallback((newScreen) => {
    playAppPop();
    setPrevScreen(screen)
    
    // Update hash to allow refresh persistence and SEO
    if (window.location.hash.replace('#', '') !== newScreen) {
      window.location.hash = newScreen
    } else {
      // If same hash, handle manually
      setScreen(newScreen)
    }
    
    window.scrollTo(0, 0)
  }, [screen, playAppPop])

  const handleStart = useCallback(() => navigateTo('selection'), [navigateTo])
  const handleCheckOdds = useCallback((count) => {
    setTicketCount(count)
    navigateTo('transition')
  }, [navigateTo])

  const handleTransitionComplete = useCallback(() => {
    navigateTo('results')
  }, [navigateTo])

  const handleTryAgain = useCallback(() => navigateTo('selection'), [navigateTo])
  const handleStartOver = useCallback(() => navigateTo('start'), [navigateTo])
  const handleExploreOdds = useCallback(() => navigateTo('odds'), [navigateTo])
  const handleBackFromOdds = useCallback(() => navigateTo(prevScreen === 'odds' ? 'start' : prevScreen), [navigateTo, prevScreen])
  const handleZodiacFortune = useCallback(() => navigateTo('zodiac'), [navigateTo])
  const handleBackFromZodiac = useCallback(() => navigateTo('results'), [navigateTo])
  const handleBackFromTaxes = useCallback((target) => {
    if (typeof target === 'string') navigateTo(target)
    else navigateTo('results')
  }, [navigateTo])
  const handleViewTaxes = useCallback(() => navigateTo('stateTaxes'), [navigateTo])

  return (
    <ThemeContext.Provider value={{ theme, toggle: toggleTheme }}>
      <LangContext.Provider value={{ lang, setLang }}>
        <div className={`min-h-screen transition-colors duration-300 flex flex-col ${theme === 'dark' ? 'dark' : ''}`} style={{ background: theme === 'dark' ? '#0a0a0a' : '#f7f5f0' }}>
          <RealityCheckTicker />
          <LanguageSwitcher />
          <ThemeToggle />

          {/* Main content area with min-height to prevent footer jump */}
          <div className="flex-1 flex flex-col">
            {screen === 'start' && (
              <StartPage 
                onStart={handleStart} 
                onExploreOdds={handleExploreOdds} 
                onGoToHistory={() => { window.scrollTo(0,0); navigateTo('history'); }} 
                onGoToChecklist={() => { window.scrollTo(0,0); navigateTo('checklist'); }} 
                onGoToLucky={() => { window.scrollTo(0,0); navigateTo('lucky'); }} 
                onGoToLumpSum={() => { window.scrollTo(0,0); navigateTo('annuity'); }} 
                jackpotData={liveJackpots} 
                lastWinners={lastWinners} 
                lastJackpotWinners={lastJackpotWinners} 
                isLiveData={isLiveData} 
              />
            )}
            {screen === 'history' && (
              <LotteryHistory 
                onGoBack={() => { window.scrollTo(0,0); navigateTo('start'); }} 
                onNext={() => { window.scrollTo(0,0); navigateTo('checklist'); }}
              />
            )}
            {screen === 'checklist' && (
              <JackpotChecklist 
                onGoBack={() => { window.scrollTo(0,0); navigateTo('history'); }}
                onNext={() => { window.scrollTo(0,0); navigateTo('annuity'); }}
              />
            )}
            {screen === 'annuity' && (
              <LumpSumAnnuity 
                onGoBack={() => { window.scrollTo(0,0); navigateTo('checklist'); }}
                onNext={() => { window.scrollTo(0,0); navigateTo('lucky'); }}
              />
            )}
            {screen === 'lucky' && (
              <LuckyNumbers 
                onGoBack={() => { window.scrollTo(0,0); navigateTo('annuity'); }}
                onFinish={() => { window.scrollTo(0,0); navigateTo('selection'); }}
              />
            )}
            {screen === 'selection' && (
              <TicketSelection
                onCheckOdds={handleCheckOdds}
                selectedGame={selectedGame}
                setSelectedGame={setSelectedGame}
                onExploreOdds={handleExploreOdds}
                onGoBack={handleStartOver}
                jackpotData={liveJackpots}
              />
            )}
            {screen === 'transition' && (
              <TransitionScreen onComplete={handleTransitionComplete} />
            )}
            {screen === 'results' && (
              <Results
                ticketCount={ticketCount}
                selectedGame={selectedGame}
                onTryAgain={handleTryAgain}
                onExploreOdds={handleExploreOdds}
                onStartOver={handleStartOver}
                onZodiacFortune={handleZodiacFortune}
                jackpotData={liveJackpots}
                selectedState={selectedState}
                setSelectedState={setSelectedState}
                onViewTaxes={handleViewTaxes}
                onGoToSimulator={() => navigateTo('simulator')}
              />
            )}
            {screen === 'simulator' && (
              <div className="relative min-h-screen">
                <button
                  onClick={() => navigateTo('results')}
                  className="absolute top-4 left-4 z-50 flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
                  style={{
                    background: 'rgba(0,0,0,0.5)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    color: '#fff',
                    backdropFilter: 'blur(8px)'
                  }}
                  aria-label="Back to results"
                >
                  ← {t('backToResults', lang)}
                </button>
                <LotterySimulator />
              </div>
            )}
            {screen === 'odds' && (
              <OddsBreakdown
                onBack={handleBackFromOdds}
                onCheckJackpot={handleStart}
                selectedGame={selectedGame}
                setSelectedGame={setSelectedGame}
                jackpotData={liveJackpots}
              />
            )}
            {screen === 'zodiac' && (
              <ZodiacFortune
                onBack={handleBackFromZodiac}
                onStartOver={handleStartOver}
              />
            )}
            {screen === 'stateTaxes' && (
              <TaxInfoBlog lang={lang} onBack={handleBackFromTaxes} />
            )}
            {screen === 'taxTrivia' && (
              <TaxTrivia lang={lang} onBack={handleBackFromTaxes} />
            )}

          </div>

          {/* Legal Disclaimer — always visible */}
          <footer className="w-full max-w-3xl mx-auto px-6 py-12 mt-auto border-t" style={{ borderColor: 'rgba(128,128,128,0.2)' }}>
            <p className="text-[11px] font-bold leading-relaxed text-center mb-4" style={{ color: 'var(--text-muted)' }}>
              {t('disclaimer', lang)}
            </p>
            <div className="flex items-center justify-center gap-4 mb-4">
              <button
                onClick={() => setLegalModal('privacy')}
                className="text-[10px] uppercase tracking-wider opacity-60 hover:opacity-100 transition-opacity"
                style={{ color: 'var(--text-dim)' }}
              >
                {t('privacyPolicy', lang)}
              </button>
              <span className="w-1 h-1 rounded-full bg-white/10" />
              <button
                onClick={() => setLegalModal('tos')}
                className="text-[10px] uppercase tracking-wider opacity-60 hover:opacity-100 transition-opacity"
                style={{ color: 'var(--text-dim)' }}
              >
                {t('termsOfService', lang)}
              </button>
            </div>
            <p className="text-[10px] text-center" style={{ color: 'var(--text-dim)', opacity: 0.8 }}>
              {t('copyrightFooter', lang, { year: new Date().getFullYear() })}
            </p>
          </footer>

          {/* Modals */}
          {legalModal === 'privacy' && <LegalModal type="privacy" onClose={() => setLegalModal(null)} />}
          {legalModal === 'tos' && <LegalModal type="tos" onClose={() => setLegalModal(null)} />}
        </div>
      </LangContext.Provider>
      <SpeedInsights />
    </ThemeContext.Provider>
  )
}
