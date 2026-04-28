import StudentModel from "../../model/student.model";
import { StudentDTO, StudentResponse } from "../../constant/student.constant";

class StudentService {
  constructor(private studentModel: StudentModel) { }
  
  async createStudent(data: StudentDTO): Promise<number> {
    try {
      const studentId = await this.studentModel.createStudent(data);
      return studentId;
    } catch (e) {
      throw new Error(`Error: ${e}`);
    }
  }

  async getAllStudents(): Promise<StudentResponse[]> {
    try {
      const students = await this.studentModel.getAllStudents();
      return students.map(student => ({
        id: student.id,
        student_id: student.student_id,
        first_name: student.first_name,
        middle_name: student.middle_name,
        last_name: student.last_name,
        age: student.age,
        lrn: student.lrn,
        level: student.level
      }));
    } catch (e) {
      console.log(`Error ${e}`);
      throw new Error(`Error: ${e}`);  
    }
  }

  async getStudentById(id: number): Promise<StudentResponse | null> {
    try {
      const student = await this.studentModel.getStudentById(id);

      if (!student) {
        return null;
      }

      return {
        id: student.id,
        student_id: student.student_id,
        first_name: student.first_name,
        middle_name: student.middle_name,
        last_name: student.last_name,
        age: student.age,
        lrn: student.lrn,
        level: student.level
      };
    } catch (e) {
      console.log(`Error ${e}`);
      throw new Error(`Error: ${e}`);  
    }
  }

  async getStudentByStudentId(student_id: number): Promise<StudentResponse | null> {
    try {
      const student = await this.studentModel.getStudentByStudentId(student_id);

      if (!student) {
        return null;
      }

      return {
        id: student.id,
        student_id: student.student_id,
        first_name: student.first_name,
        middle_name: student.middle_name,
        last_name: student.last_name,
        age: student.age,
        lrn: student.lrn,
        level: student.level
      };
    } catch (e) {
      console.log(`Error ${e}`);
      throw new Error(`Error: ${e}`);  
    }
  }

  async updateStudentById(id: number, data: Partial<StudentDTO>): Promise<number> {
    try {
      const result = await this.studentModel.updateStudentById(id, data);
      return result;
    } catch (e) {
      throw new Error(`Error: ${e}`);
    }
  }

  async deleteStudentById(id: number): Promise<number> {
    try {
      const result = await this.studentModel.deleteStudentById(id);
      return result;
    } catch (e) {
      throw new Error(`Error: ${e}`);
    }
  }
}

export default StudentService;
