import React from 'react';
import { useLang, useTheme, AdPlaceholder } from './App.jsx';
import { t } from './translations.js';

export default function JackpotChecklist({ onGoBack, onNext }) {
  const { theme } = useTheme();
  const { lang } = useLang();
  const isDark = theme === 'dark';

  return (
    <div className="w-full flex-1 flex flex-col bg-transparent pb-16">
      
      {/* Header Navigation */}
      <div className="w-full max-w-3xl mx-auto px-4 pt-6 pb-2 flex justify-between items-center">
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
            src="/images/checklist_hero.jpg" 
            alt="The Ultimate Jackpot Checklist" 
            className="w-full aspect-square md:aspect-video object-cover rounded-2xl mb-8 shadow-2xl border border-white/10"
          />
          <h1 className="text-3xl md:text-4xl font-black mb-4 tracking-tight"
              style={{ color: isDark ? '#fff' : '#111' }}>
            {t('checklistTitle', lang)}
          </h1>
          <p className="text-lg md:text-xl leading-relaxed"
             style={{ color: isDark ? '#aaa' : '#555' }}>
            {t('checklistIntro', lang)}
          </p>
        </div>

        <AdPlaceholder className="mb-10 w-full" />

        {/* Step 1 */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4" style={{ color: isDark ? '#ef4444' : '#dc2626' }}>
            {t('step1Title', lang)}
          </h2>
          <p className="text-lg leading-relaxed" style={{ color: isDark ? '#ddd' : '#333' }}>
            {t('step1Desc', lang)}
          </p>
        </section>

        {/* Step 2 */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4" style={{ color: isDark ? '#ef4444' : '#dc2626' }}>
            {t('step2Title', lang)}
          </h2>
          <p className="text-lg leading-relaxed" style={{ color: isDark ? '#ddd' : '#333' }}>
            {t('step2Desc', lang)}
          </p>
        </section>

        {/* Step 3 */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4" style={{ color: isDark ? '#ef4444' : '#dc2626' }}>
            {t('step3Title', lang)}
          </h2>
          <p className="text-lg leading-relaxed" style={{ color: isDark ? '#ddd' : '#333' }}>
            {t('step3Desc', lang)}
          </p>
        </section>

        {/* Step 4 */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4" style={{ color: isDark ? '#ef4444' : '#dc2626' }}>
            {t('step4Title', lang)}
          </h2>
          <p className="text-lg leading-relaxed" style={{ color: isDark ? '#ddd' : '#333' }}>
            {t('step4Desc', lang)}
          </p>
        </section>

        {/* Step 5 */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4" style={{ color: isDark ? '#ef4444' : '#dc2626' }}>
            {t('step5Title', lang)}
          </h2>
          <p className="text-lg leading-relaxed" style={{ color: isDark ? '#ddd' : '#333' }}>
            {t('step5Desc', lang)}
          </p>
        </section>

        <AdPlaceholder className="mt-8 mb-8 w-full" />

        {/* Bottom Buttons */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 px-4 py-8 pb-16">
          <button
            onClick={onGoBack}
            className="px-8 py-4 rounded-xl font-bold text-lg border border-current transition-transform hover:scale-105"
            style={{ color: isDark ? '#fff' : '#000' }}
          >
            ← {t('back', lang)}
          </button>
          {onNext && (
            <button
              onClick={onNext}
              className="px-8 py-4 rounded-xl font-bold text-lg transition-transform hover:scale-105 shadow-xl"
              style={{
                background: isDark ? '#fff' : '#000',
                color: isDark ? '#000' : '#fff'
              }}
            >
              {t('nextArticleAnnuity', lang)} →
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
