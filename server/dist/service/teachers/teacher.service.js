"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class TeacherService {
    teacherModel;
    constructor(teacherModel) {
        this.teacherModel = teacherModel;
    }
    async createTeacher(data) {
        try {
            const teacherId = await this.teacherModel.createTeacher(data);
            return teacherId;
        }
        catch (e) {
            throw new Error(`Error: ${e}`);
        }
    }
    async getAllTeachers() {
        try {
            const teachers = await this.teacherModel.getAllTeachers();
            return teachers.map(teacher => ({
                id: teacher.id,
                email: teacher.email,
                first_name: teacher.first_name,
                middle_name: teacher.middle_name,
                last_name: teacher.last_name
            }));
        }
        catch (e) {
            console.log(`Error ${e}`);
            throw new Error(`Error: ${e}`);
        }
    }
    async getTeacherById(id) {
        try {
            const teacher = await this.teacherModel.getTeacherById(id);
            if (!teacher) {
                return null;
            }
            return {
                id: teacher.id,
                email: teacher.email,
                first_name: teacher.first_name,
                middle_name: teacher.middle_name,
                last_name: teacher.last_name
            };
        }
        catch (e) {
            console.log(`Error ${e}`);
            throw new Error(`Error: ${e}`);
        }
    }
    async getTeacherByEmail(email) {
        try {
            const teacher = await this.teacherModel.getTeacherByEmail(email);
            if (!teacher) {
                return null;
            }
            return {
                id: teacher.id,
                email: teacher.email,
                first_name: teacher.first_name,
                middle_name: teacher.middle_name,
                last_name: teacher.last_name
            };
        }
        catch (e) {
            console.log(`Error ${e}`);
            throw new Error(`Error: ${e}`);
        }
    }
    async updateTeacherById(id, data) {
        try {
            const result = await this.teacherModel.updateTeacherById(id, data);
            return result;
        }
        catch (e) {
            throw new Error(`Error: ${e}`);
        }
    }
    async deleteTeacherById(id) {
        try {
            const result = await this.teacherModel.deleteTeacherById(id);
            return result;
        }
        catch (e) {
            throw new Error(`Error: ${e}`);
        }
    }
}
exports.default = TeacherService;
//# sourceMappingURL=teacher.service.js.map