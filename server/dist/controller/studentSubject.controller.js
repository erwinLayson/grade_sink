"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllStudentSubjects = getAllStudentSubjects;
exports.getStudentSubjectById = getStudentSubjectById;
exports.getSubjectsByStudent = getSubjectsByStudent;
exports.createStudentSubject = createStudentSubject;
exports.deleteStudentSubject = deleteStudentSubject;
const studentSubject_service_1 = __importDefault(require("../service/studentSubject/studentSubject.service"));
const studentSubject_model_1 = __importDefault(require("../model/studentSubject.model"));
const dbConnection_config_1 = require("../config/dbConnection.config");
async function getAllStudentSubjects(req, res) {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const offset = parseInt(req.query.offset) || 0;
        const ssService = new studentSubject_service_1.default(new studentSubject_model_1.default(dbConnection_config_1.pool));
        const studentSubjects = await ssService.getAllStudentSubjects();
        const paginatedSS = studentSubjects.slice(offset, offset + limit);
        res.status(200).json({
            success: true,
            data: paginatedSS,
            pagination: { limit, offset, total: studentSubjects.length }
        });
    }
    catch (e) {
        res.status(500).json({ success: false, msg: `Error: ${e}` });
    }
}
async function getStudentSubjectById(req, res) {
    try {
        const id = parseInt(req.params.id);
        const ssService = new studentSubject_service_1.default(new studentSubject_model_1.default(dbConnection_config_1.pool));
        const ss = await ssService.getStudentSubjectById(id);
        if (!ss) {
            return res.status(404).json({ success: false, msg: "Student-Subject entry not found" });
        }
        res.status(200).json({ success: true, data: ss });
    }
    catch (e) {
        res.status(500).json({ success: false, msg: `Error: ${e}` });
    }
}
async function getSubjectsByStudent(req, res) {
    try {
        const studentId = parseInt(req.params.studentId);
        const ssService = new studentSubject_service_1.default(new studentSubject_model_1.default(dbConnection_config_1.pool));
        const subjects = await ssService.getSubjectsByStudentId(studentId);
        res.status(200).json({ success: true, data: subjects });
    }
    catch (e) {
        res.status(500).json({ success: false, msg: `Error: ${e}` });
    }
}
async function createStudentSubject(req, res) {
    try {
        const { student_id, subject_id, teacher_id } = req.body;
        if (!student_id || !subject_id || !teacher_id) {
            return res.status(400).json({ success: false, msg: "Student ID, Subject ID, and Teacher ID are required" });
        }
        const ssService = new studentSubject_service_1.default(new studentSubject_model_1.default(dbConnection_config_1.pool));
        const result = await ssService.createStudentSubject({ student_id, subject_id, teacher_id });
        if (result) {
            return res.status(201).json({ success: true, msg: "Subject assigned to student successfully", data: { id: result } });
        }
    }
    catch (e) {
        res.status(500).json({ success: false, msg: `Error: ${e}` });
    }
}
async function deleteStudentSubject(req, res) {
    try {
        const id = parseInt(req.params.id);
        const ssService = new studentSubject_service_1.default(new studentSubject_model_1.default(dbConnection_config_1.pool));
        const result = await ssService.deleteStudentSubjectById(id);
        if (result === 0) {
            return res.status(404).json({ success: false, msg: "Student-Subject entry not found" });
        }
        res.status(200).json({ success: true, msg: "Subject removed from student successfully" });
    }
    catch (e) {
        res.status(500).json({ success: false, msg: `Error: ${e}` });
    }
}
//# sourceMappingURL=studentSubject.controller.js.map