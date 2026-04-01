import React from 'react';
import { useLang, useTheme, AdPlaceholder } from './App.jsx';
import { t } from './translations.js';

export default function LotteryHistory({ onGoBack }) {
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
          <h1 className="text-3xl md:text-4xl font-black mb-4 tracking-tight"
              style={{ color: isDark ? '#fff' : '#111' }}>
            {t('historyTitle', lang)}
          </h1>
          <p className="text-lg md:text-xl leading-relaxed"
             style={{ color: isDark ? '#aaa' : '#555' }}>
            {t('historyIntro', lang)}
          </p>
        </div>

        <AdPlaceholder className="mb-10 w-full" />

        {/* Section 1 */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4" style={{ color: isDark ? '#ffd700' : '#d4af37' }}>
            {t('hist1Title', lang)}
          </h2>
          <p className="text-lg leading-relaxed mb-3" style={{ color: isDark ? '#ddd' : '#333' }}>
            {t('hist1Desc', lang)}
          </p>
          <p className="text-sm italic" style={{ color: isDark ? '#888' : '#777' }}>
            {t('hist1Source', lang)}
          </p>
        </section>

        {/* Section 2 */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4" style={{ color: isDark ? '#ffd700' : '#d4af37' }}>
            {t('hist2Title', lang)}
          </h2>
          <p className="text-lg leading-relaxed mb-3" style={{ color: isDark ? '#ddd' : '#333' }}>
            {t('hist2Desc', lang)}
          </p>
          <p className="text-sm italic" style={{ color: isDark ? '#888' : '#777' }}>
            {t('hist2Source', lang)}
          </p>
        </section>

        <AdPlaceholder className="mb-12 w-full" />

        {/* Section 3 */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4" style={{ color: isDark ? '#ffd700' : '#d4af37' }}>
            {t('hist3Title', lang)}
          </h2>
          <p className="text-lg leading-relaxed mb-3" style={{ color: isDark ? '#ddd' : '#333' }}>
            {t('hist3Desc', lang)}
          </p>
          <p className="text-sm italic" style={{ color: isDark ? '#888' : '#777' }}>
            {t('hist3Source', lang)}
          </p>
        </section>

        {/* Section 4 */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4" style={{ color: isDark ? '#ffd700' : '#d4af37' }}>
            {t('hist4Title', lang)}
          </h2>
          <p className="text-lg leading-relaxed mb-3" style={{ color: isDark ? '#ddd' : '#333' }}>
            {t('hist4Desc', lang)}
          </p>
          <p className="text-sm italic" style={{ color: isDark ? '#888' : '#777' }}>
            {t('hist4Source', lang)}
          </p>
        </section>

        {/* Closing Ad */}
        <AdPlaceholder className="mt-8 mb-8 w-full" />
        
        {/* Bottom Back Button */}
        <div className="text-center">
          <button
            onClick={onGoBack}
            className="px-8 py-4 rounded-xl font-bold text-lg transition-transform hover:scale-105"
            style={{
              background: isDark ? '#fff' : '#000',
              color: isDark ? '#000' : '#fff'
            }}
          >
            ← {t('backToCalculator', lang) || t('back', lang)}
          </button>
        </div>

      </div>
    </div>
  );
}
