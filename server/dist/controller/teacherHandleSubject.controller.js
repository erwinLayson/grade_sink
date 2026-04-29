"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllTeacherHandleSubjects = getAllTeacherHandleSubjects;
exports.getTeacherHandleSubjectById = getTeacherHandleSubjectById;
exports.getSubjectsByTeacher = getSubjectsByTeacher;
exports.createTeacherHandleSubject = createTeacherHandleSubject;
exports.deleteTeacherHandleSubject = deleteTeacherHandleSubject;
const teacherHandleSubject_service_1 = __importDefault(require("../service/teacherHandleSubject/teacherHandleSubject.service"));
const teacherHandleSubject_model_1 = __importDefault(require("../model/teacherHandleSubject.model"));
const dbConnection_config_1 = require("../config/dbConnection.config");
async function getAllTeacherHandleSubjects(req, res) {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const offset = parseInt(req.query.offset) || 0;
        const thsService = new teacherHandleSubject_service_1.default(new teacherHandleSubject_model_1.default(dbConnection_config_1.pool));
        const assignments = await thsService.getAllTeacherHandleSubjects();
        const paginatedAssignments = assignments.slice(offset, offset + limit);
        res.status(200).json({
            success: true,
            data: paginatedAssignments,
            pagination: { limit, offset, total: assignments.length }
        });
    }
    catch (e) {
        res.status(500).json({ success: false, msg: `Error: ${e}` });
    }
}
async function getTeacherHandleSubjectById(req, res) {
    try {
        const id = parseInt(req.params.id);
        const thsService = new teacherHandleSubject_service_1.default(new teacherHandleSubject_model_1.default(dbConnection_config_1.pool));
        const assignment = await thsService.getTeacherHandleSubjectById(id);
        if (!assignment) {
            return res.status(404).json({ success: false, msg: "Teacher-Subject assignment not found" });
        }
        res.status(200).json({ success: true, data: assignment });
    }
    catch (e) {
        res.status(500).json({ success: false, msg: `Error: ${e}` });
    }
}
async function getSubjectsByTeacher(req, res) {
    try {
        const teacherId = parseInt(req.params.teacherId);
        const thsService = new teacherHandleSubject_service_1.default(new teacherHandleSubject_model_1.default(dbConnection_config_1.pool));
        const subjects = await thsService.getSubjectsByTeacherId(teacherId);
        res.status(200).json({ success: true, data: subjects });
    }
    catch (e) {
        res.status(500).json({ success: false, msg: `Error: ${e}` });
    }
}
async function createTeacherHandleSubject(req, res) {
    try {
        const { teacher_id, subject_id } = req.body;
        if (!teacher_id || !subject_id) {
            return res.status(400).json({ success: false, msg: "Teacher ID and Subject ID are required" });
        }
        const thsService = new teacherHandleSubject_service_1.default(new teacherHandleSubject_model_1.default(dbConnection_config_1.pool));
        const result = await thsService.createTeacherHandleSubject({ teacher_id, subject_id });
        if (result) {
            return res.status(201).json({ success: true, msg: "Subject assigned to teacher successfully", data: { id: result } });
        }
    }
    catch (e) {
        res.status(500).json({ success: false, msg: `Error: ${e}` });
    }
}
async function deleteTeacherHandleSubject(req, res) {
    try {
        const id = parseInt(req.params.id);
        const thsService = new teacherHandleSubject_service_1.default(new teacherHandleSubject_model_1.default(dbConnection_config_1.pool));
        const result = await thsService.deleteTeacherHandleSubjectById(id);
        if (result === 0) {
            return res.status(404).json({ success: false, msg: "Teacher-Subject assignment not found" });
        }
        res.status(200).json({ success: true, msg: "Subject removed from teacher successfully" });
    }
    catch (e) {
        res.status(500).json({ success: false, msg: `Error: ${e}` });
    }
}
//# sourceMappingURL=teacherHandleSubject.controller.js.map