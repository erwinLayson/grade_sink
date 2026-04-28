import { Request, Response, NextFunction } from "express";
import { Role } from "../constant/userRole";

const allowedRole = (roles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;

    if (!user) {
      return res.status(401).json({ msg: "Unauthorize" });
    }

    if (!roles.includes(user.role)) {
      return res.status(403).json({ msg: "Forbidden: Access denied" });
    }

    next();
  }
}
export default allowedRole;