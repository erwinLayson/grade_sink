import { Request, Response } from "express";
export declare function getAllStudentSubjects(req: Request, res: Response): Promise<void>;
export declare function getStudentSubjectById(req: Request<{
    id: string;
}>, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function getSubjectsByStudent(req: Request<{
    studentId: string;
}>, res: Response): Promise<void>;
export declare function createStudentSubject(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function deleteStudentSubject(req: Request<{
    id: string;
}>, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=studentSubject.controller.d.ts.map