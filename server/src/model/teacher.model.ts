import { Pool } from "mysql2/promise";
import { Teacher, TeacherDTO } from "../constant/teacher.constant";
import { ResultSetHeader } from "mysql2/promise";

class TeacherModel {
  private pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  async createTeacher(data: TeacherDTO): Promise<number> {
    try {
      const [rows] = await this.pool.query<ResultSetHeader>(
        "INSERT INTO teachers(first_name, middle_name, last_name, email) VALUES(?, ?, ?, ?)",
        [data.first_name || null, data.middle_name || null, data.last_name || null, data.email]
      );
      return rows.insertId;
    } catch (e) {
      throw new Error(`Error: ${e}`);
    }
  }

  async getAllTeachers(): Promise<Teacher[]> {
    try {
      const [rows] = await this.pool.query("SELECT * FROM teachers");
      return rows as Teacher[];
    } catch (e) {
      console.log(`....Fetching error ${e}`);
      throw new Error(`${e}`);
    }
  }

  async getTeacherById(id: number): Promise<Teacher | null> {
    try {
      const [rows] = await this.pool.query("SELECT * FROM teachers WHERE id = ?", [id]);
      const teachers = rows as Teacher[];

      if (teachers.length <= 0) {
        return null;
      }

      return teachers[0] ?? null;
    } catch (e) {
      console.log(`....Fetching teacher by id ${e}`);
      throw new Error(`${e}`);
    }
  }

  async getTeacherByEmail(email: string): Promise<Teacher | null> {
    try {
      const [rows] = await this.pool.query("SELECT * FROM teachers WHERE email = ?", [email]);
      const teachers = rows as Teacher[];

      if (teachers.length <= 0) {
        return null;
      }

      return teachers[0] ?? null;
    } catch (e) {
      console.log(`....Fetching teacher by email ${e}`);
      throw new Error(`${e}`);
    }
  }

  async updateTeacherById(id: number, data: Partial<TeacherDTO>): Promise<number> {
    try {
      const keys = Object.keys(data);
      if (keys.length === 0) return 0;

      const setClause = keys.map((key) => `${key} = ?`).join(", ");
      const values = keys.map((key) => data[key as keyof TeacherDTO]);

      const [result] = await this.pool.query<ResultSetHeader>(
        `UPDATE teachers SET ${setClause} WHERE id = ?`,
        [...values, id]
      );

      return result.affectedRows;
    } catch (e) {
      console.log(`....Updating teacher error ${e}`);
      throw new Error(`${e}`);
    }
  }

  async deleteTeacherById(id: number): Promise<number> {
    try {
      const [result] = await this.pool.query<ResultSetHeader>("DELETE FROM teachers WHERE id = ?", [id]);
      return result.affectedRows;
    } catch (e) {
      console.log(`....Deleting teacher error ${e}`);
      throw new Error(`${e}`);
    }
  }
}

export default TeacherModel;
