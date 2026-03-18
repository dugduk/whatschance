import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import confetti from "canvas-confetti";
import { ChevronRight, Download, RotateCcw, Share2, Volume2, VolumeX } from "lucide-react";
import { toPng } from "html-to-image";
import { useLang, ThemeContext, AdPlaceholder } from './App.jsx';
import { t } from './translations.js';
import { useContext } from 'react';


const SFX = {
  start: "/sfx/start.mp3",
  spin: "/sfx/spin.mp3",
  tick: "/sfx/tick.mp3",
  ball: "/sfx/ball.mp3",
  win: "/sfx/win.mp3",
  lose: "/sfx/lose.mp3",
};

const MOCK_DRAW_DATA = {
  powerball: [
    { id: "pb1", game: "powerball", date: "2026-03-09", white: [4, 12, 36, 54, 69], special: 16 },
    { id: "pb2", game: "powerball", date: "2026-03-07", white: [9, 27, 38, 45, 57], special: 12 },
    { id: "pb3", game: "powerball", date: "2026-03-04", white: [1, 18, 29, 43, 64], special: 14 },
    { id: "pb4", game: "powerball", date: "2026-03-02", white: [7, 16, 25, 31, 59], special: 23 },
    { id: "pb5", game: "powerball", date: "2026-02-28", white: [5, 11, 22, 48, 66], special: 9 },
  ],
  megamillions: [
    { id: "mm1", game: "megamillions", date: "2026-03-06", white: [8, 19, 26, 38, 42], special: 24 },
    { id: "mm2", game: "megamillions", date: "2026-03-03", white: [7, 21, 53, 54, 62], special: 16 },
    { id: "mm3", game: "megamillions", date: "2026-02-27", white: [11, 14, 33, 45, 68], special: 9 },
    { id: "mm4", game: "megamillions", date: "2026-02-24", white: [2, 17, 28, 49, 70], special: 5 },
    { id: "mm5", game: "megamillions", date: "2026-02-20", white: [6, 18, 25, 41, 63], special: 11 },
  ],
};

const USE_REMOTE_DRAW_DATA = false;

const THEMES = {
  powerball: {
    pageBg: "from-slate-950 via-[#0e1d46] to-[#2d0e1a]",
    heroGlow: "bg-red-400/25",
    accent: "from-red-500 to-amber-300",
    paperHeader: "from-[#b10035] to-[#e34e7a]",
    markFill: "bg-[#cf2f58] text-white border-[#9f1539]",
    specialFill: "bg-[#b10035] text-white border-[#84062b]",
    chip: "bg-red-500/15 text-red-100 border-red-300/20",
  },
  megamillions: {
    pageBg: "from-slate-950 via-[#0b2c67] to-[#0c4a6e]",
    heroGlow: "bg-sky-400/25",
    accent: "from-sky-400 to-yellow-300",
    paperHeader: "from-[#db4982] to-[#f5c745]",
    markFill: "bg-[#f0c93e] text-[#7a2142] border-[#d9ab0a]",
    specialFill: "bg-[#db4982] text-white border-[#b53067]",
    chip: "bg-sky-500/15 text-sky-100 border-sky-300/20",
  },
};

const GAME_META = {
  powerball: {
    nameKey: "powerballName",
    whiteMax: 69,
    specialMax: 26,
    specialLabel: "PB",
    addOnLabelKey: "powerPlayLabel",
    basePrice: 2,
  },
  megamillions: {
    nameKey: "megaMillionsName",
    whiteMax: 70,
    specialMax: 24,
    specialLabel: "MB",
    addOnLabelKey: "megaplierLabel",
    basePrice: 2,
  },
};

const PRIZE_TIERS = {
  powerball: {
    "5-1": 100000000, // Jackpot placeholder (not used in sum)
    "5-0": 1000000,
    "4-1": 50000,
    "4-0": 100,
    "3-1": 100,
    "3-0": 7,
    "2-1": 7,
    "1-1": 4,
    "0-1": 4,
  },
  megamillions: {
    "5-1": 100000000, // Jackpot placeholder
    "5-0": 1000000,
    "4-1": 10000,
    "4-0": 500,
    "3-1": 200,
    "3-0": 10,
    "2-1": 10,
    "1-1": 4,
    "0-1": 2,
  }
};

function playSound(src, enabled) {
  if (!enabled) return;
  try {
    const audio = new Audio(src);
    audio.volume = 0.55;
    try {
      const maybePromise = audio.play();
      if (maybePromise && typeof maybePromise.catch === "function") {
        maybePromise.catch(() => {});
      }
    } catch {
      // silently fail
    }
  } catch {
    // silently fail
  }
}

// Crinkle: short papery white-noise burst — for number bubble add/remove
function playCrinkle(enabled) {
  if (!enabled) return;
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const bufSize = ctx.sampleRate * 0.09; // 90ms
    const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufSize, 2.2);
    }
    const src = ctx.createBufferSource();
    src.buffer = buf;

    // Bandpass to keep the crinkly midrange
    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.value = 3200;
    bp.Q.value = 0.8;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.38, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.09);

    src.connect(bp);
    bp.connect(gain);
    gain.connect(ctx.destination);
    src.start();
    src.stop(ctx.currentTime + 0.1);
    src.onended = () => ctx.close();
  } catch {
    // silently fail
  }
}

// Pop: water-droplet frequency-glide bloop — for page transitions & box opens
function playPop(enabled) {
  if (!enabled) return;
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    // Frequency sweeps from 620Hz down to 160Hz — deeper, more satisfying droplet bloop
    osc.frequency.setValueAtTime(620, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(160, ctx.currentTime + 0.14);

    gain.gain.setValueAtTime(0.0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.32, ctx.currentTime + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.2);
    osc.onended = () => ctx.close();
  } catch {
    // silently fail
  }
}


function makeRows(max, perRow = 10) {
  const rows = [];
  for (let i = 1; i <= max; i += perRow) {
    const row = [];
    for (let j = i; j < i + perRow && j <= max; j += 1) row.push(j);
    rows.push(row);
  }
  return rows;
}

function getPrizeText(matchedWhite, matchedSpecial) {
  if (matchedWhite === 5 && matchedSpecial) return "jackpotSimulation";
  if (matchedWhite === 5) return "millionStyleHit";
  if (matchedWhite === 4 && matchedSpecial) return "bigSimulatedWin";
  if (matchedWhite === 4 || (matchedWhite === 3 && matchedSpecial)) return "hundredStyleHit";
  if (matchedWhite === 3 || (matchedWhite === 2 && matchedSpecial)) return "smallSimulatedPrize";
  if (matchedWhite <= 1 && matchedSpecial) return "fourDollarStyleHit";
  return "noSimulatedPrize";
}

function getWinAmountText(matchedWhite, matchedSpecial) {
  if (matchedWhite === 5 && matchedSpecial) return "JACKPOT";
  if (matchedWhite === 5) return "$1,000,000";
  if (matchedWhite === 4 && matchedSpecial) return "$50,000";
  if (matchedWhite === 4 || (matchedWhite === 3 && matchedSpecial)) return "$100";
  if (matchedWhite === 3 || (matchedWhite === 2 && matchedSpecial)) return "$7";
  if (matchedWhite <= 1 && matchedSpecial) return "$4";
  return "$0";
}

function getApproxOdds(matchedWhite, matchedSpecial) {
  if (matchedWhite === 5 && matchedSpecial) return "1 in 292,000,000";
  if (matchedWhite === 5) return "~1 in 11,000,000";
  if (matchedWhite === 4 && matchedSpecial) return "~1 in 913,000";
  if (matchedWhite === 4) return "~1 in 36,000";
  if (matchedWhite === 3 && matchedSpecial) return "~1 in 14,500";
  if (matchedWhite === 3) return "~1 in 580";
  if (matchedWhite === 2 && matchedSpecial) return "~1 in 700";
  if (matchedWhite === 1 && matchedSpecial) return "~1 in 90";
  return "very unlikely";
}

function getOddsComparisons(oddsText, lang) {
  return [
    { label: t("jackpotOddsLabel", lang), value: oddsText },
    { label: t("lightningOddsLabel", lang), value: "~1 in 1,200,000" },
    { label: t("sharkAttackOddsLabel", lang), value: "~1 in 3,700,000" },
  ];
}

function cx() {
  return Array.from(arguments).filter(Boolean).join(" ");
}

// Tooltip on hover
function Tooltip({ children, text }) {
  const [show, setShow] = React.useState(false);
  return (
    <span
      className="relative inline-block"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {show && text && (
        <span className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg border border-white/10 bg-slate-900/95 px-3 py-1.5 text-xs text-white/80 shadow-xl backdrop-blur">
          {text}
          <span className="absolute left-1/2 top-full h-0 w-0 -translate-x-1/2 border-4 border-transparent border-t-slate-900/95" />
        </span>
      )}
    </span>
  );
}

// Random reaction GIF for no-prize outcome
const NO_PRIZE_GIFS = [
  "https://media.giphy.com/media/pynZagVcYxVUk/giphy.gif",
  "https://media.giphy.com/media/yIxNOXEMpqkqA/giphy.gif",
  "https://media.giphy.com/media/TJawtKM6OCKkvwCIqX/giphy.gif",
  "https://media.giphy.com/media/evVKsrjZEqVVWvE2VR/giphy.gif",
];

function NoPrizeGif() {
  const [error, setError] = useState(false);
  const gifUrl = useMemo(
    () => NO_PRIZE_GIFS[Math.floor(Math.random() * NO_PRIZE_GIFS.length)],
    []
  );

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.45 }}
      className="mt-3 flex flex-col items-center gap-3"
    >
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
        {error ? (
          <div className="flex h-40 w-40 flex-col items-center justify-center gap-2 p-4 text-center sm:h-48 sm:w-48">
            <span className="text-4xl text-white/40">🫠</span>
            <span className="text-[10px] uppercase tracking-widest text-white/30">No Prize</span>
          </div>
        ) : (
          <img
            src={gifUrl}
            alt="No prize reaction"
            onError={() => setError(true)}
            className="h-40 w-auto max-w-xs object-cover sm:h-48"
            style={{ minWidth: '160px' }}
          />
        )}
      </div>
      <p className="max-w-[220px] text-center text-[11px] text-white/45 leading-relaxed">
        Better luck next time... or simulate 1,000,000 tries below 👇
      </p>
    </motion.div>
  );
}

function LotteryBall({ value, shown, matched, special }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -140, scale: 0.4, rotate: -15 }}
      animate={
        shown
          ? {
              opacity: 1,
              y: [-140, 18, -10, 4, 0],
              scale: [0.4, 1.12, 0.94, 1.04, 1],
              rotate: [-15, 5, -3, 1, 0],
            }
          : {
              opacity: 0.2,
              y: -20,
              scale: 0.75,
              rotate: 0,
            }
      }
      transition={{ duration: shown ? 0.9 : 0.2, times: [0, 0.55, 0.72, 0.88, 1], ease: "easeOut" }}
      className={cx(
        "relative flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full border text-lg sm:text-xl font-extrabold shadow-[0_18px_40px_rgba(0,0,0,0.3)]",
        special
          ? "border-red-300/30 bg-gradient-to-br from-rose-500 to-red-700 text-white"
          : "border-slate-200 bg-gradient-to-br from-white to-slate-100 text-slate-900",
        matched && "ring-4 ring-emerald-400 shadow-[0_0_32px_rgba(52,211,153,0.6)]"
      )}
    >
      {shown ? value : "?"}
      {shown && (
        <motion.div
          initial={{ opacity: 0.8, scale: 0 }}
          animate={{ opacity: 0, scale: 2.8 }}
          transition={{ duration: 0.7 }}
          className="absolute inset-0 rounded-full bg-white/50 blur-lg pointer-events-none"
        />
      )}
      {matched && shown && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="absolute -inset-2 rounded-full border-2 border-emerald-400 pointer-events-none"
        />
      )}
    </motion.div>
  );
}

function RouletteWheel({ labels, spinning, rotation, pointerFlash }) {
  const sliceAngle = 360 / labels.length;

  return (
    <div className="relative mx-auto h-[260px] w-[260px] sm:h-[320px] sm:w-[320px] md:h-[380px] md:w-[380px]">
      <motion.div
        animate={{ rotate: rotation || 0 }}
        transition={spinning ? { duration: 3.2, ease: [0.12, 0.85, 0.18, 1] } : { duration: 0.8 }}
        className="absolute inset-0 rounded-full border-[10px] border-white/20 shadow-[0_30px_80px_rgba(0,0,0,0.45)]"
        style={{
          background: `conic-gradient(
            from -90deg,
            #dc2626 0deg ${sliceAngle}deg,
            #2563eb ${sliceAngle}deg ${sliceAngle * 2}deg,
            #dc2626 ${sliceAngle * 2}deg ${sliceAngle * 3}deg,
            #2563eb ${sliceAngle * 3}deg ${sliceAngle * 4}deg,
            #dc2626 ${sliceAngle * 4}deg ${sliceAngle * 5}deg,
            #2563eb ${sliceAngle * 5}deg 360deg
          )`,
        }}
      >
        <div className="absolute inset-[3%] rounded-full border border-white/10 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.18)_0%,rgba(255,255,255,0.06)_30%,rgba(0,0,0,0.22)_64%,rgba(0,0,0,0.48)_100%)]" />
        {labels.map((label, idx) => {
          const angle = sliceAngle * idx;
          return (
            <div key={`${label}-${idx}`} className="absolute inset-0">
              <div
                className="absolute left-1/2 top-1/2 h-[42%] w-px origin-bottom bg-white/25"
                style={{ transform: `translate(-50%, -100%) rotate(${angle}deg)` }}
              />
              <div
                className="absolute left-1/2 top-1/2 origin-center"
                style={{ transform: `translate(-50%, -50%) rotate(${angle + sliceAngle / 2}deg) translateY(-112px)` }}
              >
                <div className="-translate-x-1/2 rounded-full border border-white/20 bg-black/30 px-2 py-1 text-[9px] sm:text-[10px] font-bold tracking-[0.14em] text-white/95 md:text-xs">
                  {label}
                </div>
              </div>
            </div>
          );
        })}
        <div className="absolute inset-[24%] rounded-full border border-white/15 bg-black/45 backdrop-blur" />
      </motion.div>
      <div className="absolute left-1/2 top-0 z-20 -translate-x-1/2">
        <motion.div
          animate={pointerFlash ? { y: [0, -3, 0], scale: [1, 1.08, 1] } : { y: 0, scale: 1 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="relative"
        >
          <div className="h-0 w-0 border-l-[14px] border-r-[14px] border-t-[26px] sm:border-l-[16px] sm:border-r-[16px] sm:border-t-[30px] border-l-transparent border-r-transparent border-t-yellow-300 drop-shadow-[0_8px_12px_rgba(0,0,0,0.35)]" />
          {pointerFlash && <div className="absolute left-1/2 top-0 h-8 w-8 -translate-x-1/2 rounded-full bg-yellow-300/30 blur-xl" />}
        </motion.div>
      </div>
      <div className="absolute left-1/2 top-1/2 z-20 h-7 w-7 sm:h-8 sm:w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/25 bg-white shadow-[0_10px_30px_rgba(0,0,0,0.3)]" />
    </div>
  );
}

function SlipBubble({ value, active, onClick, onSound, disabled, special, theme }) {
  return (
    <button
      type="button"
      onClick={() => { if (onSound) onSound(); onClick(); }}
      disabled={disabled}
      className={cx(
        "relative flex h-8 w-8 items-center justify-center rounded-full border text-[11px] font-semibold transition-all duration-150 active:scale-95 md:h-9 md:w-9",
        active ? (special ? theme.specialFill : theme.markFill) : "border-[#d8d8d8] bg-white text-slate-500 hover:border-slate-500 hover:text-slate-800",
        disabled && !active && "opacity-25"
      )}
    >
      {value}
      {active && <span className="absolute inset-[4px] rounded-full border border-white/40" />}
    </button>
  );
}

function BasketBall({ value, special, theme }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.2, y: -40, rotate: -20 }}
      animate={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
      exit={{ opacity: 0, scale: 0.5, y: 20, rotate: 10 }}
      transition={{ 
        type: "spring", 
        stiffness: 400, 
        damping: 25,
        mass: 0.8
      }}
      className={cx(
        "flex h-9 w-9 items-center justify-center rounded-full border text-[13px] font-black shadow-lg relative overflow-hidden",
        special ? theme.specialFill : theme.markFill
      )}
    >
      <span className="relative z-10">{value}</span>
      <div className="absolute inset-[2px] rounded-full border border-white/30" />
      <div className="absolute -left-1 -top-1 h-4 w-4 rounded-full bg-white/20 blur-[2px]" />
    </motion.div>
  );
}

export default function LotterySimulator() {
  const { lang } = useLang();

  const [stage, setStage] = useState("start");
  const [game, setGame] = useState("powerball");
  const [activePanel, setActivePanel] = useState("A");
  const [panelTickets, setPanelTickets] = useState({
    A: { white: [], special: null, addOn: false },
    B: { white: [], special: null, addOn: false },
    C: { white: [], special: null, addOn: false },
  });
  const [draw, setDraw] = useState(null);
  const [spinLabel, setSpinLabel] = useState(t("pushToSpin", lang));
  const [revealIndex, setRevealIndex] = useState(0);
  const [sound, setSound] = useState(true);
  const [wheelSpinning, setWheelSpinning] = useState(false);
  const [draws, setDraws] = useState([]);
  const [drawsLoading, setDrawsLoading] = useState(true);
  const [drawsError, setDrawsError] = useState(null);
  const [wheelRotation, setWheelRotation] = useState(0);
  const [pointerFlash, setPointerFlash] = useState(false);
  const [simStats, setSimStats] = useState(null);
  const [simulating, setSimulating] = useState(false);
  const [simProgress, setSimProgress] = useState(0);
  const [simLive, setSimLive] = useState({ jackpots: 0, match3Plus: 0, specialHits: 0, totalWon: 0 });
  const [simFlash, setSimFlash] = useState(false);
  const [simEventText, setSimEventText] = useState(null);
  const [simRunTarget, setSimRunTarget] = useState(null);

  const rouletteRef = useRef(null);
  const revealRef = useRef(null);
  const resultCardRef = useRef(null);

  const theme = THEMES[game];
  const meta = GAME_META[game];
  const whiteRows = useMemo(() => makeRows(meta.whiteMax), [meta.whiteMax]);
  const specialRows = useMemo(() => makeRows(meta.specialMax), [meta.specialMax]);
  const ticket = panelTickets[activePanel];
  const ticketPrice = meta.basePrice;
  const addOnPrice = 1;
  const ticketPriceWithAddOn = ticket.addOn ? ticketPrice + addOnPrice : ticketPrice;
  const addOnLabel = t(meta.addOnLabelKey, lang);
  const gameName = t(meta.nameKey, lang);

  const panelCosts = useMemo(() => {
    return ["A", "B", "C"].reduce((acc, panel) => {
      const panelTicket = panelTickets[panel];
      const isFilled = panelTicket.white.length > 0 || panelTicket.special !== null;
      acc[panel] = isFilled ? ticketPrice + (panelTicket.addOn ? addOnPrice : 0) : 0;
      return acc;
    }, {});
  }, [panelTickets, ticketPrice]);

  const totalTicketCost = panelCosts.A + panelCosts.B + panelCosts.C;

  const matchedWhite = useMemo(() => {
    if (!draw) return [];
    return ticket.white.filter((n) => draw.white.includes(n));
  }, [ticket.white, draw]);

  const matchedSpecial = draw ? ticket.special === draw.special : false;
  const prizeText = t(getPrizeText(matchedWhite.length, matchedSpecial), lang);
  const winAmountText = getWinAmountText(matchedWhite.length, matchedSpecial);
  const oddsText = getApproxOdds(matchedWhite.length, matchedSpecial);
  const oddsComparisons = getOddsComparisons(oddsText, lang);
  const nearMissText = matchedWhite.length === 4 && !matchedSpecial
    ? t("soCloseToJackpot", lang)
    : matchedWhite.length === 5 && !matchedSpecial
      ? t("oneSpecialAway", lang)
      : matchedWhite.length === 3 && matchedSpecial
        ? t("strongHitRandomDraw", lang)
        : null;

  useEffect(() => {
    setStage("start");
    setActivePanel("A");
    setPanelTickets({
      A: { white: [], special: null, addOn: false },
      B: { white: [], special: null, addOn: false },
      C: { white: [], special: null, addOn: false },
    });
    setDraw(null);
    setSpinLabel(t("pushToSpin", lang));
    setRevealIndex(0);
    setWheelSpinning(false);
    setWheelRotation(0);
    setPointerFlash(false);
    setSimStats(null);
    setSimulating(false);
    setSimProgress(0);
    setSimLive({ jackpots: 0, match3Plus: 0, specialHits: 0 });
    setSimFlash(false);
    setSimEventText(null);
  }, [game, lang]);

  useEffect(() => {
    let active = true;
    setDrawsLoading(true);
    setDrawsError(null);

    const loadDraws = async () => {
      try {
        if (USE_REMOTE_DRAW_DATA) {
          const response = await fetch(`/api/draws?game=${game}`);
          if (!response.ok) throw new Error(`Failed to load draws for ${game}`);
          const payload = await response.json();
          if (!active) return;
          setDraws(payload.draws || []);
        } else {
          await new Promise((resolve) => setTimeout(resolve, 220));
          if (!active) return;
          setDraws(MOCK_DRAW_DATA[game]);
        }
        setDrawsLoading(false);
      } catch (error) {
        if (!active) return;
        setDraws([]);
        setDrawsLoading(false);
        setDrawsError(error instanceof Error ? error.message : t("failedToLoadDraws", lang));
      }
    };

    loadDraws();

    return () => {
      active = false;
    };
  }, [game, lang]);

  useEffect(() => {
    return () => {
      if (rouletteRef.current) window.clearInterval(rouletteRef.current);
      if (revealRef.current) window.clearInterval(revealRef.current);
    };
  }, []);

  function updateActivePanel(updater) {
    setPanelTickets((prev) => ({
      ...prev,
      [activePanel]: updater(prev[activePanel]),
    }));
  }

  function startRoulette() {
    if (drawsLoading || draws.length === 0) return;
    playSound(SFX.start, sound);
    playSound(SFX.spin, sound);
    setStage("roulette");
    setWheelSpinning(true);
    setPointerFlash(false);

    const selectedIndex = Math.floor(Math.random() * draws.length);
    const selected = draws[selectedIndex];
    const sliceAngle = 360 / draws.length;
    const targetCenterAngle = selectedIndex * sliceAngle + sliceAngle / 2;
    const finalRotation = 360 * 5 - targetCenterAngle;
    setWheelRotation(finalRotation);

    let i = 0;
    let tickDelay = 55;
    let tickTimer = null;

    const runTick = () => {
      playSound(SFX.tick, sound);
      tickDelay = Math.min(180, tickDelay + 8);
      tickTimer = window.setTimeout(runTick, tickDelay);
    };

    runTick();

    rouletteRef.current = window.setInterval(() => {
      const current = draws[i % draws.length];
      setSpinLabel(current.date);
      i += 1;
    }, 90);

    window.setTimeout(() => {
      if (rouletteRef.current) window.clearInterval(rouletteRef.current);
      if (tickTimer) window.clearTimeout(tickTimer);
      setDraw(selected);
      setSpinLabel(selected.date);
      setWheelSpinning(false);
      setPointerFlash(true);
      playSound(SFX.tick, sound);
      window.setTimeout(() => setPointerFlash(false), 520);
      window.setTimeout(() => setStage("slip"), 700);
    }, 3200);
  }

  function toggleWhite(n) {
    updateActivePanel((current) => {
      if (current.white.includes(n)) return { ...current, white: current.white.filter((x) => x !== n) };
      if (current.white.length >= 5) return current;
      return { ...current, white: [...current.white, n].sort((a, b) => a - b) };
    });
  }

  function chooseSpecial(n) {
    updateActivePanel((current) => ({ ...current, special: current.special === n ? null : n }));
  }

  function quickPick() {
    const picked = new Set();
    while (picked.size < 5) picked.add(Math.floor(Math.random() * meta.whiteMax) + 1);
    updateActivePanel((current) => ({
      ...current,
      white: Array.from(picked).sort((a, b) => a - b),
      special: Math.floor(Math.random() * meta.specialMax) + 1,
      addOn: Math.random() > 0.5,
    }));
  }

  function goCompare() {
    if (ticket.white.length !== 5 || ticket.special === null) return;
    setStage("compare");
  }

  function reveal() {
    if (!draw) return;
    setStage("reveal");
    setRevealIndex(0);

    let i = 0;
    revealRef.current = window.setInterval(() => {
      i += 1;
      playSound(SFX.ball, sound);
      setRevealIndex(i);
      if (i >= 6) {
        if (revealRef.current) window.clearInterval(revealRef.current);
        window.setTimeout(() => {
          setStage("result");
          if (matchedWhite.length >= 4 || matchedSpecial) {
            playSound(SFX.win, sound);
            confetti({ particleCount: 120, spread: 80, origin: { y: 0.7 } });
          } else {
            playSound(SFX.lose, sound);
          }
        }, 700);
      }
    }, 650);
  }

  async function runSimulation(runs = 1000) {
    if (!draw || simulating) return;

    const chunkSize = runs <= 10000 ? 50 : runs <= 100000 ? 500 : 5000;
    let jackpots = 0;
    let match3Plus = 0;
    let specialHits = 0;
    let totalWon = 0;

    setSimulating(true);
    setSimProgress(0);
    setSimStats(null);
    setSimLive({ jackpots: 0, match3Plus: 0, specialHits: 0, totalWon: 0 });
    setSimFlash(false);
    setSimRunTarget(runs);
    setSimEventText(t("bootingProbabilityEngine", lang));

    for (let start = 0; start < runs; start += chunkSize) {
      const end = Math.min(runs, start + chunkSize);
      const prevJackpots = jackpots;
      let nearMissesInChunk = 0;

      for (let i = start; i < end; i += 1) {
        const whites = new Set();
        while (whites.size < 5) whites.add(Math.floor(Math.random() * meta.whiteMax) + 1);
        const special = Math.floor(Math.random() * meta.specialMax) + 1;

        const matchWhite = Array.from(whites).filter((n) => draw.white.includes(n)).length;
        const matchSpecial = special === draw.special;

        const prizeKey = `${matchWhite}-${matchSpecial ? 1 : 0}`;
        const prize = PRIZE_TIERS[game][prizeKey] || 0;
        if (prize > 0 && prizeKey !== "5-1") totalWon += prize;

        if (matchWhite === 5 && matchSpecial) jackpots += 1;
        if (matchWhite >= 3) match3Plus += 1;
        if (matchSpecial) specialHits += 1;
        if (matchWhite === 4 && !matchSpecial) nearMissesInChunk += 1;
      }

      setSimLive({ jackpots, match3Plus, specialHits, totalWon });
      const progressRatio = end / runs;
      const progressPercent = Math.round(progressRatio * 100);
      setSimProgress(progressPercent);
      playSound(SFX.tick, sound);

      if (jackpots > prevJackpots) {
        setSimFlash(true);
        setSimEventText(t("jackpotFoundLiveBatch", lang));
        playSound(SFX.win, sound);
        confetti({ particleCount: 90, spread: 80, origin: { y: 0.72 } });
        window.setTimeout(() => setSimFlash(false), 450);
      } else if (nearMissesInChunk > 0) {
        setSimFlash(true);
        setSimEventText(`${nearMissesInChunk} ${t("nearMissesInBatch", lang)}`);
        window.setTimeout(() => setSimFlash(false), 260);
      } else if (progressPercent < 35) {
        setSimEventText(t("scanningEarlyCombinations", lang));
      } else if (progressPercent < 75) {
        setSimEventText(t("accelerationKickingIn", lang));
      } else {
        setSimEventText(t("finalStretchOddsSpicy", lang));
      }

      const delay = progressRatio < 0.5 ? 40 : progressRatio < 0.8 ? 24 : 10;
      await new Promise((resolve) => window.setTimeout(resolve, delay));
    }

    const totalSpent = runs * meta.basePrice;
    setSimStats({ runs, jackpots, match3Plus, specialHits, totalWon, totalSpent });
    setSimulating(false);
    setSimRunTarget(null);
    setSimFlash(false);
    setSimEventText(jackpots > 0 ? t("simulationCompleteJackpotDetected", lang) : t("simulationComplete", lang));

    if (jackpots > 0) {
      playSound(SFX.win, sound);
      confetti({ particleCount: 150, spread: 100, origin: { y: 0.68 } });
    } else if (match3Plus > 0) {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.75 } });
    }
  }

  function copyResult() {
    if (!draw) return;

    const panelsText = ["A", "B", "C"]
      .map((panel) => {
        const panelTicket = panelTickets[panel];
        const numbers = panelTicket.white.length ? panelTicket.white.join("-") : "empty";
        const special = panelTicket.special ?? "-";
        const addOn = panelTicket.addOn ? ` + ${addOnLabel}` : "";
        return `${t("panelLabel", lang)} ${panel}: ${numbers} + ${special}${addOn}`;
      })
      .join("\n");

    const text = [
      `${t("gameLabel", lang)}: ${gameName}`,
      panelsText,
      `${t("activePanelLabel", lang)}: ${activePanel}`,
      `${t("panelCostLabel", lang)}: $${panelCosts[activePanel]}`,
      `${t("totalFilledPanelsCostLabel", lang)}: $${totalTicketCost}`,
      `${t("drawDateLabel", lang)}: ${draw.date}`,
      `${t("winningNumbersLabel", lang)}: ${draw.white.join("-")} + ${draw.special}`,
      `${t("matchedOnActivePanelLabel", lang)}: ${matchedWhite.length}${matchedSpecial ? ` + ${t("specialBallLabel", lang)}` : ""}`,
      `${t("approxOddsLabel", lang)}: ${oddsText}`,
    ].join("\n");

    navigator.clipboard.writeText(text).catch(() => {});
  }

  async function downloadResultImage() {
    if (!resultCardRef.current) return;
    const dataUrl = await toPng(resultCardRef.current, {
      cacheBust: true,
      pixelRatio: 2,
      backgroundColor: "#0f172a",
    });
    const link = document.createElement("a");
    link.download = `${game}-${draw?.date || "result"}.png`;
    link.href = dataUrl;
    link.click();
  }

  async function shareResultImage() {
    if (!resultCardRef.current || !navigator.share) return;
    try {
      const dataUrl = await toPng(resultCardRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: "#0f172a",
      });
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], `${game}-${draw?.date || "result"}.png`, { type: blob.type });
      await navigator.share({
        title: t("historicalDrawResultTitle", lang),
        text: t("shareResultText", lang),
        files: [file],
      });
    } catch {
      // silently fail
    }
  }

  function quickReplay() {
    setStage("slip");
    setRevealIndex(0);
    setSimStats(null);
    setSimulating(false);
    setSimProgress(0);
    setSimLive({ jackpots: 0, match3Plus: 0, specialHits: 0 });
    setSimFlash(false);
    setSimEventText(null);
  }

  function reset() {
    setStage("start");
    setActivePanel("A");
    setPanelTickets({
      A: { white: [], special: null, addOn: false },
      B: { white: [], special: null, addOn: false },
      C: { white: [], special: null, addOn: false },
    });
    setDraw(null);
    setSpinLabel(t("pushToSpin", lang));
    setRevealIndex(0);
    setWheelSpinning(false);
    setWheelRotation(0);
    setPointerFlash(false);
    setSimStats(null);
    setSimulating(false);
    setSimProgress(0);
    setSimLive({ jackpots: 0, match3Plus: 0, specialHits: 0 });
    setSimFlash(false);
    setSimEventText(null);
  }

  const wheelLabels = (draws.length ? draws : MOCK_DRAW_DATA[game]).map((d) => d.date);

  return (
    <div className={cx("min-h-screen bg-gradient-to-br text-white", theme.pageBg)}>
      <div className="relative overflow-hidden">
        <div className={cx("absolute -left-20 top-10 h-72 w-72 rounded-full blur-3xl", theme.heroGlow)} />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-yellow-300/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl p-3 sm:p-4 md:p-6">
        <div className="mb-4 sm:mb-6 flex flex-col gap-4 rounded-[28px] border border-white/10 bg-white/5 p-4 backdrop-blur md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.28em] text-white/60">{t("interactiveLotterySimulation", lang)}</div>
            <h1 className="mt-1 tracking-tight text-2xl sm:text-3xl font-semibold md:text-4xl">{t("lotterySimulatorTitle", lang)}</h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="grid grid-cols-2 gap-2 rounded-2xl bg-white/10 p-1">
              {["powerball", "megamillions"].map((g) => (
                <button
                  key={g}
                  onClick={() => { playPop(sound); setGame(g); }}
                  className={cx(
                    "rounded-2xl px-3 sm:px-4 py-3 tracking-tight text-sm font-medium transition active:scale-95",
                    game === g ? "bg-white text-slate-900 shadow" : "text-white/75"
                  )}
                >
                  {t(GAME_META[g].nameKey, lang)}
                </button>
              ))}
            </div>
            <button onClick={() => setSound((s) => !s)} className="rounded-2xl border border-white/10 bg-white/10 p-3 active:scale-95 transition">
              {sound ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {stage === "start" && (
            <motion.div
              key="start"
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="grid items-start gap-6 lg:grid-cols-[1.1fr_0.9fr]"
            >
              {/* Left: hero copy + how-it-works */}
              <div className="space-y-6 text-center lg:text-left">
                <div className={cx("inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em]", theme.chip)}>
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  {t("interactiveLotterySimulation", lang)}
                </div>

                <div>
                  <h2 className="leading-[1.15] tracking-tight text-4xl sm:text-5xl font-bold md:text-6xl">
                    Think you'd win if you played the <span className={`bg-gradient-to-r ${theme.accent} bg-clip-text text-transparent`}>right day?</span>
                  </h2>
                  <p className="mt-4 text-lg text-white/60 leading-relaxed">
                    Pick a real past draw. Fill in your numbers. See what actually happened — then run 1,000,000 random tickets to face the math.
                  </p>
                </div>

                {/* How it works steps */}
                <div className="grid gap-3 sm:grid-cols-3">
                  {[
                    { step: '01', emoji: '🎡', title: 'Spin the wheel', desc: 'Lock a real historical draw date' },
                    { step: '02', emoji: '✏️', title: 'Fill your slip', desc: 'Pick numbers like a real ticket — up to 3 panels' },
                    { step: '03', emoji: '💥', title: 'Face reality', desc: 'Reveal results & simulate 1M random tickets' },
                  ].map(({ step, emoji, title, desc }) => (
                    <div key={step} className="rounded-2xl border border-white/8 bg-white/4 p-4 text-left backdrop-blur hover:bg-white/8 transition">
                      <div className="text-[10px] uppercase tracking-[0.3em] text-white/30 mb-1">{step}</div>
                      <div className="text-2xl mb-1">{emoji}</div>
                      <div className="text-sm font-semibold text-white">{title}</div>
                      <div className="text-xs text-white/50 mt-0.5">{desc}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: roulette wheel + spin CTA */}
              <div className="rounded-[36px] border border-white/10 bg-black/25 p-5 backdrop-blur shadow-[0_24px_60px_rgba(0,0,0,0.4)]">
                <div className="flex flex-col items-center gap-5">
                  <RouletteWheel labels={wheelLabels} spinning={false} rotation={wheelRotation} pointerFlash={pointerFlash} />
                  <motion.button
                    onClick={startRoulette}
                    disabled={drawsLoading || draws.length === 0}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    className={cx(
                      "relative rounded-full px-10 py-5 text-xl tracking-tight font-bold shadow-2xl bg-gradient-to-r overflow-hidden",
                      theme.accent,
                      (drawsLoading || draws.length === 0) && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    {/* Shimmer sweep */}
                    <motion.div
                      className="absolute inset-0 bg-white/20"
                      animate={{ x: ['-100%', '200%'] }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 1.5, ease: 'easeInOut' }}
                      style={{ transform: 'skewX(-15deg)' }}
                    />
                    <span className="relative z-10">
                      {drawsLoading ? '⏳ Loading...' : '🎡 SPIN THE WHEEL'}
                    </span>
                  </motion.button>
                  <div className="text-center space-y-1">
                    <p className="text-sm text-white/55">{t("spinToLockHistoricalDrawDate", lang)}</p>
                    <p className="text-xs text-white/30">
                      {drawsLoading ? t("loadingDraws", lang) : drawsError ? `⚠️ ${drawsError}` : `🗓 ${draws.length} ${t("pastDatesLoaded", lang)}`}
                    </p>
                  </div>
                </div>
              </div>
            <div className="mt-8">
              <AdPlaceholder />
            </div>
          </motion.div>
        )}

          {stage === "roulette" && (
            <motion.div
              key="roulette"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.04 }}
              transition={{ duration: 0.35 }}
              className="space-y-6 text-center"
            >
              <div>
                <motion.div
                  animate={{ opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                  className="text-xs uppercase tracking-[0.35em] text-white/55"
                >
                  🎲 Selecting a past draw date...
                </motion.div>
                <p className="mt-2 text-sm text-white/40">Hold tight — your fate is being decided</p>
              </div>
              <RouletteWheel labels={wheelLabels} spinning={wheelSpinning} rotation={wheelRotation} pointerFlash={pointerFlash} />
              <motion.div
                animate={{ scale: [1, 1.06, 1] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="tracking-tight text-5xl sm:text-6xl font-bold md:text-7xl"
              >
                {spinLabel}
              </motion.div>
              <div className="mt-8">
                <AdPlaceholder />
              </div>
            </motion.div>
          )}

          {stage === "slip" && (
            <motion.div
              key="slip"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -18 }}
              transition={{ duration: 0.35 }}
              className="space-y-6"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                  <div className="text-xs uppercase tracking-[0.28em] text-white/55">{t("fillPlaySlipLabel", lang)}</div>
                  <h2 className="mt-1 tracking-tight text-3xl font-semibold">{t("markNumbersLikeRealTicket", lang)}</h2>
                  <p className="mt-2 text-white/72">{t("lockedDrawDateLabel", lang)}: <span className="font-semibold text-white">{draw?.date}</span></p>
                  <div className="mt-2 space-y-3 text-sm text-white/60">
                    <div>
                      <p>
                        {t("ticketPriceLabel", lang)}: <span className="font-semibold text-white">${ticketPrice}</span>
                        {ticket.addOn ? <span> · {t("withAddOnLabel", lang)} {addOnLabel}: <span className="font-semibold text-white">${ticketPriceWithAddOn}</span></span> : null}
                      </p>
                      <p>
                        {t("totalFilledPanelsCostLabel", lang)}: <span className="font-semibold text-white">${totalTicketCost}</span>
                      </p>
                    </div>

                    <div className="max-w-md rounded-2xl border border-white/10 bg-black/20 p-4 backdrop-blur">
                      <div className="text-[11px] uppercase tracking-[0.24em] text-white/45">{t("ticketReceiptLabel", lang)}</div>
                      <div className="mt-3 space-y-2">
                        {["A", "B", "C"].map((panel) => {
                          const panelTicket = panelTickets[panel];
                          const isFilled = panelTicket.white.length > 0 || panelTicket.special !== null;
                          return (
                            <div key={panel} className="flex items-center justify-between rounded-xl bg-white/5 px-3 py-2">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-white">{t("panelLabel", lang)} {panel}</span>
                                <span className="text-xs text-white/45">{isFilled ? (panelTicket.addOn ? addOnLabel : t("baseTicketLabel", lang)) : t("emptyLabel", lang)}</span>
                              </div>
                              <span className="font-semibold text-white">${panelCosts[panel]}</span>
                            </div>
                          );
                        })}
                      </div>
                      <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-3 text-white">
                        <span className="font-medium">{t("totalLabel", lang)}</span>
                        <span className="font-semibold">${totalTicketCost}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3">
                  <button onClick={() => { playPop(sound); quickPick(); }} className="rounded-2xl border border-white/10 bg-white/10 px-5 py-3 tracking-tight text-sm font-medium active:scale-95 transition">
                    {t("quickPickButton", lang)}
                  </button>
                  <button
                    onClick={() => { playPop(sound); goCompare(); }}
                    disabled={ticket.white.length !== 5 || ticket.special === null}
                    className={cx(
                      "inline-flex items-center gap-2 rounded-2xl px-5 py-3 tracking-tight text-sm font-semibold active:scale-95 transition",
                      ticket.white.length === 5 && ticket.special !== null ? `bg-gradient-to-r ${theme.accent} text-slate-950` : "bg-white/10 text-white/45"
                    )}
                  >
                    {t("continueButton", lang)} <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="mx-auto max-w-5xl rounded-[32px] bg-[#f8f3eb] p-3 text-slate-900 shadow-[0_20px_60px_rgba(0,0,0,0.28)] md:p-5">
                <div className={cx("rounded-[28px] bg-gradient-to-r p-4 text-white", theme.paperHeader)}>
                  <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-[0.28em] opacity-80">{t("officialStylePlaySlip", lang)}</div>
                      <div className="mt-1 tracking-tight text-3xl font-semibold">{gameName}</div>
                    </div>
                    <div className="rounded-full bg-white/15 px-4 py-2 text-sm font-medium">
                      {addOnLabel}
                      <button
                        type="button"
                        onClick={() => updateActivePanel((current) => ({ ...current, addOn: !current.addOn }))}
                        className={cx(
                          "ml-3 rounded-full px-3 py-1 text-xs font-semibold active:scale-95 transition",
                          ticket.addOn ? "bg-white text-slate-900" : "bg-black/20 text-white"
                        )}
                      >
                        {ticket.addOn ? t("onLabel", lang) : t("offLabel", lang)}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-4 grid gap-5 lg:grid-cols-[1fr_220px]">
                  <div className="lg:col-span-2 flex flex-wrap gap-2 px-1 pb-1">
                    {["A", "B", "C"].map((panel) => (
                      <button
                        key={panel}
                        type="button"
                        onClick={() => { playPop(sound); setActivePanel(panel); }}
                        className={cx(
                          "rounded-full border px-4 py-2 text-sm tracking-tight font-medium transition active:scale-95",
                          activePanel === panel ? "border-slate-900 bg-slate-900 text-white" : "border-slate-300 bg-white text-slate-600"
                        )}
                      >
                        {t("panelLabel", lang)} {panel}
                        {panelTickets[panel].white.length || panelTickets[panel].special !== null ? ` • ${t("savedLabel", lang)}` : ""}
                      </button>
                    ))}
                  </div>

                  <div className="rounded-[28px] border border-[#e5d7d7] bg-white p-4 relative min-h-[500px] flex flex-col">
                    <div className="mb-4 flex items-center justify-between">
                      <div>
                        <div className="text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-400">{t("panelLabel", lang)} {activePanel}</div>
                        <div className="mt-1 tracking-tight text-xl font-semibold">{t("pickFiveFromOneTo", lang)} {meta.whiteMax}</div>
                      </div>
                      <div className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600">{ticket.white.length}/5</div>
                    </div>
                    <div className="space-y-2">
                      {whiteRows.map((row, idx) => (
                        <div key={idx} className="flex flex-wrap gap-2">
                          {row.map((n) => (
                            <SlipBubble
                              key={n}
                              value={n}
                              active={ticket.white.includes(n)}
                              disabled={!ticket.white.includes(n) && ticket.white.length >= 5}
                              onClick={() => toggleWhite(n)}
                              onSound={() => playCrinkle(sound)}
                              theme={theme}
                            />
                          ))}
                        </div>
                      ))}
                    </div>

                    {/* Basket tray area at the bottom */}
                    <div className="mt-auto pt-6 border-t border-slate-50 flex flex-col items-center">
                      <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 mb-4">{t("yourBasket", lang)}</div>
                      <div className="flex flex-wrap items-center justify-center gap-2.5 min-h-[44px]">
                        <AnimatePresence mode="popLayout">
                          {ticket.white.map((n) => (
                            <BasketBall key={`white-${n}`} value={n} theme={theme} />
                          ))}
                          {ticket.special !== null && (
                            <BasketBall key={`special-${ticket.special}`} value={ticket.special} theme={theme} special />
                          )}
                        </AnimatePresence>
                        {ticket.white.length === 0 && ticket.special === null && (
                          <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-xs font-medium text-slate-300 italic"
                          >
                            {lang === 'ko' ? '번호를 선택하면 여기에 담깁니다' : 'Numbers will appear here'}
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="rounded-[28px] border border-[#e5d7d7] bg-white p-4">
                      <div className="mb-4 text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-400">{meta.specialLabel}</div>
                      <div className="space-y-2">
                        {specialRows.map((row, idx) => (
                          <div key={idx} className="flex flex-wrap gap-2">
                            {row.map((n) => (
                              <SlipBubble
                                key={n}
                                value={n}
                                active={ticket.special === n}
                                onClick={() => chooseSpecial(n)}
                                onSound={() => playCrinkle(sound)}
                                special
                                theme={theme}
                              />
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-[28px] border border-[#e5d7d7] bg-white p-4">
                      <div className="text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-400">{t("currentPickLabel", lang)}</div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {ticket.white.map((n) => (
                          <div key={n} className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-slate-100 text-sm font-semibold text-slate-700">
                            {n}
                          </div>
                        ))}
                        {ticket.special !== null && (
                          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-rose-300 bg-rose-500 text-sm font-semibold text-white">
                            {ticket.special}
                          </div>
                        )}
                      </div>
                      <div className="mt-3 space-y-1 text-xs text-slate-500">
                        <div>{t("baseLabel", lang)}: ${ticketPrice}{ticket.addOn ? ` · ${t("withAddOnLabel", lang)} ${addOnLabel}: $${ticketPriceWithAddOn}` : ""}</div>
                        <div>{t("panelLabel", lang)} {activePanel} {t("costLabel", lang)}: ${panelCosts[activePanel]}</div>
                        <div>{t("totalTicketCostLabel", lang)}: ${totalTicketCost}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-8">
                <AdPlaceholder />
              </div>
            </motion.div>
          )}

          {stage === "compare" && (
            <motion.div
              key="compare"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35 }}
              className="space-y-8 text-center"
            >
              <div>
                <div className="text-xs uppercase tracking-[0.3em] text-white/55">{t("yourNumbersFirstLabel", lang)}</div>
                <h2 className="mt-2 tracking-tight text-3xl font-semibold">{t("hereIsCombinationYouPicked", lang)}</h2>
              </div>

              {simStats && (
                <div className="mx-auto max-w-3xl space-y-4">
                  <div className="rounded-3xl border border-white/10 bg-white/5 p-4 text-center backdrop-blur">
                    <div className="text-xs uppercase tracking-[0.24em] text-white/45">{t("simulationLabel", lang)}</div>
                    <div className="mt-2 tracking-tight text-2xl font-semibold">{simStats.jackpots} {t("jackpotsInRandomTickets", lang)} {simStats.runs.toLocaleString()}</div>
                    <div className="mt-4 grid gap-3 sm:grid-cols-3 text-left">
                      {[
                        { label: t("jackpotsLabel", lang), value: simStats.jackpots, max: Math.max(1, simStats.runs) },
                        { label: t("threePlusMatchesLabel", lang), value: simStats.match3Plus, max: Math.max(1, simStats.runs) },
                        { label: t("specialHitsLabel", lang), value: simStats.specialHits, max: Math.max(1, simStats.runs) },
                      ].map((item) => (
                        <div key={item.label} className="rounded-2xl bg-black/20 p-4">
                          <div className="text-xs uppercase tracking-[0.2em] text-white/45">{item.label}</div>
                          <div className="mt-2 tracking-tight text-2xl font-semibold">{item.value}</div>
                          <div className="mt-3 h-2 rounded-full bg-white/10">
                            <div className="h-2 rounded-full bg-gradient-to-r from-yellow-300 to-amber-500" style={{ width: `${Math.max(2, Math.min(100, (item.value / item.max) * 100))}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-3xl border border-white/10 bg-black/30 p-4 backdrop-blur">
                    <div className="text-[11px] uppercase tracking-[0.24em] text-white/45">{t("ticketReceiptLabel", lang)}</div>
                    <div className="mt-3 space-y-2">
                      {["A", "B", "C"].map((panel) => {
                        const panelTicket = panelTickets[panel];
                        const isFilled = panelTicket.white.length > 0 || panelTicket.special !== null;
                        return (
                          <div key={panel} className="flex items-center justify-between rounded-xl bg-white/5 px-3 py-2">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-white">{t("panelLabel", lang)} {panel}</span>
                              <span className="text-xs text-white/45">{isFilled ? (panelTicket.addOn ? addOnLabel : t("baseLabel", lang)) : t("emptyLabel", lang)}</span>
                            </div>
                            <span className="font-semibold text-white">${panelCosts[panel]}</span>
                          </div>
                        );
                      })}
                    </div>
                    <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-3 text-white">
                      <span className="font-medium">{t("totalLabel", lang)}</span>
                      <span className="font-semibold">${totalTicketCost}</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="mx-auto max-w-4xl rounded-3xl border border-white/10 bg-white/5 p-4 text-left backdrop-blur">
                <div className="text-xs uppercase tracking-[0.24em] text-white/45">{t("panelsPlayedLabel", lang)}</div>
                <div className="mt-3 grid gap-3 md:grid-cols-3">
                  {["A", "B", "C"].map((panel) => {
                    const panelTicket = panelTickets[panel];
                    return (
                      <div key={panel} className={cx("rounded-2xl p-4", panel === activePanel ? "bg-yellow-300/10 ring-2 ring-yellow-300/40 shadow-[0_0_24px_rgba(253,224,71,0.14)]" : "bg-black/20")}>
                        <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-white/45">
                          <span>{t("panelLabel", lang)} {panel}</span>
                          {panel === activePanel && <span className="ml-2 rounded-full bg-yellow-300 px-2 py-[2px] text-[10px] font-bold text-slate-900">{t("liveLabel", lang)}</span>}
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {panelTicket.white.length ? panelTicket.white.map((n) => (
                            <div key={`${panel}-${n}`} className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/10 text-sm font-semibold text-white">
                              {n}
                            </div>
                          )) : <div className="text-sm text-white/40">{t("noPicksYetLabel", lang)}</div>}
                          {panelTicket.special !== null && (
                            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-rose-300/30 bg-rose-500 text-sm font-semibold text-white">
                              {panelTicket.special}
                            </div>
                          )}
                        </div>
                        <div className="mt-3 space-y-1 text-xs text-white/50">
                          <div>{panelTicket.addOn ? addOnLabel : t("baseTicketLabel", lang)}</div>
                          <div>{t("costLabel", lang)}: ${panelCosts[panel]}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex flex-wrap justify-center gap-3">
                {ticket.white.map((n) => (
                  <LotteryBall key={n} value={n} shown />
                ))}
                {ticket.special !== null && <LotteryBall value={ticket.special} shown special />}
              </div>

              <div className="text-sm text-white/68">{t("historicalDrawDateSelectedLabel", lang)}: <span className="font-semibold text-white">{draw?.date}</span></div>

              <div className="mx-auto inline-flex items-center gap-3 rounded-full border border-yellow-300/30 bg-yellow-300/10 px-5 py-3 text-sm text-yellow-100 shadow-[0_0_30px_rgba(253,224,71,0.12)]">
                <span className="text-xs uppercase tracking-[0.22em] text-yellow-200/80">{t("revealTargetLabel", lang)}</span>
                <span className="tracking-tight text-lg font-semibold">{t("panelLabel", lang)} {activePanel}</span>
                <span className="rounded-full bg-yellow-300 px-3 py-1 text-xs font-semibold text-slate-900">{t("activeLabel", lang)}</span>
              </div>

              <div className="mx-auto w-full max-w-2xl rounded-3xl border border-white/10 bg-white/5 p-4 text-left backdrop-blur">
                <div className="text-xs uppercase tracking-[0.24em] text-white/45">{t("ticketSummaryLabel", lang)}</div>
                <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-5">
                  <div className="rounded-2xl bg-black/20 p-3 flex flex-col justify-between min-h-[70px]">
                    <div className="text-[9px] uppercase tracking-[0.15em] text-white/40 leading-tight">{t("revealPanelLabel", lang)}</div>
                    <div className="mt-1 tracking-tight text-lg font-bold text-yellow-200">{activePanel}</div>
                  </div>
                  <div className="rounded-2xl bg-black/20 p-3 flex flex-col justify-between min-h-[70px]">
                    <div className="text-[9px] uppercase tracking-[0.15em] text-white/40 leading-tight">{t("addOnLabel", lang)}</div>
                    <div className="mt-1 tracking-tight text-lg font-bold text-white leading-tight">{ticket.addOn ? addOnLabel : t("offLabel", lang)}</div>
                  </div>
                  <div className="rounded-2xl bg-black/20 p-3 flex flex-col justify-between min-h-[70px]">
                    <div className="text-[9px] uppercase tracking-[0.15em] text-white/40 leading-tight">{t("drawDateLabel", lang)}</div>
                    <div className="mt-1 tracking-tight text-lg font-bold text-white">{draw?.date}</div>
                  </div>
                  <div className="rounded-2xl bg-black/20 p-3 flex flex-col justify-between min-h-[70px]">
                    <div className="text-[9px] uppercase tracking-[0.15em] text-white/40 leading-tight">{t("panelCostLabel", lang)}</div>
                    <div className="mt-1 tracking-tight text-lg font-bold text-white">${panelCosts[activePanel]}</div>
                  </div>
                  <div className="rounded-2xl bg-black/20 p-3 flex flex-col justify-between min-h-[70px]">
                    <div className="text-[9px] uppercase tracking-[0.15em] text-white/40 leading-tight">{t("totalCostLabel", lang)}</div>
                    <div className="mt-1 tracking-tight text-lg font-bold text-white">${totalTicketCost}</div>
                  </div>
                </div>
              </div>

              <motion.button
                onClick={() => { playPop(sound); reveal(); }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className={cx("relative rounded-2xl bg-gradient-to-r px-8 py-5 tracking-tight text-lg font-bold text-slate-950 shadow-2xl overflow-hidden", theme.accent)}
              >
                <motion.div
                  className="absolute inset-0 bg-white/20"
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ duration: 1.8, repeat: Infinity, repeatDelay: 1, ease: 'easeInOut' }}
                  style={{ transform: 'skewX(-15deg)' }}
                />
                <span className="relative z-10">🎱 {t("revealWinningNumbersButton", lang)}</span>
              </motion.button>
              <div className="mt-6">
                <AdPlaceholder />
              </div>
            </motion.div>
          )}

          {stage === "reveal" && draw && (
            <motion.div
              key="reveal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-8 text-center"
            >
              <div>
                <motion.div
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 0.9, repeat: Infinity }}
                  className="text-xs uppercase tracking-[0.3em] text-white/55"
                >
                  🎱 Dropping the winning numbers...
                </motion.div>
                <h2 className="mt-2 tracking-tight text-2xl font-bold">{draw.date} official draw</h2>
                <p className="mt-1 text-sm text-white/45">Green ring = your number matched!</p>
              </div>

              <div className="mx-auto flex max-w-3xl flex-wrap justify-center gap-4">
                {draw.white.map((n, i) => (
                  <LotteryBall key={n} value={n} shown={revealIndex > i} matched={ticket.white.includes(n)} />
                ))}
                <div className="flex items-center">
                  <div className="mx-2 text-white/30 text-2xl">+</div>
                  <LotteryBall value={draw.special} shown={revealIndex >= 6} matched={ticket.special === draw.special} special />
                </div>
              </div>
              {revealIndex >= 6 && (
                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-white/50"
                >
                  {matchedWhite.length === 0 && !matchedSpecial ? '😬 No matches. Hang on...' :
                   matchedWhite.length >= 4 ? '🔥 Strong match! Counting your winnings...' :
                   matchedWhite.length >= 2 ? '✨ A few matches! Checking your prize...' :
                   '🎃 Small hit! Every match counts...'}
                </motion.p>
              )}
              <div className="mt-12">
                <AdPlaceholder />
              </div>
            </motion.div>
          )}

          {stage === "result" && draw && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="space-y-6 text-center"
            >
              <div ref={resultCardRef} className="mx-auto max-w-4xl overflow-hidden rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.92),rgba(2,6,23,0.96))] p-0 shadow-[0_24px_80px_rgba(0,0,0,0.28)] backdrop-blur">
                <div className={cx("bg-gradient-to-r px-6 py-4", theme.paperHeader)}>
                  <div className="flex items-center justify-between gap-4 text-white">
                    <div>
                      <div className="text-[11px] uppercase tracking-[0.28em] opacity-80">{t("historicalDrawResultLabel", lang)}</div>
                      <div className="mt-1 tracking-tight text-2xl font-semibold">{gameName}</div>
                    </div>
                    <div className="rounded-full bg-white/15 px-4 py-2 text-sm font-medium">{t("panelLabel", lang)} {activePanel}</div>
                  </div>
                </div>
                <div className="p-4 sm:p-6 space-y-6">
                  {/* Outcome header */}
                  <div className="text-center">
                    <div className="text-[11px] uppercase tracking-[0.3em] text-white/40 mb-2">{t("resultLabel", lang)}</div>
                    {winAmountText === "JACKPOT" ? (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.7 }}
                        animate={{ opacity: 1, scale: [0.7, 1.1, 0.98, 1.04, 1] }}
                        transition={{ duration: 1.2, times: [0, 0.4, 0.65, 0.82, 1] }}
                        className="mt-2"
                      >
                        <div className="tracking-tight text-6xl font-black text-yellow-300 drop-shadow-[0_0_40px_rgba(253,224,71,0.6)] md:text-7xl">🏆 JACKPOT!</div>
                        <div className="mt-3 text-xl text-white/90 font-semibold">{t("beatImpossibleOdds", lang)}</div>
                        <div className="mt-1 text-sm text-white/55">1 in 292,000,000 — and you hit it.</div>
                      </motion.div>
                    ) : winAmountText !== "$0" ? (
                      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mt-2">
                        <div className="tracking-tight text-5xl font-black text-emerald-300 drop-shadow-[0_0_24px_rgba(74,222,128,0.4)] md:text-6xl">
                          {t("youWonLabel", lang)} {winAmountText} 🎉
                        </div>
                      </motion.div>
                    ) : (
                      <NoPrizeGif />
                    )}
                    {winAmountText !== "$0" && <h2 className="mt-3 tracking-tight text-2xl font-bold">{prizeText}</h2>}
                    {nearMissText && <p className="mt-2 text-yellow-300 font-semibold text-lg">{nearMissText}</p>}
                    <p className="mt-2 text-white/65">
                      {t("youMatchedLabel", lang)} <span className="font-bold text-white text-lg">{matchedWhite.length}</span> {t("whiteBallsLabel", lang)}
                      {matchedSpecial ? ` ${t("andSpecialBallLabel", lang)}` : "."}
                    </p>
                  </div>
                    <div className="mx-auto mt-3 max-w-xl rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                      <div className="text-[11px] uppercase tracking-[0.24em] text-white/45">{t("probabilityLabel", lang)}</div>
                      <div className="mt-2 tracking-tight text-2xl font-semibold text-white">{oddsText}</div>
                      <p className="mt-1 text-sm text-white/60">{t("approxOddsExactOutcome", lang)}</p>
                    </div>

                  <div className="flex flex-wrap justify-center gap-3">
                    {ticket.white.map((n) => (
                      <LotteryBall key={`mine-${n}`} value={n} shown matched={draw.white.includes(n)} />
                    ))}
                    {ticket.special !== null && <LotteryBall value={ticket.special} shown matched={matchedSpecial} special />}
                  </div>

                  <div className="mx-auto max-w-4xl rounded-3xl border border-white/10 bg-white/5 p-4 text-left backdrop-blur">
                    <div className="text-xs uppercase tracking-[0.24em] text-white/45">{t("allPanelsLabel", lang)}</div>
                    <div className="mt-3 grid gap-3 md:grid-cols-3">
                      {["A", "B", "C"].map((panel) => {
                        const panelTicket = panelTickets[panel];
                        const panelMatchWhite = draw ? panelTicket.white.filter((n) => draw.white.includes(n)).length : 0;
                        const panelMatchSpecial = draw ? panelTicket.special === draw.special : false;
                        return (
                          <div key={panel} className={cx("rounded-2xl p-4", panel === activePanel ? "bg-yellow-300/10 ring-2 ring-yellow-300/40 shadow-[0_0_24px_rgba(253,224,71,0.14)]" : "bg-black/20")}>
                            <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-white/45">
                              <span>{t("panelLabel", lang)} {panel}</span>
                              {panel === activePanel && <span className="ml-2 rounded-full bg-yellow-300 px-2 py-[2px] text-[10px] font-bold text-slate-900">{t("liveLabel", lang)}</span>}
                            </div>
                            <div className="mt-3 flex flex-wrap gap-2">
                              {panelTicket.white.length ? panelTicket.white.map((n) => (
                                <div key={`${panel}-result-${n}`} className={cx("flex h-9 w-9 items-center justify-center rounded-full border text-sm font-semibold", draw.white.includes(n) ? "border-emerald-300 bg-emerald-500/20 text-white" : "border-white/15 bg-white/10 text-white")}>
                                  {n}
                                </div>
                              )) : <div className="text-sm text-white/40">{t("noPicksYetLabel", lang)}</div>}
                              {panelTicket.special !== null && (
                                <div className={cx("flex h-9 w-9 items-center justify-center rounded-full border text-sm font-semibold", panelMatchSpecial ? "border-emerald-300 bg-emerald-500/20 text-white" : "border-rose-300/30 bg-rose-500 text-white")}>
                                  {panelTicket.special}
                                </div>
                              )}
                            </div>
                            <div className="mt-3 text-xs text-white/55">
                              {panelMatchWhite} {t(panelMatchWhite === 1 ? "whiteMatchSingular" : "whiteMatchesPlural", lang)}{panelMatchSpecial ? ` + ${t("specialBallLabel", lang)}` : ""}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="mx-auto w-full max-w-4xl rounded-3xl border border-white/10 bg-white/5 p-4 text-left backdrop-blur">
                    <div className="text-[10px] uppercase tracking-[0.24em] text-white/45">{t("matchBreakdownLabel", lang)}</div>
                    <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-5">
                      <div className="rounded-2xl bg-black/20 p-3 flex flex-col justify-between min-h-[80px]">
                        <div className="text-[9px] uppercase tracking-[0.15em] text-white/40 leading-tight">{t("whiteBallsLabel", lang)}</div>
                        <div className="mt-1 tracking-tight text-xl font-bold text-white">{matchedWhite.length}</div>
                      </div>
                      <div className="rounded-2xl bg-black/20 p-3 flex flex-col justify-between min-h-[80px]">
                        <div className="text-[9px] uppercase tracking-[0.15em] text-white/40 leading-tight">{t("specialBallLabel", lang)}</div>
                        <div className="mt-1 tracking-tight text-xl font-bold text-white">{matchedSpecial ? t("yesLabel", lang) : t("noLabel", lang)}</div>
                      </div>
                      <div className="rounded-2xl bg-black/20 p-3 flex flex-col justify-between min-h-[80px]">
                        <div className="text-[9px] uppercase tracking-[0.15em] text-white/40 leading-tight">{t("panelLabel", lang)}</div>
                        <div className="mt-1 tracking-tight text-xl font-bold text-white">{activePanel}</div>
                      </div>
                      <div className="rounded-2xl bg-black/20 p-3 flex flex-col justify-between min-h-[80px]">
                        <div className="text-[9px] uppercase tracking-[0.15em] text-white/40 leading-tight">{t("panelCostLabel", lang)}</div>
                        <div className="mt-1 tracking-tight text-xl font-bold text-white">${panelCosts[activePanel]}</div>
                      </div>
                      <div className="rounded-2xl bg-black/20 p-3 flex flex-col justify-between min-h-[80px]">
                        <div className="text-[9px] uppercase tracking-[0.15em] text-white/40 leading-tight">{t("totalCostLabel", lang)}</div>
                        <div className="mt-1 tracking-tight text-xl font-bold text-white">${totalTicketCost}</div>
                      </div>
                    </div>
                  </div>

                  <div className="mx-auto max-w-4xl rounded-3xl border border-white/10 bg-white/5 p-4 text-left backdrop-blur">
                    <div className="text-xs uppercase tracking-[0.24em] text-white/45">{t("oddsComparisonLabel", lang)}</div>
                    <div className="mt-3 grid gap-3 md:grid-cols-3">
                      {oddsComparisons.map((item) => (
                        <div key={item.label} className="rounded-2xl bg-black/20 p-4">
                          <div className="text-xs uppercase tracking-[0.2em] text-white/45">{item.label}</div>
                          <div className="mt-2 tracking-tight text-xl font-semibold">{item.value}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {simStats && (
                    <div className="mx-auto max-w-3xl space-y-4">
                      <div className="rounded-3xl border border-white/10 bg-white/5 p-4 text-center backdrop-blur">
                        <div className="text-xs uppercase tracking-[0.24em] text-white/45">{t("simulationLabel", lang)}</div>
                        <div className="mt-2 tracking-tight text-2xl font-semibold">{simStats.jackpots} {t("jackpotsInRandomTickets", lang)} {simStats.runs.toLocaleString()}</div>
                        <div className="mt-4 grid gap-3 sm:grid-cols-3 text-left">
                          {[
                            { 
                              label: t("jackpotsLabel", lang), 
                              value: simStats.jackpots, 
                              max: Math.max(1, simStats.runs),
                              desc: "Jackpot"
                            },
                            { 
                              label: t("threePlusMatchesLabel", lang), 
                              value: simStats.match3Plus, 
                              max: Math.max(1, simStats.runs),
                              desc: game === 'powerball' ? "$7 ~ $1M+" : "$10 ~ $1M+"
                            },
                            { 
                              label: t("specialHitsLabel", lang), 
                              value: simStats.specialHits, 
                              max: Math.max(1, simStats.runs),
                              desc: game === 'powerball' ? "$4 ~ $100" : "$2 ~ $200"
                            },
                          ].map((item) => (
                            <div key={item.label} className="rounded-2xl bg-black/20 p-4">
                              <div className="flex items-center justify-between">
                                <div className="text-xs uppercase tracking-[0.2em] text-white/45">{item.label}</div>
                                <div className="text-[10px] font-medium text-amber-400/80">{item.desc}</div>
                              </div>
                              <div className="mt-2 tracking-tight text-2xl font-semibold">{item.value.toLocaleString()}</div>
                              <div className="mt-3 h-2 rounded-full bg-white/10">
                                <div className="h-2 rounded-full bg-gradient-to-r from-yellow-300 to-amber-500" style={{ width: `${Math.max(2, Math.min(100, (item.value / item.max) * 100))}%` }} />
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Simulation Balance Summary */}
                        <div className="mt-4 flex flex-col gap-2 rounded-2xl bg-white/5 p-4 sm:flex-row sm:items-center sm:justify-around border border-white/5">
                          <div className="text-center">
                            <div className="text-[10px] uppercase tracking-[0.2em] text-white/40">Total Spent</div>
                            <div className="mt-1 text-xl font-bold text-rose-400">${simStats.totalSpent.toLocaleString()}</div>
                          </div>
                          <div className="hidden h-8 w-px bg-white/10 sm:block" />
                          <div className="text-center">
                            <div className="text-[10px] uppercase tracking-[0.2em] text-white/40">Total Won</div>
                            <div className="mt-1 text-xl font-bold text-emerald-400">${simStats.totalWon.toLocaleString()}</div>
                          </div>
                          <div className="hidden h-8 w-px bg-white/10 sm:block" />
                          <div className="text-center">
                            <div className="text-[10px] uppercase tracking-[0.2em] text-white/40">Net Profit</div>
                            <div className="mt-1 text-xl font-bold text-white/90">
                              {(simStats.totalWon - simStats.totalSpent) < 0 ? '-' : '+'}
                              ${Math.abs(simStats.totalWon - simStats.totalSpent).toLocaleString()}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="rounded-3xl border border-white/10 bg-black/30 p-4 backdrop-blur">
                        <div className="text-[11px] uppercase tracking-[0.24em] text-white/45">{t("ticketReceiptLabel", lang)}</div>
                        <div className="mt-3 space-y-2">
                          {["A", "B", "C"].map((panel) => {
                            const panelTicket = panelTickets[panel];
                            const isFilled = panelTicket.white.length > 0 || panelTicket.special !== null;
                            return (
                              <div key={panel} className="flex items-center justify-between rounded-xl bg-white/5 px-3 py-2">
                                <div className="flex items-center gap-2">
                                  <span className="font-semibold text-white">{t("panelLabel", lang)} {panel}</span>
                                  <span className="text-xs text-white/45">{isFilled ? (panelTicket.addOn ? addOnLabel : t("baseLabel", lang)) : t("emptyLabel", lang)}</span>
                                </div>
                                <span className="font-semibold text-white">${panelCosts[panel]}</span>
                              </div>
                            );
                          })}
                        </div>
                        <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-3 text-white">
                          <span className="font-medium">{t("totalLabel", lang)}</span>
                          <span className="font-semibold">${totalTicketCost}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="mt-4 border-t border-white/10 pt-4" />
                  <div className="mt-4 text-center text-[11px] tracking-[0.2em] text-white/35">
                    {t("historicalLotterySimulationFooter", lang)}
                  </div>
                </div>
              </div>


{/* ── Utility row: copy / save / share ── */}
              <div className="flex flex-wrap justify-center gap-2">
                <button
                  onClick={copyResult}
                  title="Copy result as text to clipboard"
                  className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white active:scale-95 transition"
                >
                  {t("copyResultButton", lang)}
                </button>
                <button
                  onClick={downloadResultImage}
                  title="Download result as PNG image"
                  className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white active:scale-95 transition"
                >
                  <Download className="h-3.5 w-3.5" /> {t("saveResultImageButton", lang)}
                </button>
                {typeof navigator !== "undefined" && typeof navigator.share === "function" && (
                  <button
                    onClick={shareResultImage}
                    title="Share result image via system share sheet"
                    className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white active:scale-95 transition"
                  >
                    <Share2 className="h-3.5 w-3.5" /> {t("shareImageButton", lang)}
                  </button>
                )}
              </div>

              {/* ── Simulation arcade panel ── */}
              <div
                className="mx-auto w-full max-w-2xl rounded-[28px] border border-white/10 p-4 backdrop-blur"
                style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(0,0,0,0.22) 100%)' }}
              >
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.28em] text-white/40">Simulation Engine</p>
                    <p className="mt-0.5 text-sm font-medium text-white/75"
                       title="Fires N random tickets against the locked historical draw date. None are your numbers — pure probability demonstration.">
                      🎰 Run random tickets vs. the locked draw
                      <span className="ml-1.5 cursor-help rounded-full border border-white/20 bg-white/10 px-1.5 py-0.5 text-[10px] text-white/50 hover:bg-white/20 transition" title="Each simulation generates N fully random ticket combinations and checks them against the historical draw date selected by the roulette wheel. Shows you how often random tickets would have won.">?</span>
                    </p>
                  </div>
                  {simStats && (
                    <div className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-300">
                      {simStats.runs.toLocaleString()} run{simStats.runs > 1 ? 's' : ''} done
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {[
                    { label: '1,000', runs: 1000, color: 'from-slate-600 to-slate-500', ring: 'ring-slate-400/30', title: 'Quick run — results in ~1 second' },
                    { label: '10,000', runs: 10000, color: 'from-indigo-700 to-indigo-500', ring: 'ring-indigo-400/30', title: 'Standard run — ~3 seconds' },
                    { label: '100,000', runs: 100000, color: 'from-violet-700 to-fuchsia-500', ring: 'ring-violet-400/30', title: 'Deep run — ~10 seconds. Rare events start appearing.' },
                    { label: '1,000,000', runs: 1000000, color: 'from-amber-600 to-rose-500', ring: 'ring-amber-400/30', title: 'Mega run — 30–60 seconds. True jackpot probability in action.' },
                  ].map(({ label, runs: n, color, ring, title: btnTitle }) => (
                    <button
                      key={n}
                      onClick={() => runSimulation(n)}
                      disabled={simulating}
                      title={btnTitle}
                      className={cx(
                        'group relative flex flex-col items-center justify-center gap-1 rounded-2xl border px-3 py-4 font-semibold transition-all duration-200 active:scale-95',
                        simulating
                          ? 'cursor-not-allowed border-white/5 bg-white/5 opacity-40'
                          : `cursor-pointer border-white/10 bg-gradient-to-br ${color} shadow-lg hover:scale-[1.03] hover:shadow-xl hover:ring-2 ${ring}`
                      )}
                    >
                      <span className="text-[11px] uppercase tracking-[0.22em] text-white/60 group-hover:text-white/80 transition">simulate</span>
                      <span className="tracking-tight text-lg font-bold text-white leading-none">{label}×</span>
                      {simulating && simRunTarget === n && (
                        <span className="mt-1 text-[10px] text-yellow-300 animate-pulse">{simProgress}%</span>
                      )}
                    </button>
                  ))}
                </div>

                {simulating && (
                  <div className="mt-3 rounded-xl border border-yellow-300/20 bg-yellow-300/10 px-4 py-2 text-center text-sm text-yellow-100">
                    {simEventText || t('runningRandomTicketsLabel', lang)} — {simProgress}%
                    <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/10">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${simProgress}%` }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                        className="h-1.5 rounded-full bg-gradient-to-r from-yellow-300 via-amber-400 to-orange-500"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* ── Navigation row ── */}
              <div className="flex flex-wrap justify-center gap-3">
                <button
                  onClick={() => { playPop(sound); quickReplay(); }}
                  title="Keep the same draw date and try different numbers"
                  className={cx('rounded-2xl bg-gradient-to-r px-6 py-4 tracking-tight text-base font-semibold text-slate-950 shadow-xl active:scale-95 hover:scale-[1.02] transition', theme.accent)}
                >
                  {t('tryAgainInstantlyButton', lang)}
                </button>
                <button
                  onClick={reset}
                  title="Go back to the start and pick a new game"
                  className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-6 py-4 tracking-tight text-base font-medium hover:bg-white/15 active:scale-95 transition"
                >
                  <RotateCcw className="h-4 w-4" /> {t('backToStartButton', lang)}
                </button>
              </div>
              <div className="mt-8">
                <AdPlaceholder />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-10 border-t border-white/10 pt-6 text-center text-sm text-white/45">{t("entertainmentOnlyDisclaimer", lang)}</div>
      </div>
    </div>
  );
}
