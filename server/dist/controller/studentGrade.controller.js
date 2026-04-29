"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllGrades = getAllGrades;
exports.getGradeById = getGradeById;
exports.getGradesByStudent = getGradesByStudent;
exports.createGrade = createGrade;
exports.updateGrade = updateGrade;
exports.deleteGrade = deleteGrade;
const studentGrade_service_1 = __importDefault(require("../service/studentGrade/studentGrade.service"));
const studentGrade_model_1 = __importDefault(require("../model/studentGrade.model"));
const teacher_model_1 = __importDefault(require("../model/teacher.model"));
const dbConnection_config_1 = require("../config/dbConnection.config");
async function resolveTeacherIdFromRequest(req) {
    const user = req.user;
    if (!user?.email) {
        return null;
    }
    const teacherModel = new teacher_model_1.default(dbConnection_config_1.pool);
    const teacher = await teacherModel.getTeacherByEmail(user.email);
    return teacher?.id ?? null;
}
async function getAllGrades(req, res) {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const offset = parseInt(req.query.offset) || 0;
        const gradeService = new studentGrade_service_1.default(new studentGrade_model_1.default(dbConnection_config_1.pool));
        const grades = await gradeService.getAllStudentGrades();
        const paginatedGrades = grades.slice(offset, offset + limit);
        res.status(200).json({
            success: true,
            data: paginatedGrades,
            pagination: { limit, offset, total: grades.length }
        });
    }
    catch (e) {
        res.status(500).json({ success: false, msg: `Error: ${e}` });
    }
}
async function getGradeById(req, res) {
    try {
        const id = parseInt(req.params.id);
        const gradeService = new studentGrade_service_1.default(new studentGrade_model_1.default(dbConnection_config_1.pool));
        const grade = await gradeService.getStudentGradeById(id);
        if (!grade) {
            return res.status(404).json({ success: false, msg: "Grade not found" });
        }
        res.status(200).json({ success: true, data: grade });
    }
    catch (e) {
        res.status(500).json({ success: false, msg: `Error: ${e}` });
    }
}
async function getGradesByStudent(req, res) {
    try {
        const studentId = parseInt(req.params.studentId);
        const gradeService = new studentGrade_service_1.default(new studentGrade_model_1.default(dbConnection_config_1.pool));
        const grades = await gradeService.getGradesByStudentId(studentId);
        res.status(200).json({ success: true, data: grades });
    }
    catch (e) {
        res.status(500).json({ success: false, msg: `Error: ${e}` });
    }
}
async function createGrade(req, res) {
    try {
        const { student_id, subject_id, teacher_id, grade, quarter } = req.body;
        const user = req.user;
        const gradeService = new studentGrade_service_1.default(new studentGrade_model_1.default(dbConnection_config_1.pool));
        const resolvedTeacherId = user?.role === "teacher"
            ? await resolveTeacherIdFromRequest(req)
            : teacher_id;
        if (!student_id || !subject_id || !resolvedTeacherId || grade === undefined || !quarter) {
            return res.status(400).json({ success: false, msg: "All grade fields are required" });
        }
        const existingGrade = await gradeService.getStudentGradeByStudentSubjectQuarter(student_id, subject_id, quarter);
        if (existingGrade) {
            return res.status(409).json({
                success: false,
                msg: "Grade already exists for this student, subject, and quarter. Use edit instead.",
                data: existingGrade,
            });
        }
        const result = await gradeService.createStudentGrade({
            student_id,
            subject_id,
            teacher_id: resolvedTeacherId,
            grade,
            quarter,
        });
        if (result) {
            return res.status(201).json({ success: true, msg: "Grade created successfully", data: { id: result } });
        }
    }
    catch (e) {
        res.status(500).json({ success: false, msg: `Error: ${e}` });
    }
}
async function updateGrade(req, res) {
    try {
        const id = parseInt(req.params.id);
        const data = req.body;
        const user = req.user;
        const gradeService = new studentGrade_service_1.default(new studentGrade_model_1.default(dbConnection_config_1.pool));
        // Check if teacher is updating their own grade
        if (user.role === "teacher") {
            const teacherId = await resolveTeacherIdFromRequest(req);
            const grade = await gradeService.getStudentGradeById(id);
            if (!grade || !teacherId || grade.teacher_id !== teacherId) {
                return res.status(403).json({ success: false, msg: "You can only update your own grades" });
            }
        }
        const result = await gradeService.updateStudentGradeById(id, data);
        if (result === 0) {
            return res.status(404).json({ success: false, msg: "Grade not found" });
        }
        res.status(200).json({ success: true, msg: "Grade updated successfully" });
    }
    catch (e) {
        res.status(500).json({ success: false, msg: `Error: ${e}` });
    }
}
async function deleteGrade(req, res) {
    try {
        const id = parseInt(req.params.id);
        const gradeService = new studentGrade_service_1.default(new studentGrade_model_1.default(dbConnection_config_1.pool));
        const result = await gradeService.deleteStudentGradeById(id);
        if (result === 0) {
            return res.status(404).json({ success: false, msg: "Grade not found" });
        }
        res.status(200).json({ success: true, msg: "Grade deleted successfully" });
    }
    catch (e) {
        res.status(500).json({ success: false, msg: `Error: ${e}` });
    }
}
//# sourceMappingURL=studentGrade.controller.js.map