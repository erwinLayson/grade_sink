import ClassTeacherModel from "../../model/classTeacher.model";
import { ClassTeacherDTO, ClassTeacherResponse } from "../../constant/classTeacher.constant";

class ClassTeacherService {
  constructor(private classTeacherModel: ClassTeacherModel) { }
  
  async createClassTeacher(data: ClassTeacherDTO): Promise<number> {
    try {
      const id = await this.classTeacherModel.createClassTeacher(data);
      return id;
    } catch (e) {
      throw new Error(`Error: ${e}`);
    }
  }

  async getAllClassTeachers(): Promise<ClassTeacherResponse[]> {
    try {
      const classTeachers = await this.classTeacherModel.getAllClassTeachers();
      return classTeachers.map(ct => ({
        id: ct.id,
        class_id: ct.class_id,
        teacher_id: ct.teacher_id
      }));
    } catch (e) {
      console.log(`Error ${e}`);
      throw new Error(`Error: ${e}`);  
    }
  }

  async getClassTeacherById(id: number): Promise<ClassTeacherResponse | null> {
    try {
      const classTeacher = await this.classTeacherModel.getClassTeacherById(id);

      if (!classTeacher) {
        return null;
      }

      return {
        id: classTeacher.id,
        class_id: classTeacher.class_id,
        teacher_id: classTeacher.teacher_id
      };
    } catch (e) {
      console.log(`Error ${e}`);
      throw new Error(`Error: ${e}`);  
    }
  }

  async getTeachersByClassId(class_id: number): Promise<ClassTeacherResponse[]> {
    try {
      const classTeachers = await this.classTeacherModel.getTeachersByClassId(class_id);
      return classTeachers.map(ct => ({
        id: ct.id,
        class_id: ct.class_id,
        teacher_id: ct.teacher_id
      }));
    } catch (e) {
      console.log(`Error ${e}`);
      throw new Error(`Error: ${e}`);  
    }
  }

  async getClassesByTeacherId(teacher_id: number): Promise<any[]> {
    try {
      const classes = await this.classTeacherModel.getClassesByTeacherId(teacher_id);
      return classes;
    } catch (e) {
      console.log(`Error ${e}`);
      throw new Error(`Error: ${e}`);  
    }
  }

  async deleteClassTeacherById(id: number): Promise<number> {
    try {
      const result = await this.classTeacherModel.deleteClassTeacherById(id);
      return result;
    } catch (e) {
      throw new Error(`Error: ${e}`);
    }
  }
}

export default ClassTeacherService;
