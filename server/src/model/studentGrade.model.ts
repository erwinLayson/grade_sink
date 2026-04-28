import { Pool } from "mysql2/promise";
import { StudentGrade, StudentGradeDTO } from "../constant/studentGrade.constant";
import { ResultSetHeader } from "mysql2/promise";

class StudentGradeModel {
  private pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  async createStudentGrade(data: StudentGradeDTO): Promise<number> {
    try {
      const [rows] = await this.pool.query<ResultSetHeader>(
        "INSERT INTO student_grades(student_id, subject_id, teacher_id, grade, quarter) VALUES(?, ?, ?, ?, ?)",
        [data.student_id, data.subject_id, data.teacher_id, data.grade, data.quarter]
      );
      return rows.insertId;
    } catch (e) {
      throw new Error(`Error: ${e}`);
    }
  }

  async getAllStudentGrades(): Promise<StudentGrade[]> {
    try {
      const [rows] = await this.pool.query("SELECT * FROM student_grades");
      return rows as StudentGrade[];
    } catch (e) {
      console.log(`....Fetching error ${e}`);
      throw new Error(`${e}`);
    }
  }

  async getStudentGradeById(id: number): Promise<StudentGrade | null> {
    try {
      const [rows] = await this.pool.query("SELECT * FROM student_grades WHERE id = ?", [id]);
      const grades = rows as StudentGrade[];

      if (grades.length <= 0) {
        return null;
      }

      return grades[0] ?? null;
    } catch (e) {
      console.log(`....Fetching student grade by id ${e}`);
      throw new Error(`${e}`);
    }
  }

  async getGradesByStudentId(student_id: number): Promise<StudentGrade[]> {
    try {
      const [rows] = await this.pool.query("SELECT * FROM student_grades WHERE student_id = ?", [student_id]);
      return rows as StudentGrade[];
    } catch (e) {
      console.log(`....Fetching grades by student ${e}`);
      throw new Error(`${e}`);
    }
  }

  async updateStudentGradeById(id: number, data: Partial<StudentGradeDTO>): Promise<number> {
    try {
      const keys = Object.keys(data);
      if (keys.length === 0) return 0;

      const setClause = keys.map((key) => `${key} = ?`).join(", ");
      const values = keys.map((key) => data[key as keyof StudentGradeDTO]);

      const [result] = await this.pool.query<ResultSetHeader>(
        `UPDATE student_grades SET ${setClause} WHERE id = ?`,
        [...values, id]
      );

      return result.affectedRows;
    } catch (e) {
      console.log(`....Updating student grade error ${e}`);
      throw new Error(`${e}`);
    }
  }

  async deleteStudentGradeById(id: number): Promise<number> {
    try {
      const [result] = await this.pool.query<ResultSetHeader>("DELETE FROM student_grades WHERE id = ?", [id]);
      return result.affectedRows;
    } catch (e) {
      console.log(`....Deleting student grade error ${e}`);
      throw new Error(`${e}`);
    }
  }
}

export default StudentGradeModel;
