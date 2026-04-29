"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ClassStudentModel {
    pool;
    constructor(pool) {
        this.pool = pool;
    }
    async createClassStudent(data) {
        try {
            const [rows] = await this.pool.query("INSERT INTO class_student(student_id, class_id) VALUES(?, ?)", [data.student_id, data.class_id]);
            return rows.insertId;
        }
        catch (e) {
            throw new Error(`Error: ${e}`);
        }
    }
    async getAllClassStudents() {
        try {
            const [rows] = await this.pool.query("SELECT * FROM class_student");
            return rows;
        }
        catch (e) {
            console.log(`....Fetching error ${e}`);
            throw new Error(`${e}`);
        }
    }
    async getClassStudentById(id) {
        try {
            const [rows] = await this.pool.query("SELECT * FROM class_student WHERE id = ?", [id]);
            const classStudents = rows;
            if (classStudents.length <= 0) {
                return null;
            }
            return classStudents[0] ?? null;
        }
        catch (e) {
            console.log(`....Fetching class student by id ${e}`);
            throw new Error(`${e}`);
        }
    }
    async getStudentsByClassId(class_id) {
        try {
            const [rows] = await this.pool.query(`SELECT cs.id, s.id as student_id, s.first_name, s.middle_name, s.last_name, s.sex, cs.class_id
         FROM class_student cs
         JOIN students s ON cs.student_id = s.id
         WHERE cs.class_id = ?`, [class_id]);
            return rows;
        }
        catch (e) {
            console.log(`....Fetching students by class ${e}`);
            throw new Error(`${e}`);
        }
    }
    async deleteClassStudentById(id) {
        try {
            const [result] = await this.pool.query("DELETE FROM class_student WHERE id = ?", [id]);
            return result.affectedRows;
        }
        catch (e) {
            console.log(`....Deleting class student error ${e}`);
            throw new Error(`${e}`);
        }
    }
}
exports.default = ClassStudentModel;
//# sourceMappingURL=classStudent.model.js.map