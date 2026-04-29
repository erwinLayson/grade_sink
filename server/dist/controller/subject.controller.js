"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllSubjects = getAllSubjects;
exports.getSubjectById = getSubjectById;
exports.createSubject = createSubject;
exports.updateSubject = updateSubject;
exports.deleteSubject = deleteSubject;
const subject_service_1 = __importDefault(require("../service/subjects/subject.service"));
const subject_model_1 = __importDefault(require("../model/subject.model"));
const dbConnection_config_1 = require("../config/dbConnection.config");
async function getAllSubjects(req, res) {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const offset = parseInt(req.query.offset) || 0;
        const subjectService = new subject_service_1.default(new subject_model_1.default(dbConnection_config_1.pool));
        const subjects = await subjectService.getAllSubjects();
        const paginatedSubjects = subjects.slice(offset, offset + limit);
        res.status(200).json({
            success: true,
            data: paginatedSubjects,
            pagination: { limit, offset, total: subjects.length }
        });
    }
    catch (e) {
        res.status(500).json({ success: false, msg: `Error: ${e}` });
    }
}
async function getSubjectById(req, res) {
    try {
        const id = parseInt(req.params.id);
        const subjectService = new subject_service_1.default(new subject_model_1.default(dbConnection_config_1.pool));
        const subject = await subjectService.getSubjectById(id);
        if (!subject) {
            return res.status(404).json({ success: false, msg: "Subject not found" });
        }
        res.status(200).json({ success: true, data: subject });
    }
    catch (e) {
        res.status(500).json({ success: false, msg: `Error: ${e}` });
    }
}
async function createSubject(req, res) {
    try {
        const { code, name } = req.body;
        if (!code || !name) {
            return res.status(400).json({ success: false, msg: "Code and name are required" });
        }
        const subjectService = new subject_service_1.default(new subject_model_1.default(dbConnection_config_1.pool));
        const result = await subjectService.createSubject({ code, name });
        if (result) {
            return res.status(201).json({ success: true, msg: "Subject created successfully", data: { id: result } });
        }
    }
    catch (e) {
        res.status(500).json({ success: false, msg: `Error: ${e}` });
    }
}
async function updateSubject(req, res) {
    try {
        const id = parseInt(req.params.id);
        const data = req.body;
        const subjectService = new subject_service_1.default(new subject_model_1.default(dbConnection_config_1.pool));
        const result = await subjectService.updateSubjectById(id, data);
        if (result === 0) {
            return res.status(404).json({ success: false, msg: "Subject not found" });
        }
        res.status(200).json({ success: true, msg: "Subject updated successfully" });
    }
    catch (e) {
        res.status(500).json({ success: false, msg: `Error: ${e}` });
    }
}
async function deleteSubject(req, res) {
    try {
        const id = parseInt(req.params.id);
        const subjectService = new subject_service_1.default(new subject_model_1.default(dbConnection_config_1.pool));
        const result = await subjectService.deleteSubjectById(id);
        if (result === 0) {
            return res.status(404).json({ success: false, msg: "Subject not found" });
        }
        res.status(200).json({ success: true, msg: "Subject deleted successfully" });
    }
    catch (e) {
        res.status(500).json({ success: false, msg: `Error: ${e}` });
    }
}
//# sourceMappingURL=subject.controller.js.map