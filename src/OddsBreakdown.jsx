import React, { useState } from 'react'
import { useLang, AdPlaceholder } from './App.jsx'
import { t } from './translations.js'
import { formatNumber } from './utils/formatters.js'
import { BackArrow } from './components/Icons.jsx'

// ============================================================
// BALL ICON COMPONENTS
// ============================================================

function WhiteBall() {
  return (
    <span className="inline-flex items-center justify-center w-6 h-6 md:w-7 md:h-7 rounded-full bg-gradient-to-b from-white to-gray-200 text-[10px] font-bold text-gray-700 shadow-md border border-gray-300 flex-shrink-0" aria-label="white ball">
      <span className="w-2 h-2 rounded-full bg-gray-300/60"></span>
    </span>
  )
}

function MegaBall({ label }) {
  return (
    <span className="inline-flex items-center justify-center w-6 h-6 md:w-7 md:h-7 rounded-full bg-gradient-to-b from-blue-400 to-blue-700 text-[10px] font-bold text-white shadow-md border border-blue-500 flex-shrink-0" aria-label={label || "mega ball"}>
      <span className="w-2 h-2 rounded-full bg-blue-300/60"></span>
    </span>
  )
}

function RedBall({ label }) {
  return (
    <span className="inline-flex items-center justify-center w-6 h-6 md:w-7 md:h-7 rounded-full bg-gradient-to-b from-red-400 to-red-700 text-[10px] font-bold text-white shadow-md border border-red-500 flex-shrink-0" aria-label={label || "red ball"}>
      <span className="w-2 h-2 rounded-full bg-red-300/60"></span>
    </span>
  )
}

// ============================================================
// ODDS DATA (from official sites — JACKPOT EXCLUDED)
// ============================================================

const MEGA_MILLIONS_TIERS = [
  {
    match: "5 White Balls",
    balls: { white: 5, gold: 0 },
    prize: "$1,000,000",
    prizeNum: 1000000,
    odds: 12629232,
    emoji: "💎",
    humor: "Like being the one person picked from the entire population of Manhattan... twice. You'd have better luck getting a personal call from the president.",
    humorKo: "맨해튼 전체 인구 중 한 명이 뽑히는 것과 같아요... 두 번이나. 대통령한테 직접 전화받을 확률이 더 높아요.",
    humorEs: "Como ser la única persona elegida de toda la población de Manhattan... dos veces. Tendrías más suerte recibiendo una llamada personal del presidente.",
    comicImage: "/images/comic-snowflake.png",
    comicAlt: "A lone person in a Manhattan blizzard reaching for one golden snowflake",
    difficulty: 0.92
  },
  {
    match: "4 White + Mega Ball",
    balls: { white: 4, gold: 1 },
    prize: "$10,000",
    prizeNum: 10000,
    odds: 893761,
    emoji: "🏙️",
    humor: "Imagine every person in San Francisco writing their name on a grain of rice, dumping them in a pool, and you blindly picking yours. That's roughly your odds here.",
    humorKo: "샌프란시스코 전체 인구가 쌀알에 이름을 쓰고 수영장에 부어서, 눈 감고 내 것을 뽑는 확률이에요.",
    humorEs: "Imagina que cada persona en San Francisco escribe su nombre en un grano de arroz, los tiran en una piscina, y tú sacas el tuyo a ciegas.",
    comicImage: "/images/comic-dartboard.png",
    comicAlt: "A cartoon person throwing a dart at a football-field-sized dartboard",
    difficulty: 0.82
  },
  {
    match: "4 White Balls",
    balls: { white: 4, gold: 0 },
    prize: "$500",
    prizeNum: 500,
    odds: 38792,
    emoji: "📍",
    humor: "Like dropping a pin on a map of your city and landing on the exact restaurant you had your first date at. Romantic? Sure. Likely? Absolutely not.",
    humorKo: "도시 지도에 핀을 떨어뜨려서 첫 데이트했던 정확한 식당에 꽂히는 확률이에요. 로맨틱하죠? 그래요. 가능성은? 전혀 없어요.",
    humorEs: "Como soltar un pin en el mapa de tu ciudad y caer exactamente en el restaurante de tu primera cita. ¿Romántico? Claro. ¿Probable? Absolutamente no.",
    comicImage: "/images/comic-stadium.png",
    comicAlt: "A cartoon person looking for one specific seat in a massive stadium",
    difficulty: 0.72
  },
  {
    match: "3 White + Mega Ball",
    balls: { white: 3, gold: 1 },
    prize: "$200",
    prizeNum: 200,
    odds: 14547,
    emoji: "📡",
    humor: "Like accidentally connecting to your neighbor's WiFi from 3 blocks away during a thunderstorm. The signal just... found you.",
    humorKo: "폭풍우 치는 날 3블록 떨어진 이웃의 WiFi에 우연히 연결되는 확률이에요. 신호가 그냥... 당신을 찾았네요.",
    humorEs: "Como conectarte accidentalmente al WiFi de tu vecino a 3 cuadras durante una tormenta. La señal simplemente... te encontró.",
    comicImage: "/images/comic-radar.png",
    comicAlt: "A cartoon satellite dish receiving a golden signal through a thunderstorm",
    difficulty: 0.62
  },
  {
    match: "3 White Balls",
    balls: { white: 3, gold: 0 },
    prize: "$10",
    prizeNum: 10,
    odds: 606,
    emoji: "🧋",
    humor: "Like walking into a coffee shop and sitting in the one chair out of ~600 that has gum stuck under it. Congrats. Prize: $10 and a sticky surprise.",
    humorKo: "카페에 들어가서 ~600개 의자 중 밑에 껌 붙은 의자에 딱 앉는 확률이에요. 축하해요. 상금: $10과 끈적한 서프라이즈.",
    humorEs: "Como entrar a una cafetería y sentarte en la única silla de ~600 que tiene chicle pegado debajo. Felicidades. Premio: $10 y una sorpresa pegajosa.",
    comicImage: "/images/comic-coffee.png",
    comicAlt: "A cartoon coffee shop with hundreds of chairs and one marked with a golden X",
    difficulty: 0.52
  },
  {
    match: "2 White + Mega Ball",
    balls: { white: 2, gold: 1 },
    prize: "$10",
    prizeNum: 10,
    odds: 693,
    emoji: "🎒",
    humor: "Like reaching into a pile of 693 identical backpacks at a music festival and pulling out yours on the first try. Yours has the $10 emergency bill in it.",
    humorKo: "음악 페스티벌에서 693개의 같은 배낭 중 첫 시도에 내 것을 뽑는 확률이에요. 거기에 비상용 $10가 들어있죠.",
    humorEs: "Como meter la mano en una pila de 693 mochilas idénticas en un festival y sacar la tuya al primer intento. La tuya tiene el billete de $10 de emergencia.",
    comicImage: "/images/comic-lockers.png",
    comicAlt: "A cartoon person searching through hundreds of identical lockers for one golden one",
    difficulty: 0.48
  },
  {
    match: "1 White + Mega Ball",
    balls: { white: 1, gold: 1 },
    prize: "$4",
    prizeNum: 4,
    odds: 89,
    emoji: "🎪",
    humor: "Like guessing which of 89 carnival ducks has the star under it. You've done worse. Probably today. Prize: $4. That's almost a fancy coffee.",
    humorKo: "카니발에서 89마리 오리 중 별 붙은 오리를 맞추는 확률이에요. 더 어려운 것도 해봤잖아요. 상금: $4. 거의 팬시 커피값.",
    humorEs: "Como adivinar cuál de los 89 patos de carnaval tiene la estrella debajo. Has hecho cosas peores. Premio: $4. Casi alcanza para un café elegante.",
    comicImage: "/images/comic-balloon.png",
    comicAlt: "A cartoon carnival game with 89 rubber ducks and one golden one",
    difficulty: 0.28
  },
  {
    match: "Mega Ball Only",
    balls: { white: 0, gold: 1 },
    prize: "$2",
    prizeNum: 2,
    odds: 37,
    emoji: "🤧",
    humor: "Like betting which kid in a class of 37 will sneeze first. Odds are decent. Prize is $2 on a $2 ticket — so you broke even. Math is... neutral.",
    humorKo: "37명 반에서 누가 먼저 재채기하는지 맞추는 확률이에요. 확률은 괜찮아요. $2 티켓에 상금 $2 — 본전. 수학은... 중립적이에요.",
    humorEs: "Como apostar cuál de los 37 niños de una clase estornudará primero. Las probabilidades son decentes. El premio es $2 en un boleto de $2 — quedaste tablas. Las matemáticas son... neutrales.",
    comicImage: "/images/comic-sneeze.png",
    comicAlt: "A cartoon classroom with kids and one doing an enormous sneeze",
    difficulty: 0.08
  }
]

const POWERBALL_TIERS = [
  {
    match: "5 White Balls",
    balls: { white: 5, red: 0 },
    prize: "$1,000,000",
    prizeNum: 1000000,
    odds: 11688054,
    emoji: "💎",
    humor: "Like being the one person chosen from the entire population of a small European country. You'd have better luck being struck by a meteorite. Twice.",
    humorKo: "소규모 유럽 국가 전체 인구 중 한 명으로 뽑히는 것과 같아요. 운석에 두 번 맞을 확률이 더 높아요.",
    humorEs: "Como ser la única persona elegida de toda la población de un pequeño país europeo. Tendrías más suerte siendo golpeado por un meteorito. Dos veces.",
    comicImage: "/images/comic-snowflake.png",
    comicAlt: "A lone person reaching for one golden snowflake among billions",
    difficulty: 0.92
  },
  {
    match: "4 White + Powerball",
    balls: { white: 4, red: 1 },
    prize: "$50,000",
    prizeNum: 50000,
    odds: 913129,
    emoji: "🏙️",
    humor: "Imagine a stadium with 913,129 people, and you need YOUR name to be drawn. Better odds than the jackpot. Still absurd. At least there's popcorn.",
    humorKo: "913,129명이 있는 경기장에서 내 이름이 뽑혀야 해요. 잭팟보다는 나아요. 여전히 황당하지만. 팝콘이라도 있으니.",
    humorEs: "Imagina un estadio con 913,129 personas y necesitas que TU nombre sea elegido. Mejores probabilidades que el jackpot. Aún absurdo. Al menos hay palomitas.",
    comicImage: "/images/comic-dartboard.png",
    comicAlt: "A person throwing a dart at a football-field-sized dartboard",
    difficulty: 0.82
  },
  {
    match: "4 White Balls",
    balls: { white: 4, red: 0 },
    prize: "$100",
    prizeNum: 100,
    odds: 36525,
    emoji: "📍",
    humor: "Like a random Google Maps drop landing exactly on your front door. In a city of 36,525 buildings. The algorithm knows where you live. Creepy.",
    humorKo: "36,525개 건물 중 구글 맵 무작위 핀이 정확히 우리 집 앞에 떨어지는 확률이에요. 알고리즘이 집을 알아요. 으스스.",
    humorEs: "Como que un pin aleatorio de Google Maps caiga exactamente en tu puerta. En una ciudad con 36,525 edificios. El algoritmo sabe dónde vives. Espeluznante.",
    comicImage: "/images/comic-stadium.png",
    comicAlt: "A person looking for one specific seat in a massive stadium",
    difficulty: 0.72
  },
  {
    match: "3 White + Powerball",
    balls: { white: 3, red: 1 },
    prize: "$100",
    prizeNum: 100,
    odds: 14494,
    emoji: "📡",
    humor: "Like tuning an old radio dial and landing on that one pirate station that only broadcasts for 3 minutes a day. During a solar flare. In a tunnel.",
    humorKo: "오래된 라디오 다이얼을 돌려서 하루에 3분만 방송하는 해적 방송국에 딱 맞추는 확률이에요. 태양 폭풍 중에. 터널 안에서.",
    humorEs: "Como sintonizar un dial de radio viejo y encontrar esa estación pirata que solo transmite 3 minutos al día. Durante una tormenta solar. En un túnel.",
    comicImage: "/images/comic-radar.png",
    comicAlt: "A satellite dish receiving a golden signal through a thunderstorm",
    difficulty: 0.62
  },
  {
    match: "3 White Balls",
    balls: { white: 3, red: 0 },
    prize: "$7",
    prizeNum: 7,
    odds: 580,
    emoji: "🎰",
    humor: "Like picking the right locker out of 580 at a massive gym. Your prize: $7 and the satisfaction of being mildly lucky. Tell no one.",
    humorKo: "대형 헬스장 580개 사물함 중 맞는 걸 고르는 확률이에요. 상금: $7과 약간 운이 좋다는 자기 만족. 아무한테도 말하지 마세요.",
    humorEs: "Como elegir el casillero correcto de 580 en un gimnasio enorme. Tu premio: $7 y la satisfacción de tener algo de suerte. No se lo digas a nadie.",
    comicImage: "/images/comic-ocean.png",
    comicAlt: "A cartoon person looking for one golden fish in a vast ocean",
    difficulty: 0.48
  },
  {
    match: "2 White + Powerball",
    balls: { white: 2, red: 1 },
    prize: "$7",
    prizeNum: 7,
    odds: 701,
    emoji: "🎫",
    humor: "Like winning an office raffle at a company with 701 employees. You beat Karen from accounting and Dave who always wins these things. Prize: $7. Just enough for Dave's parking meter revenge.",
    humorKo: "직원 701명인 회사 사내 추첨에 당첨되는 것과 같아요. 회계부 카렌과 맨날 당첨되는 데이브를 이겼어요. 상금: $7.",
    humorEs: "Como ganar una rifa de oficina en una empresa con 701 empleados. Le ganaste a Karen de contabilidad y a Dave que siempre gana. Premio: $7.",
    comicImage: "/images/comic-raffle.png",
    comicAlt: "A cartoon office raffle with one golden ticket holder among 701 workers",
    difficulty: 0.38
  },
  {
    match: "1 White + Powerball",
    balls: { white: 1, red: 1 },
    prize: "$4",
    prizeNum: 4,
    odds: 92,
    emoji: "💐",
    humor: "Like catching the bouquet at a wedding with 92 guests. You elbowed Aunt Karen, dove across a table, and landed on the cake. Worth it? The $4 says 'debatable.'",
    humorKo: "하객 92명인 결혼식에서 부케를 잡는 것과 같아요. 이모를 밀치고, 테이블을 넘어, 케이크 위에 착지했어요. 가치가 있냐고? $4가 '글쎄'라고 해요.",
    humorEs: "Como atrapar el ramo en una boda con 92 invitados. Le diste un codazo a la tía Karen, te lanzaste sobre una mesa y caíste en el pastel. ¿Valió la pena? Los $4 dicen 'discutible'.",
    comicImage: "/images/comic-bouquet.png",
    comicAlt: "A chaotic wedding scene with 92 guests scrambling to catch a golden bouquet",
    difficulty: 0.18
  },
  {
    match: "Powerball Only",
    balls: { white: 0, red: 1 },
    prize: "$4",
    prizeNum: 4,
    odds: 38,
    emoji: "🤧",
    humor: "Like betting which kid in a class of 38 will sneeze first. Odds are decent. Prize is $4 on a $2 ticket — you doubled your money! Warren Buffett is shaking. Call your financial advisor.",
    humorKo: "38명 반에서 누가 먼저 재채기하는지 맞추는 확률이에요. 확률은 괜찮아요. $2 티켓에 $4 — 두 배를 벌었어요! 워런 버핏이 떨고 있어요.",
    humorEs: "Como apostar cuál de los 38 niños estornudará primero. Las probabilidades son decentes. El premio es $4 en un boleto de $2 — ¡duplicaste tu dinero! Warren Buffett está temblando.",
    comicImage: "/images/comic-sneeze.png",
    comicAlt: "A cartoon classroom with one kid doing an enormous exaggerated sneeze",
    difficulty: 0.08
  }
]

// ============================================================
// HELPER: Ball display component for each tier
// ============================================================

function BallDisplay({ tier, game }) {
  const balls = []
  const w = tier.balls.white || 0
  const special = game === 'megaMillions' ? (tier.balls.gold || 0) : (tier.balls.red || 0)

  for (let i = 0; i < w; i++) balls.push(<WhiteBall key={`w${i}`} />)
  
  if (special > 0) {
    if (game === 'megaMillions') {
      balls.push(<MegaBall key="g" label="Mega Ball" />)
    } else {
      balls.push(<RedBall key="r" label="Powerball" />)
    }
  }
  
  const totalWhite = 5
  const fadedWhite = totalWhite - w
  for (let i = 0; i < fadedWhite; i++) {
    balls.push(
      <span key={`fw${i}`} className="inline-flex items-center justify-center w-6 h-6 md:w-7 md:h-7 rounded-full bg-gray-700/50 border border-gray-600/30 flex-shrink-0 opacity-30" aria-hidden="true">
        <span className="w-2 h-2 rounded-full bg-gray-500/30"></span>
      </span>
    )
  }
  if (special === 0) {
    balls.push(
      <span key="fs" className={`inline-flex items-center justify-center w-6 h-6 md:w-7 md:h-7 rounded-full border flex-shrink-0 opacity-30 ${game === 'megaMillions' ? 'bg-yellow-900/30 border-yellow-700/30' : 'bg-red-900/30 border-red-700/30'}`} aria-hidden="true">
        <span className="w-2 h-2 rounded-full bg-gray-500/30"></span>
      </span>
    )
  }

  return <div className="flex items-center gap-1">{balls}</div>
}


// ============================================================
// FORMAT HELPERS
// ============================================================

// formatNumber now imported from ./utils/formatters.js

function getDifficultyColor(d) {
  if (d < 0.2) return 'bg-green-500'
  if (d < 0.4) return 'bg-lime-400'
  if (d < 0.6) return 'bg-yellow-400'
  if (d < 0.8) return 'bg-orange-500'
  return 'bg-red-500'
}

function getDifficultyLabel(d, lang) {
  if (d < 0.2) return t('prettyDoable', lang)
  if (d < 0.4) return t('longShot', lang)
  if (d < 0.6) return t('dreamBig', lang)
  if (d < 0.8) return t('nearMiracle', lang)
  return t('basicallyImpossible', lang)
}

function getHumor(tier, lang) {
  if (lang === 'ko') return tier.humorKo || tier.humor
  if (lang === 'es') return tier.humorEs || tier.humor
  return tier.humor
}

function getOddsTip(tier, lang) {
  if (tier.odds < 100) return t('oddsTipEasy', lang, { odds: tier.odds })
  if (tier.odds < 1000) return t('oddsTipUncommon', lang, { odds: formatNumber(tier.odds) })
  if (tier.odds < 50000) return t('oddsTipRare', lang, { years: Math.round(tier.odds / 365) })
  if (tier.odds < 1000000) return t('oddsTipVeryRare', lang, { odds: formatNumber(tier.odds) })
  return t('oddsTipAstro', lang, { millions: (tier.odds / 1000000).toFixed(1) })
}

// ============================================================
// MAIN COMPONENT
// ============================================================

export default function OddsBreakdown({ onBack, onCheckJackpot, selectedGame, setSelectedGame, jackpotData }) {
  const [expandedTier, setExpandedTier] = useState(null)
  const [imageLoaded, setImageLoaded] = useState({})
  const { lang } = useLang()

  const isMega = selectedGame === 'megaMillions'
  const gameAccent = isMega ? '#3b82f6' : '#ef4444'
  const gameGlow = isMega ? 'rgba(59,130,246,0.15)' : 'rgba(239,68,68,0.15)'
  const tiers = isMega ? MEGA_MILLIONS_TIERS : POWERBALL_TIERS
  const gameName = isMega ? "Mega Millions" : "Powerball"
  
  // Use live data if provided (e.g., $5 Mega Millions coming soon), fallback to standard $2
  const ticketPrice = jackpotData && jackpotData[selectedGame] ? jackpotData[selectedGame].ticketPrice : 2
  const specialBallName = isMega ? t('megaBall', lang) : t('powerballBall', lang)
  const overallOdds = isMega ? "1 in 24" : "1 in 24.87"

  const toggleTier = (i) => {
    setExpandedTier(expandedTier === i ? null : i)
  }

  return (
    <main className="min-h-screen bg-[var(--bg-primary)] flex flex-col items-center px-4 py-6 md:py-10 transition-colors duration-300" role="main">
      {/* Back button */}
      <button
        onClick={onBack}
        className="self-start mb-4 text-[var(--text-muted)] hover:text-[var(--text-primary)] text-sm flex items-center gap-1 transition-colors"
        aria-label="Go back"
      >
        <BackArrow />
        {t('back', lang)}
      </button>

      {/* Page title */}
      <h1 className="text-2xl md:text-4xl font-black text-[var(--text-primary)] text-center mb-2">
        {t('knowYourOdds', lang)}
      </h1>
      <p className="text-[var(--text-muted)] text-sm md:text-base text-center mb-6 max-w-lg">
        {t('oddsSubtitle', lang, { game: gameName })}
      </p>

      {/* Game toggle */}
      <div className="flex items-center gap-4 mb-6">
        <span
          className="text-sm font-bold cursor-pointer transition-colors"
          style={{ color: isMega ? '#3b82f6' : 'var(--text-dim)' }}
          onClick={() => { setSelectedGame('megaMillions'); setExpandedTier(null) }}
        >
          Mega Millions
        </span>
        <button
          className={`toggle-track ${!isMega ? 'active' : ''}`}
          onClick={() => {
            setSelectedGame(isMega ? 'powerball' : 'megaMillions')
            setExpandedTier(null)
          }}
          role="switch"
          aria-checked={!isMega}
          aria-label="Toggle between Mega Millions and Powerball"
        >
          <div className="toggle-thumb"></div>
        </button>
        <span
          className="text-sm font-bold cursor-pointer transition-colors"
          style={{ color: !isMega ? '#ef4444' : 'var(--text-dim)' }}
          onClick={() => { setSelectedGame('powerball'); setExpandedTier(null) }}
        >
          Powerball
        </span>
      </div>

      {/* Quick stats */}
      <div className="w-full max-w-2xl grid grid-cols-3 gap-3 mb-6">
        <div className="stats-card text-center">
          <p className="text-gray-400 text-xs mb-1">{t('ticketPrice', lang)}</p>
          <p className="text-xl font-black" style={{ color: gameAccent }}>${ticketPrice}</p>
        </div>
        <div className="stats-card text-center">
          <p className="text-gray-400 text-xs mb-1">{t('waysToWin', lang)}</p>
          <p className="text-[var(--text-primary)] text-xl font-black">9</p>
          <p className="text-gray-500 text-[10px]">{t('plusJackpot', lang)}</p>
        </div>
        <div className="stats-card text-center">
          <p className="text-gray-400 text-xs mb-1">{t('anyPrizeOdds', lang)}</p>
          <p className="text-xl font-black" style={{ color: gameAccent }}>{overallOdds}</p>
        </div>
      </div>

      {/* Top Ad Slot */}
      <AdPlaceholder className="mb-6" />

      {/* Legend */}
      <div className="w-full max-w-2xl flex items-center gap-4 mb-4 px-2 text-xs text-gray-500">
        <div className="flex items-center gap-1.5">
          <WhiteBall /> <span>{t('whiteBall', lang)}</span>
        </div>
        <div className="flex items-center gap-1.5">
          {isMega ? <MegaBall label="Mega Ball" /> : <RedBall label="Powerball" />}
          <span>{specialBallName}</span>
        </div>
        <div className="flex items-center gap-1.5 ml-auto">
          <span className="text-gray-500">{t('tapToReveal', lang)}</span>
          <span>👀</span>
        </div>
      </div>

      {/* Tiers list */}
      <div className="w-full max-w-2xl flex flex-col gap-2 mb-8" role="list">
        {tiers.map((tier, i) => {
          const isOpen = expandedTier === i
          const midIndex = Math.floor(tiers.length / 2)

          return (
            <React.Fragment key={i}>
              {i === midIndex && <AdPlaceholder className="my-3" />}

              <div role="listitem">
                <button
                  onClick={() => toggleTier(i)}
                  className={`w-full text-left rounded-xl border transition-all duration-300 p-4 md:p-5 ${
                    isOpen
                      ? ''
                      : 'bg-[var(--card-bg)] border-[var(--border-color)] hover:border-[var(--border-hover)] hover:bg-[var(--card-hover)]'
                  }`}
                  style={isOpen ? {
                    background: 'var(--card-active)',
                    borderColor: gameAccent + '4d',
                    boxShadow: `0 4px 20px ${gameGlow}`
                  } : {}}
                  aria-expanded={isOpen}
                  aria-label={`${tier.match} - Prize: ${tier.prize} - Odds: 1 in ${formatNumber(tier.odds)}`}
                >
                  <div className="flex items-center gap-3 flex-wrap">
                    <BallDisplay tier={tier} game={selectedGame} />
                    <div className="flex-1 min-w-0">
                      <p className="text-[var(--text-primary)] font-bold text-sm md:text-base truncate">{tier.match}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-base md:text-lg" style={{ color: gameAccent }}>{tier.prize}</p>
                    </div>
                    <div className="text-right min-w-[100px] md:min-w-[140px]">
                      <p className="text-gray-300 text-xs md:text-sm font-mono">1 in {formatNumber(tier.odds)}</p>
                    </div>
                    <svg
                      className={`w-4 h-4 text-gray-400 transition-transform duration-300 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>

                  <div className="mt-3 flex items-center gap-2">
                    <div className="flex-1 h-1.5 rounded-full bg-gray-700 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${getDifficultyColor(tier.difficulty)}`}
                        style={{ width: `${tier.difficulty * 100}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-gray-500 whitespace-nowrap">{getDifficultyLabel(tier.difficulty, lang)}</span>
                  </div>
                </button>

                {isOpen && (
                  <div className="animate-fadeIn mt-1 rounded-xl bg-gray-800/50 border border-gray-700/50 p-4 md:p-6">
                    <div className="mb-4 rounded-lg overflow-hidden border border-gray-700/30">
                      <img
                        src={tier.comicImage}
                        alt={tier.comicAlt}
                        className={`w-full h-auto object-cover transition-opacity duration-500 ${imageLoaded[i] ? 'opacity-100' : 'opacity-0'}`}
                        loading="lazy"
                        onLoad={() => setImageLoaded(prev => ({ ...prev, [i]: true }))}
                      />
                      {!imageLoaded[i] && (
                        <div className="w-full h-40 md:h-56 bg-gray-800 animate-pulse flex items-center justify-center">
                          <span className="text-gray-600 text-sm">{t('loadingIllustration', lang)}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-3 items-start">
                      <span className="text-2xl flex-shrink-0" aria-hidden="true">{tier.emoji}</span>
                      <p className="text-gray-300 text-sm md:text-base leading-relaxed italic">
                        "{getHumor(tier, lang)}"
                      </p>
                    </div>

                    <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
                      <span>💡</span>
                      <span>{getOddsTip(tier, lang)}</span>
                    </div>
                  </div>
                )}
              </div>
            </React.Fragment>
          )
        })}
      </div>

      {/* Bottom Ad Slot */}
      <AdPlaceholder className="mb-8" />

      {/* Jackpot CTA */}
      <div className="w-full max-w-2xl text-center mb-8">
        <p className="text-gray-400 text-sm mb-3">
          {t('nonJackpotTiers', lang)}
        </p>
        <h2 className="text-xl md:text-2xl font-black text-[var(--text-primary)] mb-2">
          {lang === 'ko' ? (
            <><span className="text-gold">잭팟</span> 확률을 볼 준비가 됐나요?</>
          ) : lang === 'es' ? (
            <>¿Listo para Ver tus Probabilidades de <span className="text-gold">Jackpot</span>?</>
          ) : (
            <>Ready to See Your <span className="text-gold">Jackpot</span> Odds?</>
          )}
        </h2>
        <p className="text-gray-500 text-sm mb-5">
          {t('theOneEveryone', lang, { odds: isMega ? '302,575,350' : '292,201,338' })}
        </p>
        <button
          onClick={onCheckJackpot}
          className="text-lg px-10 py-4 font-black rounded-xl transition-all hover:scale-[1.02]"
          style={{ background: gameAccent, color: '#000' }}
          aria-label="Check your jackpot odds"
        >
          {t('checkMyJackpotOdds', lang)}
        </button>
      </div>

      {/* Source attribution */}
      <footer className="w-full max-w-2xl text-center text-gray-600 text-[11px] leading-relaxed pb-8 border-t border-gray-800/50 pt-6">
        <p className="mb-2">
          {t('oddsSourced', lang)}{' '}
          {isMega ? (
            <a href="https://www.megamillions.com/How-to-Play.aspx" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-400 transition-colors">megamillions.com</a>
          ) : (
            <a href="https://www.powerball.com/powerball-prize-chart" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-400 transition-colors">powerball.com</a>
          )}{' '}
          {t('prizeCharts', lang)}
        </p>
        <p>{t('oddsFooter', lang)}</p>
      </footer>
    </main>
  )
}
