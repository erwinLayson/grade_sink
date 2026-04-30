import express from "express";
import validateToken from "../middleware/validateToken";
import allowedRole from "../middleware/allowedRole";
import { ROLES } from "../constant/userRole";
import { getReport } from "../controller/pdf.controller";

const router = express.Router();

router.get(
	"/classes/:classId/generate-pdfs",
	validateToken,
	allowedRole([ROLES.TEACHER, ROLES.ADMIN, ROLES.SUPER_ADMIN]),
	getReport,
);

export default router;
