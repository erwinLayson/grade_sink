import UserModel from "../model/user.model";
import { pool } from "../config/dbConnection.config";
import { Request, Response } from "express";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";
 
export const authUser = async (req: Request<[], [], {email: string, password: string}>, res: Response) => {
  try {
    const { email, password } = req.body;
    
    if (!email.trim()) return res.status(400).json({msg: "Email is required"});
    if (!password.trim()) return res.status(400).json({msg: "Password is required"});

    const userModel = new UserModel(pool);
    const user = await userModel.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({msg: `User email ${email} is not found!`})
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({msg: `Incorrect password`})
    }
    const secretKey = process.env.SECRET_KEY
    if (!secretKey) {
      throw new Error("JWT_SECRET is not defined");
    }

    const token = jwt.sign({ email, role: user.role }, secretKey, { expiresIn: "1h" });
    res.cookie("userAuth", token, {
      sameSite: "lax",
      httpOnly: true,
      secure: false
    })

    return res.status(200).json({
      msg: "Login successful",
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    })
  } catch (e) {
    console.log(`Error: ${e}`)
    return res.status(500).json({ msg: "Internal server Error" });
  }
}

export const verifyAuthUser = async (req: Request, res: Response) => {
  try {
    const decodedUser = (req as any).user as { email?: string } | undefined;

    if (!decodedUser?.email) {
      return res.status(401).json({ msg: "Unauthorized" });
    }

    const userModel = new UserModel(pool);
    const user = await userModel.getUserByEmail(decodedUser.email);

    if (!user) {
      return res.status(401).json({ msg: "Session expired" });
    }

    return res.status(200).json({
      msg: "Session valid",
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (e) {
    console.log(`Error: ${e}`)
    return res.status(500).json({ msg: "Internal server Error" });
  }
}

export const logoutUser = async (req: Request, res: Response) => {
  try {
    res.clearCookie("userAuth", {
      sameSite: "lax",
      httpOnly: true,
      secure: false,
    });

    return res.status(200).json({ msg: "Logout successful" });
  } catch (e) {
    console.log(`Error: ${e}`)
    return res.status(500).json({ msg: "Internal server Error" });
  }
}