// ============================================================
// ZODIAC FORTUNE — Client-side daily horoscope generator
// Deterministic: same sign + same date = same fortune every time
// ============================================================

export const ZODIAC_SIGNS = [
  { id: 'aries', symbol: '♈', name: 'Aries', nameKo: '양자리', nameEs: 'Aries', dates: 'Mar 21 – Apr 19', element: 'Fire' },
  { id: 'taurus', symbol: '♉', name: 'Taurus', nameKo: '황소자리', nameEs: 'Tauro', dates: 'Apr 20 – May 20', element: 'Earth' },
  { id: 'gemini', symbol: '♊', name: 'Gemini', nameKo: '쌍둥이자리', nameEs: 'Géminis', dates: 'May 21 – Jun 20', element: 'Air' },
  { id: 'cancer', symbol: '♋', name: 'Cancer', nameKo: '게자리', nameEs: 'Cáncer', dates: 'Jun 21 – Jul 22', element: 'Water' },
  { id: 'leo', symbol: '♌', name: 'Leo', nameKo: '사자자리', nameEs: 'Leo', dates: 'Jul 23 – Aug 22', element: 'Fire' },
  { id: 'virgo', symbol: '♍', name: 'Virgo', nameKo: '처녀자리', nameEs: 'Virgo', dates: 'Aug 23 – Sep 22', element: 'Earth' },
  { id: 'libra', symbol: '♎', name: 'Libra', nameKo: '천칭자리', nameEs: 'Libra', dates: 'Sep 23 – Oct 22', element: 'Air' },
  { id: 'scorpio', symbol: '♏', name: 'Scorpio', nameKo: '전갈자리', nameEs: 'Escorpio', dates: 'Oct 23 – Nov 21', element: 'Water' },
  { id: 'sagittarius', symbol: '♐', name: 'Sagittarius', nameKo: '궁수자리', nameEs: 'Sagitario', dates: 'Nov 22 – Dec 21', element: 'Fire' },
  { id: 'capricorn', symbol: '♑', name: 'Capricorn', nameKo: '염소자리', nameEs: 'Capricornio', dates: 'Dec 22 – Jan 19', element: 'Earth' },
  { id: 'aquarius', symbol: '♒', name: 'Aquarius', nameKo: '물병자리', nameEs: 'Acuario', dates: 'Jan 20 – Feb 18', element: 'Air' },
  { id: 'pisces', symbol: '♓', name: 'Pisces', nameKo: '물고기자리', nameEs: 'Piscis', dates: 'Feb 19 – Mar 20', element: 'Water' },
]

// 🎰 Lottery/Money/Luck themed fortunes — EN / KO / ES
const FORTUNES = [
  { text: "The universe is hiding a golden ticket in an unexpected place today. Check between the couch cushions... or aisle 7.", textKo: "오늘 우주가 뜻밖의 곳에 황금 티켓을 숨겨뒀어요. 소파 쿠션 사이... 혹은 7번 통로를 확인해보세요.", textEs: "El universo esconde un boleto dorado en un lugar inesperado hoy. Revisa entre los cojines del sofá... o el pasillo 7.", mood: "lucky" },
  { text: "Your lucky numbers are vibrating at a higher frequency today. Whether that means anything is between you and the cosmos.", textKo: "오늘 당신의 행운의 숫자가 더 높은 주파수로 진동하고 있어요. 그게 뭘 의미하는지는 당신과 우주 사이의 비밀.", textEs: "Tus números de la suerte vibran a una frecuencia más alta hoy. Si eso significa algo, es entre tú y el cosmos.", mood: "mystical" },
  { text: "A small financial surprise is heading your way. Don't get too excited — it's probably $5 in old jeans.", textKo: "작은 금전적 서프라이즈가 다가오고 있어요. 너무 흥분하지 마세요 — 아마 오래된 청바지에서 5달러.", textEs: "Una pequeña sorpresa financiera viene hacia ti. No te emociones mucho — probablemente son $5 en unos jeans viejos.", mood: "funny" },
  { text: "Today the stars say: save your money. The jackpot will still be there tomorrow, but your rent won't pay itself.", textKo: "오늘 별들이 말합니다: 돈을 아끼세요. 잭팟은 내일도 있지만, 월세는 알아서 안 나가요.", textEs: "Hoy las estrellas dicen: ahorra tu dinero. El jackpot seguirá mañana, pero tu renta no se paga sola.", mood: "wise" },
  { text: "Someone near you will mention a 'sure thing' investment today. Spoiler: it's not sure. Nothing is sure. Buy a lottery ticket instead — at least it's honest about the odds.", textKo: "오늘 주변 누군가가 '확실한' 투자를 언급할 거예요. 스포: 확실하지 않아요. 차라리 로또를 사세요 — 최소한 확률에 대해 정직하니까.", textEs: "Alguien cercano mencionará una inversión 'segura' hoy. Spoiler: no es segura. Nada lo es. Mejor compra un boleto de lotería — al menos es honesto sobre las probabilidades.", mood: "funny" },
  { text: "The number 7 keeps appearing in your life today. On clocks, receipts, license plates. Coincidence? The universe doesn't do coincidences.", textKo: "오늘 숫자 7이 계속 나타나요. 시계, 영수증, 번호판에서. 우연? 우주는 우연을 만들지 않아요.", textEs: "El número 7 sigue apareciendo en tu vida hoy. En relojes, recibos, placas. ¿Coincidencia? El universo no hace coincidencias.", mood: "mystical" },
  { text: "Your financial intuition is sharper than usual today. Unfortunately, 'sharper than usual' for you is still pretty dull. But hey, trust the process.", textKo: "오늘 재정적 직감이 평소보다 예리해요. 안타깝게도 '평소보다 예리한' 건 여전히 좀 무딘 수준이지만. 그래도 과정을 믿으세요.", textEs: "Tu intuición financiera está más aguda de lo normal hoy. Desafortunadamente, 'más aguda de lo normal' para ti sigue siendo bastante obtusa. Pero oye, confía en el proceso.", mood: "funny" },
  { text: "A door is about to open that you didn't know existed. It might be a literal door to a store where you find a penny. Baby steps.", textKo: "몰랐던 문이 곧 열릴 거예요. 아마 동전 하나 줍는 가게 문일 수도. 한 걸음씩.", textEs: "Una puerta está a punto de abrirse que no sabías que existía. Puede ser una puerta literal a una tienda donde encuentres un centavo. Paso a paso.", mood: "funny" },
  { text: "The planets are aligned in your favor for quick decisions today. If you see something shiny, grab it. Not someone else's wallet though.", textKo: "오늘 빠른 결정에 행성이 유리하게 배열되어 있어요. 반짝이는 걸 보면 잡으세요. 다른 사람 지갑 말고.", textEs: "Los planetas están alineados a tu favor para decisiones rápidas hoy. Si ves algo brillante, tómalo. Pero no la cartera de alguien más.", mood: "lucky" },
  { text: "Your energy today attracts abundance. The kind of abundance that starts with finding a good parking spot and escalates from there.", textKo: "오늘 당신의 에너지가 풍요를 끌어당겨요. 좋은 주차자리 찾는 것에서 시작해서 점점 커지는 종류의.", textEs: "Tu energía hoy atrae abundancia. El tipo de abundancia que empieza encontrando un buen lugar de estacionamiento y escala desde ahí.", mood: "lucky" },
  { text: "Mercury is doing something dramatic again. Whatever happens with your money today, blame Mercury. Everyone else does.", textKo: "수성이 또 뭔가 드라마틱한 걸 하고 있어요. 오늘 돈에 무슨 일이 생기면 수성 탓하세요. 다들 그러니까.", textEs: "Mercurio está haciendo algo dramático de nuevo. Lo que sea que pase con tu dinero hoy, culpa a Mercurio. Todos lo hacen.", mood: "funny" },
  { text: "The stars suggest patience today. That jackpot isn't going anywhere. Actually, it might grow bigger if you wait. See? Patience pays.", textKo: "별들이 오늘은 인내를 권해요. 잭팟은 안 도망가요. 사실 기다리면 더 커질 수도. 봐요? 인내가 돈이에요.", textEs: "Las estrellas sugieren paciencia hoy. Ese jackpot no se va a ningún lado. De hecho, puede crecer si esperas. ¿Ves? La paciencia paga.", mood: "wise" },
  { text: "A stranger will say something today that feels like a sign. It's probably just small talk, but who are we to argue with the cosmos?", textKo: "오늘 낯선 사람이 징조처럼 느껴지는 말을 할 거예요. 아마 그냥 인사겠지만, 우주와 누가 논쟁하겠어요?", textEs: "Un extraño dirá algo hoy que se sentirá como una señal. Probablemente solo sea charla casual, pero ¿quiénes somos para discutir con el cosmos?", mood: "mystical" },
  { text: "Your lucky charm is working overtime today. If you don't have a lucky charm, your left sock will do in a pinch.", textKo: "오늘 행운의 부적이 야근 중이에요. 행운의 부적이 없으면 왼쪽 양말이 대신할 거예요.", textEs: "Tu amuleto de la suerte trabaja horas extra hoy. Si no tienes uno, tu calcetín izquierdo servirá en caso de emergencia.", mood: "funny" },
  { text: "The universe owes you one. Whether it pays up today is another question entirely, but the debt is noted.", textKo: "우주가 당신에게 하나 빚졌어요. 오늘 갚을지는 또 다른 문제지만, 빚은 기록됐어요.", textEs: "El universo te debe una. Si paga hoy es otra cuestión completamente diferente, pero la deuda está anotada.", mood: "lucky" },
  { text: "Today's cosmic energy favors bold moves. Buying 10 tickets instead of 1? Bold. Buying 100? Reckless. Know the difference.", textKo: "오늘의 우주 에너지는 과감한 행동을 지지해요. 1장 대신 10장? 과감함. 100장? 무모함. 차이를 아세요.", textEs: "La energía cósmica de hoy favorece los movimientos audaces. ¿Comprar 10 boletos en vez de 1? Audaz. ¿Comprar 100? Imprudente. Conoce la diferencia.", mood: "wise" },
  { text: "A golden opportunity floats by today. You might catch it, you might not. Either way, dinner will still taste good tonight.", textKo: "오늘 황금 기회가 스쳐갈 거예요. 잡을 수도, 못 잡을 수도. 어떻든 오늘 저녁은 맛있을 거예요.", textEs: "Una oportunidad dorada flota hoy. Quizás la atrapes, quizás no. De cualquier manera, la cena sabrá bien esta noche.", mood: "lucky" },
  { text: "Your wallet feels lighter today. That's not a cosmic sign — you just spent too much on coffee. But spiritually, you're rich.", textKo: "오늘 지갑이 가벼워요. 우주적 징조가 아니라 커피에 너무 쓴 거예요. 하지만 영적으로는 부자.", textEs: "Tu cartera se siente más ligera hoy. Eso no es una señal cósmica — solo gastaste mucho en café. Pero espiritualmente, eres rico.", mood: "funny" },
  { text: "The moon whispers: 'Not today, but soon.' The moon has been saying this for a while now. The moon is kind of a tease.", textKo: "달이 속삭여요: '오늘은 아니지만 곧.' 달이 한동안 이러고 있긴 해요. 달은 좀 약올리는 타입.", textEs: "La luna susurra: 'Hoy no, pero pronto.' La luna lleva diciendo esto un rato. La luna es algo provocadora.", mood: "mystical" },
  { text: "Fortune favors the prepared. Have your numbers ready, your lucky shirt on, and your expectations... managed.", textKo: "행운은 준비된 자를 도와요. 번호 준비하고, 행운의 셔츠 입고, 기대치는... 관리하세요.", textEs: "La fortuna favorece al preparado. Ten tus números listos, tu camisa de la suerte puesta, y tus expectativas... controladas.", mood: "wise" },
  { text: "A surprising amount of $1 bills will pass through your hands today. It's not wealth, but it's... volume.", textKo: "오늘 놀라운 양의 1달러 지폐가 손을 거쳐갈 거예요. 부는 아니지만... 볼륨은 있어요.", textEs: "Una cantidad sorprendente de billetes de $1 pasarán por tus manos hoy. No es riqueza, pero es... volumen.", mood: "funny" },
  { text: "The cosmic slot machine is warming up for you. It's been on a cold streak, sure, but every machine has its moment.", textKo: "우주적 슬롯머신이 당신을 위해 워밍업 중이에요. 한동안 차가웠지만, 모든 기계에겐 순간이 있죠.", textEs: "La máquina tragamonedas cósmica se está calentando para ti. Ha estado en una racha fría, seguro, pero toda máquina tiene su momento.", mood: "mystical" },
  { text: "Today is excellent for long-term financial planning. Translation: don't blow it all on scratch-offs at the gas station.", textKo: "오늘은 장기 재정 계획에 탁월한 날이에요. 번역: 주유소에서 스크래치 복권에 다 날리지 마세요.", textEs: "Hoy es excelente para la planificación financiera a largo plazo. Traducción: no lo gastes todo en raspaditos en la gasolinera.", mood: "wise" },
  { text: "An old friend might owe you money. Today's a good day to 'casually' remind them. The stars approve of passive-aggressive texts.", textKo: "옛 친구가 돈을 빚지고 있을 수 있어요. 오늘 '자연스럽게' 상기시켜 주세요. 별들도 소극적 공격 문자를 지지해요.", textEs: "Un viejo amigo podría deberte dinero. Hoy es buen día para recordárselo 'casualmente'. Las estrellas aprueban los mensajes pasivo-agresivos.", mood: "funny" },
  { text: "Your aura is glowing with potential today. Like a scratch-off ticket before you scratch it — full of possibility.", textKo: "오늘 당신의 아우라가 가능성으로 빛나요. 긁기 전 스크래치 복권처럼 — 가능성으로 가득 찬.", textEs: "Tu aura brilla con potencial hoy. Como un raspadito antes de rascarlo — lleno de posibilidad.", mood: "mystical" },
  { text: "The stars have crunched the numbers. Your odds of having a great day: 1 in 1. That's better than any jackpot.", textKo: "별들이 숫자를 계산했어요. 좋은 하루를 보낼 확률: 1 대 1. 어떤 잭팟보다 나은 확률.", textEs: "Las estrellas calcularon los números. Tus probabilidades de tener un gran día: 1 en 1. Eso es mejor que cualquier jackpot.", mood: "wise" },
  { text: "You'll find money in an unexpected place today. Under a car seat, in a jacket pocket, or in your dreams. Probably your dreams.", textKo: "오늘 예상치 못한 곳에서 돈을 발견할 거예요. 차 시트 밑, 재킷 주머니, 또는 꿈속에서. 아마 꿈속.", textEs: "Encontrarás dinero en un lugar inesperado hoy. Bajo el asiento del carro, en un bolsillo de chaqueta, o en tus sueños. Probablemente en tus sueños.", mood: "funny" },
  { text: "Jupiter is sending big energy your way. Jupiter is also a gas giant, so make of that what you will.", textKo: "목성이 큰 에너지를 보내고 있어요. 목성은 가스 행성이기도 하니까, 알아서 해석하세요.", textEs: "Júpiter te envía gran energía. Júpiter también es un gigante gaseoso, así que interpreta eso como quieras.", mood: "funny" },
  { text: "Today's vibe: cautious optimism. Like buying one ticket and genuinely believing. That's the sweet spot.", textKo: "오늘의 분위기: 조심스러운 낙관. 한 장 사고 진심으로 믿는 것처럼. 그게 최적의 지점.", textEs: "La vibra de hoy: optimismo cauteloso. Como comprar un boleto y realmente creer. Ese es el punto perfecto.", mood: "wise" },
  { text: "The constellation of wealth is directly overhead tonight. Look up and make a wish. It won't help, but the stars are pretty.", textKo: "오늘 밤 부의 별자리가 바로 머리 위에 있어요. 올려다보고 소원을 빌어요. 도움은 안 되지만, 별은 예쁘잖아요.", textEs: "La constelación de la riqueza está directamente sobre ti esta noche. Mira hacia arriba y pide un deseo. No ayudará, pero las estrellas son bonitas.", mood: "mystical" },
]

const LUCKY_COLORS = [
  { name: 'Gold', nameKo: '골드', nameEs: 'Dorado', hex: '#FFD700' },
  { name: 'Emerald', nameKo: '에메랄드', nameEs: 'Esmeralda', hex: '#50C878' },
  { name: 'Royal Blue', nameKo: '로열블루', nameEs: 'Azul Real', hex: '#4169E1' },
  { name: 'Crimson', nameKo: '크림슨', nameEs: 'Carmesí', hex: '#DC143C' },
  { name: 'Purple', nameKo: '퍼플', nameEs: 'Púrpura', hex: '#9B59B6' },
  { name: 'Silver', nameKo: '실버', nameEs: 'Plata', hex: '#C0C0C0' },
  { name: 'Coral', nameKo: '코랄', nameEs: 'Coral', hex: '#FF7F50' },
  { name: 'Jade', nameKo: '제이드', nameEs: 'Jade', hex: '#00A86B' },
  { name: 'Amber', nameKo: '앰버', nameEs: 'Ámbar', hex: '#FFBF00' },
  { name: 'Rose', nameKo: '로즈', nameEs: 'Rosa', hex: '#FF007F' },
  { name: 'Turquoise', nameKo: '터쿠아즈', nameEs: 'Turquesa', hex: '#40E0D0' },
  { name: 'Midnight', nameKo: '미드나이트', nameEs: 'Medianoche', hex: '#191970' },
]

const MOOD_EMOJIS = { lucky: '🍀', mystical: '🔮', funny: '😂', wise: '🦉' }

// Deterministic hash from string → consistent "random" number
function hashCode(str) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + ch
    hash |= 0
  }
  return Math.abs(hash)
}

// Seeded pseudo-random: produces different numbers from same base hash
function seededRandom(seed, offset) {
  return hashCode(`${seed}-${offset}`)
}

export function getDailyFortune(signId, targetDateStr = null) {
  const dateToUse = targetDateStr || new Date().toISOString().split('T')[0] // e.g. "2026-03-09"
  const seed = `${signId}-${dateToUse}`

  const fortuneIndex = hashCode(seed) % FORTUNES.length
  const fortune = FORTUNES[fortuneIndex]

  // Generate 5 lucky numbers (1-70, no duplicates)
  const luckyNumbers = []
  let attempt = 0
  while (luckyNumbers.length < 5) {
    const num = (seededRandom(seed, attempt) % 70) + 1
    if (!luckyNumbers.includes(num)) luckyNumbers.push(num)
    attempt++
  }
  luckyNumbers.sort((a, b) => a - b)

  // Lucky color
  const colorIndex = seededRandom(seed, 100) % LUCKY_COLORS.length
  const luckyColor = LUCKY_COLORS[colorIndex]

  // Fortune level (1-5 stars)
  const fortuneLevel = (seededRandom(seed, 200) % 5) + 1

  // Lucky time
  const hour = (seededRandom(seed, 300) % 12) + 1
  const ampm = seededRandom(seed, 301) % 2 === 0 ? 'AM' : 'PM'
  const luckyTime = `${hour}:00 ${ampm}`

  return {
    fortune,
    luckyNumbers,
    luckyColor,
    fortuneLevel,
    luckyTime,
    moodEmoji: MOOD_EMOJIS[fortune.mood],
    date: dateToUse
  }
}
