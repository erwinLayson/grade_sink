import StudentModel from "../../model/student.model";
import { StudentDTO, StudentResponse } from "../../constant/student.constant";
export type ImportRowStatus = "valid" | "duplicate" | "conflict" | "invalid";
export interface NormalizedStudentImportRow {
    student_id?: number;
    first_name?: string;
    middle_name?: string;
    last_name?: string;
    age?: number;
    birth_date?: string;
    lrn?: string;
    sex?: string;
    level?: string;
}
export interface ImportPreviewRow {
    row: number;
    raw: Record<string, unknown>;
    normalized: NormalizedStudentImportRow;
    status: ImportRowStatus;
    valid: boolean;
    issues: string[];
}
export interface ImportSummary {
    inserted: number;
    duplicates: number;
    conflicts: number;
    skipped: number;
}
declare class StudentService {
    private studentModel;
    constructor(studentModel: StudentModel);
    createStudent(data: StudentDTO): Promise<number>;
    getAllStudents(): Promise<StudentResponse[]>;
    getStudentById(id: number): Promise<StudentResponse | null>;
    getStudentByStudentId(student_id: number): Promise<StudentResponse | null>;
    getStudentByLrn(lrn: string): Promise<StudentResponse | null>;
    updateStudentById(id: number, data: Partial<StudentDTO>): Promise<number>;
    deleteStudentById(id: number): Promise<number>;
    importStudents(rows: NormalizedStudentImportRow[]): Promise<{
        summary: ImportSummary;
        skipped: Array<{
            row: NormalizedStudentImportRow;
            reason: string;
        }>;
    }>;
}
export default StudentService;
//# sourceMappingURL=student.service.d.ts.map