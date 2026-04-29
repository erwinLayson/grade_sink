export interface StudentSubject {
    id: number;
    student_id: number;
    subject_id: number;
    teacher_id: number;
    created_at: Date;
    updated_at: Date | null;
}
export type StudentSubjectDTO = {
    student_id: number;
    subject_id: number;
    teacher_id: number;
};
export interface StudentSubjectResponse {
    id: number;
    student_id: number;
    subject_id: number;
    teacher_id: number;
}
//# sourceMappingURL=studentSubject.constant.d.ts.map