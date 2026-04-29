"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const studentSubject_controller_1 = require("../controller/studentSubject.controller");
const validateToken_1 = __importDefault(require("../middleware/validateToken"));
const allowedRole_1 = __importDefault(require("../middleware/allowedRole"));
const userRole_1 = require("../constant/userRole");
const route = (0, express_1.Router)();
route.get("/student-subjects", validateToken_1.default, (0, allowedRole_1.default)([userRole_1.ROLES.ADMIN, userRole_1.ROLES.SUPER_ADMIN]), studentSubject_controller_1.getAllStudentSubjects);
route.get("/student-subjects/:id", validateToken_1.default, (0, allowedRole_1.default)([userRole_1.ROLES.ADMIN, userRole_1.ROLES.SUPER_ADMIN]), studentSubject_controller_1.getStudentSubjectById);
route.get("/student-subjects/student/:studentId", validateToken_1.default, (0, allowedRole_1.default)([userRole_1.ROLES.ADMIN, userRole_1.ROLES.SUPER_ADMIN]), studentSubject_controller_1.getSubjectsByStudent);
route.post("/student-subjects", validateToken_1.default, (0, allowedRole_1.default)([userRole_1.ROLES.ADMIN, userRole_1.ROLES.SUPER_ADMIN]), studentSubject_controller_1.createStudentSubject);
route.delete("/student-subjects/:id", validateToken_1.default, (0, allowedRole_1.default)([userRole_1.ROLES.ADMIN, userRole_1.ROLES.SUPER_ADMIN]), studentSubject_controller_1.deleteStudentSubject);
exports.default = route;
//# sourceMappingURL=studentSubject.route.js.map