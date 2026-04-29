import { Pool } from "mysql2/promise";
import { Teacher, TeacherDTO } from "../constant/teacher.constant";
declare class TeacherModel {
    private pool;
    constructor(pool: Pool);
    createTeacher(data: TeacherDTO): Promise<number>;
    getAllTeachers(): Promise<Teacher[]>;
    getTeacherById(id: number): Promise<Teacher | null>;
    getTeacherByEmail(email: string): Promise<Teacher | null>;
    updateTeacherById(id: number, data: Partial<TeacherDTO>): Promise<number>;
    deleteTeacherById(id: number): Promise<number>;
}
export default TeacherModel;
//# sourceMappingURL=teacher.model.d.ts.map