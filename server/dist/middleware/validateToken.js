"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const validateToken = async (req, res, next) => {
    const token = req.cookies?.userAuth;
    if (!token) {
        return res.status(401).json({ msg: "No token, Unauthorize" });
    }
    try {
        const seckretKey = process.env.SECRET_KEY;
        if (!seckretKey) {
            return res.status(500).json({ msg: `Server misconfiguration` });
        }
        const decoded = jsonwebtoken_1.default.verify(token, seckretKey);
        req.user = decoded;
        next();
    }
    catch (e) {
        res.status(401).json({ msg: "Invalid expire token" });
    }
};
exports.default = validateToken;
//# sourceMappingURL=validateToken.js.map