import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";

export async function generatePdfGrade(html: string) {
  try {
    const launchOptions: any = {
      headless: "new",
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
      ],
    };

    // prefer explicit CHROME_PATH env var, otherwise try common Windows install locations
    const possible = [process.env.CHROME_PATH,
      path.join("C:", "Program Files", "Google", "Chrome", "Application", "chrome.exe"),
      path.join("C:", "Program Files (x86)", "Google", "Chrome", "Application", "chrome.exe"),
    ].filter(Boolean) as string[];

    for (const p of possible) {
      if (p && fs.existsSync(p)) {
        launchOptions.executablePath = p;
        break;
      }
    }

    const browser = await puppeteer.launch(launchOptions);

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    const buffer = await page.pdf({
      format: "A4",
      printBackground: true,
    });

    await browser.close();
    return buffer;
  } catch (e) {
    throw new Error(`Error: ${e}`);
  }
}