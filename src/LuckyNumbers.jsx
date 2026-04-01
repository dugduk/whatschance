import React from 'react';
import { useLang, useTheme, AdPlaceholder } from './App.jsx';
import { t } from './translations.js';

export default function LuckyNumbers({ onGoBack, onFinish }) {
  const { theme } = useTheme();
  const { lang } = useLang();
  const isDark = theme === 'dark';

  return (
    <div className="w-full flex-1 flex flex-col bg-transparent pb-16">
      
      {/* Header Navigation */}
      <div className="w-full max-w-3xl mx-auto px-4 pt-6 pb-2">
        <button
          onClick={onGoBack}
          className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
          style={{
            background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
            color: isDark ? '#fff' : '#000',
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`
          }}
        >
          ← {t('back', lang)}
        </button>
      </div>

      {/* Main Content Area */}
      <div className="w-full max-w-3xl mx-auto px-4 py-8">
        
        {/* Title Section */}
        <div className="text-center mb-10">
          <img 
            src="/images/lucky_hero.jpg" 
            alt="The Science of Lucky Numbers" 
            className="w-full aspect-square md:aspect-video object-cover rounded-2xl mb-8 shadow-2xl border border-white/10"
          />
          <h1 className="text-3xl md:text-4xl font-black mb-4 tracking-tight"
              style={{ color: isDark ? '#fff' : '#111' }}>
            {t('luckyTitle', lang)}
          </h1>
          <p className="text-lg md:text-xl leading-relaxed"
             style={{ color: isDark ? '#aaa' : '#555' }}>
            {t('luckyIntro', lang)}
          </p>
        </div>

        <AdPlaceholder className="mb-10 w-full" />

        {/* Portions */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4" style={{ color: isDark ? '#10b981' : '#059669' }}>
            {t('lucky1Title', lang)}
          </h2>
          <p className="text-lg leading-relaxed" style={{ color: isDark ? '#ddd' : '#333' }}>
            {t('lucky1Desc', lang)}
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4" style={{ color: isDark ? '#10b981' : '#059669' }}>
            {t('lucky2Title', lang)}
          </h2>
          <p className="text-lg leading-relaxed" style={{ color: isDark ? '#ddd' : '#333' }}>
            {t('lucky2Desc', lang)}
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4" style={{ color: isDark ? '#10b981' : '#059669' }}>
            {t('lucky3Title', lang)}
          </h2>
          <p className="text-lg leading-relaxed" style={{ color: isDark ? '#ddd' : '#333' }}>
            {t('lucky3Desc', lang)}
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4" style={{ color: isDark ? '#10b981' : '#059669' }}>
            {t('lucky4Title', lang)}
          </h2>
          <p className="text-lg leading-relaxed" style={{ color: isDark ? '#ddd' : '#333' }}>
            {t('lucky4Desc', lang)}
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4" style={{ color: isDark ? '#10b981' : '#059669' }}>
            {t('lucky5Title', lang)}
          </h2>
          <p className="text-lg leading-relaxed" style={{ color: isDark ? '#ddd' : '#333' }}>
            {t('lucky5Desc', lang)}
          </p>
        </section>

        <AdPlaceholder className="mt-8 mb-8 w-full" />

        {/* Final Button */}
        <div className="text-center mt-12 pb-20">
          <button
            onClick={onFinish}
            className="px-10 py-5 rounded-2xl font-black text-xl transition-all hover:scale-105 shadow-[0_0_40px_rgba(16,185,129,0.3)] animate-pulse"
            style={{
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: '#fff'
            }}
          >
            {t('finishGuides', lang)} 🚀
          </button>
        </div>

      </div>
    </div>
  );
}
