import ClassStudentModel from "../../model/classStudent.model";
import { ClassStudentDTO, ClassStudentResponse } from "../../constant/classStudent.constant";

class ClassStudentService {
  constructor(private classStudentModel: ClassStudentModel) { }
  
  async createClassStudent(data: ClassStudentDTO): Promise<number> {
    try {
      const id = await this.classStudentModel.createClassStudent(data);
      return id;
    } catch (e) {
      throw new Error(`Error: ${e}`);
    }
  }

  async getAllClassStudents(): Promise<ClassStudentResponse[]> {
    try {
      const classStudents = await this.classStudentModel.getAllClassStudents();
      return classStudents.map(cs => ({
        id: cs.id,
        student_id: cs.student_id,
        class_id: cs.class_id
      }));
    } catch (e) {
      console.log(`Error ${e}`);
      throw new Error(`Error: ${e}`);  
    }
  }

  async getClassStudentById(id: number): Promise<ClassStudentResponse | null> {
    try {
      const classStudent = await this.classStudentModel.getClassStudentById(id);

      if (!classStudent) {
        return null;
      }

      return {
        id: classStudent.id,
        student_id: classStudent.student_id,
        class_id: classStudent.class_id
      };
    } catch (e) {
      console.log(`Error ${e}`);
      throw new Error(`Error: ${e}`);  
    }
  }

  async getStudentsByClassId(class_id: number): Promise<any[]> {
    try {
      const students = await this.classStudentModel.getStudentsByClassId(class_id);
      return students;
    } catch (e) {
      console.log(`Error ${e}`);
      throw new Error(`Error: ${e}`);  
    }
  }

  async deleteClassStudentById(id: number): Promise<number> {
    try {
      const result = await this.classStudentModel.deleteClassStudentById(id);
      return result;
    } catch (e) {
      throw new Error(`Error: ${e}`);
    }
  }
}

export default ClassStudentService;
