// Vercel Serverless Function: Mega Millions API Proxy
// Proxies requests to the official Mega Millions API to avoid CORS issues

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const response = await fetch(
      'https://www.megamillions.com/cmspages/utilservice.asmx/GetLatestDrawData',
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/xml, application/xml, text/html',
          'Referer': 'https://www.megamillions.com/',
        },
        signal: AbortSignal.timeout(10000),
      }
    );

    if (!response.ok) {
      throw new Error(`Mega Millions API returned ${response.status}`);
    }

    const text = await response.text();
    
    // Set appropriate content type
    res.setHeader('Content-Type', 'text/xml; charset=utf-8');
    return res.status(200).send(text);
  } catch (error) {
    console.error('[API] Mega Millions proxy error:', error.message);
    return res.status(502).json({
      error: 'Failed to fetch Mega Millions data',
      message: error.message,
    });
  }
}
