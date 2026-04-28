import { Pool } from "mysql2/promise";
import { Class, ClassDTO } from "../constant/class.constant";
import { ResultSetHeader } from "mysql2/promise";

class ClassModel {
  private pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  async createClass(data: ClassDTO): Promise<number> {
    try {
      const [rows] = await this.pool.query<ResultSetHeader>(
        "INSERT INTO class(name, section, school_year, school_level, teacher_id) VALUES(?, ?, ?, ?, ?)",
        [data.name, data.section, data.school_year, data.school_level, data.teacher_id || null]
      );
      return rows.insertId;
    } catch (e) {
      throw new Error(`Error: ${e}`);
    }
  }

  async getAllClasses(): Promise<Class[]> {
    try {
      const [rows] = await this.pool.query("SELECT * FROM class");
      return rows as Class[];
    } catch (e) {
      console.log(`....Fetching error ${e}`);
      throw new Error(`${e}`);
    }
  }

  async getClassById(id: number): Promise<Class | null> {
    try {
      const [rows] = await this.pool.query("SELECT * FROM class WHERE id = ?", [id]);
      const classes = rows as Class[];

      if (classes.length <= 0) {
        return null;
      }

      return classes[0] ?? null;
    } catch (e) {
      console.log(`....Fetching class by id ${e}`);
      throw new Error(`${e}`);
    }
  }

  async updateClassById(id: number, data: Partial<ClassDTO>): Promise<number> {
    try {
      const keys = Object.keys(data);
      if (keys.length === 0) return 0;

      const setClause = keys.map((key) => `${key} = ?`).join(", ");
      const values = keys.map((key) => data[key as keyof ClassDTO]);

      const [result] = await this.pool.query<ResultSetHeader>(
        `UPDATE class SET ${setClause} WHERE id = ?`,
        [...values, id]
      );

      return result.affectedRows;
    } catch (e) {
      console.log(`....Updating class error ${e}`);
      throw new Error(`${e}`);
    }
  }

  async deleteClassById(id: number): Promise<number> {
    try {
      const [result] = await this.pool.query<ResultSetHeader>("DELETE FROM class WHERE id = ?", [id]);
      return result.affectedRows;
    } catch (e) {
      console.log(`....Deleting class error ${e}`);
      throw new Error(`${e}`);
    }
  }
}

export default ClassModel;
