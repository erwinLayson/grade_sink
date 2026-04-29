import { Request } from "express";
export declare function resolveClientIp(req: Request<any, any, any, any>): string | undefined;
export declare function logActivity(req: Request<any, any, any, any>, action: string, resource: string, details?: any): Promise<void>;
//# sourceMappingURL=activityLogger.d.ts.map