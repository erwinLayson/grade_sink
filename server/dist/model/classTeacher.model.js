"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ClassTeacherModel {
    pool;
    constructor(pool) {
        this.pool = pool;
    }
    async createClassTeacher(data) {
        try {
            const [rows] = await this.pool.query("INSERT INTO class_teacher(class_id, teacher_id) VALUES(?, ?)", [data.class_id, data.teacher_id]);
            return rows.insertId;
        }
        catch (e) {
            throw new Error(`Error: ${e}`);
        }
    }
    async getAllClassTeachers() {
        try {
            const [rows] = await this.pool.query("SELECT * FROM class_teacher");
            return rows;
        }
        catch (e) {
            console.log(`....Fetching error ${e}`);
            throw new Error(`${e}`);
        }
    }
    async getClassTeacherById(id) {
        try {
            const [rows] = await this.pool.query("SELECT * FROM class_teacher WHERE id = ?", [id]);
            const classTeachers = rows;
            if (classTeachers.length <= 0) {
                return null;
            }
            return classTeachers[0] ?? null;
        }
        catch (e) {
            console.log(`....Fetching class teacher by id ${e}`);
            throw new Error(`${e}`);
        }
    }
    async getTeachersByClassId(class_id) {
        try {
            const [rows] = await this.pool.query("SELECT * FROM class_teacher WHERE class_id = ?", [class_id]);
            return rows;
        }
        catch (e) {
            console.log(`....Fetching teachers by class ${e}`);
            throw new Error(`${e}`);
        }
    }
    async getClassesByTeacherId(teacher_id) {
        try {
            const [rows] = await this.pool.query(`SELECT c.id, c.name, c.section, c.school_year, c.school_level 
         FROM class c 
         JOIN class_teacher ct ON c.id = ct.class_id 
         WHERE ct.teacher_id = ?`, [teacher_id]);
            return rows;
        }
        catch (e) {
            console.log(`....Fetching classes by teacher ${e}`);
            throw new Error(`${e}`);
        }
    }
    async deleteClassTeacherById(id) {
        try {
            const [result] = await this.pool.query("DELETE FROM class_teacher WHERE id = ?", [id]);
            return result.affectedRows;
        }
        catch (e) {
            console.log(`....Deleting class teacher error ${e}`);
            throw new Error(`${e}`);
        }
    }
}
exports.default = ClassTeacherModel;
//# sourceMappingURL=classTeacher.model.js.map