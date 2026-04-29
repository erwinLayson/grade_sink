import TeacherModel from "../../model/teacher.model";
import { TeacherDTO, TeacherResponse } from "../../constant/teacher.constant";
declare class TeacherService {
    private teacherModel;
    constructor(teacherModel: TeacherModel);
    createTeacher(data: TeacherDTO): Promise<number>;
    getAllTeachers(): Promise<TeacherResponse[]>;
    getTeacherById(id: number): Promise<TeacherResponse | null>;
    getTeacherByEmail(email: string): Promise<TeacherResponse | null>;
    updateTeacherById(id: number, data: Partial<TeacherDTO>): Promise<number>;
    deleteTeacherById(id: number): Promise<number>;
}
export default TeacherService;
//# sourceMappingURL=teacher.service.d.ts.map