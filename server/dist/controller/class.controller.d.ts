import { Request, Response } from "express";
export declare function getAllClasses(req: Request, res: Response): Promise<void>;
export declare function getClassById(req: Request<{
    id: string;
}>, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function createClass(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function updateClass(req: Request<{
    id: string;
}>, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function deleteClass(req: Request<{
    id: string;
}>, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=class.controller.d.ts.map