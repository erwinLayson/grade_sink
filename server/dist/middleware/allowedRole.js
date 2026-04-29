"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const allowedRole = (roles) => {
    return (req, res, next) => {
        const user = req.user;
        if (!user) {
            return res.status(401).json({ msg: "Unauthorize" });
        }
        if (!roles.includes(user.role)) {
            return res.status(403).json({ msg: "Forbidden: Access denied" });
        }
        next();
    };
};
exports.default = allowedRole;
//# sourceMappingURL=allowedRole.js.map