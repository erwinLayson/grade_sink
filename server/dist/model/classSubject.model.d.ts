import { Pool } from "mysql2/promise";
import { ClassSubject, ClassSubjectDTO } from "../constant/classSubject.constant";
declare class ClassSubjectModel {
    private pool;
    constructor(pool: Pool);
    createClassSubject(data: ClassSubjectDTO): Promise<number>;
    getAllClassSubjects(): Promise<ClassSubject[]>;
    getClassSubjectById(id: number): Promise<ClassSubject | null>;
    getSubjectsByClassId(class_id: number): Promise<ClassSubject[]>;
    deleteClassSubjectById(id: number): Promise<number>;
    getClassesByTeacherId(teacher_id: number): Promise<any[]>;
    getClassSubjectByClassAndSubject(class_id: number, subject_id: number): Promise<{
        id: number;
        class_id: number;
        subject_id: number;
    } | null>;
    deleteClassSubjectByClassAndSubject(class_id: number, subject_id: number): Promise<number>;
}
export default ClassSubjectModel;
//# sourceMappingURL=classSubject.model.d.ts.map