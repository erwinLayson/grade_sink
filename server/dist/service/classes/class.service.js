"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ClassService {
    classModel;
    constructor(classModel) {
        this.classModel = classModel;
    }
    async createClass(data) {
        try {
            const classId = await this.classModel.createClass(data);
            return classId;
        }
        catch (e) {
            throw new Error(`Error: ${e}`);
        }
    }
    async getAllClasses() {
        try {
            const classes = await this.classModel.getAllClasses();
            return classes.map(cls => ({
                id: cls.id,
                name: cls.name,
                section: cls.section,
                school_year: cls.school_year,
                school_level: cls.school_level,
                teacher_id: cls.teacher_id
            }));
        }
        catch (e) {
            console.log(`Error ${e}`);
            throw new Error(`Error: ${e}`);
        }
    }
    async getClassById(id) {
        try {
            const cls = await this.classModel.getClassById(id);
            if (!cls) {
                return null;
            }
            return {
                id: cls.id,
                name: cls.name,
                section: cls.section,
                school_year: cls.school_year,
                school_level: cls.school_level,
                teacher_id: cls.teacher_id
            };
        }
        catch (e) {
            console.log(`Error ${e}`);
            throw new Error(`Error: ${e}`);
        }
    }
    async updateClassById(id, data) {
        try {
            const result = await this.classModel.updateClassById(id, data);
            return result;
        }
        catch (e) {
            throw new Error(`Error: ${e}`);
        }
    }
    async deleteClassById(id) {
        try {
            const result = await this.classModel.deleteClassById(id);
            return result;
        }
        catch (e) {
            throw new Error(`Error: ${e}`);
        }
    }
}
exports.default = ClassService;
//# sourceMappingURL=class.service.js.map