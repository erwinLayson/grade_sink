import { Request, Response } from "express";
export declare function getAllTeachers(req: Request, res: Response): Promise<void>;
export declare function getTeacherById(req: Request<{
    id: string;
}>, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function getTeacherByEmail(req: Request<{
    email: string;
}>, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function createTeacher(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function updateTeacher(req: Request<{
    id: string;
}>, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function deleteTeacher(req: Request<{
    id: string;
}>, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function getMyTeacherProfile(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
type UpdateTeacherProfileBody = {
    first_name?: string;
    middle_name?: string;
    last_name?: string;
    username?: string;
    email?: string;
    current_password?: string;
    new_password?: string;
    confirm_password?: string;
};
export declare function updateMyTeacherProfile(req: Request<unknown, unknown, UpdateTeacherProfileBody>, res: Response): Promise<Response<any, Record<string, any>>>;
export {};
//# sourceMappingURL=teacher.controller.d.ts.map