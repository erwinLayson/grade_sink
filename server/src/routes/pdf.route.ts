import express from "express";
import validateToken from "../middleware/validateToken";
import { generateClassStudentPDFs } from "../controller/pdf.controller";

const router = express.Router();

router.post("/classes/:classId/generate-pdfs", validateToken, generateClassStudentPDFs);

export default router;
