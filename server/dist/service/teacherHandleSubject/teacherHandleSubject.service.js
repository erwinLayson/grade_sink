"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class TeacherHandleSubjectService {
    teacherHandleSubjectModel;
    constructor(teacherHandleSubjectModel) {
        this.teacherHandleSubjectModel = teacherHandleSubjectModel;
    }
    async createTeacherHandleSubject(data) {
        try {
            const id = await this.teacherHandleSubjectModel.createTeacherHandleSubject(data);
            return id;
        }
        catch (e) {
            throw new Error(`Error: ${e}`);
        }
    }
    async getAllTeacherHandleSubjects() {
        try {
            const assignments = await this.teacherHandleSubjectModel.getAllTeacherHandleSubjects();
            return assignments.map(assignment => ({
                id: assignment.id,
                teacher_id: assignment.teacher_id,
                subject_id: assignment.subject_id
            }));
        }
        catch (e) {
            console.log(`Error ${e}`);
            throw new Error(`Error: ${e}`);
        }
    }
    async getTeacherHandleSubjectById(id) {
        try {
            const assignment = await this.teacherHandleSubjectModel.getTeacherHandleSubjectById(id);
            if (!assignment) {
                return null;
            }
            return {
                id: assignment.id,
                teacher_id: assignment.teacher_id,
                subject_id: assignment.subject_id
            };
        }
        catch (e) {
            console.log(`Error ${e}`);
            throw new Error(`Error: ${e}`);
        }
    }
    async getSubjectsByTeacherId(teacher_id) {
        try {
            const subjects = await this.teacherHandleSubjectModel.getSubjectsByTeacherId(teacher_id);
            return subjects;
        }
        catch (e) {
            console.log(`Error ${e}`);
            throw new Error(`Error: ${e}`);
        }
    }
    async deleteTeacherHandleSubjectById(id) {
        try {
            const result = await this.teacherHandleSubjectModel.deleteTeacherHandleSubjectById(id);
            return result;
        }
        catch (e) {
            throw new Error(`Error: ${e}`);
        }
    }
}
exports.default = TeacherHandleSubjectService;
//# sourceMappingURL=teacherHandleSubject.service.js.map