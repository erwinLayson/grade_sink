import { Pool } from "mysql2/promise";
type studentGrades = {
    studentId: number;
    fullName: string;
    LRN: string;
    age: number;
    sex: string;
    schoolLevel: string;
    className: string;
    classSection: string;
    subjectName: string;
    grades: number;
    quarter: number;
};
export default class ReportCardModel {
    private pool;
    constructor(pool: Pool);
    getStudentGradeByClassId(classId: number): Promise<studentGrades[]>;
}
export {};
//# sourceMappingURL=reportCard.model.d.ts.map