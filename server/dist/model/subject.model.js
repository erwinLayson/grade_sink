"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SubjectModel {
    pool;
    constructor(pool) {
        this.pool = pool;
    }
    async createSubject(data) {
        try {
            const [rows] = await this.pool.query("INSERT INTO subjects(code, name) VALUES(?, ?)", [data.code, data.name]);
            return rows.insertId;
        }
        catch (e) {
            throw new Error(`Error: ${e}`);
        }
    }
    async getAllSubjects() {
        try {
            const [rows] = await this.pool.query("SELECT * FROM subjects");
            return rows;
        }
        catch (e) {
            console.log(`....Fetching error ${e}`);
            throw new Error(`${e}`);
        }
    }
    async getSubjectById(id) {
        try {
            const [rows] = await this.pool.query("SELECT * FROM subjects WHERE id = ?", [id]);
            const subjects = rows;
            if (subjects.length <= 0) {
                return null;
            }
            return subjects[0] ?? null;
        }
        catch (e) {
            console.log(`....Fetching subject by id ${e}`);
            throw new Error(`${e}`);
        }
    }
    async updateSubjectById(id, data) {
        try {
            const keys = Object.keys(data);
            if (keys.length === 0)
                return 0;
            const setClause = keys.map((key) => `${key} = ?`).join(", ");
            const values = keys.map((key) => data[key]);
            const [result] = await this.pool.query(`UPDATE subjects SET ${setClause} WHERE id = ?`, [...values, id]);
            return result.affectedRows;
        }
        catch (e) {
            console.log(`....Updating subject error ${e}`);
            throw new Error(`${e}`);
        }
    }
    async deleteSubjectById(id) {
        try {
            const [result] = await this.pool.query("DELETE FROM subjects WHERE id = ?", [id]);
            return result.affectedRows;
        }
        catch (e) {
            console.log(`....Deleting subject error ${e}`);
            throw new Error(`${e}`);
        }
    }
}
exports.default = SubjectModel;
//# sourceMappingURL=subject.model.js.map