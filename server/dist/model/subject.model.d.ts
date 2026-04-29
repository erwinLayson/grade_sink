import { Pool } from "mysql2/promise";
import { Subject, SubjectDTO } from "../constant/subject.constant";
declare class SubjectModel {
    private pool;
    constructor(pool: Pool);
    createSubject(data: SubjectDTO): Promise<number>;
    getAllSubjects(): Promise<Subject[]>;
    getSubjectById(id: number): Promise<Subject | null>;
    updateSubjectById(id: number, data: Partial<SubjectDTO>): Promise<number>;
    deleteSubjectById(id: number): Promise<number>;
}
export default SubjectModel;
//# sourceMappingURL=subject.model.d.ts.map