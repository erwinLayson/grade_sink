"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class StudentSubjectModel {
    pool;
    constructor(pool) {
        this.pool = pool;
    }
    async createStudentSubject(data) {
        try {
            const [rows] = await this.pool.query("INSERT INTO student_subject(student_id, subject_id, teacher_id) VALUES(?, ?, ?)", [data.student_id, data.subject_id, data.teacher_id]);
            return rows.insertId;
        }
        catch (e) {
            throw new Error(`Error: ${e}`);
        }
    }
    async getAllStudentSubjects() {
        try {
            const [rows] = await this.pool.query("SELECT * FROM student_subject");
            return rows;
        }
        catch (e) {
            console.log(`....Fetching error ${e}`);
            throw new Error(`${e}`);
        }
    }
    async getStudentSubjectById(id) {
        try {
            const [rows] = await this.pool.query("SELECT * FROM student_subject WHERE id = ?", [id]);
            const studentSubjects = rows;
            if (studentSubjects.length <= 0) {
                return null;
            }
            return studentSubjects[0] ?? null;
        }
        catch (e) {
            console.log(`....Fetching student subject by id ${e}`);
            throw new Error(`${e}`);
        }
    }
    async getSubjectsByStudentId(student_id) {
        try {
            const [rows] = await this.pool.query("SELECT * FROM student_subject WHERE student_id = ?", [student_id]);
            return rows;
        }
        catch (e) {
            console.log(`....Fetching subjects by student ${e}`);
            throw new Error(`${e}`);
        }
    }
    async deleteStudentSubjectById(id) {
        try {
            const [result] = await this.pool.query("DELETE FROM student_subject WHERE id = ?", [id]);
            return result.affectedRows;
        }
        catch (e) {
            console.log(`....Deleting student subject error ${e}`);
            throw new Error(`${e}`);
        }
    }
}
exports.default = StudentSubjectModel;
//# sourceMappingURL=studentSubject.model.js.map