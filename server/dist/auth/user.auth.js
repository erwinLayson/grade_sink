"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logoutUser = exports.verifyAuthUser = exports.authUser = void 0;
const user_model_1 = __importDefault(require("../model/user.model"));
const dbConnection_config_1 = require("../config/dbConnection.config");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const activity_service_1 = __importDefault(require("../service/activity.service"));
const activity_model_1 = __importDefault(require("../model/activity.model"));
const activityLogger_1 = require("../middleware/activityLogger");
const loginLimiter_1 = __importStar(require("../middleware/loginLimiter"));
const authUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email.trim())
            return res.status(400).json({ msg: "Email is required" });
        if (!password.trim())
            return res.status(400).json({ msg: "Password is required" });
        const userModel = new user_model_1.default(dbConnection_config_1.pool);
        const user = await userModel.getUserByEmail(email);
        if (!user) {
            try {
                const activityService = new activity_service_1.default(new activity_model_1.default(dbConnection_config_1.pool));
                await activityService.recordActivity({
                    user_id: 0,
                    role: "unknown",
                    action: "login_failed",
                    resource: "auth",
                    details: JSON.stringify({ reason: "user_not_found", email }),
                    ip: (0, activityLogger_1.resolveClientIp)(req),
                    user_agent: req.get("user-agent") || "",
                });
            }
            catch (e) {
                console.error("Failed to record login_failed activity (user not found)", e);
            }
            return res.status(401).json({ msg: `User email ${email} is not found!` });
        }
        const isMatch = await bcrypt_1.default.compare(password, user.password);
        if (!isMatch) {
            try {
                const activityService = new activity_service_1.default(new activity_model_1.default(dbConnection_config_1.pool));
                await activityService.recordActivity({
                    user_id: user.id,
                    role: user.role,
                    action: "login_failed",
                    resource: "auth",
                    details: JSON.stringify({ reason: "wrong_password", email }),
                    ip: (0, activityLogger_1.resolveClientIp)(req),
                    user_agent: req.get("user-agent") || "",
                });
            }
            catch (e) {
                console.error("Failed to record login_failed activity (wrong password)", e);
            }
            return res.status(401).json({ msg: `Incorrect password` });
        }
        const secretKey = process.env.SECRET_KEY;
        if (!secretKey) {
            throw new Error("JWT_SECRET is not defined");
        }
        const token = jsonwebtoken_1.default.sign({ email, role: user.role }, secretKey, { expiresIn: "1h" });
        res.cookie("userAuth", token, {
            sameSite: "lax",
            httpOnly: true,
            secure: false
        });
        try {
            const activityService = new activity_service_1.default(new activity_model_1.default(dbConnection_config_1.pool));
            await activityService.recordActivity({
                user_id: user.id,
                role: user.role,
                action: "login",
                resource: "auth",
                details: JSON.stringify({ email }),
                ip: (0, activityLogger_1.resolveClientIp)(req),
                user_agent: req.get("user-agent") || "",
            });
        }
        catch (e) {
            console.error("Failed to record login activity", e);
        }
        try {
            await loginLimiter_1.default.resetKey((0, loginLimiter_1.getLoginRateLimitKey)(req));
        }
        catch (e) {
            console.error("Failed to reset login limiter after successful login", e);
        }
        return res.status(200).json({
            msg: "Login successful",
            data: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    }
    catch (e) {
        console.log(`Error: ${e}`);
        return res.status(500).json({ msg: "Internal server Error" });
    }
};
exports.authUser = authUser;
const verifyAuthUser = async (req, res) => {
    try {
        const decodedUser = req.user;
        if (!decodedUser?.email) {
            return res.status(401).json({ msg: "Unauthorized" });
        }
        const userModel = new user_model_1.default(dbConnection_config_1.pool);
        const user = await userModel.getUserByEmail(decodedUser.email);
        if (!user) {
            return res.status(401).json({ msg: "Session expired" });
        }
        return res.status(200).json({
            msg: "Session valid",
            data: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
            },
        });
    }
    catch (e) {
        console.log(`Error: ${e}`);
        return res.status(500).json({ msg: "Internal server Error" });
    }
};
exports.verifyAuthUser = verifyAuthUser;
const logoutUser = async (req, res) => {
    try {
        // attempt to determine user for logging (may be present via validateToken middleware)
        try {
            const activityService = new activity_service_1.default(new activity_model_1.default(dbConnection_config_1.pool));
            let user = req.user;
            if (!user) {
                const token = req.cookies?.userAuth || req.cookies?.userAuth;
                const secretKey = process.env.SECRET_KEY;
                if (token && secretKey) {
                    try {
                        const decoded = jsonwebtoken_1.default.verify(token, secretKey);
                        if (decoded?.email) {
                            const userModel = new user_model_1.default(dbConnection_config_1.pool);
                            const found = await userModel.getUserByEmail(decoded.email);
                            if (found)
                                user = found;
                        }
                    }
                    catch (_) {
                        // ignore invalid token
                    }
                }
            }
            if (user) {
                await activityService.recordActivity({
                    user_id: user.id,
                    role: user.role,
                    action: "logout",
                    resource: "auth",
                    details: JSON.stringify({}),
                    ip: (0, activityLogger_1.resolveClientIp)(req),
                    user_agent: req.get("user-agent") || "",
                });
            }
        }
        catch (e) {
            console.error("Failed to record logout activity", e);
        }
        res.clearCookie("userAuth", {
            sameSite: "lax",
            httpOnly: true,
            secure: false,
        });
        return res.status(200).json({ msg: "Logout successful" });
    }
    catch (e) {
        console.log(`Error: ${e}`);
        return res.status(500).json({ msg: "Internal server Error" });
    }
};
exports.logoutUser = logoutUser;
//# sourceMappingURL=user.auth.js.map