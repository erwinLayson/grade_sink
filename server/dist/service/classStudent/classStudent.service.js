"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ClassStudentService {
    classStudentModel;
    constructor(classStudentModel) {
        this.classStudentModel = classStudentModel;
    }
    async createClassStudent(data) {
        try {
            const id = await this.classStudentModel.createClassStudent(data);
            return id;
        }
        catch (e) {
            throw new Error(`Error: ${e}`);
        }
    }
    async getAllClassStudents() {
        try {
            const classStudents = await this.classStudentModel.getAllClassStudents();
            return classStudents.map(cs => ({
                id: cs.id,
                student_id: cs.student_id,
                class_id: cs.class_id
            }));
        }
        catch (e) {
            console.log(`Error ${e}`);
            throw new Error(`Error: ${e}`);
        }
    }
    async getClassStudentById(id) {
        try {
            const classStudent = await this.classStudentModel.getClassStudentById(id);
            if (!classStudent) {
                return null;
            }
            return {
                id: classStudent.id,
                student_id: classStudent.student_id,
                class_id: classStudent.class_id
            };
        }
        catch (e) {
            console.log(`Error ${e}`);
            throw new Error(`Error: ${e}`);
        }
    }
    async getStudentsByClassId(class_id) {
        try {
            const students = await this.classStudentModel.getStudentsByClassId(class_id);
            return students;
        }
        catch (e) {
            console.log(`Error ${e}`);
            throw new Error(`Error: ${e}`);
        }
    }
    async deleteClassStudentById(id) {
        try {
            const result = await this.classStudentModel.deleteClassStudentById(id);
            return result;
        }
        catch (e) {
            throw new Error(`Error: ${e}`);
        }
    }
}
exports.default = ClassStudentService;
//# sourceMappingURL=classStudent.service.js.map