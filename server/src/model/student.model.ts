import { Pool } from "mysql2/promise";
import { Student, StudentDTO } from "../constant/student.constant";
import { ResultSetHeader } from "mysql2/promise";

class StudentModel {
  private pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  async createStudent(data: StudentDTO): Promise<number> {
    try {
      const [rows] = await this.pool.query<ResultSetHeader>(
        "INSERT INTO students(student_id, first_name, middle_name, last_name, age, birth_date, lrn, sex, level) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [data.student_id, data.first_name, data.middle_name, data.last_name, data.age, data.birth_date, data.lrn, data.sex, data.level]
      );
      return rows.insertId;
    } catch (e) {
      throw new Error(`Error: ${e}`);
    }
  }

  async getAllStudents(): Promise<Student[]> {
    try {
      const [rows] = await this.pool.query("SELECT * FROM students");
      return rows as Student[];
    } catch (e) {
      console.log(`....Fetching error ${e}`);
      throw new Error(`${e}`);
    }
  }

  async getStudentById(id: number): Promise<Student | null> {
    try {
      const [rows] = await this.pool.query("SELECT * FROM students WHERE id = ?", [id]);
      const students = rows as Student[];

      if (students.length <= 0) {
        return null;
      }

      return students[0] ?? null;
    } catch (e) {
      console.log(`....Fetching student by id ${e}`);
      throw new Error(`${e}`);
    }
  }

  async getStudentByStudentId(student_id: number): Promise<Student | null> {
    try {
      const [rows] = await this.pool.query("SELECT * FROM students WHERE student_id = ?", [student_id]);
      const students = rows as Student[];

      if (students.length <= 0) {
        return null;
      }

      return students[0] ?? null;
    } catch (e) {
      console.log(`....Fetching student by student_id ${e}`);
      throw new Error(`${e}`);
    }
  }

  async getStudentByLrn(lrn: string): Promise<Student | null> {
    try {
      const [rows] = await this.pool.query("SELECT * FROM students WHERE lrn = ?", [lrn]);
      const students = rows as Student[];

      if (students.length <= 0) {
        return null;
      }

      return students[0] ?? null;
    } catch (e) {
      console.log(`....Fetching student by lrn ${e}`);
      throw new Error(`${e}`);
    }
  }

  async updateStudentById(id: number, data: Partial<StudentDTO>): Promise<number> {
    try {
      const keys = Object.keys(data);
      if (keys.length === 0) return 0;

      const setClause = keys.map((key) => `${key} = ?`).join(", ");
      const values = keys.map((key) => data[key as keyof StudentDTO]);

      const [result] = await this.pool.query<ResultSetHeader>(
        `UPDATE students SET ${setClause} WHERE id = ?`,
        [...values, id]
      );

      return result.affectedRows;
    } catch (e) {
      console.log(`....Updating student error ${e}`);
      throw new Error(`${e}`);
    }
  }

  async deleteStudentById(id: number): Promise<number> {
    try {
      const [result] = await this.pool.query<ResultSetHeader>("DELETE FROM students WHERE id = ?", [id]);
      return result.affectedRows;
    } catch (e) {
      console.log(`....Deleting student error ${e}`);
      throw new Error(`${e}`);
    }
  }
}

export default StudentModel;
