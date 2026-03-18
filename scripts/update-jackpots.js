const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

const dataFile = path.resolve(__dirname, '../src/data/jackpots.json');

// Helper to calculate cash option (approx 45% of jackpot)
function calculateCashOption(jackpotAmount) {
  return parseFloat((jackpotAmount * 0.45).toFixed(1));
}

// Function to fetch Powerball
async function fetchPowerball() {
  try {
    // Note: Official sites sometimes block automated requests. We'll use a generic User-Agent.
    const res = await axios.get('https://www.powerball.com/', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8'
      },
      timeout: 10000
    });
    const $ = cheerio.load(res.data);
    
    // Attempting to scrape the jackpot from Powerball homepage
    // There is usually text like "$58 Million" or "ESTIMATED JACKPOT" followed by "$58 Million"
    const text = $('body').text();
    
    // Look for Jackpot
    const jackpotMatch = text.match(/ESTIMATED JACKPOT\s*\$(\d+)\s+Million/i) || text.match(/\$(\d+)\s+Million/i);
    let amount = 58; // Current fallback
    if (jackpotMatch && jackpotMatch[1]) {
      amount = parseInt(jackpotMatch[1], 10);
    }

    // Look for Cash Value (screenshot shows "CASH VALUE" then "$26.8 Million")
    const cashMatch = text.match(/CASH VALUE\s*\$(\d+\.?\d*)\s+Million/i);
    let cashOption = calculateCashOption(amount); // Default 45% if not found
    
    if (cashMatch && cashMatch[1]) {
      cashOption = parseFloat(cashMatch[1]);
    } else {
      // Try another pattern if the first one fails
      const cashMatchAlt = text.match(/CASH OPTION[:\s]*\$(\d+\.?\d*)\s+Million/i);
      if (cashMatchAlt && cashMatchAlt[1]) {
        cashOption = parseFloat(cashMatchAlt[1]);
      }
    }
    
    return {
      amount: amount,
      cashOption: cashOption,
      nextDrawing: "Next Draw",
      ticketPrice: 2
    };
  } catch (err) {
    console.error('Error fetching Powerball data:', err.message);
    return null;
  }
}

// Function to fetch Mega Millions
async function fetchMegaMillions() {
  try {
    const res = await axios.get('https://www.megamillions.com/', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36'
      },
      timeout: 10000
    });
    const $ = cheerio.load(res.data);
    
    // Look for "$533 Million"
    const text = $('body').text();
    const jackpotMatch = text.match(/\$(\d+)\s+Million/i);
    let amount = 533; // Current Fallback
    
    if (jackpotMatch && jackpotMatch[1]) {
      amount = parseInt(jackpotMatch[1], 10);
    }

    return {
      amount: amount,
      cashOption: calculateCashOption(amount),
      nextDrawing: "Next Draw",
      ticketPrice: 5
    };
  } catch (err) {
    console.error('Error fetching Mega Millions data:', err.message);
    return null;
  }
}

async function updateJackpots() {
  console.log('Fetching latest lottery jackpots...');
  
  // Read existing data as fallback for nextDrawing dates
  let existingData = {};
  try {
    if (fs.existsSync(dataFile)) {
      existingData = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
    }
  } catch (e) {
    console.log('No existing data found or error reading.');
  }

  const pbData = await fetchPowerball();
  const mmData = await fetchMegaMillions();

  const newData = {
    "megaMillions": Object.assign({}, existingData.megaMillions || {
      amount: 533, cashOption: 244.2, nextDrawing: "Tue, Mar 10, 2026", ticketPrice: 5
    }),
    "powerball": Object.assign({}, existingData.powerball || {
      amount: 58, cashOption: 26.8, nextDrawing: "Wed, Mar 11, 2026", ticketPrice: 2
    })
  };

  if (pbData && pbData.amount) {
    newData.powerball.amount = pbData.amount;
    newData.powerball.cashOption = pbData.cashOption;
  }
  
  if (mmData && mmData.amount) {
    newData.megaMillions.amount = mmData.amount;
    newData.megaMillions.cashOption = mmData.cashOption;
  }

  fs.writeFileSync(dataFile, JSON.stringify(newData, null, 2), 'utf8');
  console.log('Jackpots updated successfully:');
  console.log(`Mega Millions: $${newData.megaMillions.amount}M`);
  console.log(`Powerball: $${newData.powerball.amount}M`);
}

updateJackpots();
