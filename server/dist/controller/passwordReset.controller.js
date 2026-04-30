"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestPasswordReset = requestPasswordReset;
exports.confirmPasswordReset = confirmPasswordReset;
const crypto_1 = __importDefault(require("crypto"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const dbConnection_config_1 = require("../config/dbConnection.config");
const user_model_1 = __importDefault(require("../model/user.model"));
const passwordReset_model_1 = __importDefault(require("../model/passwordReset.model"));
const activityLogger_1 = require("../middleware/activityLogger");
const activity_model_1 = __importDefault(require("../model/activity.model"));
const activity_service_1 = __importDefault(require("../service/activity.service"));
const mail_service_1 = require("../service/mail.service");
function getClientSideUrl() {
    return (process.env.CLIENT_SIDE_URL || "http://localhost:5173").replace(/\/$/, "");
}
function hashToken(token) {
    return crypto_1.default.createHash("sha256").update(token).digest("hex");
}
async function requestPasswordReset(req, res) {
    try {
        const email = req.body.email?.trim().toLowerCase();
        if (!email) {
            return res.status(400).json({ success: false, msg: "Email is required" });
        }
        const userModel = new user_model_1.default(dbConnection_config_1.pool);
        const user = await userModel.getUserByEmail(email);
        if (!user) {
            return res.status(200).json({
                success: true,
                msg: "If the email exists, a reset link has been prepared.",
            });
        }
        const resetModel = new passwordReset_model_1.default(dbConnection_config_1.pool);
        await resetModel.deleteTokensByUserId(user.id);
        const token = crypto_1.default.randomBytes(32).toString("hex");
        const tokenHash = hashToken(token);
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
        await resetModel.createToken(user.id, tokenHash, expiresAt);
        try {
            const activityService = new activity_service_1.default(new activity_model_1.default(dbConnection_config_1.pool));
            await activityService.recordActivity({
                user_id: user.id,
                role: user.role,
                action: "password_reset_requested",
                resource: "auth",
                details: JSON.stringify({ email }),
                ip: (0, activityLogger_1.resolveClientIp)(req),
                user_agent: req.get("user-agent") || "",
            });
        }
        catch (e) {
            console.error("Failed to log password reset request", e);
        }
        const resetLink = `${getClientSideUrl()}/reset-password?token=${encodeURIComponent(token)}`;
        const smtpConfigured = Boolean(process.env.SMTP_SERVICE);
        Boolean(process.env.SMTP_USER) &&
            Boolean(process.env.SMTP_PASS);
        if (smtpConfigured) {
            await (0, mail_service_1.sendPasswordResetEmail)({
                to: user.email,
                resetLink,
                username: user.username,
            });
        }
        else if (process.env.NODE_ENV === "production") {
            return res.status(500).json({
                success: false,
                msg: "Password reset email service is not configured",
            });
        }
        else {
            console.warn("SMTP is not configured; returning a development reset link preview.");
        }
        return res.status(200).json({
            success: true,
            msg: "If the email exists, a reset link has been prepared.",
            data: {
                resetLink: process.env.NODE_ENV === "production" ? undefined : resetLink,
            },
        });
    }
    catch (e) {
        return res.status(500).json({ success: false, msg: `Reset request failed: ${e}` });
    }
}
async function confirmPasswordReset(req, res) {
    try {
        const token = req.body.token?.trim();
        const newPassword = req.body.new_password?.trim();
        const confirmPassword = req.body.confirm_password?.trim();
        if (!token) {
            return res.status(400).json({ success: false, msg: "Token is required" });
        }
        if (!newPassword) {
            return res.status(400).json({ success: false, msg: "New password is required" });
        }
        if (newPassword !== confirmPassword) {
            return res.status(400).json({ success: false, msg: "Passwords do not match" });
        }
        const resetModel = new passwordReset_model_1.default(dbConnection_config_1.pool);
        const tokenRow = await resetModel.findValidToken(hashToken(token));
        if (!tokenRow) {
            return res.status(400).json({ success: false, msg: "Reset link is invalid or expired" });
        }
        const userModel = new user_model_1.default(dbConnection_config_1.pool);
        const user = await userModel.getUserById(tokenRow.user_id);
        if (!user) {
            return res.status(404).json({ success: false, msg: "User not found" });
        }
        const hashedPassword = await bcrypt_1.default.hash(newPassword, 10);
        await userModel.updateUserById(user.id, { password: hashedPassword });
        await resetModel.markTokenUsed(tokenRow.id);
        try {
            const activityService = new activity_service_1.default(new activity_model_1.default(dbConnection_config_1.pool));
            await activityService.recordActivity({
                user_id: user.id,
                role: user.role,
                action: "password_reset_completed",
                resource: "auth",
                details: JSON.stringify({ email: user.email }),
                ip: (0, activityLogger_1.resolveClientIp)(req),
                user_agent: req.get("user-agent") || "",
            });
        }
        catch (e) {
            console.error("Failed to log password reset completion", e);
        }
        return res.status(200).json({ success: true, msg: "Password updated successfully" });
    }
    catch (e) {
        return res.status(500).json({ success: false, msg: `Password reset failed: ${e}` });
    }
}
//# sourceMappingURL=passwordReset.controller.js.map