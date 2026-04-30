"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePdfGrade = generatePdfGrade;
const puppeteer_1 = __importDefault(require("puppeteer"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
async function generatePdfGrade(html) {
    try {
        const launchOptions = {
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
            path_1.default.join("C:", "Program Files", "Google", "Chrome", "Application", "chrome.exe"),
            path_1.default.join("C:", "Program Files (x86)", "Google", "Chrome", "Application", "chrome.exe"),
        ].filter(Boolean);
        for (const p of possible) {
            if (p && fs_1.default.existsSync(p)) {
                launchOptions.executablePath = p;
                break;
            }
        }
        const browser = await puppeteer_1.default.launch(launchOptions);
        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: "networkidle0" });
        const buffer = await page.pdf({
            format: "A4",
            printBackground: true,
        });
        await browser.close();
        return buffer;
    }
    catch (e) {
        throw new Error(`Error: ${e}`);
    }
}
//# sourceMappingURL=generateCardPdf.service.js.map