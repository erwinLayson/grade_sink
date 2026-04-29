"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class TeacherHandleSubjectModel {
    pool;
    constructor(pool) {
        this.pool = pool;
    }
    async createTeacherHandleSubject(data) {
        try {
            const [rows] = await this.pool.query("INSERT INTO teacher_handle_subject(teacher_id, subject_id) VALUES(?, ?)", [data.teacher_id, data.subject_id]);
            return rows.insertId;
        }
        catch (e) {
            throw new Error(`Error: ${e}`);
        }
    }
    async getAllTeacherHandleSubjects() {
        try {
            const [rows] = await this.pool.query("SELECT * FROM teacher_handle_subject");
            return rows;
        }
        catch (e) {
            console.log(`....Fetching error ${e}`);
            throw new Error(`${e}`);
        }
    }
    async getTeacherHandleSubjectById(id) {
        try {
            const [rows] = await this.pool.query("SELECT * FROM teacher_handle_subject WHERE id = ?", [id]);
            const assignments = rows;
            if (assignments.length <= 0) {
                return null;
            }
            return assignments[0] ?? null;
        }
        catch (e) {
            console.log(`....Fetching teacher handle subject by id ${e}`);
            throw new Error(`${e}`);
        }
    }
    async getSubjectsByTeacherId(teacher_id) {
        try {
            const [rows] = await this.pool.query(`SELECT s.id, s.code, s.name 
         FROM subjects s 
         JOIN teacher_handle_subject ths ON s.id = ths.subject_id 
         WHERE ths.teacher_id = ?`, [teacher_id]);
            return rows;
        }
        catch (e) {
            console.log(`....Fetching subjects by teacher ${e}`);
            throw new Error(`${e}`);
        }
    }
    async deleteTeacherHandleSubjectById(id) {
        try {
            const [result] = await this.pool.query("DELETE FROM teacher_handle_subject WHERE id = ?", [id]);
            return result.affectedRows;
        }
        catch (e) {
            console.log(`....Deleting teacher handle subject error ${e}`);
            throw new Error(`${e}`);
        }
    }
}
exports.default = TeacherHandleSubjectModel;
//# sourceMappingURL=teacherHandleSubject.model.js.map