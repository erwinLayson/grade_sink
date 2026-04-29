import { Request, Response } from "express";
export declare function getAllClassStudents(req: Request, res: Response): Promise<void>;
export declare function getClassStudentById(req: Request<{
    id: string;
}>, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function getStudentsByClass(req: Request<{
    classId: string;
}>, res: Response): Promise<void>;
export declare function createClassStudent(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function deleteClassStudent(req: Request<{
    id: string;
}>, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=classStudent.controller.d.ts.map