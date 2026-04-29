export interface Class {
    id: number;
    name: string;
    section: string;
    school_year: string;
    school_level: string;
    teacher_id: number | null;
    created_at: Date;
    updated_at: Date | null;
}
export type ClassDTO = {
    name: string;
    section: string;
    school_year: string;
    school_level: string;
    teacher_id?: number | null;
};
export interface ClassResponse {
    id: number;
    name: string;
    section: string;
    school_year: string;
    school_level: string;
    teacher_id: number | null;
}
//# sourceMappingURL=class.constant.d.ts.map