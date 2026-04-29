export interface StudentGrade {
    id: number;
    student_id: number;
    subject_id: number;
    teacher_id: number;
    grade: number;
    quarter: string;
    created_at: Date;
    updated_at: Date | null;
}
export type StudentGradeDTO = {
    student_id: number;
    subject_id: number;
    teacher_id: number;
    grade: number;
    quarter: string;
};
export interface StudentGradeResponse {
    id: number;
    student_id: number;
    subject_id: number;
    teacher_id: number;
    grade: number;
    quarter: string;
}
//# sourceMappingURL=studentGrade.constant.d.ts.map