import { Request, Response } from "express";
export declare function getAllClassSubjects(req: Request, res: Response): Promise<void>;
export declare function getClassSubjectById(req: Request<{
    id: string;
}>, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function getSubjectsByClass(req: Request<{
    classId: string;
}>, res: Response): Promise<void>;
export declare function getClassesByTeacherSubjects(req: Request<{
    teacherId: string;
}>, res: Response): Promise<void>;
export declare function createClassSubject(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function deleteClassSubject(req: Request<{
    id: string;
}>, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=classSubject.controller.d.ts.map