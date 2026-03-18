# Project Notes

## 2026-03-09
## Lottery Odds Visualizer - New Premium Project (2026-03-09)
- User: Dug H
- Project: "Lottery Odds Visualizer"
- Status: Intake phase - collecting sample images (1 of 3 uploaded)
- Sample 1: Start page - dark theme, gold metallic text for jackpot amounts (Mega Millions $533M, Powerball $46M), dramatic lightning/galaxy split image, yellow-green "Check My Odds" CTA button, Korean text, responsive (mobile + desktop)
- Design vibe: Dark, premium, cinematic, bold contrasts
- Reference URL: what'sthechance.com
- Waiting for 2 more sample images before proceeding

## 2026-03-09
## Lottery Odds Visualizer - Intake Complete (2026-03-09)

### Decisions from Q&A:
1. **Jackpot data**: Live from lottery API (real-time) — need to research available APIs
2. **Visualization**: Multiple different images based on odds tier (lightning strike, needle in haystack, golden grain of sand, etc.)
3. **Odds math**: Real formulas — Mega Millions: 1 in 302,575,350 per ticket, Powerball: 1 in 292,201,338 per ticket
4. **Share feature**: Social media sharing (Twitter/Facebook/etc.)
5. **Scope**: 3 screens MVP, more features planned for later
6. **Language**: English first, Korean later

### 3-Screen Flow:
1. **Start Page** — Current jackpots (live API), hero image (lightning/galaxy split), "Check My Odds" CTA
2. **Ticket Selection** — 3 tiers (1/5/10+), ticket counter with +/-, investment calc, "Check Odds" CTA
3. **Results Page** — Visual metaphor image (varies by odds), witty description, stats row (tickets/odds/jackpot), "Try Again" + "Share My Fortune"

### Design:
- Dark theme (near-black background)
- Gold metallic text for jackpot amounts
- Yellow-green (#c8ff00 approx) CTA buttons
- Subtle gold border accents
- Dramatic/cinematic imagery
- Responsive (mobile-first, works on desktop)
- Toggle for Mega Millions vs Powerball

## 2026-03-09
## SEO & Accessibility Requirements (2026-03-09)
- Meta titles/descriptions targeting: "Lottery Odds Visualizer", "Texas Lottery", "Maryland Lottery"
- All images must have descriptive alt tags
- SEO-friendly structure (semantic HTML, Open Graph tags, Twitter cards)
- Google Trends keywords to target: lottery odds, lottery probability, mega millions odds, powerball odds, lottery visualizer
- Accessibility: alt tags, ARIA labels, keyboard navigation, semantic HTML

## 2026-03-09
## Updates (2026-03-09 - Round 2)
- Fixed Mega Millions base odds: 290,472,336 (was 302,575,350) per megamillions.com
- Powerball odds confirmed: 292,201,338 per powerball.com
- Mega Millions ticket price: $5 (includes multiplier)
- Powerball ticket price: $2
- Added new page: "Odds Breakdown" (/src/OddsBreakdown.jsx) — shows all 9 prize tiers for each game
  - Each tier has: match description, prize, odds, emoji, humorous comparison, real-world comparison
  - Expandable rows with humor text on click
  - Color-coded difficulty bars (green=easy, red=miracle)
  - Game toggle (MM vs PB)
  - Quick stats: ticket price, 9 ways to win, overall odds
- Navigation: "Explore the Real Odds" link added to Start, Selection, and Results pages
- Back button on Odds Breakdown returns to previous screen
- Files: /src/App.jsx, /src/OddsBreakdown.jsx, /styles.css

## 2026-03-09
## Updates (2026-03-09 - Round 3)
### Odds Breakdown Page Changes:
- Removed jackpot tier from the list (8 tiers now, not 9)
- Added "Check My Jackpot Odds" CTA at the bottom → navigates to ticket selection
- Added visual ball icons: White balls (gradient white), Gold ball (Mega Ball), Red ball (Powerball)
- Faded/dimmed balls for non-matched positions
- Legend at top showing ball types
- Each tier now has a comic cartoon image that loads on expand (16 unique images generated)

### Comic Images Generated (/public/images/):
Mega Millions: comic-stadium-hat, comic-snowflake, comic-dartboard, comic-cards, comic-mainstreet, comic-dice, comic-lockers, comic-coffee, comic-balloons
Powerball: comic-scubadiver, comic-phonecall, comic-horserace, comic-theater, comic-apartment, comic-raffle, comic-bouquet, comic-sneeze

### AdSense Layout:
- AdPlaceholder component in both App.jsx and OddsBreakdown.jsx
- Responsive: 320×50 on mobile, 728×90 on desktop
- Labeled "Advertisement" in sleek dark theme
- Placement:
  - Start Page: After hero section
  - Ticket Selection: After investment display, before CTA
  - Results Page: Bottom, above footer
  - Odds Breakdown: Top (after stats), Mid-list (between tiers), Bottom (before jackpot CTA)

### SEO:
- Footer on Results page with keyword text
- Source attribution footer on Odds page linking to official sites
- Keyword mentions: Mega Millions, Powerball, Texas Lottery, Maryland Lottery

## 2026-03-09
## Major Update (2026-03-09 - Round 4)

### 1. Theme Toggle (Light/Dark Mode)
- ThemeContext + useTheme hook + useThemeStyles hook
- CSS variables via [data-theme="dark"] and [data-theme="light"] on :root
- Light mode: warm cream (#f7f5f0) background, dark text, gold accent shifted to #8a7000
- Dark mode: unchanged premium dark
- Fixed position sun/moon toggle button top-right
- All components use theme-aware styles via the hooks
- OddsBreakdown updated for theme variables too

### 2. Live Lottery Data Section
- Added LAST_WINNERS data to hero page
- Shows: Next Drawing date, Last Winner (date, state, amount, tier)
- Mock data for now — ready for API swap

### 3. Ticket Selection Revamp
- Removed bottom counter → +/- buttons directly under each tier card
- 10+ card: +/- buttons add/subtract by 10
- Shows current ticket count + cost in a display bar
- Custom input: "Want to go crazy?" link → text field for manual entry (up to 10M tickets)
- activeTier logic: 1=single, 2-9=five, 10+=ten+

### 4. Start Over Button
- HomeIcon + "Start Over" button on Results page
- Navigates back to Start screen

### 5. New 10-Tier Result Visualizations (mystical/dark/meme style)
All images: dark cinematic photorealistic, mystical atmosphere, absurdly funny
- Tier 1 (1 ticket): Infinite Coin Stack — flipping heads 28 times
- Tier 2 (2-3): Gum on Highway — finding exact gum spit NY to LA
- Tier 3 (4-5): Sneeze Boss — predicting exact sneeze second over 9.5 years
- Tier 4 (6-10): Phone Ex — dialing random number, ex picks up
- Tier 5 (11-20): Cat Keyboard — cat typing "WINNER" perfectly
- Tier 6 (21-50): Vending Machine — crushed by vending machine 3x in a row
- Tier 7 (51-100): Dice Streak — same number on die 11 times
- Tier 8 (101-1000): Heartbeat — predicting exact heartbeat among 300M
- Tier 9 (1001-100000): Hole in One — first-time golfer, back-to-back holes-in-one
- Tier 10 (100001+): Empire Brick — one brick in 30 Empire State Buildings

### Files Modified:
- /src/App.jsx — full rewrite with theme system, new data, revamped UI
- /styles.css — CSS variables for theming + new styles
- /src/OddsBreakdown.jsx — theme variable updates
- 10 new images in /public/images/result-*.png