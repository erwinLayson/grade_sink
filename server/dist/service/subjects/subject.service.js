"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SubjectService {
    subjectModel;
    constructor(subjectModel) {
        this.subjectModel = subjectModel;
    }
    async createSubject(data) {
        try {
            const subjectId = await this.subjectModel.createSubject(data);
            return subjectId;
        }
        catch (e) {
            throw new Error(`Error: ${e}`);
        }
    }
    async getAllSubjects() {
        try {
            const subjects = await this.subjectModel.getAllSubjects();
            return subjects.map(subject => ({
                id: subject.id,
                code: subject.code,
                name: subject.name
            }));
        }
        catch (e) {
            console.log(`Error ${e}`);
            throw new Error(`Error: ${e}`);
        }
    }
    async getSubjectById(id) {
        try {
            const subject = await this.subjectModel.getSubjectById(id);
            if (!subject) {
                return null;
            }
            return {
                id: subject.id,
                code: subject.code,
                name: subject.name
            };
        }
        catch (e) {
            console.log(`Error ${e}`);
            throw new Error(`Error: ${e}`);
        }
    }
    async updateSubjectById(id, data) {
        try {
            const result = await this.subjectModel.updateSubjectById(id, data);
            return result;
        }
        catch (e) {
            throw new Error(`Error: ${e}`);
        }
    }
    async deleteSubjectById(id) {
        try {
            const result = await this.subjectModel.deleteSubjectById(id);
            return result;
        }
        catch (e) {
            throw new Error(`Error: ${e}`);
        }
    }
}
exports.default = SubjectService;
//# sourceMappingURL=subject.service.js.map