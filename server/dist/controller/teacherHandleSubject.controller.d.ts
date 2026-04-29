import { Request, Response } from "express";
export declare function getAllTeacherHandleSubjects(req: Request, res: Response): Promise<void>;
export declare function getTeacherHandleSubjectById(req: Request<{
    id: string;
}>, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function getSubjectsByTeacher(req: Request<{
    teacherId: string;
}>, res: Response): Promise<void>;
export declare function createTeacherHandleSubject(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function deleteTeacherHandleSubject(req: Request<{
    id: string;
}>, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=teacherHandleSubject.controller.d.ts.map