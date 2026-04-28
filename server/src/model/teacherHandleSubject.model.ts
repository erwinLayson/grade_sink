import { Pool } from "mysql2/promise";
import { TeacherHandleSubject, TeacherHandleSubjectDTO } from "../constant/teacherHandleSubject.constant";
import { ResultSetHeader } from "mysql2/promise";

class TeacherHandleSubjectModel {
  private pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  async createTeacherHandleSubject(data: TeacherHandleSubjectDTO): Promise<number> {
    try {
      const [rows] = await this.pool.query<ResultSetHeader>(
        "INSERT INTO teacher_handle_subject(teacher_id, subject_id) VALUES(?, ?)",
        [data.teacher_id, data.subject_id]
      );
      return rows.insertId;
    } catch (e) {
      throw new Error(`Error: ${e}`);
    }
  }

  async getAllTeacherHandleSubjects(): Promise<TeacherHandleSubject[]> {
    try {
      const [rows] = await this.pool.query("SELECT * FROM teacher_handle_subject");
      return rows as TeacherHandleSubject[];
    } catch (e) {
      console.log(`....Fetching error ${e}`);
      throw new Error(`${e}`);
    }
  }

  async getTeacherHandleSubjectById(id: number): Promise<TeacherHandleSubject | null> {
    try {
      const [rows] = await this.pool.query("SELECT * FROM teacher_handle_subject WHERE id = ?", [id]);
      const assignments = rows as TeacherHandleSubject[];

      if (assignments.length <= 0) {
        return null;
      }

      return assignments[0] ?? null;
    } catch (e) {
      console.log(`....Fetching teacher handle subject by id ${e}`);
      throw new Error(`${e}`);
    }
  }

  async getSubjectsByTeacherId(teacher_id: number): Promise<any[]> {
    try {
      const [rows] = await this.pool.query(
        `SELECT s.id, s.code, s.name 
         FROM subjects s 
         JOIN teacher_handle_subject ths ON s.id = ths.subject_id 
         WHERE ths.teacher_id = ?`,
        [teacher_id]
      );
      return rows as any[];
    } catch (e) {
      console.log(`....Fetching subjects by teacher ${e}`);
      throw new Error(`${e}`);
    }
  }

  async deleteTeacherHandleSubjectById(id: number): Promise<number> {
    try {
      const [result] = await this.pool.query<ResultSetHeader>("DELETE FROM teacher_handle_subject WHERE id = ?", [id]);
      return result.affectedRows;
    } catch (e) {
      console.log(`....Deleting teacher handle subject error ${e}`);
      throw new Error(`${e}`);
    }
  }
}

export default TeacherHandleSubjectModel;
