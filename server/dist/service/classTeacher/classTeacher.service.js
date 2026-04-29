"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ClassTeacherService {
    classTeacherModel;
    constructor(classTeacherModel) {
        this.classTeacherModel = classTeacherModel;
    }
    async createClassTeacher(data) {
        try {
            const id = await this.classTeacherModel.createClassTeacher(data);
            return id;
        }
        catch (e) {
            throw new Error(`Error: ${e}`);
        }
    }
    async getAllClassTeachers() {
        try {
            const classTeachers = await this.classTeacherModel.getAllClassTeachers();
            return classTeachers.map(ct => ({
                id: ct.id,
                class_id: ct.class_id,
                teacher_id: ct.teacher_id
            }));
        }
        catch (e) {
            console.log(`Error ${e}`);
            throw new Error(`Error: ${e}`);
        }
    }
    async getClassTeacherById(id) {
        try {
            const classTeacher = await this.classTeacherModel.getClassTeacherById(id);
            if (!classTeacher) {
                return null;
            }
            return {
                id: classTeacher.id,
                class_id: classTeacher.class_id,
                teacher_id: classTeacher.teacher_id
            };
        }
        catch (e) {
            console.log(`Error ${e}`);
            throw new Error(`Error: ${e}`);
        }
    }
    async getTeachersByClassId(class_id) {
        try {
            const classTeachers = await this.classTeacherModel.getTeachersByClassId(class_id);
            return classTeachers.map(ct => ({
                id: ct.id,
                class_id: ct.class_id,
                teacher_id: ct.teacher_id
            }));
        }
        catch (e) {
            console.log(`Error ${e}`);
            throw new Error(`Error: ${e}`);
        }
    }
    async getClassesByTeacherId(teacher_id) {
        try {
            const classes = await this.classTeacherModel.getClassesByTeacherId(teacher_id);
            return classes;
        }
        catch (e) {
            console.log(`Error ${e}`);
            throw new Error(`Error: ${e}`);
        }
    }
    async deleteClassTeacherById(id) {
        try {
            const result = await this.classTeacherModel.deleteClassTeacherById(id);
            return result;
        }
        catch (e) {
            throw new Error(`Error: ${e}`);
        }
    }
}
exports.default = ClassTeacherService;
//# sourceMappingURL=classTeacher.service.js.map