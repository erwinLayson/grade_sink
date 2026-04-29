"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class StudentSubjectService {
    studentSubjectModel;
    constructor(studentSubjectModel) {
        this.studentSubjectModel = studentSubjectModel;
    }
    async createStudentSubject(data) {
        try {
            const id = await this.studentSubjectModel.createStudentSubject(data);
            return id;
        }
        catch (e) {
            throw new Error(`Error: ${e}`);
        }
    }
    async getAllStudentSubjects() {
        try {
            const studentSubjects = await this.studentSubjectModel.getAllStudentSubjects();
            return studentSubjects.map(ss => ({
                id: ss.id,
                student_id: ss.student_id,
                subject_id: ss.subject_id,
                teacher_id: ss.teacher_id
            }));
        }
        catch (e) {
            console.log(`Error ${e}`);
            throw new Error(`Error: ${e}`);
        }
    }
    async getStudentSubjectById(id) {
        try {
            const studentSubject = await this.studentSubjectModel.getStudentSubjectById(id);
            if (!studentSubject) {
                return null;
            }
            return {
                id: studentSubject.id,
                student_id: studentSubject.student_id,
                subject_id: studentSubject.subject_id,
                teacher_id: studentSubject.teacher_id
            };
        }
        catch (e) {
            console.log(`Error ${e}`);
            throw new Error(`Error: ${e}`);
        }
    }
    async getSubjectsByStudentId(student_id) {
        try {
            const studentSubjects = await this.studentSubjectModel.getSubjectsByStudentId(student_id);
            return studentSubjects.map(ss => ({
                id: ss.id,
                student_id: ss.student_id,
                subject_id: ss.subject_id,
                teacher_id: ss.teacher_id
            }));
        }
        catch (e) {
            console.log(`Error ${e}`);
            throw new Error(`Error: ${e}`);
        }
    }
    async deleteStudentSubjectById(id) {
        try {
            const result = await this.studentSubjectModel.deleteStudentSubjectById(id);
            return result;
        }
        catch (e) {
            throw new Error(`Error: ${e}`);
        }
    }
}
exports.default = StudentSubjectService;
//# sourceMappingURL=studentSubject.service.js.map