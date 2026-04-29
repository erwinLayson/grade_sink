"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controller/user.controller");
const validateToken_1 = __importDefault(require("../middleware/validateToken"));
const allowedRole_1 = __importDefault(require("../middleware/allowedRole"));
const userRole_1 = require("../constant/userRole");
const route = (0, express_1.Router)();
route.get("/users", validateToken_1.default, (0, allowedRole_1.default)([userRole_1.ROLES.ADMIN, userRole_1.ROLES.SUPER_ADMIN]), user_controller_1.getAllUser);
route.get("/users/:email", validateToken_1.default, user_controller_1.getUserByEmail);
route.put("/users/:email", validateToken_1.default, user_controller_1.updateUserByEmail);
route.post("/users", user_controller_1.createUser);
exports.default = route;
//# sourceMappingURL=user.route.js.map