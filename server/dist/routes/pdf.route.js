"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const validateToken_1 = __importDefault(require("../middleware/validateToken"));
const pdf_controller_1 = require("../controller/pdf.controller");
const router = express_1.default.Router();
router.post("/classes/:classId/generate-pdfs", validateToken_1.default, pdf_controller_1.generateClassStudentPDFs);
exports.default = router;
//# sourceMappingURL=pdf.route.js.map