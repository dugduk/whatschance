import React, { useState, useMemo } from 'react';
import { US_STATE_PATHS } from './USMapData';
import { STATE_TAX_RATES } from './data/stateTaxRates';
import { useLang } from './App';
import { t } from './translations';

const NO_LOTTERY_STATES = ["Alabama", "Alaska", "Hawaii", "Nevada", "Utah"];

const USMap = () => {
    const { lang } = useLang();
    const [hoveredState, setHoveredState] = useState(null);
    const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

    const getStateColor = (stateName) => {
        if (NO_LOTTERY_STATES.includes(stateName)) return '#374151';

        const rate = STATE_TAX_RATES[stateName];
        if (rate === undefined) return '#1f2937';

        if (rate === 0) return '#22c55e';
        if (rate <= 0.04) return '#eab308';
        if (rate <= 0.07) return '#f97316';
        return '#ef4444';
    };

    const handleMouseMove = (e) => {
        setTooltipPos({ x: e.clientX, y: e.clientY });
    };

    const states = useMemo(() => Object.entries(US_STATE_PATHS), []);

    return (
        <div className="relative w-full max-w-4xl mx-auto mb-10 group/map bg-white dark:bg-black/20 rounded-3xl p-4 md:p-8 border border-gray-200 dark:border-white/5 shadow-2xl overflow-visible">
            <svg
                viewBox="0 0 1100 750"
                className="w-full h-auto drop-shadow-[0_0_30px_rgba(0,0,0,0.5)]"
                onMouseMove={handleMouseMove}
            >
                {states.map(([name, path]) => {
                    const color = getStateColor(name);
                    const isHovered = hoveredState === name;
                    return (
                        <path
                            key={name}
                            d={path}
                            fill={color}
                            stroke="#000"
                            strokeWidth="1.5"
                            className="transition-all duration-300 cursor-pointer hover:opacity-80 hover:stroke-white/50"
                            style={{
                                filter: isHovered ? 'brightness(1.2)' : 'none',
                                transform: isHovered ? 'scale(1.01) translateY(-2px)' : 'none',
                                transformOrigin: 'center center',
                                opacity: hoveredState && !isHovered ? 0.4 : 1
                            }}
                            onMouseEnter={() => setHoveredState(name)}
                            onMouseLeave={() => setHoveredState(null)}
                            onClick={() => setHoveredState(name === hoveredState ? null : name)}
                        />
                    );
                })}
            </svg>

            {/* Tooltip */}
            {hoveredState && (
                <div
                    className="fixed z-[100] pointer-events-none bg-white/95 dark:bg-black/80 backdrop-blur-xl border border-gray-200 dark:border-white/20 rounded-xl px-4 py-3 shadow-2xl transition-opacity animate-in fade-in zoom-in duration-200"
                    style={{
                        left: tooltipPos.x + 15,
                        top: tooltipPos.y - 15,
                        transform: 'translateY(-100%)'
                    }}
                >
                    <div className="flex flex-col gap-1">
                        <span className="text-gray-900 dark:text-white font-black text-sm uppercase tracking-wider">
                            {hoveredState}
                        </span>
                        <span className={`text-xs font-bold ${NO_LOTTERY_STATES.includes(hoveredState) ? 'text-gray-600 dark:text-white/40' : 'text-rose-700 dark:text-gold'}`}>
                            {NO_LOTTERY_STATES.includes(hoveredState)
                                ? t('noLottery', lang)
                                : `${(STATE_TAX_RATES[hoveredState] * 100).toFixed(2)}% ${hoveredState === 'New York' ? t('excludingLocal', lang) : ''}`}
                        </span>
                    </div>
                </div>
            )}

            {/* Legend */}
            <div className="mt-8 flex flex-wrap justify-center gap-6 text-[10px] md:text-xs font-black uppercase tracking-widest text-gray-700 dark:text-white/40">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#22c55e]"></div>
                    <span>0% {t('tax', lang)}</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#eab308]"></div>
                    <span>1-4%</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#f97316]"></div>
                    <span>4-7%</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#ef4444]"></div>
                    <span>7%+</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#374151]"></div>
                    <span>{t('noLottery', lang)}</span>
                </div>
            </div>
        </div>
    );
};

export default USMap;