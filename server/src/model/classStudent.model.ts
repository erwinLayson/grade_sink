import { Pool } from "mysql2/promise";
import { ClassStudent, ClassStudentDTO } from "../constant/classStudent.constant";
import { ResultSetHeader } from "mysql2/promise";

class ClassStudentModel {
  private pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  async createClassStudent(data: ClassStudentDTO): Promise<number> {
    try {
      const [rows] = await this.pool.query<ResultSetHeader>(
        "INSERT INTO class_student(student_id, class_id) VALUES(?, ?)",
        [data.student_id, data.class_id]
      );
      return rows.insertId;
    } catch (e) {
      throw new Error(`Error: ${e}`);
    }
  }

  async getAllClassStudents(): Promise<ClassStudent[]> {
    try {
      const [rows] = await this.pool.query("SELECT * FROM class_student");
      return rows as ClassStudent[];
    } catch (e) {
      console.log(`....Fetching error ${e}`);
      throw new Error(`${e}`);
    }
  }

  async getClassStudentById(id: number): Promise<ClassStudent | null> {
    try {
      const [rows] = await this.pool.query("SELECT * FROM class_student WHERE id = ?", [id]);
      const classStudents = rows as ClassStudent[];

      if (classStudents.length <= 0) {
        return null;
      }

      return classStudents[0] ?? null;
    } catch (e) {
      console.log(`....Fetching class student by id ${e}`);
      throw new Error(`${e}`);
    }
  }

  async getStudentsByClassId(class_id: number): Promise<any[]> {
    try {
      const [rows] = await this.pool.query(
        `SELECT cs.id, s.id as student_id, s.first_name, s.middle_name, s.last_name, s.sex, cs.class_id
         FROM class_student cs
         JOIN students s ON cs.student_id = s.id
         WHERE cs.class_id = ?`,
        [class_id]
      );
      return rows as any[];
    } catch (e) {
      console.log(`....Fetching students by class ${e}`);
      throw new Error(`${e}`);
    }
  }

  async deleteClassStudentById(id: number): Promise<number> {
    try {
      const [result] = await this.pool.query<ResultSetHeader>("DELETE FROM class_student WHERE id = ?", [id]);
      return result.affectedRows;
    } catch (e) {
      console.log(`....Deleting class student error ${e}`);
      throw new Error(`${e}`);
    }
  }
}

export default ClassStudentModel;
