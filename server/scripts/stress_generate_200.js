const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function buildHtml(pageCount) {
  const styles = `
    <style>
      body { font-family: Arial, sans-serif; }
      .main { page-break-before: always; padding: 20px; }
      .header { font-size: 18px; font-weight: bold; margin-bottom: 8px; }
      table { width: 100%; border-collapse: collapse; }
      td, th { border: 1px solid #ccc; padding: 6px; }
    </style>`;

  let body = '';
  for (let i = 1; i <= pageCount; i++) {
    body += `<main class="main"><div class="header">Student ${i}</div>`;
    body += `<table><tr><th>Subject</th><th>Q1</th><th>Q2</th><th>Q3</th><th>Average</th></tr>`;
    for (let s = 1; s <= 8; s++) {
      const q1 = Math.floor(Math.random() * 41) + 60; // 60-100
      const q2 = Math.floor(Math.random() * 41) + 60;
      const q3 = Math.floor(Math.random() * 41) + 60;
      const avg = ((q1 + q2 + q3) / 3).toFixed(2);
      body += `<tr><td>Subject ${s}</td><td>${q1}</td><td>${q2}</td><td>${q3}</td><td>${avg}</td></tr>`;
    }
    body += `</table></main>`;
  }

  return `<!doctype html><html><head><meta charset="utf-8">${styles}</head><body>${body}</body></html>`;
}

(async function main(){
  const PAGES = 200;
  const outDir = path.join(__dirname, '..', 'tmp');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, `report_${PAGES}.pdf`);

  console.log('Starting stress test: generating', PAGES, 'pages');
  const t0 = Date.now();
  const mem0 = process.memoryUsage();
  console.log('Node memory before:', formatMem(mem0));

  const html = await buildHtml(PAGES);

  // Try to launch puppeteer; if bundled Chrome isn't available, try common local Chrome paths
  const chromeCandidates = [
    process.env.CHROME_PATH,
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files\\Chromium\\Application\\chrome.exe',
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  ].filter(Boolean);

  function findChrome() {
    for (const p of chromeCandidates) {
      try { if (fs.existsSync(p)) return p; } catch (e) { /* ignore */ }
    }
    return null;
  }

  const localChrome = findChrome();
  const launchOpts = { args: ['--no-sandbox', '--disable-setuid-sandbox'], headless: 'new' };
  if (localChrome) launchOpts.executablePath = localChrome;

  const browser = await puppeteer.launch(launchOpts);
  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });

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
