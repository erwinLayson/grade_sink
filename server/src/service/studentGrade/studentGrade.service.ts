import StudentGradeModel from "../../model/studentGrade.model";
import { StudentGradeDTO, StudentGradeResponse } from "../../constant/studentGrade.constant";

class StudentGradeService {
  constructor(private studentGradeModel: StudentGradeModel) { }
  
  async createStudentGrade(data: StudentGradeDTO): Promise<number> {
    try {
      const id = await this.studentGradeModel.createStudentGrade(data);
      return id;
    } catch (e) {
      throw new Error(`Error: ${e}`);
    }
  }

  async getAllStudentGrades(): Promise<StudentGradeResponse[]> {
    try {
      const grades = await this.studentGradeModel.getAllStudentGrades();
      return grades.map(grade => ({
        id: grade.id,
        student_id: grade.student_id,
        subject_id: grade.subject_id,
        teacher_id: grade.teacher_id,
        grade: grade.grade,
        quarter: grade.quarter
      }));
    } catch (e) {
      console.log(`Error ${e}`);
      throw new Error(`Error: ${e}`);  
    }
  }

  async getStudentGradeById(id: number): Promise<StudentGradeResponse | null> {
    try {
      const grade = await this.studentGradeModel.getStudentGradeById(id);

      if (!grade) {
        return null;
      }

      return {
        id: grade.id,
        student_id: grade.student_id,
        subject_id: grade.subject_id,
        teacher_id: grade.teacher_id,
        grade: grade.grade,
        quarter: grade.quarter
      };
    } catch (e) {
      console.log(`Error ${e}`);
      throw new Error(`Error: ${e}`);  
    }
  }

  async getGradesByStudentId(student_id: number): Promise<StudentGradeResponse[]> {
    try {
      const grades = await this.studentGradeModel.getGradesByStudentId(student_id);
      return grades.map(grade => ({
        id: grade.id,
        student_id: grade.student_id,
        subject_id: grade.subject_id,
        teacher_id: grade.teacher_id,
        grade: grade.grade,
        quarter: grade.quarter
      }));
    } catch (e) {
      console.log(`Error ${e}`);
      throw new Error(`Error: ${e}`);  
    }
  }

  async updateStudentGradeById(id: number, data: Partial<StudentGradeDTO>): Promise<number> {
    try {
      const result = await this.studentGradeModel.updateStudentGradeById(id, data);
      return result;
    } catch (e) {
      throw new Error(`Error: ${e}`);
    }
  }

  async deleteStudentGradeById(id: number): Promise<number> {
    try {
      const result = await this.studentGradeModel.deleteStudentGradeById(id);
      return result;
    } catch (e) {
      throw new Error(`Error: ${e}`);
    }
  }
}

export default StudentGradeService;
