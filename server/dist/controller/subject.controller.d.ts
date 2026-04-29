import { Request, Response } from "express";
export declare function getAllSubjects(req: Request, res: Response): Promise<void>;
export declare function getSubjectById(req: Request<{
    id: string;
}>, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function createSubject(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function updateSubject(req: Request<{
    id: string;
}>, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function deleteSubject(req: Request<{
    id: string;
}>, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=subject.controller.d.ts.map