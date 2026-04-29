"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllClassSubjects = getAllClassSubjects;
exports.getClassSubjectById = getClassSubjectById;
exports.getSubjectsByClass = getSubjectsByClass;
exports.getClassesByTeacherSubjects = getClassesByTeacherSubjects;
exports.createClassSubject = createClassSubject;
exports.deleteClassSubject = deleteClassSubject;
const classSubject_service_1 = __importDefault(require("../service/classSubject/classSubject.service"));
const classSubject_model_1 = __importDefault(require("../model/classSubject.model"));
const dbConnection_config_1 = require("../config/dbConnection.config");
async function getAllClassSubjects(req, res) {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const offset = parseInt(req.query.offset) || 0;
        const csService = new classSubject_service_1.default(new classSubject_model_1.default(dbConnection_config_1.pool));
        const classSubjects = await csService.getAllClassSubjects();
        const paginatedCS = classSubjects.slice(offset, offset + limit);
        res.status(200).json({
            success: true,
            data: paginatedCS,
            pagination: { limit, offset, total: classSubjects.length }
        });
    }
    catch (e) {
        res.status(500).json({ success: false, msg: `Error: ${e}` });
    }
}
async function getClassSubjectById(req, res) {
    try {
        const id = parseInt(req.params.id);
        const csService = new classSubject_service_1.default(new classSubject_model_1.default(dbConnection_config_1.pool));
        const cs = await csService.getClassSubjectById(id);
        if (!cs) {
            return res.status(404).json({ success: false, msg: "Class-Subject entry not found" });
        }
        res.status(200).json({ success: true, data: cs });
    }
    catch (e) {
        res.status(500).json({ success: false, msg: `Error: ${e}` });
    }
}
async function getSubjectsByClass(req, res) {
    try {
        const classId = parseInt(req.params.classId);
        const csService = new classSubject_service_1.default(new classSubject_model_1.default(dbConnection_config_1.pool));
        const subjects = await csService.getSubjectsByClassId(classId);
        res.status(200).json({ success: true, data: subjects });
    }
    catch (e) {
        res.status(500).json({ success: false, msg: `Error: ${e}` });
    }
}
async function getClassesByTeacherSubjects(req, res) {
    try {
        const teacherId = parseInt(req.params.teacherId);
        const csService = new classSubject_service_1.default(new classSubject_model_1.default(dbConnection_config_1.pool));
        const classes = await csService.getClassesByTeacherId(teacherId);
        res.status(200).json({ success: true, data: classes });
    }
    catch (e) {
        res.status(500).json({ success: false, msg: `Error: ${e}` });
    }
}
async function createClassSubject(req, res) {
    try {
        const { class_id, subject_id } = req.body;
        if (!class_id || !subject_id) {
            return res.status(400).json({ success: false, msg: "Class ID and Subject ID are required" });
        }
        const csService = new classSubject_service_1.default(new classSubject_model_1.default(dbConnection_config_1.pool));
        const result = await csService.createClassSubject({ class_id, subject_id });
        if (result) {
            return res.status(201).json({ success: true, msg: "Subject added to class successfully", data: { id: result } });
        }
    }
    catch (e) {
        res.status(500).json({ success: false, msg: `Error: ${e}` });
    }
}
async function deleteClassSubject(req, res) {
    try {
        const id = parseInt(req.params.id);
        const csService = new classSubject_service_1.default(new classSubject_model_1.default(dbConnection_config_1.pool));
        const result = await csService.deleteClassSubjectById(id);
        if (result === 0) {
            return res.status(404).json({ success: false, msg: "Class-Subject entry not found" });
        }
        res.status(200).json({ success: true, msg: "Subject removed from class successfully" });
    }
    catch (e) {
        res.status(500).json({ success: false, msg: `Error: ${e}` });
    }
}
//# sourceMappingURL=classSubject.controller.js.map