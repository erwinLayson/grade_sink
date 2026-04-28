import SubjectModel from "../../model/subject.model";
import { SubjectDTO, SubjectResponse } from "../../constant/subject.constant";

class SubjectService {
  constructor(private subjectModel: SubjectModel) { }
  
  async createSubject(data: SubjectDTO): Promise<number> {
    try {
      const subjectId = await this.subjectModel.createSubject(data);
      return subjectId;
    } catch (e) {
      throw new Error(`Error: ${e}`);
    }
  }

  async getAllSubjects(): Promise<SubjectResponse[]> {
    try {
      const subjects = await this.subjectModel.getAllSubjects();
      return subjects.map(subject => ({
        id: subject.id,
        code: subject.code,
        name: subject.name
      }));
    } catch (e) {
      console.log(`Error ${e}`);
      throw new Error(`Error: ${e}`);  
    }
  }

  async getSubjectById(id: number): Promise<SubjectResponse | null> {
    try {
      const subject = await this.subjectModel.getSubjectById(id);

      if (!subject) {
        return null;
      }

      return {
        id: subject.id,
        code: subject.code,
        name: subject.name
      };
    } catch (e) {
      console.log(`Error ${e}`);
      throw new Error(`Error: ${e}`);  
    }
  }

  async updateSubjectById(id: number, data: Partial<SubjectDTO>): Promise<number> {
    try {
      const result = await this.subjectModel.updateSubjectById(id, data);
      return result;
    } catch (e) {
      throw new Error(`Error: ${e}`);
    }
  }

  async deleteSubjectById(id: number): Promise<number> {
    try {
      const result = await this.subjectModel.deleteSubjectById(id);
      return result;
    } catch (e) {
      throw new Error(`Error: ${e}`);
    }
  }
}

export default SubjectService;
