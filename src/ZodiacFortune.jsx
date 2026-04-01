import React, { useState } from 'react'
import { ZODIAC_SIGNS, getDailyFortune } from './zodiacFortune.js'
import { useLang, AdPlaceholder } from './App.jsx'
import { t } from './translations.js'
import { formatNumber } from './utils/formatters.js'
import { HomeIcon, BackArrow } from './components/Icons.jsx'
import { useThemeStyles } from './hooks/useThemeStyles.js'

// Read theme from document attribute (set by App.jsx)
// useThemeStyles, BackArrow, and HomeIcon now imported from shared files

function StarRating({ level }) {
  return (
    <span className="inline-flex gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i} style={{ color: i <= level ? '#FFD700' : 'rgba(255,255,255,0.2)', fontSize: '20px' }}>★</span>
      ))}
    </span>
  )
}

// Helper to get localized sign name
function getSignName(sign, lang) {
  if (lang === 'ko') return sign.nameKo
  if (lang === 'es') return sign.nameEs
  return sign.name
}

// Helper to get localized fortune text
function getFortuneText(fortune, lang) {
  if (lang === 'ko') return fortune.textKo
  if (lang === 'es') return fortune.textEs
  return fortune.text
}

// Helper to get localized color name
function getColorName(color, lang) {
  if (lang === 'ko') return color.nameKo
  if (lang === 'es') return color.nameEs
  return color.name
}

export default function ZodiacFortune({ onBack, onStartOver }) {
  const [selectedSign, setSelectedSign] = useState(null)
  const [fortune, setFortune] = useState(null)
  const [animating, setAnimating] = useState(false)
  const [isTomorrow, setIsTomorrow] = useState(false)
  const { lang } = useLang()

  const handleSelectSign = (sign, checkTomorrow = false) => {
    setAnimating(true)
    setSelectedSign(sign)
    setIsTomorrow(checkTomorrow)

    setTimeout(() => {
      let d = new Date()
      if (checkTomorrow) {
        d.setDate(d.getDate() + 1)
      }
      const year = d.getFullYear()
      const month = String(d.getMonth() + 1).padStart(2, '0')
      const day = String(d.getDate()).padStart(2, '0')
      const targetDateStr = `${year}-${month}-${day}`

      const result = getDailyFortune(sign.id, targetDateStr)
      setFortune({ ...result, dateObj: d })
      setAnimating(false)
      window.scrollTo(0, 0)
    }, 800)
  }

  const handleBackToSelect = () => {
    setFortune(null)
    setSelectedSign(null)
    setIsTomorrow(false)
    window.scrollTo(0, 0)
  }

  if (animating) {
    return <LoadingScreen sign={selectedSign} lang={lang} />
  }

  if (fortune && selectedSign) {
    return <FortuneResult sign={selectedSign} fortune={fortune} isTomorrow={isTomorrow} onCheckTomorrow={() => handleSelectSign(selectedSign, true)} onBack={handleBackToSelect} onStartOver={onStartOver} lang={lang} />
  }

  return <SignSelection onSelect={(sign) => handleSelectSign(sign, false)} onBack={onBack} onStartOver={onStartOver} lang={lang} />
}

// ============================================================
// LOADING SCREEN
// ============================================================
function LoadingScreen({ sign, lang }) {
  const signName = getSignName(sign, lang)
  return (
    <main className="screen-enter min-h-screen flex flex-col items-center justify-center px-4 py-10">
      <div className="text-7xl mb-6" style={{ animation: 'pulse 1s ease-in-out infinite' }}>{sign.symbol}</div>
      <p className="text-lg font-medium" style={{ color: 'var(--text-color)' }}>
        {t('readingStars', lang, { sign: signName })}
      </p>
    </main>
  )
}

// ============================================================
// SIGN SELECTION GRID
// ============================================================
function SignSelection({ onSelect, onBack, onStartOver, lang }) {
  const s = useThemeStyles()

  return (
    <main className="screen-enter min-h-screen flex flex-col items-center px-4 py-6 md:py-10">
      {/* Back button */}
      <div className="w-full max-w-3xl mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-medium transition-all hover:opacity-80"
          style={{ color: s.textMuted }}
        >
          <BackArrow /> {t('backToResults', lang)}
        </button>
      </div>

      {/* Header */}
      <div className="text-5xl mb-4">🔮</div>
      <h1 className="text-2xl md:text-4xl font-black text-center mb-2">
        <span className="text-gold">{t('todaysFortune', lang)}</span>
      </h1>
      <p className="text-sm text-center mb-8 max-w-md" style={{ color: s.textMuted }}>
        {t('selectYourSign', lang)}
      </p>

      {/* Top Ad */}
      <AdPlaceholder className="mb-6" />

      {/* Zodiac Grid */}
      <div className="w-full max-w-3xl grid grid-cols-3 md:grid-cols-4 gap-3 mb-8">
        {ZODIAC_SIGNS.map(sign => (
          <button
            key={sign.id}
            onClick={() => onSelect(sign)}
            className="flex flex-col items-center gap-1.5 p-4 rounded-xl transition-all hover:scale-105 active:scale-95"
            style={{
              background: s.cardBg,
              border: `1px solid ${s.cardBorder}`,
            }}
          >
            <span className="text-3xl md:text-4xl">{sign.symbol}</span>
            <span className="text-sm font-bold" style={{ color: s.text }}>{getSignName(sign, lang)}</span>
            {lang !== 'en' && <span className="text-xs" style={{ color: s.textMuted }}>{sign.name}</span>}
            <span className="text-[10px]" style={{ color: s.textDim }}>{sign.dates}</span>
          </button>
        ))}
      </div>

      {/* Start Over */}
      <button
        onClick={onStartOver}
        className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm transition-all"
        style={{
          background: 'transparent',
          border: `1px solid ${s.cardBorder}`,
          color: s.textMuted
        }}
      >
        <HomeIcon /> {t('startOver', lang)}
      </button>
    </main>
  )
}

// ============================================================
// FORTUNE RESULT
// ============================================================
function FortuneResult({ sign, fortune, isTomorrow, onCheckTomorrow, onBack, onStartOver, lang }) {
  const s = useThemeStyles()
  const displayDate = fortune.dateObj || new Date()
  const dateStr = lang === 'ko'
    ? displayDate.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })
    : lang === 'es'
      ? displayDate.toLocaleDateString('es-ES', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
      : displayDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })

  const signName = getSignName(sign, lang)
  const fortuneText = getFortuneText(fortune.fortune, lang)
  const colorName = getColorName(fortune.luckyColor, lang)

  return (
    <main className="screen-enter min-h-screen flex flex-col items-center px-4 py-6 md:py-10">
      {/* Back button */}
      <div className="w-full max-w-2xl mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-medium transition-all hover:opacity-80"
          style={{ color: s.textMuted }}
        >
          <BackArrow /> {t('backToZodiac', lang)}
        </button>
      </div>

      {/* Sign Header */}
      <div className="text-6xl mb-3">{sign.symbol}</div>
      <h1 className="text-2xl md:text-3xl font-black text-center mb-1">
        <span className="text-gold">{t('dailyFortune', lang, { sign: signName, signKo: sign.nameKo })}</span>
      </h1>
      {lang !== 'en' && (
        <p className="text-base md:text-lg font-bold text-center mb-1" style={{ color: s.text }}>
          {sign.name}'s Daily Fortune
        </p>
      )}
      <p className="text-xs text-center mb-6" style={{ color: s.textDim }}>
        {dateStr}
      </p>

      {/* Fortune Card */}
      <div
        className="w-full max-w-2xl rounded-2xl p-6 md:p-8 mb-6"
        style={{
          background: s.cardBg,
          border: `1px solid ${s.cardBorder}`,
        }}
      >
        <div className="text-center text-3xl mb-4">{fortune.moodEmoji}</div>

        <p className="text-base md:text-lg leading-relaxed text-center mb-4 font-medium" style={{ color: s.text }}>
          "{fortuneText}"
        </p>

        {/* Fortune Level */}
        <div className="flex flex-col items-center gap-2 mb-6">
          <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: s.textDim }}>
            {t('fortuneLevel', lang)}
          </span>
          <StarRating level={fortune.fortuneLevel} />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {/* Lucky Numbers */}
          <div
            className="col-span-2 md:col-span-1 flex flex-col items-center gap-2 p-4 rounded-xl"
            style={{ background: 'rgba(255,215,0,0.08)', border: '1px solid rgba(255,215,0,0.2)' }}
          >
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#FFD700' }}>
              {t('luckyNumbers', lang)}
            </span>
            <div className="flex gap-2 flex-wrap justify-center">
              {fortune.luckyNumbers.map((num, i) => (
                <span
                  key={i}
                  className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold"
                  style={{
                    background: 'rgba(255,215,0,0.15)',
                    border: '1px solid rgba(255,215,0,0.4)',
                    color: '#FFD700'
                  }}
                >
                  {num}
                </span>
              ))}
            </div>
          </div>

          {/* Lucky Color */}
          <div
            className="flex flex-col items-center gap-2 p-4 rounded-xl"
            style={{ background: s.cardBg, border: `1px solid ${s.cardBorder}` }}
          >
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: s.textDim }}>
              {t('luckyColor', lang)}
            </span>
            <div
              className="w-10 h-10 rounded-full border-2"
              style={{ background: fortune.luckyColor.hex, borderColor: 'rgba(255,255,255,0.2)' }}
            />
            <span className="text-sm font-bold" style={{ color: fortune.luckyColor.hex }}>
              {colorName}
            </span>
          </div>

          {/* Lucky Time */}
          <div
            className="flex flex-col items-center gap-2 p-4 rounded-xl"
            style={{ background: s.cardBg, border: `1px solid ${s.cardBorder}` }}
          >
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: s.textDim }}>
              {t('luckyTime', lang)}
            </span>
            <span className="text-2xl">🕐</span>
            <span className="text-sm font-bold" style={{ color: s.text }}>
              {fortune.luckyTime}
            </span>
          </div>
        </div>
      </div>

      {/* Mid Ad */}
      <AdPlaceholder className="mb-6" />

      {/* Action Buttons */}
      <div className="w-full max-w-2xl flex flex-col md:flex-row gap-3 mb-3">
        {!isTomorrow && (
          <button
            onClick={onCheckTomorrow}
            className="flex-1 btn-cta"
            style={{ background: '#4169E1', color: '#fff' }}
          >
            {t('checkTomorrow', lang)}
          </button>
        )}

        <div className="w-full flex justify-center mt-6">
          <button
            onClick={onBack}
            className="btn-cta mb-4 w-full max-w-md"
          >
            {t('tryAnotherSign', lang)}
          </button>
        </div>

      </div>

      {/* Start Over */}
      <button
        onClick={onStartOver}
        className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm transition-all mb-4"
        style={{
          background: 'transparent',
          border: `1px solid ${s.cardBorder}`,
          color: s.textMuted
        }}
      >
        <HomeIcon /> {t('startOver', lang)}
      </button>
    </main>
  )
}
