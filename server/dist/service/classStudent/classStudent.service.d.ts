import ClassStudentModel from "../../model/classStudent.model";
import { ClassStudentDTO, ClassStudentResponse } from "../../constant/classStudent.constant";
declare class ClassStudentService {
    private classStudentModel;
    constructor(classStudentModel: ClassStudentModel);
    createClassStudent(data: ClassStudentDTO): Promise<number>;
    getAllClassStudents(): Promise<ClassStudentResponse[]>;
    getClassStudentById(id: number): Promise<ClassStudentResponse | null>;
    getStudentsByClassId(class_id: number): Promise<any[]>;
    deleteClassStudentById(id: number): Promise<number>;
}
export default ClassStudentService;
//# sourceMappingURL=classStudent.service.d.ts.map