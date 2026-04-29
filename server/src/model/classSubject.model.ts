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
      const [rows] = await this.pool.query(
        `SELECT
          cs.id,
          cs.class_id,
          cs.subject_id,
          s.code,
          s.name,
          ct.teacher_id,
          CONCAT(COALESCE(t.first_name, ''), CASE WHEN t.last_name IS NOT NULL THEN CONCAT(' ', t.last_name) ELSE '' END) AS teacher_name
        FROM class_subjects cs
        INNER JOIN subjects s ON s.id = cs.subject_id
        LEFT JOIN class_teacher ct ON ct.class_id = cs.class_id
        LEFT JOIN teachers t ON t.id = ct.teacher_id
        WHERE cs.class_id = ?
        ORDER BY cs.id DESC`,
        [class_id]
      );
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

  async getClassesByTeacherId(teacher_id: number): Promise<any[]> {
    try {
      const [rows] = await this.pool.query(
        `SELECT DISTINCT c.id, c.name, c.section, c.school_year, c.school_level
         FROM class c
         JOIN class_subjects cs ON c.id = cs.class_id
         JOIN teacher_handle_subject ths ON ths.subject_id = cs.subject_id
         WHERE ths.teacher_id = ?
         ORDER BY c.id DESC`,
        [teacher_id]
      );
      return rows as any[];
    } catch (e) {
      console.log(`....Fetching classes by teacher through subjects ${e}`);
      throw new Error(`${e}`);
    }
  }

  async getClassSubjectByClassAndSubject(class_id: number, subject_id: number): Promise<{ id: number; class_id: number; subject_id: number } | null> {
    try {
      const [rows] = await this.pool.query(
        "SELECT id, class_id, subject_id FROM class_subjects WHERE class_id = ? AND subject_id = ? ORDER BY id DESC LIMIT 1",
        [class_id, subject_id]
      );

      const classSubjects = rows as Array<{ id: number; class_id: number; subject_id: number }>;
      return classSubjects[0] ?? null;
    } catch (e) {
      console.log(`....Fetching class subject by class and subject ${e}`);
      throw new Error(`${e}`);
    }
  }

  async deleteClassSubjectByClassAndSubject(class_id: number, subject_id: number): Promise<number> {
    try {
      const [result] = await this.pool.query<ResultSetHeader>(
        "DELETE FROM class_subjects WHERE class_id = ? AND subject_id = ?",
        [class_id, subject_id]
      );
      return result.affectedRows;
    } catch (e) {
      console.log(`....Deleting class subject by class and subject error ${e}`);
      throw new Error(`${e}`);
    }
  }
}

export default ClassSubjectModel;
