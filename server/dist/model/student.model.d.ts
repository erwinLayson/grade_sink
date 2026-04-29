import { Pool } from "mysql2/promise";
import { Student, StudentDTO } from "../constant/student.constant";
declare class StudentModel {
    private pool;
    constructor(pool: Pool);
    createStudent(data: StudentDTO): Promise<number>;
    getAllStudents(): Promise<Student[]>;
    getStudentById(id: number): Promise<Student | null>;
    getStudentByStudentId(student_id: number): Promise<Student | null>;
    getStudentByLrn(lrn: string): Promise<Student | null>;
    updateStudentById(id: number, data: Partial<StudentDTO>): Promise<number>;
    deleteStudentById(id: number): Promise<number>;
}
export default StudentModel;
//# sourceMappingURL=student.model.d.ts.map