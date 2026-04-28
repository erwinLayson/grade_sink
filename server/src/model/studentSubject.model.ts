import { Pool } from "mysql2/promise";
import { StudentSubject, StudentSubjectDTO } from "../constant/studentSubject.constant";
import { ResultSetHeader } from "mysql2/promise";

class StudentSubjectModel {
  private pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  async createStudentSubject(data: StudentSubjectDTO): Promise<number> {
    try {
      const [rows] = await this.pool.query<ResultSetHeader>(
        "INSERT INTO student_subject(student_id, subject_id, teacher_id) VALUES(?, ?, ?)",
        [data.student_id, data.subject_id, data.teacher_id]
      );
      return rows.insertId;
    } catch (e) {
      throw new Error(`Error: ${e}`);
    }
  }

  async getAllStudentSubjects(): Promise<StudentSubject[]> {
    try {
      const [rows] = await this.pool.query("SELECT * FROM student_subject");
      return rows as StudentSubject[];
    } catch (e) {
      console.log(`....Fetching error ${e}`);
      throw new Error(`${e}`);
    }
  }

  async getStudentSubjectById(id: number): Promise<StudentSubject | null> {
    try {
      const [rows] = await this.pool.query("SELECT * FROM student_subject WHERE id = ?", [id]);
      const studentSubjects = rows as StudentSubject[];

      if (studentSubjects.length <= 0) {
        return null;
      }

      return studentSubjects[0] ?? null;
    } catch (e) {
      console.log(`....Fetching student subject by id ${e}`);
      throw new Error(`${e}`);
    }
  }

  async getSubjectsByStudentId(student_id: number): Promise<StudentSubject[]> {
    try {
      const [rows] = await this.pool.query("SELECT * FROM student_subject WHERE student_id = ?", [student_id]);
      return rows as StudentSubject[];
    } catch (e) {
      console.log(`....Fetching subjects by student ${e}`);
      throw new Error(`${e}`);
    }
  }

  async deleteStudentSubjectById(id: number): Promise<number> {
    try {
      const [result] = await this.pool.query<ResultSetHeader>("DELETE FROM student_subject WHERE id = ?", [id]);
      return result.affectedRows;
    } catch (e) {
      console.log(`....Deleting student subject error ${e}`);
      throw new Error(`${e}`);
    }
  }
}

export default StudentSubjectModel;
