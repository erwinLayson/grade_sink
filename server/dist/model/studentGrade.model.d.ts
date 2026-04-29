import { Pool } from "mysql2/promise";
import { StudentGrade, StudentGradeDTO } from "../constant/studentGrade.constant";
declare class StudentGradeModel {
    private pool;
    constructor(pool: Pool);
    createStudentGrade(data: StudentGradeDTO): Promise<number>;
    getAllStudentGrades(): Promise<StudentGrade[]>;
    getStudentGradeById(id: number): Promise<StudentGrade | null>;
    getGradesByStudentId(student_id: number): Promise<StudentGrade[]>;
    getStudentGradeByStudentSubjectQuarter(student_id: number, subject_id: number, quarter: string): Promise<StudentGrade | null>;
    updateStudentGradeById(id: number, data: Partial<StudentGradeDTO>): Promise<number>;
    deleteStudentGradeById(id: number): Promise<number>;
}
export default StudentGradeModel;
//# sourceMappingURL=studentGrade.model.d.ts.map