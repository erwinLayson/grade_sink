import ClassModel from "../../model/class.model";
import { ClassDTO, ClassResponse } from "../../constant/class.constant";

class ClassService {
  constructor(private classModel: ClassModel) { }
  
  async createClass(data: ClassDTO): Promise<number> {
    try {
      const classId = await this.classModel.createClass(data);
      return classId;
    } catch (e) {
      throw new Error(`Error: ${e}`);
    }
  }

  async getAllClasses(): Promise<ClassResponse[]> {
    try {
      const classes = await this.classModel.getAllClasses();
      return classes.map(cls => ({
        id: cls.id,
        name: cls.name,
        section: cls.section,
        school_year: cls.school_year,
        school_level: cls.school_level,
        teacher_id: cls.teacher_id
      }));
    } catch (e) {
      console.log(`Error ${e}`);
      throw new Error(`Error: ${e}`);  
    }
  }

  async getClassById(id: number): Promise<ClassResponse | null> {
    try {
      const cls = await this.classModel.getClassById(id);

      if (!cls) {
        return null;
      }

      return {
        id: cls.id,
        name: cls.name,
        section: cls.section,
        school_year: cls.school_year,
        school_level: cls.school_level,
        teacher_id: cls.teacher_id
      };
    } catch (e) {
      console.log(`Error ${e}`);
      throw new Error(`Error: ${e}`);  
    }
  }

  async updateClassById(id: number, data: Partial<ClassDTO>): Promise<number> {
    try {
      const result = await this.classModel.updateClassById(id, data);
      return result;
    } catch (e) {
      throw new Error(`Error: ${e}`);
    }
  }

  async deleteClassById(id: number): Promise<number> {
    try {
      const result = await this.classModel.deleteClassById(id);
      return result;
    } catch (e) {
      throw new Error(`Error: ${e}`);
    }
  }
}

export default ClassService;
