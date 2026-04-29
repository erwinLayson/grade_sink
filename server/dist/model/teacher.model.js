"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class TeacherModel {
    pool;
    constructor(pool) {
        this.pool = pool;
    }
    async createTeacher(data) {
        try {
            const [rows] = await this.pool.query("INSERT INTO teachers(first_name, middle_name, last_name, email) VALUES(?, ?, ?, ?)", [data.first_name || null, data.middle_name || null, data.last_name || null, data.email]);
            return rows.insertId;
        }
        catch (e) {
            throw new Error(`Error: ${e}`);
        }
    }
    async getAllTeachers() {
        try {
            const [rows] = await this.pool.query("SELECT * FROM teachers");
            return rows;
        }
        catch (e) {
            console.log(`....Fetching error ${e}`);
            throw new Error(`${e}`);
        }
    }
    async getTeacherById(id) {
        try {
            const [rows] = await this.pool.query("SELECT * FROM teachers WHERE id = ?", [id]);
            const teachers = rows;
            if (teachers.length <= 0) {
                return null;
            }
            return teachers[0] ?? null;
        }
        catch (e) {
            console.log(`....Fetching teacher by id ${e}`);
            throw new Error(`${e}`);
        }
    }
    async getTeacherByEmail(email) {
        try {
            const [rows] = await this.pool.query("SELECT * FROM teachers WHERE email = ?", [email]);
            const teachers = rows;
            if (teachers.length <= 0) {
                return null;
            }
            return teachers[0] ?? null;
        }
        catch (e) {
            console.log(`....Fetching teacher by email ${e}`);
            throw new Error(`${e}`);
        }
    }
    async updateTeacherById(id, data) {
        try {
            const keys = Object.keys(data);
            if (keys.length === 0)
                return 0;
            const setClause = keys.map((key) => `${key} = ?`).join(", ");
            const values = keys.map((key) => data[key]);
            const [result] = await this.pool.query(`UPDATE teachers SET ${setClause} WHERE id = ?`, [...values, id]);
            return result.affectedRows;
        }
        catch (e) {
            console.log(`....Updating teacher error ${e}`);
            throw new Error(`${e}`);
        }
    }
    async deleteTeacherById(id) {
        try {
            const [result] = await this.pool.query("DELETE FROM teachers WHERE id = ?", [id]);
            return result.affectedRows;
        }
        catch (e) {
            console.log(`....Deleting teacher error ${e}`);
            throw new Error(`${e}`);
        }
    }
}
exports.default = TeacherModel;
//# sourceMappingURL=teacher.model.js.map