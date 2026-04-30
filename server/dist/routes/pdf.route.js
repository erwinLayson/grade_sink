"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const validateToken_1 = __importDefault(require("../middleware/validateToken"));
const allowedRole_1 = __importDefault(require("../middleware/allowedRole"));
const userRole_1 = require("../constant/userRole");
const pdf_controller_1 = require("../controller/pdf.controller");
const router = express_1.default.Router();
router.get("/classes/:classId/generate-pdfs", validateToken_1.default, (0, allowedRole_1.default)([userRole_1.ROLES.TEACHER, userRole_1.ROLES.ADMIN, userRole_1.ROLES.SUPER_ADMIN]), pdf_controller_1.getReport);
exports.default = router;
//# sourceMappingURL=pdf.route.js.map