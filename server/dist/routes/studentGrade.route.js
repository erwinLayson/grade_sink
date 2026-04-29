"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const studentGrade_controller_1 = require("../controller/studentGrade.controller");
const validateToken_1 = __importDefault(require("../middleware/validateToken"));
const allowedRole_1 = __importDefault(require("../middleware/allowedRole"));
const userRole_1 = require("../constant/userRole");
const route = (0, express_1.Router)();
route.get("/grades", validateToken_1.default, (0, allowedRole_1.default)([userRole_1.ROLES.ADMIN, userRole_1.ROLES.SUPER_ADMIN, userRole_1.ROLES.TEACHER]), studentGrade_controller_1.getAllGrades);
route.get("/grades/:id", validateToken_1.default, (0, allowedRole_1.default)([userRole_1.ROLES.ADMIN, userRole_1.ROLES.SUPER_ADMIN, userRole_1.ROLES.TEACHER]), studentGrade_controller_1.getGradeById);
route.get("/grades/student/:studentId", validateToken_1.default, (0, allowedRole_1.default)([userRole_1.ROLES.ADMIN, userRole_1.ROLES.SUPER_ADMIN, userRole_1.ROLES.TEACHER]), studentGrade_controller_1.getGradesByStudent);
route.post("/grades", validateToken_1.default, (0, allowedRole_1.default)([userRole_1.ROLES.ADMIN, userRole_1.ROLES.SUPER_ADMIN, userRole_1.ROLES.TEACHER]), studentGrade_controller_1.createGrade);
route.put("/grades/:id", validateToken_1.default, (0, allowedRole_1.default)([userRole_1.ROLES.ADMIN, userRole_1.ROLES.SUPER_ADMIN, userRole_1.ROLES.TEACHER]), studentGrade_controller_1.updateGrade);
route.delete("/grades/:id", validateToken_1.default, (0, allowedRole_1.default)([userRole_1.ROLES.ADMIN, userRole_1.ROLES.SUPER_ADMIN]), studentGrade_controller_1.deleteGrade);
exports.default = route;
//# sourceMappingURL=studentGrade.route.js.map