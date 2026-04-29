"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class StudentGradeModel {
    pool;
    constructor(pool) {
        this.pool = pool;
    }
    async createStudentGrade(data) {
        try {
            const [rows] = await this.pool.query("INSERT INTO student_grades(student_id, subject_id, teacher_id, grade, quarter) VALUES(?, ?, ?, ?, ?)", [data.student_id, data.subject_id, data.teacher_id, data.grade, data.quarter]);
            return rows.insertId;
        }
        catch (e) {
            throw new Error(`Error: ${e}`);
        }
    }
    async getAllStudentGrades() {
        try {
            const [rows] = await this.pool.query("SELECT * FROM student_grades");
            return rows;
        }
        catch (e) {
            console.log(`....Fetching error ${e}`);
            throw new Error(`${e}`);
        }
    }
    async getStudentGradeById(id) {
        try {
            const [rows] = await this.pool.query("SELECT * FROM student_grades WHERE id = ?", [id]);
            const grades = rows;
            if (grades.length <= 0) {
                return null;
            }
            return grades[0] ?? null;
        }
        catch (e) {
            console.log(`....Fetching student grade by id ${e}`);
            throw new Error(`${e}`);
        }
    }
    async getGradesByStudentId(student_id) {
        try {
            const [rows] = await this.pool.query("SELECT * FROM student_grades WHERE student_id = ?", [student_id]);
            return rows;
        }
        catch (e) {
            console.log(`....Fetching grades by student ${e}`);
            throw new Error(`${e}`);
        }
    }
    async getStudentGradeByStudentSubjectQuarter(student_id, subject_id, quarter) {
        try {
            const [rows] = await this.pool.query(`SELECT * FROM student_grades
         WHERE student_id = ? AND subject_id = ? AND quarter = ?
         ORDER BY id DESC
         LIMIT 1`, [student_id, subject_id, quarter]);
            const grades = rows;
            if (grades.length <= 0) {
                return null;
            }
            return grades[0] ?? null;
        }
        catch (e) {
            console.log(`....Fetching grade by student, subject, quarter ${e}`);
            throw new Error(`${e}`);
        }
    }
    async updateStudentGradeById(id, data) {
        try {
            const keys = Object.keys(data);
            if (keys.length === 0)
                return 0;
            const setClause = keys.map((key) => `${key} = ?`).join(", ");
            const values = keys.map((key) => data[key]);
            const [result] = await this.pool.query(`UPDATE student_grades SET ${setClause} WHERE id = ?`, [...values, id]);
            return result.affectedRows;
        }
        catch (e) {
            console.log(`....Updating student grade error ${e}`);
            throw new Error(`${e}`);
        }
    }
    async deleteStudentGradeById(id) {
        try {
            const [result] = await this.pool.query("DELETE FROM student_grades WHERE id = ?", [id]);
            return result.affectedRows;
        }
        catch (e) {
            console.log(`....Deleting student grade error ${e}`);
            throw new Error(`${e}`);
        }
    }
}
exports.default = StudentGradeModel;
//# sourceMappingURL=studentGrade.model.js.map