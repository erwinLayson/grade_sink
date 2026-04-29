export interface Teacher {
    id: number;
    first_name: string | null;
    middle_name: string | null;
    last_name: string | null;
    email: string;
    created_at: Date;
    updated_at: Date | null;
}
export type TeacherDTO = {
    first_name?: string | null;
    middle_name?: string | null;
    last_name?: string | null;
    email: string;
};
export interface TeacherResponse {
    id: number;
    email: string;
    first_name: string | null;
    middle_name: string | null;
    last_name: string | null;
}
//# sourceMappingURL=teacher.constant.d.ts.map