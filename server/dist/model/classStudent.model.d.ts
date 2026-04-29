import { Pool } from "mysql2/promise";
import { ClassStudent, ClassStudentDTO } from "../constant/classStudent.constant";
declare class ClassStudentModel {
    private pool;
    constructor(pool: Pool);
    createClassStudent(data: ClassStudentDTO): Promise<number>;
    getAllClassStudents(): Promise<ClassStudent[]>;
    getClassStudentById(id: number): Promise<ClassStudent | null>;
    getStudentsByClassId(class_id: number): Promise<any[]>;
    deleteClassStudentById(id: number): Promise<number>;
}
export default ClassStudentModel;
//# sourceMappingURL=classStudent.model.d.ts.map