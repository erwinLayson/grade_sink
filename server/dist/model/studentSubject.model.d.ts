import { Pool } from "mysql2/promise";
import { StudentSubject, StudentSubjectDTO } from "../constant/studentSubject.constant";
declare class StudentSubjectModel {
    private pool;
    constructor(pool: Pool);
    createStudentSubject(data: StudentSubjectDTO): Promise<number>;
    getAllStudentSubjects(): Promise<StudentSubject[]>;
    getStudentSubjectById(id: number): Promise<StudentSubject | null>;
    getSubjectsByStudentId(student_id: number): Promise<StudentSubject[]>;
    deleteStudentSubjectById(id: number): Promise<number>;
}
export default StudentSubjectModel;
//# sourceMappingURL=studentSubject.model.d.ts.map