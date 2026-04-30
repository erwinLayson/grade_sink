"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllClasses = getAllClasses;
exports.getClassById = getClassById;
exports.createClass = createClass;
exports.updateClass = updateClass;
exports.deleteClass = deleteClass;
const class_service_1 = __importDefault(require("../service/classes/class.service"));
const class_model_1 = __importDefault(require("../model/class.model"));
const dbConnection_config_1 = require("../config/dbConnection.config");
async function getAllClasses(req, res) {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const offset = parseInt(req.query.offset) || 0;
        const classService = new class_service_1.default(new class_model_1.default(dbConnection_config_1.pool));
        const classes = await classService.getAllClasses();
        const paginatedClasses = classes.slice(offset, offset + limit);
        res.status(200).json({
            success: true,
            data: paginatedClasses,
            pagination: { limit, offset, total: classes.length }
        });
    }
    catch (e) {
        res.status(500).json({ success: false, msg: `Error: ${e}` });
    }
}
async function getClassById(req, res) {
    try {
        const id = parseInt(req.params.id);
        const classService = new class_service_1.default(new class_model_1.default(dbConnection_config_1.pool));
        const cls = await classService.getClassById(id);
        if (!cls) {
            return res.status(404).json({ success: false, msg: "Class not found" });
        }
        res.status(200).json({ success: true, data: cls });
    }
    catch (e) {
        res.status(500).json({ success: false, msg: `Error: ${e}` });
    }
}
async function createClass(req, res) {
    try {
        const { name, section, school_year, school_level, teacher_id } = req.body;
        if (!name || !section || !school_year || !school_level) {
            return res.status(400).json({ success: false, msg: "Name, section, school_year, and school_level are required" });
        }
        const classService = new class_service_1.default(new class_model_1.default(dbConnection_config_1.pool));
        const payload = { name, section, school_year, school_level };
        if (typeof teacher_id !== "undefined")
            payload.teacher_id = teacher_id;
        const result = await classService.createClass(payload);
        if (result) {
            return res.status(201).json({ success: true, msg: "Class created successfully", data: { id: result } });
        }
    }
    catch (e) {
        res.status(500).json({ success: false, msg: `Error: ${e}` });
    }
}
async function updateClass(req, res) {
    try {
        const id = parseInt(req.params.id);
        const data = req.body;
        const classService = new class_service_1.default(new class_model_1.default(dbConnection_config_1.pool));
        const result = await classService.updateClassById(id, data);
        if (result === 0) {
            return res.status(404).json({ success: false, msg: "Class not found" });
        }
        res.status(200).json({ success: true, msg: "Class updated successfully" });
    }
    catch (e) {
        res.status(500).json({ success: false, msg: `Error: ${e}` });
    }
}
async function deleteClass(req, res) {
    try {
        const id = parseInt(req.params.id);
        const classService = new class_service_1.default(new class_model_1.default(dbConnection_config_1.pool));
        const result = await classService.deleteClassById(id);
        if (result === 0) {
            return res.status(404).json({ success: false, msg: "Class not found" });
        }
        res.status(200).json({ success: true, msg: "Class deleted successfully" });
    }
    catch (e) {
        res.status(500).json({ success: false, msg: `Error: ${e}` });
    }
}
//# sourceMappingURL=class.controller.js.map