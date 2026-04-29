import { Pool } from "mysql2/promise";
import { ClassTeacher, ClassTeacherDTO } from "../constant/classTeacher.constant";
declare class ClassTeacherModel {
    private pool;
    constructor(pool: Pool);
    createClassTeacher(data: ClassTeacherDTO): Promise<number>;
    getAllClassTeachers(): Promise<ClassTeacher[]>;
    getClassTeacherById(id: number): Promise<ClassTeacher | null>;
    getTeachersByClassId(class_id: number): Promise<ClassTeacher[]>;
    getClassesByTeacherId(teacher_id: number): Promise<any[]>;
    deleteClassTeacherById(id: number): Promise<number>;
}
export default ClassTeacherModel;
//# sourceMappingURL=classTeacher.model.d.ts.map