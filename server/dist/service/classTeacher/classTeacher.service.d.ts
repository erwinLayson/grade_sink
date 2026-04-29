import ClassTeacherModel from "../../model/classTeacher.model";
import { ClassTeacherDTO, ClassTeacherResponse } from "../../constant/classTeacher.constant";
declare class ClassTeacherService {
    private classTeacherModel;
    constructor(classTeacherModel: ClassTeacherModel);
    createClassTeacher(data: ClassTeacherDTO): Promise<number>;
    getAllClassTeachers(): Promise<ClassTeacherResponse[]>;
    getClassTeacherById(id: number): Promise<ClassTeacherResponse | null>;
    getTeachersByClassId(class_id: number): Promise<ClassTeacherResponse[]>;
    getClassesByTeacherId(teacher_id: number): Promise<any[]>;
    deleteClassTeacherById(id: number): Promise<number>;
}
export default ClassTeacherService;
//# sourceMappingURL=classTeacher.service.d.ts.map