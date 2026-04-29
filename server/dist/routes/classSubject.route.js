"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const classSubject_controller_1 = require("../controller/classSubject.controller");
const validateToken_1 = __importDefault(require("../middleware/validateToken"));
const allowedRole_1 = __importDefault(require("../middleware/allowedRole"));
const userRole_1 = require("../constant/userRole");
const route = (0, express_1.Router)();
route.get("/class-subjects", validateToken_1.default, (0, allowedRole_1.default)([userRole_1.ROLES.ADMIN, userRole_1.ROLES.SUPER_ADMIN]), classSubject_controller_1.getAllClassSubjects);
route.get("/class-subjects/:id", validateToken_1.default, (0, allowedRole_1.default)([userRole_1.ROLES.ADMIN, userRole_1.ROLES.SUPER_ADMIN]), classSubject_controller_1.getClassSubjectById);
route.get("/class-subjects/class/:classId", validateToken_1.default, (0, allowedRole_1.default)([userRole_1.ROLES.ADMIN, userRole_1.ROLES.SUPER_ADMIN, userRole_1.ROLES.TEACHER]), classSubject_controller_1.getSubjectsByClass);
route.get("/class-subjects/teacher/:teacherId", validateToken_1.default, (0, allowedRole_1.default)([userRole_1.ROLES.ADMIN, userRole_1.ROLES.SUPER_ADMIN, userRole_1.ROLES.TEACHER]), classSubject_controller_1.getClassesByTeacherSubjects);
route.post("/class-subjects", validateToken_1.default, (0, allowedRole_1.default)([userRole_1.ROLES.ADMIN, userRole_1.ROLES.SUPER_ADMIN]), classSubject_controller_1.createClassSubject);
route.delete("/class-subjects/:id", validateToken_1.default, (0, allowedRole_1.default)([userRole_1.ROLES.ADMIN, userRole_1.ROLES.SUPER_ADMIN]), classSubject_controller_1.deleteClassSubject);
exports.default = route;
//# sourceMappingURL=classSubject.route.js.map