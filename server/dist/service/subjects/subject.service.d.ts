import SubjectModel from "../../model/subject.model";
import { SubjectDTO, SubjectResponse } from "../../constant/subject.constant";
declare class SubjectService {
    private subjectModel;
    constructor(subjectModel: SubjectModel);
    createSubject(data: SubjectDTO): Promise<number>;
    getAllSubjects(): Promise<SubjectResponse[]>;
    getSubjectById(id: number): Promise<SubjectResponse | null>;
    updateSubjectById(id: number, data: Partial<SubjectDTO>): Promise<number>;
    deleteSubjectById(id: number): Promise<number>;
}
export default SubjectService;
//# sourceMappingURL=subject.service.d.ts.map