"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_auth_1 = require("../auth/user.auth");
const passwordReset_controller_1 = require("../controller/passwordReset.controller");
const express_1 = require("express");
const validateToken_1 = __importDefault(require("../middleware/validateToken"));
const route = (0, express_1.Router)();
route.post("/auth", user_auth_1.authUser);
route.post("/auth/forgot-password", passwordReset_controller_1.requestPasswordReset);
route.post("/auth/reset-password", passwordReset_controller_1.confirmPasswordReset);
route.get("/auth/verify", validateToken_1.default, user_auth_1.verifyAuthUser);
route.post("/logout", user_auth_1.logoutUser);
exports.default = route;
//# sourceMappingURL=userAuth.route.js.map