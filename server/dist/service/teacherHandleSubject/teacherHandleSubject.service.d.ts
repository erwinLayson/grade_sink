import TeacherHandleSubjectModel from "../../model/teacherHandleSubject.model";
import { TeacherHandleSubjectDTO, TeacherHandleSubjectResponse } from "../../constant/teacherHandleSubject.constant";
declare class TeacherHandleSubjectService {
    private teacherHandleSubjectModel;
    constructor(teacherHandleSubjectModel: TeacherHandleSubjectModel);
    createTeacherHandleSubject(data: TeacherHandleSubjectDTO): Promise<number>;
    getAllTeacherHandleSubjects(): Promise<TeacherHandleSubjectResponse[]>;
    getTeacherHandleSubjectById(id: number): Promise<TeacherHandleSubjectResponse | null>;
    getSubjectsByTeacherId(teacher_id: number): Promise<any[]>;
    deleteTeacherHandleSubjectById(id: number): Promise<number>;
}
export default TeacherHandleSubjectService;
//# sourceMappingURL=teacherHandleSubject.service.d.ts.map