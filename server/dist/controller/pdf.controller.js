"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getReport = getReport;
const reportCard_model_1 = __importDefault(require("../model/reportCard.model"));
const teacher_model_1 = __importDefault(require("../model/teacher.model"));
const classTeacher_service_1 = __importDefault(require("../service/classTeacher/classTeacher.service"));
const classTeacher_model_1 = __importDefault(require("../model/classTeacher.model"));
const generateGrade_pdf_1 = __importDefault(require("../helper/generateGrade.pdf"));
const dbConnection_config_1 = require("../config/dbConnection.config");
const generateCardPdf_service_1 = require("../service/generateCardPdf.service");
async function getReport(req, res) {
    try {
        // support both :classId and :_id route params
        const rawId = req.params.classId ?? req.params._id ?? req.query.classId;
        const classId = Number(rawId);
        if (!rawId || isNaN(classId)) {
            return res.status(400).json({ msg: "Invalid Class Id" });
        }
        // Authorization: if requester is a teacher, ensure they advise this class
        const decoded = req.user;
        if (decoded?.role === "teacher") {
            const teacherModel = new teacher_model_1.default(dbConnection_config_1.pool);
            const teacher = await teacherModel.getTeacherByEmail(decoded.email ?? "");
            if (!teacher) {
                return res.status(401).json({ msg: "Unauthorized" });
            }
            const ctService = new classTeacher_service_1.default(new classTeacher_model_1.default(dbConnection_config_1.pool));
            const teachers = await ctService.getTeachersByClassId(classId);
            const advisingTeacherIds = (teachers || []).map((t) => t.teacher_id);
            if (!advisingTeacherIds.includes(teacher.id)) {
                return res.status(403).json({ msg: "Forbidden: you are not the advising teacher for this class" });
            }
        }
        const rcModel = new reportCard_model_1.default(dbConnection_config_1.pool);
        const data = await rcModel.getStudentGradeByClassId(classId);
        if (!data || data.length === 0) {
            return res.status(404).json({ msg: "No students or grades found for this class" });
        }
        const map = new Map();
        for (const row of data) {
            if (!map.has(row.studentId)) {
                map.set(row.studentId, {
                    studentId: row.studentId,
                    fullName: row.fullName,
                    className: row.className,
                    classSection: row.classSection,
                    schoolLevel: row.schoolLevel ?? null,
                    LRN: row.LRN ?? null,
                    sex: row.sex ?? null,
                    age: row.age ?? null,
                    subjects: []
                });
            }
            const student = map.get(row.studentId);
            student.subjects.push({
                name: row.subjectName,
                grades: row.grades ?? null,
                quarter: row.quarter ?? null
            });
        }
        const result = Array.from(map.values());
        const html = (0, generateGrade_pdf_1.default)(result);
        const pdf = await (0, generateCardPdf_service_1.generatePdfGrade)(html);
        res.set({
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename="report_${classId}.pdf"`,
        });
        return res.send(pdf);
    }
    catch (err) {
        console.error("getReport error:", err);
        return res.status(500).json({ msg: "Failed to build report" });
    }
}
//# sourceMappingURL=pdf.controller.js.map