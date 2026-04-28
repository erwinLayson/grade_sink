import ClassSubjectModel from "../../model/classSubject.model";
import { ClassSubjectDTO, ClassSubjectResponse } from "../../constant/classSubject.constant";

class ClassSubjectService {
  constructor(private classSubjectModel: ClassSubjectModel) { }
  
  async createClassSubject(data: ClassSubjectDTO): Promise<number> {
    try {
      const id = await this.classSubjectModel.createClassSubject(data);
      return id;
    } catch (e) {
      throw new Error(`Error: ${e}`);
    }
  }

  async getAllClassSubjects(): Promise<ClassSubjectResponse[]> {
    try {
      const classSubjects = await this.classSubjectModel.getAllClassSubjects();
      return classSubjects.map(cs => ({
        id: cs.id,
        class_id: cs.class_id,
        subject_id: cs.subject_id
      }));
    } catch (e) {
      console.log(`Error ${e}`);
      throw new Error(`Error: ${e}`);  
    }
  }

  async getClassSubjectById(id: number): Promise<ClassSubjectResponse | null> {
    try {
      const classSubject = await this.classSubjectModel.getClassSubjectById(id);

      if (!classSubject) {
        return null;
      }

      return {
        id: classSubject.id,
        class_id: classSubject.class_id,
        subject_id: classSubject.subject_id
      };
    } catch (e) {
      console.log(`Error ${e}`);
      throw new Error(`Error: ${e}`);  
    }
  }

  async getSubjectsByClassId(class_id: number): Promise<ClassSubjectResponse[]> {
    try {
      const classSubjects = await this.classSubjectModel.getSubjectsByClassId(class_id);
      return classSubjects.map((cs: any) => ({
        id: cs.id,
        class_id: cs.class_id,
        subject_id: cs.subject_id,
        code: cs.code,
        name: cs.name,
        teacher_id: cs.teacher_id ?? null,
        teacher_name: cs.teacher_name ?? null,
      }));
    } catch (e) {
      console.log(`Error ${e}`);
      throw new Error(`Error: ${e}`);  
    }
  }

  async deleteClassSubjectById(id: number): Promise<number> {
    try {
      const result = await this.classSubjectModel.deleteClassSubjectById(id);
      return result;
    } catch (e) {
      throw new Error(`Error: ${e}`);
    }
  }
}

export default ClassSubjectService;
