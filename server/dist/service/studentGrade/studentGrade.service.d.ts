import StudentGradeModel from "../../model/studentGrade.model";
import { StudentGradeDTO, StudentGradeResponse } from "../../constant/studentGrade.constant";
declare class StudentGradeService {
    private studentGradeModel;
    constructor(studentGradeModel: StudentGradeModel);
    createStudentGrade(data: StudentGradeDTO): Promise<number>;
    getAllStudentGrades(): Promise<StudentGradeResponse[]>;
    getStudentGradeById(id: number): Promise<StudentGradeResponse | null>;
    getGradesByStudentId(student_id: number): Promise<StudentGradeResponse[]>;
    getStudentGradeByStudentSubjectQuarter(student_id: number, subject_id: number, quarter: string): Promise<StudentGradeResponse | null>;
    updateStudentGradeById(id: number, data: Partial<StudentGradeDTO>): Promise<number>;
    deleteStudentGradeById(id: number): Promise<number>;
}
export default StudentGradeService;
//# sourceMappingURL=studentGrade.service.d.ts.map