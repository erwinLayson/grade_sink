import { Pool } from "mysql2/promise";
import { Class, ClassDTO } from "../constant/class.constant";
declare class ClassModel {
    private pool;
    constructor(pool: Pool);
    createClass(data: ClassDTO): Promise<number>;
    getAllClasses(): Promise<Class[]>;
    getClassById(id: number): Promise<Class | null>;
    updateClassById(id: number, data: Partial<ClassDTO>): Promise<number>;
    deleteClassById(id: number): Promise<number>;
}
export default ClassModel;
//# sourceMappingURL=class.model.d.ts.map