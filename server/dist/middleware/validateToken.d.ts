import { Request, Response, NextFunction } from "express";
declare const validateToken: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export default validateToken;
//# sourceMappingURL=validateToken.d.ts.map