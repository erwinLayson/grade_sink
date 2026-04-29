import { Request, Response } from "express";
export declare function getAllGrades(req: Request, res: Response): Promise<void>;
export declare function getGradeById(req: Request<{
    id: string;
}>, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function getGradesByStudent(req: Request<{
    studentId: string;
}>, res: Response): Promise<void>;
export declare function createGrade(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function updateGrade(req: Request<{
    id: string;
}>, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function deleteGrade(req: Request<{
    id: string;
}>, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=studentGrade.controller.d.ts.map