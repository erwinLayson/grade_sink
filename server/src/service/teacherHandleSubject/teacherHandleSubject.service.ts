import TeacherHandleSubjectModel from "../../model/teacherHandleSubject.model";
import { TeacherHandleSubjectDTO, TeacherHandleSubjectResponse } from "../../constant/teacherHandleSubject.constant";

class TeacherHandleSubjectService {
  constructor(private teacherHandleSubjectModel: TeacherHandleSubjectModel) { }
  
  async createTeacherHandleSubject(data: TeacherHandleSubjectDTO): Promise<number> {
    try {
      const id = await this.teacherHandleSubjectModel.createTeacherHandleSubject(data);
      return id;
    } catch (e) {
      throw new Error(`Error: ${e}`);
    }
  }

  async getAllTeacherHandleSubjects(): Promise<TeacherHandleSubjectResponse[]> {
    try {
      const assignments = await this.teacherHandleSubjectModel.getAllTeacherHandleSubjects();
      return assignments.map(assignment => ({
        id: assignment.id,
        teacher_id: assignment.teacher_id,
        subject_id: assignment.subject_id
      }));
    } catch (e) {
      console.log(`Error ${e}`);
      throw new Error(`Error: ${e}`);  
    }
  }

  async getTeacherHandleSubjectById(id: number): Promise<TeacherHandleSubjectResponse | null> {
    try {
      const assignment = await this.teacherHandleSubjectModel.getTeacherHandleSubjectById(id);

      if (!assignment) {
        return null;
      }

      return {
        id: assignment.id,
        teacher_id: assignment.teacher_id,
        subject_id: assignment.subject_id
      };
    } catch (e) {
      console.log(`Error ${e}`);
      throw new Error(`Error: ${e}`);  
    }
  }

  async getSubjectsByTeacherId(teacher_id: number): Promise<any[]> {
    try {
      const subjects = await this.teacherHandleSubjectModel.getSubjectsByTeacherId(teacher_id);
      return subjects;
    } catch (e) {
      console.log(`Error ${e}`);
      throw new Error(`Error: ${e}`);  
    }
  }

  async deleteTeacherHandleSubjectById(id: number): Promise<number> {
    try {
      const result = await this.teacherHandleSubjectModel.deleteTeacherHandleSubjectById(id);
      return result;
    } catch (e) {
      throw new Error(`Error: ${e}`);
    }
  }
}

export default TeacherHandleSubjectService;
