import TeacherModel from "../../model/teacher.model";
import { TeacherDTO, TeacherResponse } from "../../constant/teacher.constant";

class TeacherService {
  constructor(private teacherModel: TeacherModel) { }
  
  async createTeacher(data: TeacherDTO): Promise<number> {
    try {
      const teacherId = await this.teacherModel.createTeacher(data);
      return teacherId;
    } catch (e) {
      throw new Error(`Error: ${e}`);
    }
  }

  async getAllTeachers(): Promise<TeacherResponse[]> {
    try {
      const teachers = await this.teacherModel.getAllTeachers();
      return teachers.map(teacher => ({
        id: teacher.id,
        email: teacher.email,
        first_name: teacher.first_name,
        middle_name: teacher.middle_name,
        last_name: teacher.last_name
      }));
    } catch (e) {
      console.log(`Error ${e}`);
      throw new Error(`Error: ${e}`);  
    }
  }

  async getTeacherById(id: number): Promise<TeacherResponse | null> {
    try {
      const teacher = await this.teacherModel.getTeacherById(id);

      if (!teacher) {
        return null;
      }

      return {
        id: teacher.id,
        email: teacher.email,
        first_name: teacher.first_name,
        middle_name: teacher.middle_name,
        last_name: teacher.last_name
      };
    } catch (e) {
      console.log(`Error ${e}`);
      throw new Error(`Error: ${e}`);  
    }
  }

  async getTeacherByEmail(email: string): Promise<TeacherResponse | null> {
    try {
      const teacher = await this.teacherModel.getTeacherByEmail(email);

      if (!teacher) {
        return null;
      }

      return {
        id: teacher.id,
        email: teacher.email,
        first_name: teacher.first_name,
        middle_name: teacher.middle_name,
        last_name: teacher.last_name
      };
    } catch (e) {
      console.log(`Error ${e}`);
      throw new Error(`Error: ${e}`);  
    }
  }

  async updateTeacherById(id: number, data: Partial<TeacherDTO>): Promise<number> {
    try {
      const result = await this.teacherModel.updateTeacherById(id, data);
      return result;
    } catch (e) {
      throw new Error(`Error: ${e}`);
    }
  }

  async deleteTeacherById(id: number): Promise<number> {
    try {
      const result = await this.teacherModel.deleteTeacherById(id);
      return result;
    } catch (e) {
      throw new Error(`Error: ${e}`);
    }
  }
}

export default TeacherService;
