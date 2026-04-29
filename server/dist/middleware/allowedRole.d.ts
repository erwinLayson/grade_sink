import { Request, Response, NextFunction } from "express";
import { Role } from "../constant/userRole";
declare const allowedRole: (roles: Role[]) => (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export default allowedRole;
//# sourceMappingURL=allowedRole.d.ts.map