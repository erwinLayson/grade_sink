import { Pool } from "mysql2/promise";
import { ClassSubject, ClassSubjectDTO } from "../constant/classSubject.constant";
import { ResultSetHeader } from "mysql2/promise";

class ClassSubjectModel {
  private pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  async createClassSubject(data: ClassSubjectDTO): Promise<number> {
    try {
      const [rows] = await this.pool.query<ResultSetHeader>(
        "INSERT INTO class_subjects(class_id, subject_id) VALUES(?, ?)",
        [data.class_id, data.subject_id]
      );
      return rows.insertId;
    } catch (e) {
      throw new Error(`Error: ${e}`);
    }
  }

  async getAllClassSubjects(): Promise<ClassSubject[]> {
    try {
      const [rows] = await this.pool.query("SELECT * FROM class_subjects");
      return rows as ClassSubject[];
    } catch (e) {
      console.log(`....Fetching error ${e}`);
      throw new Error(`${e}`);
    }
  }

  async getClassSubjectById(id: number): Promise<ClassSubject | null> {
    try {
      const [rows] = await this.pool.query("SELECT * FROM class_subjects WHERE id = ?", [id]);
      const classSubjects = rows as ClassSubject[];

      if (classSubjects.length <= 0) {
        return null;
      }

      return classSubjects[0] ?? null;
    } catch (e) {
      console.log(`....Fetching class subject by id ${e}`);
      throw new Error(`${e}`);
    }
  }

  async getSubjectsByClassId(class_id: number): Promise<ClassSubject[]> {
    try {
      const [rows] = await this.pool.query("SELECT * FROM class_subjects WHERE class_id = ?", [class_id]);
      return rows as ClassSubject[];
    } catch (e) {
      console.log(`....Fetching subjects by class ${e}`);
      throw new Error(`${e}`);
    }
  }

  async deleteClassSubjectById(id: number): Promise<number> {
    try {
      const [result] = await this.pool.query<ResultSetHeader>("DELETE FROM class_subjects WHERE id = ?", [id]);
      return result.affectedRows;
    } catch (e) {
      console.log(`....Deleting class subject error ${e}`);
      throw new Error(`${e}`);
    }
  }
}

export default ClassSubjectModel;
