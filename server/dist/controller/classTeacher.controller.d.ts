import { Request, Response } from "express";
export declare function getAllClassTeachers(req: Request, res: Response): Promise<void>;
export declare function getClassTeacherById(req: Request<{
    id: string;
}>, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function getTeachersByClass(req: Request<{
    classId: string;
}>, res: Response): Promise<void>;
export declare function getClassesByTeacher(req: Request<{
    teacherId: string;
}>, res: Response): Promise<void>;
export declare function createClassTeacher(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function deleteClassTeacher(req: Request<{
    id: string;
}>, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=classTeacher.controller.d.ts.map