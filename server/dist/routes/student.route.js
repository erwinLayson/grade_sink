"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const student_controller_1 = require("../controller/student.controller");
const validateToken_1 = __importDefault(require("../middleware/validateToken"));
const allowedRole_1 = __importDefault(require("../middleware/allowedRole"));
const userRole_1 = require("../constant/userRole");
const route = (0, express_1.Router)();
route.get("/students", validateToken_1.default, (0, allowedRole_1.default)([userRole_1.ROLES.ADMIN, userRole_1.ROLES.SUPER_ADMIN]), student_controller_1.getAllStudents);
route.get("/students/:id", validateToken_1.default, (0, allowedRole_1.default)([userRole_1.ROLES.ADMIN, userRole_1.ROLES.SUPER_ADMIN]), student_controller_1.getStudentById);
route.post("/students", validateToken_1.default, (0, allowedRole_1.default)([userRole_1.ROLES.ADMIN, userRole_1.ROLES.SUPER_ADMIN]), student_controller_1.createStudent);
// Import endpoints
route.post("/students/import/preview", validateToken_1.default, (0, allowedRole_1.default)([userRole_1.ROLES.ADMIN, userRole_1.ROLES.SUPER_ADMIN]), 
// controller provides multer middleware in array
...student_controller_1.importPreview);
route.post("/students/import", validateToken_1.default, (0, allowedRole_1.default)([userRole_1.ROLES.ADMIN, userRole_1.ROLES.SUPER_ADMIN]), student_controller_1.importCommit);
route.put("/students/:id", validateToken_1.default, (0, allowedRole_1.default)([userRole_1.ROLES.ADMIN, userRole_1.ROLES.SUPER_ADMIN]), student_controller_1.updateStudent);
route.delete("/students/:id", validateToken_1.default, (0, allowedRole_1.default)([userRole_1.ROLES.ADMIN, userRole_1.ROLES.SUPER_ADMIN]), student_controller_1.deleteStudent);
exports.default = route;
//# sourceMappingURL=student.route.js.map