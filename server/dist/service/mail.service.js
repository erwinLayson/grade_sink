"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendPasswordResetEmail = sendPasswordResetEmail;
const nodemailer_1 = __importDefault(require("nodemailer"));
function requireEnv(name) {
    const value = process.env[name];
    if (!value) {
        throw new Error(`${name} is not configured`);
    }
    return value;
}
function createTransporter() {
    const host = requireEnv("SMTP_HOST");
    const port = Number(requireEnv("SMTP_PORT"));
    const secure = String(process.env.SMTP_SECURE || "false").toLowerCase() === "true";
    const user = requireEnv("SMTP_USER");
    const pass = requireEnv("SMTP_PASS");
    return nodemailer_1.default.createTransport({
        host,
        port,
        secure,
        auth: {
            user,
            pass,
        },
    });
}
async function sendPasswordResetEmail({ to, resetLink, username }) {
    const from = process.env.SMTP_FROM || process.env.SMTP_USER;
    if (!from) {
        throw new Error("SMTP_FROM or SMTP_USER must be configured");
    }
    const transporter = createTransporter();
    const appName = process.env.APP_NAME || "Grade Sink";
    await transporter.sendMail({
        from: `${appName} <${from}>`,
        to,
        subject: `${appName} password reset`,
        text: [
            `Hello${username ? ` ${username}` : ""},`,
            "",
            `A password reset was requested for your account.`,
            `Use the link below to reset your password:`,
            resetLink,
            "",
            "If you did not request this reset, you can safely ignore this email.",
        ].join("\n"),
        html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
        <h2 style="margin: 0 0 16px;">${appName} Password Reset</h2>
        <p>Hello${username ? ` ${username}` : ""},</p>
        <p>A password reset was requested for your account.</p>
        <p>
          <a href="${resetLink}" style="display:inline-block;padding:12px 18px;background:#111827;color:#ffffff;text-decoration:none;border-radius:10px;">
            Reset Password
          </a>
        </p>
        <p style="word-break: break-all; color: #374151;">Or copy this link: ${resetLink}</p>
        <p style="color: #6b7280; font-size: 12px;">If you did not request this reset, ignore this email.</p>
      </div>
    `,
    });
}
//# sourceMappingURL=mail.service.js.map