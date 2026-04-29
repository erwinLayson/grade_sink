import { Request, Response } from "express";
export declare const authUser: (req: Request<any, any, {
    email: string;
    password: string;
}>, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const verifyAuthUser: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const logoutUser: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=user.auth.d.ts.map