"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllClassStudents = getAllClassStudents;
exports.getClassStudentById = getClassStudentById;
exports.getStudentsByClass = getStudentsByClass;
exports.createClassStudent = createClassStudent;
exports.deleteClassStudent = deleteClassStudent;
const classStudent_service_1 = __importDefault(require("../service/classStudent/classStudent.service"));
const classStudent_model_1 = __importDefault(require("../model/classStudent.model"));
const dbConnection_config_1 = require("../config/dbConnection.config");
async function getAllClassStudents(req, res) {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const offset = parseInt(req.query.offset) || 0;
        const csService = new classStudent_service_1.default(new classStudent_model_1.default(dbConnection_config_1.pool));
        const classStudents = await csService.getAllClassStudents();
        const paginatedCS = classStudents.slice(offset, offset + limit);
        res.status(200).json({
            success: true,
            data: paginatedCS,
            pagination: { limit, offset, total: classStudents.length }
        });
    }
    catch (e) {
        res.status(500).json({ success: false, msg: `Error: ${e}` });
    }
}
async function getClassStudentById(req, res) {
    try {
        const id = parseInt(req.params.id);
        const csService = new classStudent_service_1.default(new classStudent_model_1.default(dbConnection_config_1.pool));
        const cs = await csService.getClassStudentById(id);
        if (!cs) {
            return res.status(404).json({ success: false, msg: "Class-Student entry not found" });
        }
        res.status(200).json({ success: true, data: cs });
    }
    catch (e) {
        res.status(500).json({ success: false, msg: `Error: ${e}` });
    }
}
async function getStudentsByClass(req, res) {
    try {
        const classId = parseInt(req.params.classId);
        const csService = new classStudent_service_1.default(new classStudent_model_1.default(dbConnection_config_1.pool));
        const students = await csService.getStudentsByClassId(classId);
        res.status(200).json({ success: true, data: students });
    }
    catch (e) {
        res.status(500).json({ success: false, msg: `Error: ${e}` });
    }
}
async function createClassStudent(req, res) {
    try {
        const { student_id, class_id } = req.body;
        if (!student_id || !class_id) {
            return res.status(400).json({ success: false, msg: "Student ID and Class ID are required" });
        }
        const connection = await dbConnection_config_1.pool.getConnection();
        try {
            await connection.beginTransaction();
            const csService = new classStudent_service_1.default(new classStudent_model_1.default(connection));
            const result = await csService.createClassStudent({ student_id, class_id });
            await connection.query(`INSERT INTO student_subject (student_id, subject_id, teacher_id)
         SELECT ?, cs.subject_id, ths.teacher_id
         FROM class_subjects cs
         INNER JOIN teacher_handle_subject ths ON ths.subject_id = cs.subject_id
         WHERE cs.class_id = ?
         AND ths.teacher_id IS NOT NULL
         AND NOT EXISTS (
           SELECT 1 FROM student_subject ss
           WHERE ss.student_id = ? AND ss.subject_id = cs.subject_id
         )`, [student_id, class_id, student_id]);
            await connection.commit();
            if (result) {
                return res.status(201).json({ success: true, msg: "Student added to class successfully", data: { id: result } });
            }
        }
        catch (e) {
            await connection.rollback();
            throw e;
        }
        finally {
            connection.release();
        }
    }
    catch (e) {
        res.status(500).json({ success: false, msg: `Error: ${e}` });
    }
}
async function deleteClassStudent(req, res) {
    try {
        const id = parseInt(req.params.id);
        const csService = new classStudent_service_1.default(new classStudent_model_1.default(dbConnection_config_1.pool));
        const result = await csService.deleteClassStudentById(id);
        if (result === 0) {
            return res.status(404).json({ success: false, msg: "Class-Student entry not found" });
        }
        res.status(200).json({ success: true, msg: "Student removed from class successfully" });
    }
    catch (e) {
        res.status(500).json({ success: false, msg: `Error: ${e}` });
    }
}
//# sourceMappingURL=classStudent.controller.js.map