import jwt from "jsonwebtoken";

import { Request, Response, NextFunction } from "express"

const validateToken = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies?.userAuth;

  if (!token) {
    return res.status(401).json({ msg: "No token, Unauthorize" });
  }

  try {
    const seckretKey = process.env.SECRET_KEY;

    if (!seckretKey) {
      return res.status(500).json({ msg: `Server misconfiguration` });
    }

    const decoded = jwt.verify(token, seckretKey);

    (req as any).user = decoded;
    
    next();
  } catch (e) {
    res.status(401).json({ msg: "Invalid expire token" })
  }
}

export default validateToken