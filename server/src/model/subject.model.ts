import { Pool } from "mysql2/promise";
import { Subject, SubjectDTO } from "../constant/subject.constant";
import { ResultSetHeader } from "mysql2/promise";

class SubjectModel {
  private pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  async createSubject(data: SubjectDTO): Promise<number> {
    try {
      const [rows] = await this.pool.query<ResultSetHeader>(
        "INSERT INTO subjects(code, name) VALUES(?, ?)",
        [data.code, data.name]
      );
      return rows.insertId;
    } catch (e) {
      throw new Error(`Error: ${e}`);
    }
  }

  async getAllSubjects(): Promise<Subject[]> {
    try {
      const [rows] = await this.pool.query("SELECT * FROM subjects");
      return rows as Subject[];
    } catch (e) {
      console.log(`....Fetching error ${e}`);
      throw new Error(`${e}`);
    }
  }

  async getSubjectById(id: number): Promise<Subject | null> {
    try {
      const [rows] = await this.pool.query("SELECT * FROM subjects WHERE id = ?", [id]);
      const subjects = rows as Subject[];

      if (subjects.length <= 0) {
        return null;
      }

      return subjects[0] ?? null;
    } catch (e) {
      console.log(`....Fetching subject by id ${e}`);
      throw new Error(`${e}`);
    }
  }

  async updateSubjectById(id: number, data: Partial<SubjectDTO>): Promise<number> {
    try {
      const keys = Object.keys(data);
      if (keys.length === 0) return 0;

      const setClause = keys.map((key) => `${key} = ?`).join(", ");
      const values = keys.map((key) => data[key as keyof SubjectDTO]);

      const [result] = await this.pool.query<ResultSetHeader>(
        `UPDATE subjects SET ${setClause} WHERE id = ?`,
        [...values, id]
      );

      return result.affectedRows;
    } catch (e) {
      console.log(`....Updating subject error ${e}`);
      throw new Error(`${e}`);
    }
  }

  async deleteSubjectById(id: number): Promise<number> {
    try {
      const [result] = await this.pool.query<ResultSetHeader>("DELETE FROM subjects WHERE id = ?", [id]);
      return result.affectedRows;
    } catch (e) {
      console.log(`....Deleting subject error ${e}`);
      throw new Error(`${e}`);
    }
  }
}

export default SubjectModel;
