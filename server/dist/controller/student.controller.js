"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.importPreview = void 0;
exports.getAllStudents = getAllStudents;
exports.getStudentById = getStudentById;
exports.createStudent = createStudent;
exports.updateStudent = updateStudent;
exports.deleteStudent = deleteStudent;
exports.importCommit = importCommit;
const student_service_1 = __importDefault(require("../service/students/student.service"));
const student_model_1 = __importDefault(require("../model/student.model"));
const dbConnection_config_1 = require("../config/dbConnection.config");
const multer_1 = __importDefault(require("multer"));
const xlsx_1 = __importDefault(require("xlsx"));
const activityLogger_1 = require("../middleware/activityLogger");
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
async function getAllStudents(req, res) {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const offset = parseInt(req.query.offset) || 0;
        const studentService = new student_service_1.default(new student_model_1.default(dbConnection_config_1.pool));
        const students = await studentService.getAllStudents();
        const paginatedStudents = students.slice(offset, offset + limit);
        res.status(200).json({
            success: true,
            data: paginatedStudents,
            pagination: { limit, offset, total: students.length }
        });
    }
    catch (e) {
        res.status(500).json({ success: false, msg: `Error: ${e}` });
    }
}
async function getStudentById(req, res) {
    try {
        const id = parseInt(req.params.id);
        const studentService = new student_service_1.default(new student_model_1.default(dbConnection_config_1.pool));
        const student = await studentService.getStudentById(id);
        if (!student) {
            return res.status(404).json({ success: false, msg: "Student not found" });
        }
        res.status(200).json({ success: true, data: student });
    }
    catch (e) {
        res.status(500).json({ success: false, msg: `Error: ${e}` });
    }
}
async function createStudent(req, res) {
    try {
        const { student_id, first_name, middle_name, last_name, age, birth_date, lrn, sex, level } = req.body;
        if (!first_name || !middle_name || !last_name || !age || !birth_date || !lrn || !sex || !level) {
            return res.status(400).json({ success: false, msg: "All student fields are required" });
        }
        const studentService = new student_service_1.default(new student_model_1.default(dbConnection_config_1.pool));
        // build payload without explicitly including student_id when it's undefined
        const payload = { first_name, middle_name, last_name, age, birth_date, lrn, sex, level };
        if (student_id !== undefined && student_id !== null)
            payload.student_id = student_id;
        const result = await studentService.createStudent(payload);
        if (result) {
            return res.status(201).json({ success: true, msg: "Student created successfully", data: { id: result } });
        }
    }
    catch (e) {
        res.status(500).json({ success: false, msg: `Error: ${e}` });
    }
}
async function updateStudent(req, res) {
    try {
        const id = parseInt(req.params.id);
        const data = req.body;
        const studentService = new student_service_1.default(new student_model_1.default(dbConnection_config_1.pool));
        const result = await studentService.updateStudentById(id, data);
        if (result === 0) {
            return res.status(404).json({ success: false, msg: "Student not found" });
        }
        res.status(200).json({ success: true, msg: "Student updated successfully" });
    }
    catch (e) {
        res.status(500).json({ success: false, msg: `Error: ${e}` });
    }
}
async function deleteStudent(req, res) {
    try {
        const id = parseInt(req.params.id);
        const studentService = new student_service_1.default(new student_model_1.default(dbConnection_config_1.pool));
        const result = await studentService.deleteStudentById(id);
        if (result === 0) {
            return res.status(404).json({ success: false, msg: "Student not found" });
        }
        res.status(200).json({ success: true, msg: "Student deleted successfully" });
    }
    catch (e) {
        res.status(500).json({ success: false, msg: `Error: ${e}` });
    }
}
function normalizeRow(raw) {
    const mapKey = (keys) => {
        for (const k of keys) {
            if (raw[k] !== undefined && raw[k] !== null && String(raw[k]).toString().trim() !== "") {
                return raw[k];
            }
        }
        return undefined;
    };
    const studentId = mapKey(["student_id", "studentId", "student_number", "studentNo", "id"]);
    const first_name = mapKey(["first_name", "firstName", "firstname", "given_name", "first name"]);
    const middle_name = mapKey(["middle_name", "middleName", "middlename", "middle name"]);
    const last_name = mapKey(["last_name", "lastName", "lastname", "family_name", "last name"]);
    const sex = mapKey(["sex", "gender"]);
    const birth_date = mapKey(["birthdate", "birth_date", "dob", "birth date"]);
    const lrn = mapKey(["lrn"]);
    const level = mapKey(["level", "class_level", "class level", "grade_level"]);
    const parsedStudentId = studentId !== undefined && studentId !== null && String(studentId).trim() !== "" && !Number.isNaN(Number(studentId))
        ? Number(studentId)
        : undefined;
    return {
        student_id: parsedStudentId,
        first_name: first_name ? String(first_name).trim() : undefined,
        middle_name: middle_name ? String(middle_name).trim() : undefined,
        last_name: last_name ? String(last_name).trim() : undefined,
        sex: sex ? String(sex).trim().toLowerCase() : undefined,
        birth_date: birth_date ? String(birth_date).trim() : undefined,
        lrn: lrn ? String(lrn).trim() : undefined,
        level: level ? String(level).trim() : undefined,
    };
}
exports.importPreview = [
    upload.single("file"),
    async (req, res) => {
        try {
            const file = req.file;
            if (!file)
                return res.status(400).json({ success: false, msg: "No file uploaded" });
            const workbook = xlsx_1.default.read(file.buffer, { type: "buffer" });
            const sheetName = workbook.SheetNames[0];
            if (!sheetName)
                return res.status(400).json({ success: false, msg: "No sheets found in workbook" });
            const sheet = workbook.Sheets[sheetName];
            const raw = xlsx_1.default.utils.sheet_to_json(sheet, { defval: null });
            const studentService = new student_service_1.default(new student_model_1.default(dbConnection_config_1.pool));
            const rows = await Promise.all(raw.map(async (r, idx) => {
                const normalized = normalizeRow(r);
                const issues = [];
                if (!normalized.first_name)
                    issues.push("missing first_name");
                if (!normalized.last_name)
                    issues.push("missing last_name");
                if (!normalized.student_id && !normalized.lrn)
                    issues.push("missing identifier (student_id or lrn)");
                if (normalized.student_id === undefined && (r.student_id || r.studentId || r.student_number || r.studentNo || r.id)) {
                    issues.push("invalid student_id");
                }
                if (!normalized.birth_date)
                    issues.push("missing birth_date");
                if (!normalized.sex)
                    issues.push("missing sex");
                if (!normalized.level)
                    issues.push("missing level");
                if (!normalized.lrn)
                    issues.push("missing lrn");
                const studentMatch = normalized.student_id !== undefined ? await studentService.getStudentByStudentId(normalized.student_id) : null;
                const lrnMatch = normalized.lrn ? await studentService.getStudentByLrn(normalized.lrn) : null;
                let status = issues.length > 0 ? "invalid" : "valid";
                if (studentMatch && lrnMatch && studentMatch.id !== lrnMatch.id) {
                    status = "conflict";
                    issues.push("conflict: student_id and lrn point to different existing students");
                }
                else if (studentMatch || lrnMatch) {
                    status = "duplicate";
                    issues.push("duplicate");
                }
                return {
                    row: idx + 2,
                    raw: r,
                    normalized: normalized,
                    status,
                    valid: status === "valid",
                    issues,
                };
            }));
            const summary = rows.reduce((acc, row) => {
                if (row.status === "valid")
                    acc.valid += 1;
                if (row.status === "duplicate")
                    acc.duplicates += 1;
                if (row.status === "conflict")
                    acc.conflicts += 1;
                if (row.status === "invalid")
                    acc.invalid += 1;
                return acc;
            }, { valid: 0, duplicates: 0, conflicts: 0, invalid: 0 });
            return res.status(200).json({ success: true, data: { rows, summary } });
        }
        catch (e) {
            return res.status(500).json({ success: false, msg: `Error parsing file: ${e}` });
        }
    },
];
async function importCommit(req, res) {
    try {
        const rows = req.body?.rows;
        if (!rows || !Array.isArray(rows)) {
            return res.status(400).json({ success: false, msg: "rows payload is required" });
        }
        const studentService = new student_service_1.default(new student_model_1.default(dbConnection_config_1.pool));
        const normalizedRows = rows
            .map((r) => r.normalized ?? r)
            .filter((r) => r && (r.student_id !== undefined || r.lrn));
        const result = await studentService.importStudents(normalizedRows);
        // log activity for super admins / admins who perform import
        try {
            await (0, activityLogger_1.logActivity)(req, "bulk_import", "students", { summary: result.summary });
        }
        catch (e) {
            console.error("Failed to log import activity", e);
        }
        return res.status(200).json({ success: true, data: result });
    }
    catch (e) {
        return res.status(500).json({ success: false, msg: `Import failed: ${e}` });
    }
}
//# sourceMappingURL=student.controller.js.map