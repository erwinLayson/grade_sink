const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

function makeSvg(sizeKB) {
  // Build an SVG with repeated text blocks to reach approx sizeKB
  const header = '<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800">';
  const footer = '</svg>';
  let body = '';
  const chunk = '<text x="10" y="20" font-size="14">ABCDEFGHIJKLMNOPQRSTUVWXYZ 0123456789 - lorem ipsum dolor sit amet</text>';
  while (Buffer.byteLength(body, 'utf8') < sizeKB * 1024) {
    body += chunk;
  }
  return header + body + footer;
}

(async function main(){
  const PAGES = 200;
  const IMAGES_PER_PAGE = 4;
  const IMAGE_KB = 40; // ~40KB per SVG

  const outDir = path.join(__dirname, '..', 'tmp');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, `report_images_${PAGES}.pdf`);

  console.log('Starting heavy stress test: generating', PAGES, 'pages with images');
  const t0 = Date.now();
  const mem0 = process.memoryUsage();
  console.log('Node memory before:', formatMem(mem0));

  // prepare one image dataURI and reuse it to simulate embedded assets
  const svg = makeSvg(IMAGE_KB);
  const dataUri = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);

  const styles = `
    <style>
      body { font-family: Arial, sans-serif; }
      .main { page-break-before: always; padding: 20px; }
      .header { font-size: 18px; font-weight: bold; margin-bottom: 8px; }
      .images { display:flex; flex-wrap:wrap; gap:8px }
      img { width:48%; height:auto; border:1px solid #ccc }
    </style>`;

  let body = '';
  for (let i = 1; i <= PAGES; i++) {
    body += `<main class="main"><div class="header">Student ${i}</div><div class="images">`;
    for (let im = 0; im < IMAGES_PER_PAGE; im++) {
      body += `<img src="${dataUri}" alt="img"/>`;
    }
    body += `</div></main>`;
  }
  const html = `<!doctype html><html><head><meta charset="utf-8">${styles}</head><body>${body}</body></html>`;

  // Puppeteer launch with local Chrome candidates
  const chromeCandidates = [
    process.env.CHROME_PATH,
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files\\Chromium\\Application\\chrome.exe'
  ].filter(Boolean);

  function findChrome() {
    for (const p of chromeCandidates) {
      try { if (fs.existsSync(p)) return p; } catch (e) { }
    }
    return null;
  }

  const localChrome = findChrome();
  const launchOpts = { args: ['--no-sandbox', '--disable-setuid-sandbox'], headless: 'new' };
  if (localChrome) launchOpts.executablePath = localChrome;

  const browser = await puppeteer.launch(launchOpts);
  try {
    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(120000);
    // For large inlined assets, 'load' with extended timeout is more reliable than 'networkidle0'
    await page.setContent(html, { waitUntil: 'load', timeout: 120000 });

    const tRenderStart = Date.now();
    console.log('Rendering to PDF...');
    await page.pdf({ path: outPath, format: 'A4', printBackground: true });
    const tRenderEnd = Date.now();

    const stats = fs.statSync(outPath);
    const t1 = Date.now();
    const mem1 = process.memoryUsage();

    console.log('PDF generated:', outPath);
    console.log('PDF size (MB):', (stats.size / (1024*1024)).toFixed(2));
    console.log('Total time (s):', ((t1 - t0)/1000).toFixed(2));
    console.log('Render time (s):', ((tRenderEnd - tRenderStart)/1000).toFixed(2));
    console.log('Node memory after:', formatMem(mem1));
  } catch (err) {
    console.error('Error during PDF generation:', err);
  } finally {
    await browser.close();
  }

  function formatMem(m){
    return Object.entries(m).map(([k,v]) => `${k}:${(v/1024/1024).toFixed(2)}MB`).join(', ');
  }
})();
