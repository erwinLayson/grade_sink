import ClassModel from "../../model/class.model";
import { ClassDTO, ClassResponse } from "../../constant/class.constant";
declare class ClassService {
    private classModel;
    constructor(classModel: ClassModel);
    createClass(data: ClassDTO): Promise<number>;
    getAllClasses(): Promise<ClassResponse[]>;
    getClassById(id: number): Promise<ClassResponse | null>;
    updateClassById(id: number, data: Partial<ClassDTO>): Promise<number>;
    deleteClassById(id: number): Promise<number>;
}
export default ClassService;
//# sourceMappingURL=class.service.d.ts.map