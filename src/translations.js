// ============================================================
// TRANSLATIONS — EN / KO / ES
// Add new languages by adding a key to each entry
// ============================================================

const T = {

  // ─── Zodiac Fortune Missing Translations ───
  dailyFortune: { en: 'Daily Fortune', ko: '오늘의 운세', es: 'Tu Suerte Diaria' },
  backToZodiac: { en: 'Back', ko: '뒤로가기', es: 'Volver' },
  tryAnotherSign: { en: 'Try Another Sign', ko: '다른 별자리 보기', es: 'Probar Otro Signo' },
  FORTUNELEVEL: { en: 'FORTUNE LEVEL', ko: '오늘의 행운 지수', es: 'NIVEL DE SUERTE' },
  LUCKYNUMBERS: { en: 'LUCKY NUMBERS', ko: '행운의 숫자', es: 'NÚMEROS DE LA SUERTE' },
  LUCKYCOLOR: { en: 'LUCKY COLOR', ko: '행운의 색상', es: 'COLOR DE LA SUERTE' },
  LUCKYTIME: { en: 'LUCKY TIME', ko: '행운의 시간', es: 'HORA DE LA SUERTE' },

  // ─── Language Selector Labels ───
  langEN: { en: 'ENG', ko: 'ENG', es: 'ENG' },
  langKO: { en: 'KOR', ko: 'KOR', es: 'KOR' },
  langES: { en: 'ESP', ko: 'ESP', es: 'ESP' },

  // ─── Start Page ───
  megaMillions: { en: 'Mega Millions', ko: 'Mega Millions', es: 'Mega Millions' },
  powerball: { en: 'Powerball', ko: 'Powerball', es: 'Powerball' },
  next: { en: 'Next', ko: '다음 추첨', es: 'Siguiente' },
  lastWinner: { en: 'Recent {game} Winner (Non-Jackpot)', ko: '최근 {game} 당첨 (잭팟 외)', es: 'Ganador Reciente de {game} (No Jackpot)' },
  lastJackpot: { en: 'Last {game} Jackpot', ko: '최근 {game} 잭팟', es: 'Último jackpot de {game}' },

  // 형님 요청 반영: 영어 오리지널 유지, 한/스페인어는 1줄 핏에 맞게 세련되게 수정
  tagline: { en: "Hitting the 💰 jackpot 💰 today?", ko: "오늘 💰 잭팟 💰 터질 확률은?", es: "¿Toca el 💰 jackpot 💰 hoy?" },
  checkMyOdds: { en: 'Check My Odds', ko: '내 확률 보기', es: 'Ver Probabilidades' },
  subTagline: { en: "Way harder than getting struck by lightning.", ko: "벼락 맞기보다 훨씬 어렵습니다.", es: "Más difícil que ser alcanzado por un rayo." },
  advertisement: { en: 'Advertisement', ko: '광고', es: 'Publicidad' },

  // ─── Ticket Selection ───
  backToHome: { en: 'Back to Home', ko: '홈으로', es: 'Volver al Inicio' },
  howManyTickets: { en: 'How Many?', ko: '몇 장 살까요?', es: '¿Cuántos?' },
  perTicket: { en: '{game}: ${price} per ticket', ko: '{game}: 1장당 ${price}', es: '{game}: ${price} por boleto' },
  nextDrawing: { en: 'Next Drawing: {date} — Jackpot: ${amount}M', ko: '다음 추첨: {date} — 잭팟: ${amount}M', es: 'Siguiente Sorteo: {date} — Jackpot: ${amount}M' },
  cashOptionText: { en: 'Cash Option: ${amount}M', ko: '일시불 수령액: ${amount}M', es: 'Opción en Efectivo: ${amount}M' },
  tickets: { en: 'Ticket(s)', ko: '티켓', es: 'Boletos' },
  smallDream: { en: 'Small Dream', ko: '소소한 꿈', es: 'Pequeño Sueño' },
  wildAttempt: { en: 'Wild Attempt', ko: '과감한 도전', es: 'Intento Audaz' },
  cosmicHope: { en: 'Cosmic Hope', ko: '우주적 희망', es: 'Esperanza Cósmica' },
  live: { en: 'LIVE', ko: '실시간', es: 'EN VIVO' },
  noChance: { en: '0 Chance 🫠', ko: '확률 0% 🫠', es: '0 Oportunidad 🫠' },
  reset: { en: 'Reset', ko: '리셋', es: 'Reiniciar' },
  goCrazy: { en: "Daring? Enter Custom Amount →", ko: "직접 수량을 입력해 보시겠어요? →", es: "¿Te atreves? Ingrese cantidad →" },
  go: { en: 'Go', ko: '확인', es: 'Ir' },
  selectTicketsFirst: { en: 'Select Tickets First', ko: '티켓 먼저 선택', es: 'Selecciona Boletos' },
  checkOdds: { en: 'Check My Odds', ko: '내 확률 팩트체크', es: 'Ver Mis Probabilidades' },
  seeAllWays: { en: 'See All Other Ways to Win {game}', ko: '{game} 다른 당첨 방법 보기', es: 'Ver Todas las Formas de Ganar {game}' },
  invested: { en: '${amount} invested', ko: '${amount} 투자', es: '${amount} invertidos' },
  for: { en: 'for', ko: '', es: 'para' },

  // Witty Copy — Ticket Selection
  witty10M: { en: "Buying the whole lottery? LEGEND. 🏆", ko: "복권국 대주주십니다. 레전드. 🏆", es: "¿Comprando toda la lotería? LEYENDA. 🏆" },
  witty1M: { en: "You beautiful, budget-destroying maniac.", ko: "예산 파괴자. 당신은 진정한 낭만 합격.", es: "Hermoso maniaco destructor de presupuestos." },
  witty1K: { en: "Delusional optimist. I love it.", ko: "망상적 낙관주의자. 맘에 들어요.", es: "Optimista delirante. Me encanta." },

  // Random Witty Copy for 100+ tickets
  wittyRandom0: { en: "Investing heavily in disappointment.", ko: "이 정도면 '실망'에 영끌 투자하시는 수준이네요.", es: "Invirtiendo fuerte en decepción." },
  wittyRandom1: { en: "Math is crying right now.", ko: "수학의 신이 오열하고 있습니다.", es: "Las matemáticas están llorando ahora mismo." },
  wittyRandom2: { en: "Your financial advisor just felt a disturbance in the Force.", ko: "당신의 재무 관리사가 뒷목을 잡았습니다.", es: "Tu asesor financiero acaba de sentir una perturbación en la Fuerza." },
  wittyRandom3: { en: "Hope is a hell of a drug.", ko: "희망이라는 마약에 아주 깊게 취하셨네요.", es: "La esperanza es una droga increíble." },
  wittyRandom4: { en: "Funding the state's pothole repair fund, one ticket at a time.", ko: "국가 도로 보수 공사에 훌륭히 기여 중이십니다.", es: "Financiando la reparación de baches del estado, un boleto a la vez." },
  wittyRandom5: { en: "At this point, you're just paying the 'I can't do math' tax.", ko: "국가에서 걷는 '수학 포기세' 성실 납부자 시군요.", es: "Básicamente estás pagando el impuesto de los que no saben matemáticas." },
  wittyRandom6: { en: "Statistically irrelevant, but emotionally necessary.", ko: "통계적으로 무의미하지만, 감정적으로 필수적이죠.", es: "Estadísticamente irrelevante, pero emocionalmente necesario." },
  wittyRandom7: { en: "You could have bought so many tacos with this.", ko: "이 돈이면 치킨을 몇 마리나 먹을 수 있었을 텐데.", es: "Podrías haber comprado tantos tacos con esto." },
  wittyRandom8: { en: "I admire your dedication to terrible odds.", ko: "이 처참한 확률에 대한 당신의 헌신에 기립박수를.", es: "Admiro tu dedicación a las probabilidades terribles." },
  wittyRandom9: { en: "This is a cry for help. I'm here for it.", ko: "돈 낭비라는 구조 요청이네요. 제가 팩트로 때려드릴게요.", es: "Esto es un grito de ayuda. Estoy aquí para eso." },

  wittyDefault: { en: "More tickets don't change much, but it's fun.", ko: "티켓을 늘려도 확률은 거의 안 변하지만, 뭐 재밌잖아요.", es: "Más boletos no cambian mucho, pero es divertido." },

  // ─── Results Page ───
  yourJackpotOdds: { en: 'Your Jackpot Odds', ko: '당신의 잭팟 확률', es: 'Tus Probabilidades de Jackpot' },
  yourOdds: { en: 'Your Odds', ko: '당신의 확률', es: 'Tus Probabilidades' },
  game: { en: 'Game', ko: '게임', es: 'Juego' },
  jackpot: { en: 'Jackpot', ko: '잭팟', es: 'Jackpot' },
  tryAgainVisualizing: { en: 'Face Reality Again', ko: '다시 한 번 현실 마주하기', es: 'Enfrentar la Realidad de Nuevo' },
  myZodiacFortune: { en: '🔮 My Zodiac Fortune Today', ko: '🔮 오늘의 운세 확인하기', es: '🔮 Mi Horóscopo de Hoy' },
  checkTomorrow: { en: "Check Tomorrow's Fortune", ko: '내일 운세 확인하기', es: 'Ver Suerte de Mañana' },
  startOver: { en: 'Start Over', ko: '처음으로', es: 'Empezar de Nuevo' },
  copy: { en: 'Copy', ko: '복사', es: 'Copiar' },
  copied: { en: 'Copied!', ko: '복사됨!', es: '¡Copiado!' },
  generateReceipt: { en: 'Save Receipt', ko: '영수증 캡처', es: 'Guardar Recibo' },
  shareMyDelusion: { en: 'Share My Delusion', ko: '내 착각 공유하기', es: 'Compartir Mi Delirio' },
  shareText: {
    en: "I'm 1 in {odds} likely to win the {jackpot}M {game} jackpot! More likely to {title}. Reality check @ whatschance.com",
    ko: "{game} 잭팟 {jackpot}M 당첨 확률 1/{odds}! {title} 확률이 차라리 더 높음 ㅋㅋ 팩폭 맞으러 가기: whatschance.com",
    es: "¡Tengo 1 en {odds} de ganar el jackpot de {jackpot}M {game}! Más probable {title}. Realidad en whatschance.com"
  },
  readingStars: { en: 'Reading the stars for {sign}...', ko: '{sign} 무의식 읽는 중...', es: 'Leyendo las estrellas de {sign}...' },
  takeHomeTitle: { en: 'What Would You Actually Take Home?', ko: '세금 떼고 내 통장에 꽂히는 진짜 금액은?', es: '¿Cuánto Dinero Real Llegará a tus Manos?' },
  takeHomeSub: { en: 'If you won the {game} jackpot and took the lump sum', ko: '{game} 잭팟 당첨 후 일시불 수령 시', es: 'Si ganaras el jackpot de {game} y tomaras la suma global' },
  taxOuch: { en: 'Ouch. But hey, look at the bright side...', ko: '아야... 그래도 밝은 면을 보자면...', es: 'Ay. Pero mira el lado positivo...' },
  seoFooter: { en: 'Lottery Odds Visualizer — See your real chances for Mega Millions and Powerball.', ko: '로또 확률 시각화 — Mega Millions, Powerball 실제 확률을 확인하세요.', es: 'Visualizador de Probabilidades de Lotería — Ve tus probabilidades reales para Mega Millions, Powerball.' },

  // ─── Opportunity Cost ───
  whatElseBuy: { en: 'What else could you buy with this?', ko: '이 돈이면 차라리...', es: '¿Qué más podrías comprar con esto?' },
  buyGum: { en: '{count} packs of cheap gum 🍬', ko: '싸구려 껌 {count}통 🍬', es: '{count} paquetes de chicle barato 🍬' },
  buyCoffee: { en: '{count} fancy cups of coffee ☕', ko: '스벅 아메리카노 {count}잔 ☕', es: '{count} tazas de café elegante ☕' },
  buyLunch: { en: '{count} solid lunch combos 🍔', ko: '든든한 국밥 {count}그릇 🍲', es: '{count} combos de almuerzo sólido 🍔' },
  buySteak: { en: '{count} decent steak dinners 🥩', ko: '아웃백 스테이크 {count}번 🥩', es: '{count} cenas de bistec decentes 🥩' },
  buySneakers: { en: '{count} nice pairs of sneakers 👟', ko: '한정판 조던 {count}켤레 👟', es: '{count} buenos pares de tenis 👟' },
  buyPS5: { en: '{count} brand new PS5 consoles 🎮', ko: '따끈따끈한 PS5 {count}대 🎮', es: '{count} consolas PS5 nuevas 🎮' },
  buyPhone: { en: '{count} flagship smartphones 📱', ko: '최신 아이폰 프로 {count}대 📱', es: '{count} smartphones de última generación 📱' },
  buyVacation: { en: '{count} week-long vacations 🏖️', ko: '호캉스 일주일 {count}번 🏖️', es: '{count} semanas de vacaciones 🏖️' },
  buyUsedCar: { en: '{count} decent used cars 🚗', ko: '상태 좋은 아반떼 중고 {count}대 🚗', es: '{count} autos usados decentes 🚗' },
  buyLuxuryWatch: { en: '{count} luxury Swiss watches ⌚', ko: '롤렉스 시계 {count}개 ⌚', es: '{count} relojes suizos de lujo ⌚' },
  buyLuxuryWatchDesc: { en: "A collection of timeless precision.", ko: "세월이 흘러도 변치 않는 정밀함의 상징.", es: "Una colección de precisión atemporal." },
  buyHouse: { en: '{count} solid down payments on a house 🏠', ko: '서울 아파트 계약금 {count}번 🏠', es: '{count} buenos pagos iniciales para una casa 🏠' },
  buyHouseDesc: { en: "The foundation of a new life.", ko: "새로운 인생의 든든한 기반.", es: "La base de una nueva vida." },
  buySportsCar: { en: '{count} high-end sports cars 🏎️', ko: '포르쉐 911 {count}대 🏎️', es: '{count} coches deportivos de lujo 🏎️' },
  buySportsCarDesc: { en: "Pure adrenaline on four wheels.", ko: "도로 위의 순수한 아드레날린.", es: "Adrenalina pura sobre cuatro ruedas." },
  buyMansion: { en: '{count} luxury mansions 🏰', ko: '초호화 한강뷰 펜트하우스 {count}채 🏰', es: '{count} mansiones de lujo 🏰' },
  buyMansionDesc: { en: "Living at the peak of luxury.", ko: "럭셔리의 정점에서 누리는 삶.", es: "Viviendo en la cima del lujo." },
  buyPrivateJet: { en: '{count} hours on a private jet ✈️', ko: '전용기 대여 {count}시간 ✈️', es: '{count} horas en un jet privado ✈️' },
  buyPrivateJetDesc: { en: "A lifetime of global adventures.", ko: "평생 동안 즐기는 전 세계적 모험.", es: "A toda una vida de aventuras globales." },
  buyMaldivesDefense: { en: "the Maldives annual defense budget 🇲🇻", ko: "몰디브 국가 연간 국방 예산 🇲🇻", es: "el presupuesto anual de defensa de Maldivas 🇲🇻" },
  buyMaldivesDefenseDesc: { en: "Protecting an entire island nation.", ko: "섬나라 전체를 수호하는 힘.", es: "Protegiendo a toda una nación insular." },
  buyNYPenthouse: { en: "New York's most expensive penthouse 🏙️", ko: "뉴욕에서 가장 비싼 펜트하우스 🏙️", es: "el ático más caro de Nueva York 🏙️" },
  buyNYPenthouseDesc: { en: "The crown jewel of the Manhattan skyline.", ko: "맨해튼 스카이라인의 정점.", es: "La joya de la corona del skyline de Manhattan." },
  buyOhtaniContract: { en: "Shohei Ohtani's baseball genius ⚾", ko: "쇼헤이 오타니의 빛나는 재능 ⚾", es: "el genio del béisbol de Shohei Ohtani ⚾" },
  buyOhtaniContractDesc: { en: "Decades of sporting excellence.", ko: "역사에 남을 스포츠의 정점.", es: "Décadas de excelencia deportiva." },
  buyVegasConstruction: { en: "construction of the Las Vegas Sphere 🏗️", ko: "라스베이거스 스피어 건설비 🏗️", es: "la construcción de la Esfera de Las Vegas 🏗️" },
  buyVegasConstructionDesc: { en: "Building a legacy in the desert.", ko: "사막 위에 세우는 거대 레거시.", es: "Construyendo un legado en el desierto." },
  buySalvatorMundi: { en: "Leonardo da Vinci’s ‘Salvator Mundi’ 🎨", ko: "레오나르도 다빈치의 ‘살바토르 문디’ 🎨", es: "el ‘Salvator Mundi’ de Leonardo da Vinci 🎨" },
  buySalvatorMundiDesc: { en: "Owning a piece of art history.", ko: "미술사의 한 조각을 소유하는 영광.", es: "Poseer una pieza de la historia del arte." },
  purchasingPowerTitle: { en: "Wait, is this how you wanted to spend {amount}?", ko: "잠깐, 정말 {amount}을 이렇게 쓰고 싶으신가요?", es: "Espera, ¿realmente quieres gastar {amount} así?" },
  viewAllComparisons: { en: "View All Comparisons", ko: "모든 비교 보기", es: "Ver Todas las Comparaciones" },

  // ─── Odds Breakdown ───
  back: { en: 'Back', ko: '뒤로', es: 'Atrás' },
  knowYourOdds: { en: 'Know Your Odds 🎲', ko: '확률을 알아보자 🎲', es: 'Conoce Tus Probabilidades 🎲' },
  oddsSubtitle: { en: 'Every tier, every prize, every absurd comparison — from the official {game} odds chart.', ko: '모든 등급, 모든 상금, 모든 황당한 비교 — {game} 공식 확률표.', es: 'Cada nivel, cada premio, cada comparación absurda — de la tabla oficial de {game}.' },
  ticketPrice: { en: 'Ticket Price', ko: '티켓 가격', es: 'Precio del Boleto' },
  waysToWin: { en: 'Ways to Win', ko: '당첨 방법', es: 'Formas de Ganar' },
  plusJackpot: { en: '(+ Jackpot)', ko: '(+ 잭팟)', es: '(+ Jackpot)' },
  anyPrizeOdds: { en: 'Any Prize Odds', ko: '아무 상금 확률', es: 'Cualquier Premio' },
  whiteBall: { en: 'White Ball', ko: '흰 공', es: 'Bola Blanca' },
  megaBall: { en: 'Mega Ball', ko: 'Mega Ball', es: 'Mega Ball' },
  powerballBall: { en: 'Powerball', ko: 'Powerball', es: 'Powerball' },
  tapToReveal: { en: 'Tap a row to reveal', ko: '터치해서 확인하기', es: 'Toca para revelar' },
  loadingIllustration: { en: 'Loading illustration...', ko: '일러스트 로딩 중...', es: 'Cargando illustration...' },
  nonJackpotTiers: { en: 'Those are the 8 non-jackpot tiers. But the big one?', ko: '여기까지가 8개 꽝/소액 상금. 그럼 진짜 잭팟은?', es: 'Esos son los 8 niveles sin jackpot. ¿Pero el grande?' },
  readyToSee: { en: 'Ready to See Your {gold}Jackpot{/gold} Odds?', ko: '{gold}잭팟{/gold} 확률 맞을 준비 되셨나요?', es: '¿Listo para Ver tus Probabilidades de {gold}Jackpot{/gold}?' },
  theOneEveryone: { en: 'The one everyone dreams about — 1 in {odds}.', ko: '모두가 꿈꾸는 바로 그것 — {odds}분의 1.', es: 'El que todos sueñan — 1 en {odds}.' },
  checkMyJackpotOdds: { en: '🎰 Check My Jackpot Odds', ko: '🎰 내 잭팟 확률 계산하기', es: '🎰 Ver Mis Probabilidades de Jackpot' },
  oddsSourced: { en: 'Odds data sourced from official', ko: '확률 데이터 출처: 공식', es: 'Datos de probabilidades de la fuente oficial' },
  prizeCharts: { en: 'prize charts.', ko: '상금 차트.', es: 'tablas de premios.' },
  oddsFooter: { en: 'Lottery Odds Visualizer — See your real chances of winning the lottery jackpot.', ko: '로또 확률 시각화 — 로또 잭팟 당첨의 실제 확률을 확인하세요.', es: 'Visualizador de Probabilidades de Lotería — Mira tus probabilidades reales de ganar el jackpot.' },

  // Difficulty Labels
  prettyDoable: { en: 'Pretty Doable', ko: '솔직히 해볼 만함', es: 'Bastante Posible' },
  longShot: { en: 'Long Shot', ko: '가망 없음', es: 'Tiro Largo' },
  dreamBig: { en: 'Dream Big', ko: '꿈은 크게', es: 'Sueña en Grande' },
  nearMiracle: { en: 'Near Miracle', ko: '기적 그 자체', es: 'Casi un Milagro' },
  basicallyImpossible: { en: 'Basically Impossible', ko: '다시 태어나는 게 빠름', es: 'Básicamente Imposible' },

  // ─── Dynamic Comparisons ───
  easierThanLottery: { en: "It is {multiplier}x times easier to {fact}.", ko: "{fact} 확률이 {multiplier}배 더 높습니다.", es: "Es {multiplier}x veces más fácil {fact}." },
  moreLikelyThanFact: { en: "You are {multiplier}x times more likely to win this than {fact}.", ko: "잭팟 당첨 확률이 {fact} 확률보다 {multiplier}배 더 높습니다.", es: "Eres {multiplier}x veces más probable de ganar esto que {fact}." },
  
  // Ultimate Comparison Logic templates
  yourOddsAre: { en: "Your odds are 1 / {odds}.", ko: "당신의 확률은 1 / {odds} 입니다.", es: "Tus probabilidades son 1 / {odds}." },
  lowProbMessage: { 
    en: "You are {multiplier}x more likely to {fact}.", 
    ko: "{fact} 확률이 {multiplier}배 더 높습니다.", 
    es: "Eres {multiplier}x más probable {fact}." 
  },
  highProbMessage: { 
    en: "Even with {count} tickets, your {winProb}% chance is still a gamble compared to {fact}.", 
    ko: "티켓을 {count}장이나 샀지만, {winProb}%의 확률은 {fact}에 비하면 여전히 도박일 뿐입니다.", 
    es: "Incluso con {count} boletos, tu {winProb}% de probabilidad sigue siendo una apuesta comparado con {fact}." 
  },
  sourceLabel: { en: "Source: {source}", ko: "출처: {source}", es: "Fuente: {source}" },
  about1in: { en: "(About 1 in {exact})", ko: "(약 {exact}분의 1)", es: "(Aproximadamente 1 entre {exact})" },
  factProb: { en: "Fact Chance: 1 in {odds}", ko: "비교 확률: 1/{odds}", es: "Probabilidad del Facto: 1 en {odds}" },
  yourProb: { en: "Your Chance: 1 in {odds}", ko: "내 확률: 1/{odds}", es: "Tu Probabilidad: 1 en {odds}" },

  factPlane: { en: "survive a plane crash", ko: "비행기 사고에서 살아남는 것", es: "sobrevivir a un accidente de avión" },
  factLightning: { en: "be struck by lightning", ko: "벼락을 맞는 것", es: "ser alcanzado por un rayo" },
  factLightningYear: { en: "be struck by lightning in a single year", ko: "1년 안에 벼락을 맞는 것", es: "ser alcanzado por un rayo en un solo año" },
  factDogBite: { en: "die from a dog bite fatality", ko: "개에게 물려 사망하는 것", es: "morir por una mordedura de perro" },
  factAsteroid: { en: "die from a local asteroid impact", ko: "길 가다 소행성 맞고 죽는 것", es: "morir por el impacto de un asteroide local" },
  comparisonVending: { en: "be crushed to death by a tipping vending machine", ko: "자판기에 깔려 죽는 것", es: "ser aplastado por una máquina expendedora" },
  factAntarctica: { en: "be lost in Antarctica", ko: "남극에서 길을 잃는 것", es: "perderse en la Antártida" },
  factFallingBed: { en: "die from falling out of bed", ko: "침대에서 떨어져 사망하는 것", es: "morir al caerse de la cama" },
  factBowling300: { en: "bowl a perfect 300 game as an amateur", ko: "아마추어가 볼링 퍼펙트 게임(300점)을 기록하는 것", es: "hacer un juego perfecto de 300 en bolos como aficionado" },
  factOlympicGold: { en: "win an Olympic Gold Medal", ko: "올림픽 금메달을 따는 것", es: "ganar una medalla de oro olímpica" },
  factQuadruplets: { en: "be a natural birth of quadruplets", ko: "자연 임신으로 네쌍둥이가 태어나는 것", es: "ser un nacimiento natural de cuatrillizos" },
  factHoleInOnePar4: { en: "hit a hole-in-one on a Par 4", ko: "파4 홀에서 홀인원을 기록하는 것", es: "hacer un hoyo en uno en un Par 4" },
  factChessGM: { en: "become a Chess Grandmaster", ko: "체스 그랜드마스터가 되는 것", es: "convertirse en Gran Maestro de ajedrez" },
  factVenomousSnake: { en: "be bitten by a venomous snake in the US", ko: "미국에서 독사에 물리는 것", es: "ser mordido por una serpiente venenosa en EE. UU." },
  factRoyalFlush: { en: "get a Royal Flush in poker", ko: "포커에서 로열 플러시를 잡는 것", es: "obtener una escalera real en el póquer" },
  factHoleInOne: { en: "hit a hole-in-one", ko: "홀인원을 기록하는 것", es: "hacer un hoyo en uno" },
  factEverest: { en: "not survive climbing Mt. Everest", ko: "에베레스트 등반 중 사망하는 것", es: "morir escalando el monte Everest" },
  factBee: { en: "die from a bee sting", ko: "벌에 쏘여 사망하는 것", es: "morir por una picadura de abeja" },
  factShark: { en: "be attacked by a shark", ko: "상어에게 공격받는 것", es: "ser atacado por un tiburón" },
  factPearl: { en: "find a pearl in an oyster", ko: "굴에서 진주를 발견하는 것", es: "encontrar una perla en una ostra" },
  factOlympic: { en: "win an Olympic gold medal", ko: "올림픽 금메달을 따는 것", es: "ganar una medalla de oro olímpica" },
  comparisonCoin: { en: "flip a coin and land Heads 28 times in a row", ko: "동전을 던져 28번 연속 앞면이 나오는 것", es: "lanzar una moneda y obtener cara 28 veces seguidas" },
  factMonkey: { en: "witness a monkey typing Shakespeare", ko: "원숭이가 셰익스피어를 타이핑하는 것을 보는 것", es: "ver a un mono escribiendo a Shakespeare" },
  factBathtub: { en: "die from slipping in a bathtub", ko: "욕조에서 미끄러져 사망하는 것", es: "morir al resbalar en una bañera" },

  // High Prob Facts
  factSP500: { en: "investing in the S&P 500 for the long term", ko: "S&P 500에 장기 투자하는 것", es: "invertir en el S&P 500 a largo plazo" },
  factMasters: { en: "earning a Master's degree", ko: "석사 학위를 취득하는 것", es: "obtener una maestría" },
  factHealthy: { en: "improving your life through one healthy habit", ko: "하나의 건강한 습관으로 삶을 개선하는 것", es: "mejorar tu vida a través de un hábito saludable" },
  comparisonPlane: { en: "die in a commercial airplane crash", ko: "여객기 추락 사고로 사망하는 것", es: "morir en un accidente de avión comercial" },
  comparisonShark: { en: "die from a shark attack", ko: "바다에서 상어한테 물려 죽는 것", es: "morir por un ataque de tiburón" },
  comparisonBathtub: { en: "slip in your bathtub and die", ko: "집 화장실 욕조에서 미끄러져 사망하는 것", es: "resbalar en tu bañera y morir" },
  comparisonPoker: { en: "be dealt a perfect Royal Flush on the first five cards", ko: "포커 첫 패에 로열 플러시가 꽂히는 것", es: "recibir una Escalera Real en las primeras cinco cartas" },
  comparisonLightning: { en: "be struck by lightning", ko: "맨몸으로 벼락을 맞는 것", es: "ser alcanzado por un rayo" },
  comparisonGolf: { en: "hit a hole-in-one on your very first time ever playing golf", ko: "머리 올리러 간 첫 골프에서 홀인원 치는 것", es: "hacer un hoyo en uno en tu primera vez jugando al golf" },

  // Title keys (Keep these as they are used in VISUALIZATIONS)
  factCoinTitle: { en: 'Infinite Coin Flips', ko: '무한 동전 굴리기', es: 'Lanzamiento Infinito' },
  factLightningTitle: { en: '19,000 Lightning Strikes', ko: '19,000번의 벼락', es: '19,000 Rayos' },
  factSharkTitle: { en: 'The Shark Attack', ko: '죠스의 습격', es: 'El Ataque de Tiburón' },
  factVendingTitle: { en: 'Vending Machine Fatality', ko: '자판기 압사 사고', es: 'Fatalidad de Máquina Expendedora' },
  factAsteroidTitle: { en: 'The Asteroid Strike', ko: '소행성 직격탄', es: 'El Impacto del Asteroide' },
  factGolfTitle: { en: 'First-Swing Hole-in-One', ko: '첫 스윙에 홀인원', es: 'Hoyo en Uno al Primer Intento' },
  factPokerTitle: { en: 'First-Hand Royal Flush', ko: '첫 패에 로열 플러시', es: 'Escalera Real a la Primera' },
  factQuadrupletsTitle: { en: 'Identical Quadruplets', ko: '일란성 네 쌍둥이', es: 'Cuatrillizos Idénticos' },
  factPlaneTitle: { en: 'Commercial Plane Crash', ko: '여객기 추락 사고', es: 'Accidente de Avión' },
  factBathtubTitle: { en: 'Bathtub Safety Hazard', ko: '욕조 미끄럼 사고', es: 'Peligro en la Bañera' },

  vizDelusionalTitle: { en: 'The Beautiful Delusional Optimist', ko: '아름다운 망상적 낙관주의자', es: 'El Hermoso Optimista Delirante' },
  vizDelusionalDesc: { en: "You know what? At this point, you might actually win. Your odds are so good that the universe is basically begging you to cash in. You absolute legend. LET'S GO. 🎉🎰💰", ko: "이 정도면 진짜 당첨될 수도 있겠네요. 우주가 제발 당첨금 좀 가져가라고 빌고 있는 수준입니다. 전설의 시작입니다. 가보자고! 🎉🎰💰", es: "¿Sabes qué? A este punto, realmente podrías ganar. Tus probabilidades son tan buenas que el universo te está rogando que cobres. Leyenda absoluta. ¡VAMOS! 🎉🎰💰" },

  // New Memes
  vizAlienCowTitle: { en: 'The Confused Cow Abduction', ko: '혼란스러운 소 납치 사건', es: 'La Abducción de la Vaca Confundida' },
  vizAlienCowDesc: { en: "Your odds are like an alien spacecraft traveling millions of lightyears just to abduct one very specific, very confused cow from a random farm.", ko: "외계 우주선이 수백만 광년을 날아와 무작위 농장에서 아주 구체적이고 몹시 당황한 소 한 마리를 정확히 납치해갈 확률과 같습니다.", es: "Tus probabilidades son como una nave alienígena viajando millones de años luz solo para abducir a una vaca muy específica y muy confundida." },
  vizPrinterTitle: { en: 'The Holy Printer Miracle', ko: '성스러운 프린터의 기적', es: 'El Milagro de la Impresora Santa' },
  vizPrinterDesc: { en: "Your odds are like an office printer successfully printing a 100-page document perfectly on the first try without jamming, screeching, or asking for cyan ink. Angels are singing.", ko: "사무실 프린터가 단 한 번의 종이 걸림이나 청록색 잉크 교체 요구 없이 100쪽짜리 문서를 완벽하게 인쇄할 확률입니다. 기적이네요.", es: "Tus probabilidades son como una impresora de oficina imprimiendo un documento de 100 páginas perfectamente al primer intento sin atascarse." },
  vizEarbudsTitle: { en: 'The Sacred Untangled Earbuds', ko: '단선 없는 신성한 이어폰', es: 'Los Sagrados Auriculares Desenredados' },
  vizEarbudsDesc: { en: "Your odds are like pulling wired earbuds out of your pocket and finding them perfectly untangled, glowing with a holy aura. It defies the laws of physics.", ko: "주머니에서 유선 이어폰을 꺼냈는데 단 한 군데도 엉키지 않은 채 신성한 빛을 내뿜을 확률입니다. 물리학 법칙 파괴자네요.", es: "Tus probabilidades son como sacar audífonos con cable de tu bolsillo y encontrarlos perfectamente desenredados." },
  vizUsbTitle: { en: 'The Perfect USB Insertion', ko: '완벽한 USB 삽입', es: 'La Inserción Perfecta del USB' },
  vizUsbDesc: { en: "Your odds are like plugging in a USB flash drive correctly on the very first try, in complete darkness, guided only by destiny.", ko: "완전한 어둠 속에서 오로지 운명에만 의지하여 USB 메모리를 단 한 번의 시도만에 정확한 방향으로 꽂아 넣을 확률입니다.", es: "Tus probabilidades son como conectar un USB correctamente al primer intento, en completa oscuridad." },

  // Life Miracles
  factVendingDoubleTitle: { en: 'The Double Vending Blessing', ko: '자판기 1+1 축복', es: 'La Bendición de la Máquina Doble' },
  comparisonVendingDouble: { en: 'getting 2 drinks for the price of 1 from a vending machine', ko: '자판기에서 음료수 한 개 값으로 두 개가 동시에 떨어질 확률', es: 'obtener 2 bebidas por el precio de 1 en una máquina' },

  factParkingTitle: { en: 'The Perfect Parallel Park', ko: '완벽한 쾌감의 평행 주차', es: 'El Estacionamiento en Paralelo Perfecto' },
  comparisonParking: { en: 'sliding into a tight parallel spot in one go without looking', ko: '백미러 안 보고 좁은 틈새에 한 번의 핸들 꺾기로 평행 주차를 성공할 확률', es: 'estacionar en paralelo a la primera en un sitio estrecho' },

  factAvocadoTitle: { en: 'The Miracle Avocado', ko: '기적의 아보카도', es: 'El Aguacate Milagroso' },
  comparisonAvocado: { en: 'opening an avocado to find zero brown spots and a tiny pit', ko: '아보카도를 깠는데 갈색 반점 하나 없고 씨앗도 엄청 작을 확률', es: 'abrir un aguacate y encontrarlo perfecto y con hueso pequeño' },

  factPearlTitle: { en: 'The Oyster Pearl', ko: '진주가 든 굴', es: 'La Perla de Ostra' },
  comparisonPearl: { en: 'finding a natural pearl in an edible oyster while dining', ko: '식당에서 굴 먹다가 천연 진주 씹을 확률', es: 'encontrar una perla natural en una ostra comestible' },

  factCloverTitle: { en: 'The Four-Leaf Clover', ko: '네잎클로버 겟', es: 'El Trébol de Cuatro Hojas' },
  comparisonClover: { en: 'finding a four-leaf clover on your very first look', ko: '풀밭 보자마자 1초 만에 네잎클로버 찾을 확률', es: 'encontrar un trébol de cuatro hojas a la primera' },

  factBowlingTitle: { en: 'The Perfect Bowling Game', ko: '볼링 퍼펙트 게임', es: 'El Juego Perfecto de Bolos' },
  comparisonBowling: { en: 'bowling a perfect 300 game on your first attempt', ko: '머리털 나고 처음 친 볼링에서 300점 퍼펙트 칠 확률', es: 'hacer un juego perfecto de 300 bolos a la primera' },

  factMonkeyTitle: { en: 'The Infinite Monkey', ko: '무한 원숭이의 명작', es: 'El Mono Infinito' },
  comparisonMonkey: { en: 'a monkey typing out a Shakespearean sonnet by mistake', ko: '원숭이가 키보드 샷건 치다가 실수로 셰익스피어 소설 완성할 확률', es: 'un mono escribiendo un soneto de Shakespeare por error' },

  // Map existing hidden memes to storytelling comparison keys
  comparisonAlienCow: { en: 'a confused cow getting abducted by an alien spacecraft', ko: '어리둥절한 소가 외계인에게 납치당할 확률', es: 'una vaca confundida siendo abducida por una nave' },
  comparisonPrinter: { en: 'printing 100 pages perfectly without a single paper jam', ko: '프린터가 100쪽을 종이 걸림 없이 한 번에 완벽 출력할 확률', es: 'imprimir 100 páginas sin que se atasque el papel' },
  comparisonEarbuds: { en: 'pulling wired earbuds from your pocket and finding them untangled', ko: '주머니에서 꺼낸 이어폰이 마법처럼 꼬여있지 않을 확률', es: 'sacar audífonos con cable del bolsillo y que no estén enredados' },
  comparisonUsb: { en: 'inserting a USB drive correctly on the first try in pitch darkness', ko: '어둠 속에서 USB를 한 방에 제대로 꽂을 확률', es: 'insertar un USB correctamente al primer intento en la oscuridad' },

  // ─── Fool Meme Tiers (by $ lost) ───
  vizFool10kTitle: { en: '1 + 1 = 67', ko: '1 + 1 = 67', es: '1 + 1 = 67' },
  vizFool10kDesc: { en: "You lit $10,000+ on fire. Your dog is judging you.", ko: "천만 원을 불태웠습니다. 댕댕이도 한심하게 쳐다보네요.", es: "Quemaste más de $10,000. Tu perro te juzga." },
  vizFool100kTitle: { en: 'Why Did You Do This', ko: '왜 그랬어...', es: '¿Por Qué Hiciste Esto?' },
  vizFool100kDesc: { en: "Over $100k up in smoke. You bought HOPE. Beautiful, statistically irrelevant hope.", ko: "1억 증발. 희망을 사셨군요. 통계적으로 전혀 쓸모없는 그 아름다운 희망을요.", es: "Más de $100k se esfumaron. Compraste ESPERANZA. Hermosa y estúpida esperanza." },
  vizFool1mTitle: { en: "World's Biggest Fool", ko: '올해의 글로벌 호구상', es: 'El Tonto del Mundo' },
  vizFool1mDesc: { en: "Over $1M spent. The crowd gives a standing ovation for your financial catastrophe.", ko: "10억 증발. 모두가 당신의 재정적 대참사에 기립 박수를 보냅니다.", es: "Gastaste más de $1M. La multitud ovaciona tu catástrofe financiera." },

  // ─── Phase 3: Reach 10/10 Features ───
  mmDays: { en: 'Tue & Fri', ko: '화 & 금요일', es: 'mar y vie' },
  pbDays: { en: 'Mon, Wed, Sat', ko: '월, 수, 토요일', es: 'lun, mié, sáb' },
  estWinYear: { en: "The Eternal Wait Simulation", ko: "영겁의 기다림 시뮬레이션", es: "Simulación de la Espera Eterna" },
  currentYear: { en: "Scenario: Playing every single drawing...", ko: "시나리오: 매 회차 단 한 번도 안 거르고 구매 시...", es: "Escenario: Jugando todos los sorteos..." },
  winYearDesc: { en: "If you buy {count} tickets for every drawing ({days}) starting today, you will finally hit the jackpot in the year:", ko: "오늘부터 매 회차({days}) {count}장의 티켓({cost}달러)을 구매한다면, 마침내 1등에 당첨되는 해는:", es: "Si compras {count} boletos (${cost}) en cada sorteo ({days}) a partir de hoy, finalmente ganarás el premio mayor en el año:" },
  winYearInsaneDesc: { en: "{count} tickets per drawing ({days})? You're the lottery's biggest sponsor. You'll likely hit it in:", ko: "매 회차({days}) {count}장이라니... 복권국 VIP 큰손이시군요! 헌납 끝에 당첨될 연도는:", es: "¿{count} boletos por sorteo ({days})? Eres el gran patrocinador. Probablemente ganarás en:" },
  futureCity: { en: "By then, {gens} generations will have passed. Humanity might be a distant memory.", ko: "그때쯤이면 무려 {gens}세대가 교체되었습니다. 인류는 멸망했을지도 모릅니다.", es: "Para entonces, habrán pasado {gens} generaciones. La humanidad podría ser un recuerdo lejano." },
  impactImmediate: { en: "Congratulations! You won so fast that you still have a phone to check this app.", ko: "축하합니다! 빛의 속도로 당첨되셨네요. 아직 폰 만질 기력이 남아있을 때라 다행입니다.", es: "¡Felicidades! Ganaste tan rápido que todavía tienes un teléfono para revisar esto." },
  lossBadROI: { en: "Over the course of {years} years You spent ${loss} to win the lottery jackpot. Great!", ko: "{years}년 동안 당신은 복권 잭팟에 당첨되기 위해 {loss}달러를 썼습니다. 대단해요!", es: "A lo largo de {years} años, gastaste ${loss} para ganar el premio mayor de la lotería. ¡Genial!" },

  // Opportunity Cost (Monetization/Viral)
  oppCostTitle: { en: "The Multi-Million Dollar Mistake", ko: "수십억 달러짜리 인생의 실수", es: "El Error de los Millones de Dólares" },
  oppCostDesc: { en: "If you invested this ${amount} weekly in the S&P 500 (10% avg. return), by the year {year} you would have:", ko: "만약 이 {amount}달러를 매주 S&P 500(연평균 10% 수익률)에 묻어뒀다면, {year}년엔 통장에 이만큼 찍혔을 겁니다:", es: "Si hubieras invertido estos {amount} semanalmente en el S&P 500 (10% de retorno prom.), para el año {year} tendrías:" },
  oppCostResult: { en: "${wealth} — You'd be a literal billionaire.", ko: "{wealth}달러 — 당신은 진짜 억만장자가 되었을 겁니다.", es: "${wealth} — Serías un literal multimillonario." },
  wealthVsWaste: { en: "Wealth vs. Waste", ko: "부의 축적 vs 탕진잼", es: "Riqueza vs. Desperdicio" },

  // Reality Check Ticker
  realityCheckTitle: { en: 'REALITY CHECK:', ko: '팩트 체크:', es: 'REALIDAD:' },
  legendQuote1: { en: 'Oscar Wilde: "When I was young I thought money was everything; now that I\'m old I know it is."', ko: '오스카 와일드: "젊었을 때는 돈이 전부라고 생각했다. 이제 나이가 드니 그게 사실임을 알겠다."', es: 'Oscar Wilde: "Cuando era joven pensaba que el dinero era todo; ahora que soy viejo sé que lo es."' },
  legendQuote2: { en: 'Mark Twain: "October is a dangerous month to speculate. The other dangerous months are the other 11."', ko: '마크 트웨인: "10월은 투기하기에 위험한 달이다. 다른 위험한 달로는 나머지 11개월이 있다."', es: 'Mark Twain: "Octubre es un mes peligroso para especular. Los otros meses peligrosos son los otros 11."' },
  legendQuote3: { en: 'W.C. Fields: "A rich man is just a poor man with money."', ko: 'W.C. 필즈: "부자란 단지 돈이 있는 가난한 사람일 뿐이다."', es: 'W.C. Fields: "Un hombre rico es solo un hombre pobre con dinero."' },
  legendQuote4: { en: 'Henny Youngman: "What\'s the use of happiness? It can\'t buy you money."', ko: '헤니 영먼: "행복이 무슨 소용인가? 돈을 살 수도 없는데."', es: 'Henny Youngman: "¿De qué sirve la felicidad? No puede comprarte dinero."' },
  legendQuote5: { en: 'Robert Benchley: "The fastest way to double your money is to fold it and put it in your pocket."', ko: '로버트 벤칠리: "돈을 두 배로 불리는 가장 빠른 방법은 반으로 접어 주머니에 넣는 것이다."', es: 'Robert Benchley: "La forma más rápida de duplicar tu dinero es doblarlo y guardarlo en el bolsillo."' },
  legendQuote6: { en: 'Spike Milligan: "All I ask is a chance to prove that money can\'t make me happy."', ko: '스파이크 밀리건: "내가 바라는 건 돈이 나를 행복하게 만들 수 없다는 걸 증명할 기회뿐이다."', es: 'Spike Milligan: "Todo lo que pido es una oportunidad para demostrar que el dinero no puede hacerme feliz."' },
  legendQuote7: { en: 'Gertrude Stein: "Whoever said money can\'t buy happiness just didn\'t know where to shop."', ko: '거트루드 스타인: "돈으로 행복을 살 수 없다고 말한 사람은 어디서 쇼핑해야 하는지 모르는 사람이다."', es: 'Gertrude Stein: "Quien diga que el dinero no puede comprar la felicidad simplemente no sabía dónde comprar."' },
  legendQuote8: { en: 'Kin Hubbard: "It\'s hard to tell what brings happiness; both poverty and wealth have failed."', ko: '킨 허버드: "무엇이 행복을 가져다 주는지 알기 어렵다. 빈곤과 부유함 모두 실패했기 때문이다."', es: 'Kin Hubbard: "Es difícil decir qué trae la felicidad; tanto la pobreza como la riqueza han fallado."' },
  legendQuote9: { en: 'Groucho Marx: "Money can\'t buy happiness, but it lets you choose your own form of misery."', ko: '그루초 막스: "돈으로 행복을 살 수는 없지만, 당신이 원하는 형태의 불행을 선택하게 해준다."', es: 'Groucho Marx: "El dinero no puede comprar la felicidad, pero te permite elegir tu propia forma de miseria."' },
  legendQuote10: { en: 'Fran Lebowitz: "Success didn\'t spoil me, I\'ve always been insufferable."', ko: '프란 리보위츠: "성공이 나를 망친 게 아니다. 난 언제나 참을 수 없는 사람이었다."', es: 'Fran Lebowitz: "El éxito no me arruinó, siempre he sido insufrible."' },
  legendQuote11: { en: 'Benjamin Franklin: "An investment in knowledge pays the best interest."', ko: '벤자민 프랭클린: "지식에 대한 투자가 가장 높은 이자를 지급한다."', es: 'Benjamin Franklin: "Una inversión en conocimiento paga el mejor interés."' },
  legendQuote12: { en: 'George Soros: "It\'s how much you make when you\'re right and how much you lose when you\'re wrong."', ko: '조지 소로스: "중요한 건 당신이 옳았을 때 얼마나 벌고, 틀렸을 때 얼마나 잃느냐다."', es: 'George Soros: "Es cuánto ganas cuando tienes razón y cuánto pierdes cuando te equivocas."' },
  legendQuote13: { en: 'John Templeton: "The only way to avoid mistakes is to never invest, which is the biggest mistake."', ko: '존 템플턴: "실수를 피하는 유일한 방법은 절대 투자하지 않는 것인데, 그것이야말로 가장 큰 실수다."', es: 'John Templeton: "La única forma de evitar errores es nunca invertir, lo cual es el mayor error."' },
  legendQuote14: { en: 'Dave Ramsey: "Financial peace is learning to live on less than you make."', ko: '데이브 램지: "경제적 자유는 당신이 버는 것보다 적게 쓰는 법을 배우는 것이다."', es: 'Dave Ramsey: "La paz financiera es aprender a vivir con menos de lo que ganas."' },
  legendQuote15: { en: 'Jim Rohn: "Formal education makes you a living; self-education makes you a fortune."', ko: '짐 론: "정규 교육은 생계를 보장하지만, 독학은 부를 가져다준다."', es: 'Jim Rohn: "La educación formal te da para vivir; la autoeducación te da una fortuna."' },
  legendQuote16: { en: 'Paul Samuelson: "If you want excitement, take your money and go to Las Vegas."', ko: '폴 사무엘슨: "흥분을 원한다면 돈을 들고 라스베이거스로 가라."', es: 'Paul Samuelson: "Si quieres emoción, toma tu dinero y ve a Las Vegas."' },
  legendQuote17: { en: 'Thomas Jefferson: "Never spend your money before you have it."', ko: '토마스 제퍼슨: "돈을 벌기도 전에 쓰지 마라."', es: 'Thomas Jefferson: "Nunca gastes tu dinero antes de tenerlo."' },
  legendQuote18: { en: 'Will Rogers: "We buy things we don\'t want, to impress people we don\'t like."', ko: '윌 로저스: "우리는 좋아하지 않는 사람들에게 잘 보이기 위해 원하지 않는 물건을 산다."', es: 'Will Rogers: "Compramos cosas que no queremos, para impresionar a personas que no nos gustan."' },
  legendQuote19: { en: 'Robert Arnott: "In investing, what is comfortable is rarely profitable."', ko: '로버트 아놀트: "투자에서 편안한 것은 좀처럼 수익이 나지 않는다."', es: 'Robert Arnott: "En las inversiones, lo que es cómodo rara vez es rentable."' },
  legendQuote20: { en: 'Andrew Carnegie: "The first man gets the oyster, the second man gets the shell."', ko: '앤드류 카네기: "첫 번째 사람이 굴을 얻고, 두 번째 사람은 껍데기를 얻는다."', es: 'Andrew Carnegie: "El primer hombre se lleva la ostra, el segundo se lleva la concha."' },
  // Tax Blog
  taxBlogTitle: { en: "Lottery Taxes: Who Takes the Biggest Bite?", ko: "복권 세금: 누가 당신의 돈을 가장 많이 가져갈까?", es: "Impuestos de Lotería: ¿Quién se lleva la tajada más grande?" },
  taxBlogIntro: { 
    en: "Winning the jackpot is just the beginning. Before you buy that island, Uncle Sam and your state governor want their cut. Here is how much you actually lose depending on where you live.", 
    ko: "잭팟 당첨은 시작일 뿐입니다. 섬을 사기 전에 연방 정부와 주지사가 각자의 몫을 챙겨갑니다. 거주지에 따라 실제로 얼마나 떼이는지 확인해보세요.",
    es: "Ganar el premio mayor es solo el comienzo. Antes de comprar esa isla, el Tío Sam y el gobernador de su estado quieren su parte. Aquí es cuánto pierde realmente según el lugar donde viva."
  },
  taxBlog0PercentHeader: { en: "The 0% Tax Club", ko: "세금 0% 클럽", es: "El Club del 0% de Impuestos" },
  taxBlog0PercentDesc: { 
    en: "These lucky states do not tax lottery winnings at all. In these states, you only worry about the federal 37% tax.", 
    ko: "이 행운의 주들은 복권 당첨금에 대해 주 세금을 전혀 징수하지 않습니다. 여기서는 연방세 37%만 걱정하면 됩니다.",
    es: "Estos estados afortunados no gravan en absoluto las ganancias de la lotería. En estos estados, solo te preocupas por el impuesto federal del 37%."
  },
  taxBlogRankingHeader: { en: "State Tax Rankings (Highest to Lowest)", ko: "주별 세금 순위 (높은 순)", es: "Clasificación de Impuestos Estatales (Mayor a Menor)" },
  taxBlogNYCDisclaimer: { 
    en: "*New York City and Yonkers residents pay additional local taxes not shown here. (NYC 3.876%, Yonkers 1.875%)", 
    ko: "*뉴욕시와 용커스 거주자는 여기에 표시되지 않은 추가 지방세를 납부합니다. (뉴욕시 3.876%, 용커스 1.875%)",
    es: "*Los residentes de la ciudad de Nueva York y Yonkers pagan impuestos locales adicionales que no se muestran aquí."
  },
  taxBlogMissingNote: {
    en: "Wait, where are the others? Alabama, Alaska, Hawaii, Nevada, and Utah do not have state lotteries. This list includes 45 lottery-participating states, DC, and NYC (listed separately due to local taxes).",
    ko: "어라, 다른 주들은 어디 갔나요? 앨라배마, 알래스카, 하와이, 네바다, 유타주는 주 복권이 없습니다. 이 리스트는 복권이 있는 45개 주와 워싱턴 DC, 그리고 지방세 때문에 별도로 표기된 뉴욕시를 포함한 47개 항목입니다.",
    es: "Alabama, Alaska, Hawaii, Nevada y Utah no tienen loterías estatales."
  },
  taxPageCTABtn: {
    en: "Compare Tax Rates for All 50 States 🇺🇸",
    ko: "미국 전역 50개주 세금 비교하기 🇺🇸"
  },
  taxPageTitle: {
    en: "State Lottery Tax Rates 2026 | WhatsChance",
    ko: "2026 미국 주별 복권 세금 현황 | WhatsChance"
  },
  taxPageDescription: {
    en: "Find out exactly how much each US state takes from your lottery jackpot. Compare tax-free states vs. the highest tax states.",
    ko: "미국 각 주가 복권 잭팟에서 정확히 얼마를 떼어가는지 확인해보세요. 면세 주와 최고 세율 주를 비교해드립니다."
  },
  backToCalculator: {
    en: "Back to Calculator",
    ko: "계산기로 돌아가기"
  },
  taxShareText: {
    en: "Wait, they take HOW MUCH in taxes? 💸 See exactly how much your state steals from a lottery jackpot. Compare all 50 states on WhatsChance!",
    ko: "내 당첨금에서 세금을 이만큼이나 떼간다고? 💸 50개 주 복권 세금 랭킹 확인하기. 세금 없는 주는 어디일까?",
    es: "¿Esperas ganar el jackpot? Mira cuánto te quitará tu estado en impuestos. 💸 ¡Compara los 50 estados en WhatsChance!"
  },

  delusionElon: { en: 'WARREN BUFFETT: "RULE NO. 1: NEVER LOSE MONEY. RULE NO. 2: NEVER FORGET RULE NO. 1."', ko: '워런 버핏: "제1원칙: 절대 돈을 잃지 마라. 제2원칙: 제1원칙을 절대 잊지 마라."' },
  
  // Legal
  privacyPolicy: { en: "Privacy Policy", ko: "개인정보 처리방침" },
  termsOfService: { en: "Terms of Service", ko: "이용약관" },
  tosContent: {
    en: "WhatsChance is a mathematical simulation and educational tool. It is NOT a real lottery, does NOT accept real money, and offers NO real prizes. All results are generated for entertainment and educational purposes only.",
    ko: "WhatsChance는 수학적 시뮬레이션 및 교육용 도구입니다. 실제 복권이 아니며, 실제 돈을 받지 않고, 실제 경품을 제공하지 않습니다. 모든 결과는 오락 및 교육 목적으로만 생성됩니다."
  },
  privacyContent: {
    en: "We use third-party cookies (like Google AdSense and Google Analytics) to serve personalized ads and track usage. By using this site, you agree to our use of these tracking technologies.",
    ko: "당사는 개인 맞춤형 광고를 제공하고 사용량을 추적하기 위해 제3자 쿠키(Google AdSense 및 Google Analytics 등)를 사용합니다. 이 사이트를 사용함으로써 귀하는 이러한 추적 기술의 사용에 동의하게 됩니다."
  },
  close: { en: "Close", ko: "닫기" },
  delusionTrump: { en: 'ROBERT KIYOSAKI: "IT’S NOT HOW MUCH MONEY YOU MAKE. IT’S HOW MUCH MONEY YOU KEEP."', ko: '로버트 기요사키: "중요한 건 얼마나 버느냐가 아니라, 얼마나 지키느냐다."' },
  delusionJordan: { en: 'GEORGE CARLIN: "IT\'S CALLED THE AMERICAN DREAM BECAUSE YOU HAVE TO BE ASLEEP TO BELIEVE IT."', ko: '조지 칼린: "아메리칸 드림이라 부르는 이유는, 자고 있어야만 믿을 수 있기 때문이다."' },
  delusionZuck: { en: 'MARK TWAIN: "THE BEST WAY TO DOUBLE YOUR MONEY IS TO FOLD IT OVER AND PUT IT BACK IN YOUR POCKET."', ko: '마크 트웨인: "돈을 두 배로 불리는 가장 완벽한 방법은, 반으로 접어 다시 주머니에 넣는 것이다."' },
  delusionCelebrityFail: { en: 'BILL GATES: "IF YOU ARE BORN POOR IT\'S NOT YOUR MISTAKE, BUT IF YOU DIE POOR IT\'S YOUR MISTAKE."', ko: '빌 게이츠: "가난하게 태어난 건 네 잘못이 아니지만, 가난하게 죽는 건 네 잘못이다."' },

  // Easter Eggs
  egg777: { en: "Jackpot seeker! 🍀 Too bad math doesn't care about luck.", ko: "행운의 7? 🍀 안타깝게도 수학은 당신의 미신에 관심이 없습니다.", es: "¡Buscador de Jackpot! 🍀 Lástima que a las matemáticas no les importa la suerte." },
  egg666: { en: "Feeling devilish? 😈 Your bank account won't like this.", ko: "악마의 숫자군요? 😈 통장 잔고가 비명을 지릅니다.", es: "¿Sintiéndote diabólico? 😈 A tu cuenta bancaria no le gustará esto." },
  egg42: { en: "The answer to life, the universe, and everything... except this.", ko: "삶, 우주, 그리고 모든 것에 대한 해답... 하지만 이건 아니죠.", es: "La respuesta a la vida, el universo y todo... excepto esto." },
  egg444: { en: "In some cultures, this means death. To your wallet.", ko: "어떤 문화에서 이건 죽음을 의미하죠. 네, 당신 지갑의 죽음이요.", es: "En algunas culturas, esto significa muerte. Para tu billetera." },
  egg999: { en: "Testing the limits of my sanity, are we?", ko: "제 인내심의 한계를 테스트 중이신가요?", es: "¿Estamos probando los límites de mi cordura?" },
  eggSatoshi: { en: "Satoshi Nakamoto is watching your financial ruin.", ko: "사토시 나카모토가 당신의 재정적 몰락을 직관하고 있습니다.", es: "Satoshi Nakamoto está viendo tu ruina financiera." },
  revealBtn: { en: 'CHECK', ko: '확인', es: 'VER' },
  disclaimer: { 
    en: 'Educational simulation only. Not affiliated with any official lottery. If you or someone you know has a gambling problem, call 1-800-GAMBLER.', 
    ko: '본 서비스는 교육 및 재미를 위한 시뮬레이션이며 공식 복권 단체와 무관합니다. 도박 문제로움 도움이 필요하시면 1336으로 전화하세요.', 
    es: 'Solo simulación educativa. No afiliado a ninguna lotería oficial. Si tiene un problema con el juego, llame al 1-800-GAMBLER.' 
  },
  copyrightFooter: { en: '© {year} WhatsChance — Visualizing the Impossible', ko: '© {year} WhatsChance — 불가능을 시각화합니다', es: '© {year} WhatsChance — Visualizando lo Imposible' },
  taxDisclaimer: { en: '*Calculated using average state tax rates and standard deductions.', ko: '*평균 주세 및 표준 공제액을 기준으로 계산되었습니다.', es: '*Calculado usando tasas de impuestos estatales promedio y deducciones estándar.' },
  triviaPageTitle: {
    en: "Lottery Tax Exceptions: Missing States & Local Taxes | WhatsChance",
    ko: "복권 세금 예외 규정: 누락된 주 & 지방세 정보 | WhatsChance",
    es: "Excepciones de Impuestos de Lotería: Estados Faltantes e Impuestos Locales | WhatsChance"
  },
  triviaPageDescription: {
    en: "Discover why some states are missing and why NYC residents pay double taxes. Explore lottery tax exceptions and trivia on WhatsChance.",
    ko: "왜 일부 주가 목록에 없는지, 그리고 왜 뉴욕시 거주자들은 세금을 두 번 내는지 확인해보세요. WhatsChance에서 복권 세금 예외와 상식을 알아보세요.",
    es: "Descubra por qué faltan algunos estados y por qué los residentes de la ciudad de Nueva York pagan impuestos dobles."
  },
  triviaBtnNYC: {
    en: "Why is NYC taxed twice? 🍎",
    ko: "왜 뉴욕시는 세금을 두 번 떼나요? 🍎",
    es: "¿Por qué NYC paga impuestos dos veces? 🍎"
  },
  triviaBtnMissing: {
    en: "Why do 5 states have NO lottery? 🚫",
    ko: "왜 5개 주에는 복권이 없을까요? 🚫",
    es: "¿Por qué 5 estados NO tienen lotería? 🚫"
  },
  backToTaxRankings: {
    en: "Back to Tax Rankings",
    ko: "세금 순위로 돌아가기",
    es: "Volver a la clasificación de impuestos"
  },
  triviaNYCHeader: {
    en: "The Double-Dip: NYC & Yonkers",
    ko: "이중 과세: 뉴욕시 & 용커스",
    es: "El Doble Impuesto: NYC y Yonkers"
  },
  triviaNYCDesc: {
    en: "State tax isn't the end of the story in New York. If you live in NYC, the city takes an additional 3.876% local tax. Live in Yonkers? That's an extra 1.875%. That’s why we list them separately—Uncle Sam and the Mayor both want their cut before you see a dime.",
    ko: "뉴욕주에서는 주 세금이 전부가 아닙니다. 뉴욕시에 거주하면 시에서 3.876%의 추가 지방세를 징수합니다. 용커스에 사시나요? 1.875%가 추가됩니다. 그래서 저희는 이들을 별도로 표기합니다. 연방 정부와 시장 모두 당신이 한 푼이라도 손에 쥐기 전에 각자의 몫을 원하니까요.",
    es: "El impuesto estatal no es el final de la historia en Nueva York. Si vives en NYC, la ciudad cobra un impuesto local adicional del 3.876%. ¿Vives en Yonkers? Eso es un 1.875% adicional. Por eso los enumeramos por separado: el Tío Sam y el Alcalde quieren su parte antes de que veas un centavo."
  },
  triviaMissingHeader: {
    en: "The Missing Five: Why No Lottery?",
    ko: "사라진 5개 주: 왜 복권이 없을까요?",
    es: "Los Cinco Faltantes: ¿Por qué no hay lotería?"
  },
  triviaMissingDesc: {
    en: "You might have noticed 5 states missing from our list. They simply don't play the game:",
    ko: "저희 목록에서 5개 주가 빠진 것을 눈치채셨을 겁니다. 이 주들은 단순히 복권 게임을 하지 않습니다:",
    es: "Es posible que haya notado que faltan 5 estados en nuestra lista. Simplemente no juegan el juego:"
  },
  triviaNevada: {
    en: "Nevada: To protect their massive casino industry.",
    ko: "네바다: 거대한 카지노 산업을 보호하기 위해서입니다.",
    es: "Nevada: Para proteger su enorme industria de casinos."
  },
  triviaUtahHawaii: {
    en: "Utah & Hawaii: Banned for religious and moral reasons.",
    ko: "유타 & 하와이: 종교적 및 도덕적 이유로 금지되었습니다.",
    es: "Utah y Hawái: Prohibido por razones religiosas y morales."
  },
  triviaAlaska: {
    en: "Alaska: Oil revenue keeps the state rich enough without it.",
    ko: "알래스카: 석유 수입 덕분에 복권 없이도 주 재정이 충분히 넉넉합니다.",
    es: "Alaska: Los ingresos del petróleo mantienen al estado lo suficientemente rico sin él."
  },
  triviaAlabama: {
    en: "Alabama: Strong political and religious opposition.",
    ko: "앨라배마: 강력한 정치적, 종교적 반대가 있습니다.",
    es: "Alabama: Fuerte oposición política y religiosa."
  },
  triviaCanTheyPlayHeader: {
    en: "💡 But wait, can they still play?",
    ko: "💡 그런데, 그래도 복권을 살 수 있나요?",
    es: "💡 Pero espera, ¿todavía pueden jugar?"
  },
  triviaCanTheyPlayDesc: {
    en: "Yes! There is no law against winning. When jackpots soar, residents from these states simply take a road trip across state lines. In fact, border-town lottery stores in California (next to Nevada) or Idaho (next to Utah) are historically some of the busiest in the country!",
    ko: "네! 당첨되는 데에는 법적 제한이 없습니다. 잭팟 금액이 치솟으면 이 주들의 거주자들은 단순히 주 경계선을 넘어 원정을 떠납니다. 실제로 네바다 옆의 캘리포니아나 유타 옆의 아이다호 접경 지역 복권 판매점들은 역사적으로 미국에서 가장 붐비는 곳들 중 하나입니다!",
    es: "¡Sí! No hay ninguna ley contra ganar. Cuando los premios mayores se disparan, los residentes de estos estados simplemente hacen un viaje por carretera a través de las fronteras estatales. De hecho, las tiendas de lotería de las ciudades fronterizas en California (junto a Nevada) o Idaho (junto a Utah) son históricamente algunas de las más concurridas del país."
  },
  noLottery: {
    en: "No State Lottery",
    ko: "주 복권 없음",
    es: "Sin Lotería Estatal"
  },
  tax: {
    en: "Tax",
    ko: "세금",
    es: "Impuesto"
  },
  excludingLocal: {
    en: "(excluding local tax)",
    ko: "(현지 세금 별도)",
    es: "(excluyendo impuestos locales)"
  },
  triviaTaxDetailHeader: {
    en: "What about the taxes? 💸",
    ko: "세금은 어떻게 되나요? 💸",
    es: "¿Y qué pasa con los impuestos? 💸"
  },
  triviaTaxDetailDesc1: {
    en: "You can't outsmart the taxman. If you win out of state, the state where you bought the ticket takes their cut first (non-resident tax). Then, your home state might tax it as regular income.",
    ko: "세금 징수원을 속일 수는 없습니다. 타 주에서 당첨될 경우, 복권을 구매한 주에서 먼저 지분(비거주자 세금)을 떼어갑니다. 그 후, 거주 중인 주에서 해당 당첨금을 일반 소득으로 간주하여 추가로 세금을 부과할 수 있습니다.",
    es: "No puedes ser más listo que el cobrador de impuestos. Si ganas fuera de tu estado, el estado donde compraste el boleto se lleva su parte primero (impuesto para no residentes). Luego, tu estado de residencia podría gravarlo como ingreso regular."
  },
  triviaTaxDetailDesc2: {
    en: "The ultimate loophole? A Nevada resident buying a ticket in California. California has a 0% lottery tax, and Nevada has 0% state income tax. The ultimate zero-tax border run!",
    ko: "궁극의 허점은 무엇일까요? 바로 네바다 거주자가 캘리포니아에서 복권을 구매하는 것입니다. 캘리포니아는 복권 세금이 0%이고, 네바다는 주 소득세가 0%입니다. 그야말로 완벽한 '무세금 원정'인 셈이죠!",
    es: "¿La brecha legal definitiva? Un residente de Nevada comprando un boleto en California. California tiene un 0% de impuestos sobre la lotería y Nevada tiene un 0% de impuesto estatal sobre la renta. ¡La carrera fronteriza definitiva sin impuestos!"
  },
  triviaShareText: {
    en: "Did you know some states take a massive cut of your lottery winnings? Check out these insane lottery tax facts!",
    ko: "일부 주에서는 복권 당첨금의 엄청난 액수를 세금으로 떼어간다는 사실, 알고 계셨나요? 놀라운 복권 세금의 진실을 확인해 보세요!",
    es: "¿Sabías que algunos estados se llevan una parte enorme de tus ganancias de lotería? ¡Descubre estos increíbles datos sobre impuestos de lotería!"
  },

  // ─── Lottery Simulator ───
  goToSimulatorBtn: { en: 'Still feel lucky? Try the 1,000x Simulator', ko: '현실 부정하기 (1,000번 자동 시뮬레이터)', es: '¿Aún te sientes con suerte? Prueba el Simulador 1,000x' },
  backToResults: { en: 'Back to Reality', ko: '현실로 돌아가기', es: 'Volver a la Realidad' },
  interactiveLotterySimulation: { en: 'Interactive Lottery Simulation', ko: '인터랙티브 복권 시뮬레이터', es: 'Simulación Interactiva de Lotería' },
  lotterySimulatorTitle: { en: 'The Ultimate Delusion Simulator', ko: '궁극의 망상 시뮬레이터', es: 'El Simulador de Delirio Definitivo' },
  powerballName: { en: 'Powerball', ko: '파워볼', es: 'Powerball' },
  megaMillionsName: { en: 'Mega Millions', ko: '메가 밀리언', es: 'Mega Millions' },
  powerPlayLabel: { en: 'Power Play', ko: '파워 플레이', es: 'Power Play' },
  megaplierLabel: { en: 'Megaplier', ko: '메가플라이어', es: 'Megaplier' },
  pushToSpin: { en: 'Push to spin', ko: '눌러서 룰렛 돌리기', es: 'Presiona para girar' },
  failedToLoadDraws: { en: 'Failed to load draws', ko: '데이터를 불러오지 못했습니다', es: 'Error al cargar los sorteos' },
  pickFillRevealTagline: { en: 'Pick a past draw. Fill the slip. Reveal the result.', ko: '과거 회차 선택 ➡️ 번호 마킹 ➡️ 결과 확인', es: 'Elige un sorteo pasado. Llena el boleto. Revela el resultado.' },
  spinWheelTryLuckTitle: { en: 'Spin the wheel and test your fate.', ko: '룰렛을 돌려 당신의 운명을 테스트하세요.', es: 'Gira la ruleta y prueba tu suerte.' },
  resetButton: { en: 'Reset', ko: '초기화', es: 'Reiniciar' },
  spinButton: { en: 'SPIN', ko: '룰렛 돌리기', es: 'GIRAR' },
  loadingButton: { en: 'Loading...', ko: '로딩 중...', es: 'Cargando...' },
  spinToLockHistoricalDrawDate: { en: 'Spin to lock a historical draw date', ko: '돌려서 과거 당첨 날짜를 고정하세요', es: 'Gira para fijar una fecha de sorteo histórica' },
  loadingDraws: { en: 'Loading draws...', ko: '회차 정보 불러오는 중...', es: 'Cargando sorteos...' },
  pastDatesLoaded: { en: 'past dates loaded', ko: '개의 과거 회차 장전 완료', es: 'fechas pasadas cargadas' },
  selectingPastDraw: { en: 'Selecting a past draw', ko: '과거 당첨 번호 추첨 중', es: 'Seleccionando un sorteo pasado' },
  fillPlaySlipLabel: { en: 'Fill play slip', ko: '플레이 슬립 작성', es: 'Llenar boleto de juego' },
  markNumbersLikeRealTicket: { en: 'Mark your numbers like a real ticket.', ko: '실제 복권처럼 번호를 마킹해보세요.', es: 'Marca tus números como un boleto real.' },
  lockedDrawDateLabel: { en: 'Locked draw date', ko: '타겟 회차 (이 날짜 결과와 비교합니다)', es: 'Fecha de sorteo bloqueada' },
  ticketPriceLabel: { en: 'Ticket price', ko: '티켓 가격', es: 'Precio del boleto' },
  withAddOnLabel: { en: 'With', ko: '옵션 포함', es: 'Con' },
  totalFilledPanelsCostLabel: { en: 'Total filled panels cost', ko: '총 구매 비용', es: 'Costo total de paneles llenos' },
  ticketReceiptLabel: { en: 'Ticket receipt', ko: '티켓 영수증', es: 'Recibo del boleto' },
  panelLabel: { en: 'Panel', ko: '패널', es: 'Panel' },
  baseTicketLabel: { en: 'Base', ko: '기본', es: 'Base' },
  emptyLabel: { en: 'Empty', ko: '비어있음', es: 'Vacío' },
  totalLabel: { en: 'Total', ko: '합계', es: 'Total' },
  quickPickButton: { en: 'Quick Pick', ko: '자동 선택 (Quick Pick)', es: 'Selección Rápida' },
  continueButton: { en: 'Continue', ko: '계속하기', es: 'Continuar' },
  officialStylePlaySlip: { en: 'Official style play slip', ko: '공식 플레이 슬립', es: 'Boleto de juego oficial' },
  onLabel: { en: 'ON', ko: '적용', es: 'ENCENDIDO' },
  offLabel: { en: 'OFF', ko: '해제', es: 'APAGADO' },
  savedLabel: { en: 'saved', ko: '저장됨', es: 'guardado' },
  pickFiveFromOneTo: { en: 'Pick 5 from 1 to', ko: '1부터 아래 숫자까지 5개 선택:', es: 'Elige 5 del 1 al' },
  currentPickLabel: { en: 'Current pick', ko: '현재 선택한 번호', es: 'Selección actual' },
  yourBasket: { en: 'YOUR TICKET TRAY', ko: '내 티켓 바구니', es: 'TU BANDEJA DE BOLETOS' },
  baseLabel: { en: 'Base', ko: '기본', es: 'Base' },
  costLabel: { en: 'Cost', ko: '비용', es: 'Costo' },
  totalTicketCostLabel: { en: 'Total ticket cost', ko: '총 결제 금액', es: 'Costo total del boleto' },
  yourNumbersFirstLabel: { en: 'Your numbers first', ko: '당신의 번호 확인', es: 'Tus números primero' },
  hereIsCombinationYouPicked: { en: 'Here is the combination you picked.', ko: '당신이 선택한 번호 조합입니다.', es: 'Aquí está la combinación que elegiste.' },
  simulationLabel: { en: 'Simulation', ko: '시뮬레이션', es: 'Simulación' },
  jackpotsInRandomTickets: { en: 'jackpots in', ko: '번 잭팟 터짐 / 총 시도:', es: 'jackpots en' },
  jackpotsLabel: { en: 'Jackpots', ko: '1등(잭팟)', es: 'Jackpots' },
  threePlusMatchesLabel: { en: '3+ Matches', ko: '3개 이상 일치', es: '3+ Coincidencias' },
  specialHitsLabel: { en: 'Special Hits', ko: '보너스 볼 일치', es: 'Aciertos Especiales' },
  panelsPlayedLabel: { en: 'Panels played', ko: '플레이한 패널', es: 'Paneles jugados' },
  liveLabel: { en: 'LIVE', ko: 'LIVE', es: 'EN VIVO' },
  noPicksYetLabel: { en: 'No picks yet', ko: '아직 선택 안함', es: 'Aún no hay selecciones' },
  historicalDrawDateSelectedLabel: { en: 'Historical draw date selected by the wheel', ko: '룰렛이 선택한 과거 당첨 날짜', es: 'Fecha de sorteo histórico seleccionada' },
  revealTargetLabel: { en: 'Reveal target', ko: '결과 확인 대상', es: 'Objetivo a revelar' },
  activeLabel: { en: 'Active', ko: '활성', es: 'Activo' },
  ticketSummaryLabel: { en: 'Ticket summary', ko: '티켓 요약', es: 'Resumen del boleto' },
  revealPanelLabel: { en: 'Reveal panel', ko: '결과 확인 패널', es: 'Revelar panel' },
  totalCostLabel: { en: 'Total cost', ko: '총 비용', es: 'Costo total' },
  revealWinningNumbersButton: { en: 'Reveal Winning Numbers', ko: '당첨 번호 까보기!', es: 'Revelar Números Ganadores' },
  winningDrawLabel: { en: 'Winning draw', ko: '당첨 번호', es: 'Sorteo ganador' },
  winningNumbersForLabel: { en: 'Winning numbers for', ko: '해당 일자의 당첨 번호:', es: 'Números ganadores para' },
  historicalDrawResultLabel: { en: 'Historical draw result', ko: '과거 추첨 결과', es: 'Resultado del sorteo histórico' },
  resultLabel: { en: 'Result', ko: '결과', es: 'Resultado' },
  jackpotBanner: { en: 'JACKPOT', ko: '잭팟 터짐!!!', es: '¡JACKPOT!' },
  beatImpossibleOdds: { en: 'You beat impossible-looking odds.', ko: '불가능에 가까운 확률을 뚫으셨습니다.', es: 'Venciste probabilidades imposibles.' },
  youWonLabel: { en: 'YOU WON', ko: '당첨금:', es: 'GANASTE' },
  youMatchedLabel: { en: 'You matched', ko: '당신은', es: 'Acertaste' },
  whiteBallsLabel: { en: 'white ball(s)', ko: '개의 일반 볼을 맞췄습니다.', es: 'bola(s) blanca(s)' },
  andSpecialBallLabel: { en: 'and the special ball', ko: '그리고 보너스 볼까지요!', es: 'y la bola especial' },
  probabilityLabel: { en: 'Probability', ko: '확률', es: 'Probabilidad' },
  approxOddsExactOutcome: { en: 'Approx odds for this exact outcome on the active panel.', ko: '현재 패널에서 이 결과가 나올 대략적인 확률입니다.', es: 'Probabilidades aprox. para este resultado exacto.' },
  allPanelsLabel: { en: 'All panels', ko: '모든 패널', es: 'Todos los paneles' },
  whiteMatchSingular: { en: 'white match', ko: '개 일반 볼 일치', es: 'acierto blanco' },
  whiteMatchesPlural: { en: 'white matches', ko: '개 일반 볼 일치', es: 'aciertos blancos' },
  yesLabel: { en: 'Yes', ko: '네', es: 'Sí' },
  noLabel: { en: 'No', ko: '아니오', es: 'No' },
  specialBallLabel: { en: 'Special Ball', ko: '보너스 볼', es: 'Bola Especial' },
  panelCostLabel: { en: 'Panel Cost', ko: '패널 비용', es: 'Costo del Panel' },
  matchBreakdownLabel: { en: 'Match breakdown', ko: '일치 분석', es: 'Desglose de aciertos' },
  oddsComparisonLabel: { en: 'Odds comparison', ko: '확률 팩폭 비교', es: 'Comparación de probabilidades' },
  saveOrShareCardLabel: { en: 'Save or share this card', ko: '이 카드 저장 및 공유하기', es: 'Guardar o compartir esta tarjeta' },
  historicalLotterySimulationFooter: { en: "Historical lottery simulation · What's the chance?", ko: '과거 데이터 기반 복권 시뮬레이션 · 확률이 얼마나 될까?', es: 'Simulación histórica de lotería · ¿Cuál es la probabilidad?' },
  simulationInProgressLabel: { en: 'Simulation in progress', ko: '시뮬레이션 진행 중...', es: 'Simulación en progreso' },
  runningRandomTicketsLabel: { en: 'Running 1,000 random tickets…', ko: '1,000장 난수 생성 중…', es: 'Corriendo 1,000 boletos al azar…' },
  crunchingRandomTicketsLabel: { en: 'Crunching thousands of random tickets against the selected historical draw.', ko: '과거 당첨 번호를 상대로 수천 장의 가상 티켓을 긁어보는 중입니다.', es: 'Calculando miles de boletos contra el sorteo histórico.' },
  copyResultButton: { en: 'Copy Result', ko: '결과 텍스트 복사', es: 'Copiar Resultado' },
  saveResultImageButton: { en: 'Save Result Image', ko: '결과 이미지 저장', es: 'Guardar Imagen del Resultado' },
  shareImageButton: { en: 'Share Image', ko: '이미지 공유하기', es: 'Compartir Imagen' },
  simulatingButton: { en: 'Simulating…', ko: '시뮬레이션 중…', es: 'Simulando…' },
  runThousandSimulationsButton: { en: 'Run 1,000 Simulations', ko: '🎰 1,000장 연속 뽑기 실행', es: 'Correr 1,000 Simulaciones' },
  tryAgainInstantlyButton: { en: 'Try Again Instantly', ko: '다시 도전하기', es: 'Intentar de Nuevo' },
  backToStartButton: { en: 'Back to Start', ko: '처음으로 돌아가기', es: 'Volver al Inicio' },
  entertainmentOnlyDisclaimer: { en: 'Entertainment-only historical simulation. You did not actually win or lose money.', ko: '엔터테인먼트 목적의 시뮬레이션입니다. 실제로 돈을 잃거나 따지 않았으니 안심하세요.', es: 'Simulación histórica solo para entretenimiento.' },
  bootingProbabilityEngine: { en: 'Booting up the probability engine…', ko: '확률 계산 엔진 가동 중...', es: 'Iniciando el motor de probabilidades...' },
  jackpotFoundLiveBatch: { en: 'Jackpot found in the live simulation batch!', ko: '🎉 미쳤다! 시뮬레이션 도중 잭팟이 터졌습니다!', es: '¡Jackpot encontrado en la simulación en vivo!' },
  nearMissesInBatch: { en: 'near misses in this batch…', ko: '번 아깝게 빗나감 (4개 일치)...', es: 'casi aciertos en este lote...' },
  scanningEarlyCombinations: { en: 'Scanning early combinations…', ko: '초반 조합 스캔 중...', es: 'Escaneando combinaciones tempranas...' },
  accelerationKickingIn: { en: 'Acceleration kicking in…', ko: '스피드 올리는 중...', es: 'Aceleración activada...' },
  finalStretchOddsSpicy: { en: 'Final stretch — odds getting spicy.', ko: '마지막 스퍼트 — 제발 하나만 걸려라.', es: 'Tramo final — las probabilidades se ponen picantes.' },
  simulationCompleteJackpotDetected: { en: 'Simulation complete — jackpot event detected.', ko: '시뮬레이션 완료 — 잭팟 이벤트 감지됨!', es: 'Simulación completa — evento de jackpot detectado.' },
  simulationComplete: { en: 'Simulation complete. Reality remains harsh.', ko: '시뮬레이션 완료. 역시 현실은 냉혹하군요.', es: 'Simulación completa. La realidad sigue siendo dura.' },
  jackpotSimulation: { en: 'Jackpot simulation', ko: '잭팟 당첨 시뮬레이션', es: 'Simulación de jackpot' },
  millionStyleHit: { en: '$1,000,000 style hit', ko: '100만 달러(약 13억) 2등 당첨', es: 'Premio estilo $1,000,000' },
  bigSimulatedWin: { en: 'Big simulated win', ko: '대박 당첨 ($50,000)', es: 'Gran premio simulado' },
  hundredStyleHit: { en: '$100 style hit', ko: '용돈 벌이 ($100)', es: 'Premio estilo $100' },
  smallSimulatedPrize: { en: 'Small simulated prize', ko: '소소한 당첨 ($7)', es: 'Pequeño premio simulado' },
  fourDollarStyleHit: { en: '$4 style hit', ko: '본전치기 ($4)', es: 'Premio estilo $4' },
  noSimulatedPrize: { en: 'No simulated prize', ko: '꽝 (다음 기회에)', es: 'Sin premio simulado' },
  soCloseToJackpot: { en: 'So close to the jackpot.', ko: '아... 잭팟이 코앞이었는데!', es: 'Tan cerca del jackpot.' },
  oneSpecialAway: { en: 'One special ball away from the top prize.', ko: '보너스 볼 하나 차이로 1등을 놓쳤습니다.', es: 'A una bola especial del premio mayor.' },
  strongHitRandomDraw: { en: 'That was a strong hit for a random historical draw.', ko: '무작위 과거 회차 치고는 꽤 좋은 성적이네요.', es: 'Ese fue un buen acierto para un sorteo histórico.' },
  jackpotOddsLabel: { en: 'Jackpot odds', ko: '잭팟 확률', es: 'Probabilidades de jackpot' },
  lightningOddsLabel: { en: 'Being struck by lightning', ko: '벼락 맞을 확률', es: 'Ser alcanzado por un rayo' },
  sharkAttackOddsLabel: { en: 'Shark attack', ko: '상어에게 물릴 확률', es: 'Ataque de tiburón' },

  // ─── History & Fun Facts ───
  historyBtnTitle: { en: 'Discover Lottery History & Fun Facts 📚', ko: '복권의 역사와 흥미로운 진실 📚', es: 'Descubre la Historia y Curiosidades 📚' },
  historyTitle: { en: 'Lottery History & Fun Facts', ko: '복권의 역사와 흥미로운 진실', es: 'Historia de la Lotería y Curiosidades' },
  historyIntro: { 
    en: "Think the modern lottery is just a math game? The truth involves ancient empires, funding the Ivy League, and unimaginable probability quirks. Prepare to have your mind blown.", 
    ko: "현대의 복권이 그저 운과 수학 게임일 뿐이라고 생각하시나요? 진실은 고대 제국, 아이비리그 명문대의 설립 자금, 그리고 상상을 초월하는 확률의 장난과 얽혀 있습니다. 놀랄 준비 되셨나요?", 
    es: "¿Crees que la lotería moderna es solo un juego de matemáticas? La verdad involucra imperios antiguos, financiamiento de universidades y peculiaridades de probabilidad inimaginables." 
  },
  
  hist1Title: { 
    en: "1. The Ancient Origins: Funding the Great Wall of China", 
    ko: "1. 고대 기원: 만리장성 건설 자금을 조달하다", 
    es: "1. Orígenes Antiguos: Financiando la Gran Muralla China" 
  },
  hist1Desc: { 
    en: "The earliest recorded signs of a lottery trace back to the Chinese Han Dynasty between 205 and 187 BC. These early 'Keno' slips are believed to have helped finance major government projects, including the construction of the Great Wall of China. You aren't just buying a ticket; you're participating in a 2,000-year-old tradition of voluntary taxation!", 
    ko: "최초의 복권 형태는 기원전 205년~187년 중국 한나라 시대까지 거슬러 올라갑니다. 당시 초기 형태의 '키노(Keno)' 복권은 만리장성 건설을 포함한 대규모 국가 프로젝트 자금을 조달하는 데 사용되었습니다. 즉, 당신은 단순히 티켓을 사는 게 아니라 2,000년이나 된 '자발적 납세' 전통에 참여하고 있는 셈입니다!", 
    es: "Los primeros signos de lotería se remontan a la dinastía Han en China. Se cree que estos boletos ayudaron a financiar importantes proyectos, incluida la Gran Muralla China." 
  },

  hist2Title: { 
    en: "2. Building the Ivy League with Lottery Money", 
    ko: "2. 아이비리그 명문대들을 세운 도박 자금", 
    es: "2. Construyendo la Ivy League con Dinero de Lotería" 
  },
  hist2Desc: { 
    en: "In colonial America, lotteries were incredibly popular and respectable. Benjamin Franklin used lotteries to pay for cannons to defend Philadelphia. Even more shocking? Elite universities like Harvard, Yale, Princeton, and Columbia were substantially funded through lottery campaigns in the 1700s. Without gamblers hoping for a breakout payout, America's finest educational institutions might look very different today.", 
    ko: "미국 식민지 시대에 복권은 대단히 인기 있고 당당한 사업이었습니다. 벤자민 프랭클린은 필라델피아 방어를 위한 대포를 사기 위해 주 정부 복권을 발행했죠. 더 충격적인 사실은 하버드, 예일, 프린스턴, 콜롬비아 같은 자존심 높은 최고급 명문 대학들이 1700년대 복권 수익금으로 세워졌다는 것입니다. 인생 역전을 꿈꾸던 사람들이 없었다면 오늘날 미국의 명문대들은 존재하지 않았을 수도 있습니다.", 
    es: "En la América colonial, universidades de élite como Harvard, Yale y Princeton fueron financiadas en gran parte mediante campañas de lotería en los años 1700." 
  },

  hist3Title: { 
    en: "3. The Evolution of Mega Millions & Powerball", 
    ko: "3. 1조원 잭팟의 탄생 비화와 꼼수", 
    es: "3. La Evolución de Mega Millions y Powerball" 
  },
  hist3Desc: { 
    en: "Powerball started in 1992, replacing Lotto America. Mega Millions followed in 1996 as 'The Big Game'. Why are jackpots so staggeringly massive today? In 2015 and 2017, both games intentionally increased the pool of numbers. They made winning the jackpot mathematically harder (from 1 in 175M to 1 in 292M+). Harder odds mean constant rollovers, which manufacture the $1B+ headlines that drive historic ticket sales.", 
    ko: "파워볼은 1992년에 '로또 아메리카'를 대체하며 시작되었고, 메가 밀리언스는 1996년 '더 빅 게임'으로 시작했죠. 그런데 왜 요즘 잭팟 금액이 1조 원, 2조 원씩 천문학적으로 커졌을까요? 2015년과 2017년, 두 복권 위원회는 고의로 당첨 숫자 범위를 대폭 늘려 1등 당첨 확률을(1억 7500만 분의 1에서 2억 9200만 분의 1 이상으로) 악랄하게 낮췄습니다. 아무도 당첨되지 않아 금액이 계속 이월되어야 전 세계 언론을 장식하는 '빌리언 달러 잭팟'이 쓰여지고, 역대급 판매량을 올릴 수 있기 때문입니다.", 
    es: "Powerball comenzó en 1992 y Mega Millions en 1996. Recientemente, ambos hicieron intencionalmente más difícil ganar el premio mayor para crear premios acumulados de más de $1B." 
  },

  hist4Title: { 
    en: "4. The Bizarre Math of Winning Multiple Times", 
    ko: "4. 여러 번 당첨되는 사람들의 기괴한 수학", 
    es: "4. La Extraña Matemática de Ganar Varias Veces" 
  },
  hist4Desc: { 
    en: "You might hear of someone winning the lottery twice in one lifetime and think, 'That’s completely rigged or a simulation glitch!' Actually, statistician Stephen Samuels mathematically calculated that given the millions of people who regularly purchase tickets worldwide every single week, it is actually highly probable—even expected—that a handful of individuals will win multiple massive jackpots. It's known as the 'Law of Truly Large Numbers'. It just means some people truly scoop out all the luck in the universe.", 
    ko: "어떤 사람이 복권 1등에 두 번이나 당첨됐다는 뉴스를 보면 '이거 무조건 조작이네!'라고 생각하시겠죠. 하지만 통계학자 스티븐 사무엘스에 따르면 전 세계적으로 매주 수천만 명이 정기적으로 복권을 산다는 점을 감안할 때, 누군가 평생 두 번 이상의 잭팟을 터뜨리는 것은 수학적으로 '매우 정상적이고 100% 일어날 수밖에 없는' 현상이라고 합니다. 이를 통계학에서는 '진정으로 큰 수의 법칙'이라고 부릅니다. 누군가는 정말로 우주의 행운을 싹싹 긁어간다는 뜻이죠.", 
    es: "Dada la cantidad de personas que compran boletos, es matemáticamente probable que algunas ganen varias veces. Es la 'Ley de los Números Verdaderamente Grandes'." 
  }
}


// ─── Helper: get translated text with template replacement ───
export function t(key, lang = 'en', vars = {}) {
  const entry = T[key]
  if (!entry) return key
  let text = entry[lang] || entry.en || key
  for (const [k, v] of Object.entries(vars)) {
    text = text.replace(new RegExp(`\\{${k}\\}`, 'g'), v)
  }
  return text
}

// Export raw translations for special rendering (e.g. JSX with gold spans)
export function tRaw(key, lang = 'en') {
  const entry = T[key]
  if (!entry) return key
  return entry[lang] || entry.en || key
}

export default T