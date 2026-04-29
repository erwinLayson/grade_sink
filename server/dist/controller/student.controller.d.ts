import { Request, Response } from "express";
export declare function getAllStudents(req: Request, res: Response): Promise<void>;
export declare function getStudentById(req: Request<{
    id: string;
}>, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function createStudent(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function updateStudent(req: Request<{
    id: string;
}>, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function deleteStudent(req: Request<{
    id: string;
}>, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare const importPreview: (import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>> | ((req: Request, res: Response) => Promise<Response<any, Record<string, any>>>))[];
export declare function importCommit(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=student.controller.d.ts.map