"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class StudentModel {
    pool;
    constructor(pool) {
        this.pool = pool;
    }
    async createStudent(data) {
        try {
            const [rows] = await this.pool.query("INSERT INTO students(student_id, first_name, middle_name, last_name, age, birth_date, lrn, sex, level) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)", [data.student_id, data.first_name, data.middle_name, data.last_name, data.age, data.birth_date, data.lrn, data.sex, data.level]);
            return rows.insertId;
        }
        catch (e) {
            throw new Error(`Error: ${e}`);
        }
    }
    async getAllStudents() {
        try {
            const [rows] = await this.pool.query("SELECT * FROM students");
            return rows;
        }
        catch (e) {
            console.log(`....Fetching error ${e}`);
            throw new Error(`${e}`);
        }
    }
    async getStudentById(id) {
        try {
            const [rows] = await this.pool.query("SELECT * FROM students WHERE id = ?", [id]);
            const students = rows;
            if (students.length <= 0) {
                return null;
            }
            return students[0] ?? null;
        }
        catch (e) {
            console.log(`....Fetching student by id ${e}`);
            throw new Error(`${e}`);
        }
    }
    async getStudentByStudentId(student_id) {
        try {
            const [rows] = await this.pool.query("SELECT * FROM students WHERE student_id = ?", [student_id]);
            const students = rows;
            if (students.length <= 0) {
                return null;
            }
            return students[0] ?? null;
        }
        catch (e) {
            console.log(`....Fetching student by student_id ${e}`);
            throw new Error(`${e}`);
        }
    }
    async getStudentByLrn(lrn) {
        try {
            const [rows] = await this.pool.query("SELECT * FROM students WHERE lrn = ?", [lrn]);
            const students = rows;
            if (students.length <= 0) {
                return null;
            }
            return students[0] ?? null;
        }
        catch (e) {
            console.log(`....Fetching student by lrn ${e}`);
            throw new Error(`${e}`);
        }
    }
    async updateStudentById(id, data) {
        try {
            const keys = Object.keys(data);
            if (keys.length === 0)
                return 0;
            const setClause = keys.map((key) => `${key} = ?`).join(", ");
            const values = keys.map((key) => data[key]);
            const [result] = await this.pool.query(`UPDATE students SET ${setClause} WHERE id = ?`, [...values, id]);
            return result.affectedRows;
        }
        catch (e) {
            console.log(`....Updating student error ${e}`);
            throw new Error(`${e}`);
        }
    }
    async deleteStudentById(id) {
        try {
            const [result] = await this.pool.query("DELETE FROM students WHERE id = ?", [id]);
            return result.affectedRows;
        }
        catch (e) {
            console.log(`....Deleting student error ${e}`);
            throw new Error(`${e}`);
        }
    }
}
exports.default = StudentModel;
//# sourceMappingURL=student.model.js.map