import ClassSubjectModel from "../../model/classSubject.model";
import { ClassSubjectDTO, ClassSubjectResponse } from "../../constant/classSubject.constant";
declare class ClassSubjectService {
    private classSubjectModel;
    constructor(classSubjectModel: ClassSubjectModel);
    createClassSubject(data: ClassSubjectDTO): Promise<number>;
    getAllClassSubjects(): Promise<ClassSubjectResponse[]>;
    getClassSubjectById(id: number): Promise<ClassSubjectResponse | null>;
    getSubjectsByClassId(class_id: number): Promise<ClassSubjectResponse[]>;
    deleteClassSubjectById(id: number): Promise<number>;
    getClassesByTeacherId(teacher_id: number): Promise<any[]>;
}
export default ClassSubjectService;
//# sourceMappingURL=classSubject.service.d.ts.map