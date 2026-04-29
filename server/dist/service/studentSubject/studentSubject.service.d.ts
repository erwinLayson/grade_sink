import StudentSubjectModel from "../../model/studentSubject.model";
import { StudentSubjectDTO, StudentSubjectResponse } from "../../constant/studentSubject.constant";
declare class StudentSubjectService {
    private studentSubjectModel;
    constructor(studentSubjectModel: StudentSubjectModel);
    createStudentSubject(data: StudentSubjectDTO): Promise<number>;
    getAllStudentSubjects(): Promise<StudentSubjectResponse[]>;
    getStudentSubjectById(id: number): Promise<StudentSubjectResponse | null>;
    getSubjectsByStudentId(student_id: number): Promise<StudentSubjectResponse[]>;
    deleteStudentSubjectById(id: number): Promise<number>;
}
export default StudentSubjectService;
//# sourceMappingURL=studentSubject.service.d.ts.map