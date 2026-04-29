"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllTeachers = getAllTeachers;
exports.getTeacherById = getTeacherById;
exports.getTeacherByEmail = getTeacherByEmail;
exports.createTeacher = createTeacher;
exports.updateTeacher = updateTeacher;
exports.deleteTeacher = deleteTeacher;
exports.getMyTeacherProfile = getMyTeacherProfile;
exports.updateMyTeacherProfile = updateMyTeacherProfile;
const teacher_service_1 = __importDefault(require("../service/teachers/teacher.service"));
const teacher_model_1 = __importDefault(require("../model/teacher.model"));
const user_model_1 = __importDefault(require("../model/user.model"));
const dbConnection_config_1 = require("../config/dbConnection.config");
const bcrypt_1 = __importDefault(require("bcrypt"));
const userRole_1 = require("../constant/userRole");
async function getAllTeachers(req, res) {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const offset = parseInt(req.query.offset) || 0;
        const teacherService = new teacher_service_1.default(new teacher_model_1.default(dbConnection_config_1.pool));
        const teachers = await teacherService.getAllTeachers();
        const paginatedTeachers = teachers.slice(offset, offset + limit);
        res.status(200).json({
            success: true,
            data: paginatedTeachers,
            pagination: { limit, offset, total: teachers.length }
        });
    }
    catch (e) {
        res.status(500).json({ success: false, msg: `Error: ${e}` });
    }
}
async function getTeacherById(req, res) {
    try {
        const id = parseInt(req.params.id);
        const teacherService = new teacher_service_1.default(new teacher_model_1.default(dbConnection_config_1.pool));
        const teacher = await teacherService.getTeacherById(id);
        if (!teacher) {
            return res.status(404).json({ success: false, msg: "Teacher not found" });
        }
        res.status(200).json({ success: true, data: teacher });
    }
    catch (e) {
        res.status(500).json({ success: false, msg: `Error: ${e}` });
    }
}
async function getTeacherByEmail(req, res) {
    try {
        const email = req.params.email;
        const teacherService = new teacher_service_1.default(new teacher_model_1.default(dbConnection_config_1.pool));
        const teacher = await teacherService.getTeacherByEmail(email);
        if (!teacher) {
            return res.status(404).json({ success: false, msg: "Teacher not found" });
        }
        res.status(200).json({ success: true, data: teacher });
    }
    catch (e) {
        res.status(500).json({ success: false, msg: `Error: ${e}` });
    }
}
async function createTeacher(req, res) {
    try {
        const { first_name, middle_name, last_name, email } = req.body;
        if (!email) {
            return res.status(400).json({ success: false, msg: "Email is required" });
        }
        const teacherService = new teacher_service_1.default(new teacher_model_1.default(dbConnection_config_1.pool));
        const result = await teacherService.createTeacher({ first_name, middle_name, last_name, email });
        if (result) {
            return res.status(201).json({ success: true, msg: "Teacher created successfully", data: { id: result } });
        }
    }
    catch (e) {
        res.status(500).json({ success: false, msg: `Error: ${e}` });
    }
}
async function updateTeacher(req, res) {
    try {
        const id = parseInt(req.params.id);
        const data = req.body;
        const teacherService = new teacher_service_1.default(new teacher_model_1.default(dbConnection_config_1.pool));
        const result = await teacherService.updateTeacherById(id, data);
        if (result === 0) {
            return res.status(404).json({ success: false, msg: "Teacher not found" });
        }
        res.status(200).json({ success: true, msg: "Teacher updated successfully" });
    }
    catch (e) {
        res.status(500).json({ success: false, msg: `Error: ${e}` });
    }
}
async function deleteTeacher(req, res) {
    try {
        const id = parseInt(req.params.id);
        const teacherService = new teacher_service_1.default(new teacher_model_1.default(dbConnection_config_1.pool));
        const result = await teacherService.deleteTeacherById(id);
        if (result === 0) {
            return res.status(404).json({ success: false, msg: "Teacher not found" });
        }
        res.status(200).json({ success: true, msg: "Teacher deleted successfully" });
    }
    catch (e) {
        res.status(500).json({ success: false, msg: `Error: ${e}` });
    }
}
async function getMyTeacherProfile(req, res) {
    try {
        const authUser = req.user;
        if (!authUser?.email) {
            return res.status(401).json({ success: false, msg: "Unauthorized" });
        }
        if (authUser.role !== userRole_1.ROLES.TEACHER) {
            return res.status(403).json({ success: false, msg: "Forbidden" });
        }
        const teacherService = new teacher_service_1.default(new teacher_model_1.default(dbConnection_config_1.pool));
        const userModel = new user_model_1.default(dbConnection_config_1.pool);
        const [teacher, user] = await Promise.all([
            teacherService.getTeacherByEmail(authUser.email),
            userModel.getUserByEmail(authUser.email),
        ]);
        if (!teacher || !user) {
            return res.status(404).json({ success: false, msg: "Teacher profile not found" });
        }
        return res.status(200).json({
            success: true,
            data: {
                first_name: teacher.first_name,
                middle_name: teacher.middle_name,
                last_name: teacher.last_name,
                email: user.email,
                username: user.username,
                role: user.role,
            },
        });
    }
    catch (e) {
        return res.status(500).json({ success: false, msg: `Error: ${e}` });
    }
}
async function updateMyTeacherProfile(req, res) {
    try {
        const authUser = req.user;
        if (!authUser?.email) {
            return res.status(401).json({ success: false, msg: "Unauthorized" });
        }
        if (authUser.role !== userRole_1.ROLES.TEACHER) {
            return res.status(403).json({ success: false, msg: "Forbidden" });
        }
        const { first_name, middle_name, last_name, username, email, current_password, new_password, confirm_password, } = req.body;
        const teacherService = new teacher_service_1.default(new teacher_model_1.default(dbConnection_config_1.pool));
        const userModel = new user_model_1.default(dbConnection_config_1.pool);
        const [teacher, user] = await Promise.all([
            teacherService.getTeacherByEmail(authUser.email),
            userModel.getUserByEmail(authUser.email),
        ]);
        if (!teacher || !user) {
            return res.status(404).json({ success: false, msg: "Teacher profile not found" });
        }
        const hasTeacherChange = typeof first_name === "string" ||
            typeof middle_name === "string" ||
            typeof last_name === "string";
        const hasAccountChange = typeof username === "string" || typeof email === "string" || typeof new_password === "string";
        if (!hasTeacherChange && !hasAccountChange) {
            return res.status(400).json({ success: false, msg: "No profile changes submitted" });
        }
        if (hasAccountChange) {
            if (!current_password || !current_password.trim()) {
                return res.status(400).json({ success: false, msg: "Current password is required" });
            }
            const isCurrentPasswordValid = await bcrypt_1.default.compare(current_password, user.password);
            if (!isCurrentPasswordValid) {
                return res.status(400).json({ success: false, msg: "Current password is incorrect" });
            }
        }
        const teacherUpdate = {};
        const userUpdate = {};
        if (typeof first_name === "string") {
            teacherUpdate.first_name = first_name.trim() || null;
        }
        if (typeof middle_name === "string") {
            teacherUpdate.middle_name = middle_name.trim() || null;
        }
        if (typeof last_name === "string") {
            teacherUpdate.last_name = last_name.trim() || null;
        }
        if (typeof username === "string") {
            const nextUsername = username.trim();
            if (!nextUsername) {
                return res.status(400).json({ success: false, msg: "Username cannot be empty" });
            }
            if (nextUsername !== user.username) {
                const existingUser = await userModel.getUserByUsername(nextUsername);
                if (existingUser && existingUser.id !== user.id) {
                    return res.status(409).json({ success: false, msg: "Username is already in use" });
                }
                userUpdate.username = nextUsername;
            }
        }
        if (typeof email === "string") {
            const nextEmail = email.trim().toLowerCase();
            if (!nextEmail) {
                return res.status(400).json({ success: false, msg: "Email cannot be empty" });
            }
            if (nextEmail !== user.email) {
                const existingUser = await userModel.getUserByEmail(nextEmail);
                if (existingUser && existingUser.id !== user.id) {
                    return res.status(409).json({ success: false, msg: "Email is already in use" });
                }
                userUpdate.email = nextEmail;
                teacherUpdate.email = nextEmail;
            }
        }
        if (typeof new_password === "string") {
            if (!new_password.trim()) {
                return res.status(400).json({ success: false, msg: "New password cannot be empty" });
            }
            if (new_password.length < 6) {
                return res.status(400).json({ success: false, msg: "New password must be at least 6 characters" });
            }
            if (new_password !== confirm_password) {
                return res.status(400).json({ success: false, msg: "Password confirmation does not match" });
            }
            userUpdate.password = await bcrypt_1.default.hash(new_password, 10);
        }
        if (Object.keys(teacherUpdate).length > 0) {
            await teacherService.updateTeacherById(teacher.id, teacherUpdate);
        }
        if (Object.keys(userUpdate).length > 0) {
            await userModel.updateUserById(user.id, userUpdate);
        }
        const latestUser = await userModel.getUserByEmail(userUpdate.email ?? user.email);
        if (!latestUser) {
            return res.status(500).json({ success: false, msg: "Profile updated but refresh failed" });
        }
        return res.status(200).json({
            success: true,
            msg: "Profile updated successfully",
            data: {
                id: latestUser.id,
                username: latestUser.username,
                email: latestUser.email,
                role: latestUser.role,
            },
        });
    }
    catch (e) {
        return res.status(500).json({ success: false, msg: `Error: ${e}` });
    }
}
//# sourceMappingURL=teacher.controller.js.map