import { Request, Response } from "express";
export declare function requestPasswordReset(req: Request<any, any, {
    email: string;
}>, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function confirmPasswordReset(req: Request<any, any, {
    token: string;
    new_password: string;
    confirm_password: string;
}>, res: Response): Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=passwordReset.controller.d.ts.map