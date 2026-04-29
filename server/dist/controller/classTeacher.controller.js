"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllClassTeachers = getAllClassTeachers;
exports.getClassTeacherById = getClassTeacherById;
exports.getTeachersByClass = getTeachersByClass;
exports.getClassesByTeacher = getClassesByTeacher;
exports.createClassTeacher = createClassTeacher;
exports.deleteClassTeacher = deleteClassTeacher;
const classTeacher_service_1 = __importDefault(require("../service/classTeacher/classTeacher.service"));
const classTeacher_model_1 = __importDefault(require("../model/classTeacher.model"));
const dbConnection_config_1 = require("../config/dbConnection.config");
async function getAllClassTeachers(req, res) {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const offset = parseInt(req.query.offset) || 0;
        const ctService = new classTeacher_service_1.default(new classTeacher_model_1.default(dbConnection_config_1.pool));
        const classTeachers = await ctService.getAllClassTeachers();
        const paginatedCT = classTeachers.slice(offset, offset + limit);
        res.status(200).json({
            success: true,
            data: paginatedCT,
            pagination: { limit, offset, total: classTeachers.length }
        });
    }
    catch (e) {
        res.status(500).json({ success: false, msg: `Error: ${e}` });
    }
}
async function getClassTeacherById(req, res) {
    try {
        const id = parseInt(req.params.id);
        const ctService = new classTeacher_service_1.default(new classTeacher_model_1.default(dbConnection_config_1.pool));
        const ct = await ctService.getClassTeacherById(id);
        if (!ct) {
            return res.status(404).json({ success: false, msg: "Class-Teacher entry not found" });
        }
        res.status(200).json({ success: true, data: ct });
    }
    catch (e) {
        res.status(500).json({ success: false, msg: `Error: ${e}` });
    }
}
async function getTeachersByClass(req, res) {
    try {
        const classId = parseInt(req.params.classId);
        const ctService = new classTeacher_service_1.default(new classTeacher_model_1.default(dbConnection_config_1.pool));
        const teachers = await ctService.getTeachersByClassId(classId);
        res.status(200).json({ success: true, data: teachers });
    }
    catch (e) {
        res.status(500).json({ success: false, msg: `Error: ${e}` });
    }
}
async function getClassesByTeacher(req, res) {
    try {
        const teacherId = parseInt(req.params.teacherId);
        const ctService = new classTeacher_service_1.default(new classTeacher_model_1.default(dbConnection_config_1.pool));
        const classes = await ctService.getClassesByTeacherId(teacherId);
        res.status(200).json({ success: true, data: classes });
    }
    catch (e) {
        res.status(500).json({ success: false, msg: `Error: ${e}` });
    }
}
async function createClassTeacher(req, res) {
    try {
        const { class_id, teacher_id } = req.body;
        if (!class_id || !teacher_id) {
            return res.status(400).json({ success: false, msg: "Class ID and Teacher ID are required" });
        }
        const ctService = new classTeacher_service_1.default(new classTeacher_model_1.default(dbConnection_config_1.pool));
        const result = await ctService.createClassTeacher({ class_id, teacher_id });
        if (result) {
            return res.status(201).json({ success: true, msg: "Teacher added to class successfully", data: { id: result } });
        }
    }
    catch (e) {
        res.status(500).json({ success: false, msg: `Error: ${e}` });
    }
}
async function deleteClassTeacher(req, res) {
    try {
        const id = parseInt(req.params.id);
        const ctService = new classTeacher_service_1.default(new classTeacher_model_1.default(dbConnection_config_1.pool));
        const result = await ctService.deleteClassTeacherById(id);
        if (result === 0) {
            return res.status(404).json({ success: false, msg: "Class-Teacher entry not found" });
        }
        res.status(200).json({ success: true, msg: "Teacher removed from class successfully" });
    }
    catch (e) {
        res.status(500).json({ success: false, msg: `Error: ${e}` });
    }
}
//# sourceMappingURL=classTeacher.controller.js.map