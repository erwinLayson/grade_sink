import { Request, Response } from "express";
import crypto from "crypto";
import bcrypt from "bcrypt";
import { pool } from "../config/dbConnection.config";
import UserModel from "../model/user.model";
import PasswordResetModel from "../model/passwordReset.model";
import { resolveClientIp } from "../middleware/activityLogger";
import ActivityModel from "../model/activity.model";
import ActivityService from "../service/activity.service";
import { sendPasswordResetEmail } from "../service/mail.service";

function getClientSideUrl() {
  return (process.env.CLIENT_SIDE_URL || "http://localhost:5173").replace(/\/$/, "");
}

function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export async function requestPasswordReset(req: Request<any, any, { email: string }>, res: Response) {
  try {
    const email = req.body.email?.trim().toLowerCase();

    if (!email) {
      return res.status(400).json({ success: false, msg: "Email is required" });
    }

    const userModel = new UserModel(pool);
    const user = await userModel.getUserByEmail(email);

    if (!user) {
      return res.status(200).json({
        success: true,
        msg: "If the email exists, a reset link has been prepared.",
      });
    }

    const resetModel = new PasswordResetModel(pool);
    await resetModel.deleteTokensByUserId(user.id);

    const token = crypto.randomBytes(32).toString("hex");
    const tokenHash = hashToken(token);
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    await resetModel.createToken(user.id, tokenHash, expiresAt);

    try {
      const activityService = new ActivityService(new ActivityModel(pool));
      await activityService.recordActivity({
        user_id: user.id,
        role: user.role,
        action: "password_reset_requested",
        resource: "auth",
        details: JSON.stringify({ email }),
        ip: resolveClientIp(req),
        user_agent: req.get("user-agent") || "",
      });
    } catch (e) {
      console.error("Failed to log password reset request", e);
    }

    const resetLink = `${getClientSideUrl()}/reset-password?token=${encodeURIComponent(token)}`;

    const smtpConfigured =
      Boolean(process.env.SMTP_SERVICE)
      Boolean(process.env.SMTP_USER) &&
      Boolean(process.env.SMTP_PASS);

    if (smtpConfigured) {
      await sendPasswordResetEmail({
        to: user.email,
        resetLink,
        username: user.username,
      });
    } else if (process.env.NODE_ENV === "production") {
      return res.status(500).json({
        success: false,
        msg: "Password reset email service is not configured",
      });
    } else {
      console.warn("SMTP is not configured; returning a development reset link preview.");
    }

    return res.status(200).json({
      success: true,
      msg: "If the email exists, a reset link has been prepared.",
      data: {
        resetLink: process.env.NODE_ENV === "production" ? undefined : resetLink,
      },
    });
  } catch (e) {
    return res.status(500).json({ success: false, msg: `Reset request failed: ${e}` });
  }
}

export async function confirmPasswordReset(
  req: Request<any, any, { token: string; new_password: string; confirm_password: string }>,
  res: Response,
) {
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

    const resetModel = new PasswordResetModel(pool);
    const tokenRow = await resetModel.findValidToken(hashToken(token));

    if (!tokenRow) {
      return res.status(400).json({ success: false, msg: "Reset link is invalid or expired" });
    }

    const userModel = new UserModel(pool);
    const user = await userModel.getUserById(tokenRow.user_id);

    if (!user) {
      return res.status(404).json({ success: false, msg: "User not found" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await userModel.updateUserById(user.id, { password: hashedPassword });
    await resetModel.markTokenUsed(tokenRow.id as number);

    try {
      const activityService = new ActivityService(new ActivityModel(pool));
      await activityService.recordActivity({
        user_id: user.id,
        role: user.role,
        action: "password_reset_completed",
        resource: "auth",
        details: JSON.stringify({ email: user.email }),
        ip: resolveClientIp(req),
        user_agent: req.get("user-agent") || "",
      });
    } catch (e) {
      console.error("Failed to log password reset completion", e);
    }

    return res.status(200).json({ success: true, msg: "Password updated successfully" });
  } catch (e) {
    return res.status(500).json({ success: false, msg: `Password reset failed: ${e}` });
  }
}