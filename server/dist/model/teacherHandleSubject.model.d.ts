import { Pool } from "mysql2/promise";
import { TeacherHandleSubject, TeacherHandleSubjectDTO } from "../constant/teacherHandleSubject.constant";
declare class TeacherHandleSubjectModel {
    private pool;
    constructor(pool: Pool);
    createTeacherHandleSubject(data: TeacherHandleSubjectDTO): Promise<number>;
    getAllTeacherHandleSubjects(): Promise<TeacherHandleSubject[]>;
    getTeacherHandleSubjectById(id: number): Promise<TeacherHandleSubject | null>;
    getSubjectsByTeacherId(teacher_id: number): Promise<any[]>;
    deleteTeacherHandleSubjectById(id: number): Promise<number>;
}
export default TeacherHandleSubjectModel;
//# sourceMappingURL=teacherHandleSubject.model.d.ts.map