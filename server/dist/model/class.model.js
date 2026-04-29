"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ClassModel {
    pool;
    constructor(pool) {
        this.pool = pool;
    }
    async createClass(data) {
        try {
            const [rows] = await this.pool.query("INSERT INTO class(name, section, school_year, school_level, teacher_id) VALUES(?, ?, ?, ?, ?)", [data.name, data.section, data.school_year, data.school_level, data.teacher_id || null]);
            return rows.insertId;
        }
        catch (e) {
            throw new Error(`Error: ${e}`);
        }
    }
    async getAllClasses() {
        try {
            const [rows] = await this.pool.query("SELECT * FROM class");
            return rows;
        }
        catch (e) {
            console.log(`....Fetching error ${e}`);
            throw new Error(`${e}`);
        }
    }
    async getClassById(id) {
        try {
            const [rows] = await this.pool.query("SELECT * FROM class WHERE id = ?", [id]);
            const classes = rows;
            if (classes.length <= 0) {
                return null;
            }
            return classes[0] ?? null;
        }
        catch (e) {
            console.log(`....Fetching class by id ${e}`);
            throw new Error(`${e}`);
        }
    }
    async updateClassById(id, data) {
        try {
            const keys = Object.keys(data);
            if (keys.length === 0)
                return 0;
            const setClause = keys.map((key) => `${key} = ?`).join(", ");
            const values = keys.map((key) => data[key]);
            const [result] = await this.pool.query(`UPDATE class SET ${setClause} WHERE id = ?`, [...values, id]);
            return result.affectedRows;
        }
        catch (e) {
            console.log(`....Updating class error ${e}`);
            throw new Error(`${e}`);
        }
    }
    async deleteClassById(id) {
        try {
            const [result] = await this.pool.query("DELETE FROM class WHERE id = ?", [id]);
            return result.affectedRows;
        }
        catch (e) {
            console.log(`....Deleting class error ${e}`);
            throw new Error(`${e}`);
        }
    }
}
exports.default = ClassModel;
//# sourceMappingURL=class.model.js.map