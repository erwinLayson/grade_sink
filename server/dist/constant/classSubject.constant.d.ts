export interface ClassSubject {
    id: number;
    class_id: number;
    subject_id: number;
    teacher_id: number | null;
    created_at: Date;
    updated_at: Date | null;
}
export type ClassSubjectDTO = {
    class_id: number;
    subject_id: number;
    teacher_id?: number;
};
export interface ClassSubjectResponse {
    id: number;
    class_id: number;
    subject_id: number;
    teacher_id?: number | null;
    code?: string;
    name?: string;
    teacher_name?: string | null;
}
//# sourceMappingURL=classSubject.constant.d.ts.map