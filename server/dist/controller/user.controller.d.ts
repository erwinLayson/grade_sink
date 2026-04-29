import { Request, Response } from "express";
export declare function getAllUser(req: Request, res: Response): Promise<void>;
export declare function getUserByEmail(req: Request<{
    email: string;
}>, res: Response): Promise<void>;
export declare function createUser(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function updateUserByEmail(req: Request<{
    email: string;
}>, res: Response): Promise<void>;
//# sourceMappingURL=user.controller.d.ts.map