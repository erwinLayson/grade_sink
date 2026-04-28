import { Request, Response } from "express";
import UserService from "../service/users/user.service";
import UserModel from "../model/user.model";
import { pool } from "../config/dbConnection.config";
import { UserDTO } from "../constant/user.constant";
import bcrypt from "bcrypt"

export async function getAllUser(req: Request, res: Response) {
  try {
    const userService = new UserService(new UserModel(pool));
    const users = await userService.getAllUser();
    res.status(200).json(users);
  } catch (e) {
    throw new Error(`Error: ${e}`);
  }
}

export async function getUserByEmail(req: Request<{email: string}>, res: Response) {
  try {
    const email: string = req.params.email;
    const userService = new UserService(new UserModel(pool));
    const users = await userService.getUserByEmail(email);
    res.status(200).json(users);
  } catch (e) {
    throw new Error(`Error: ${e}`);
  }
}

export async function createUser(req: Request, res: Response) {
  try {
    const { email, password, role, username }: UserDTO = req.body;

    if (!email || !password || !role || !username)
      return res.status(400).json({ msg: "Invalid user credential" });

    const hashPassword = await bcrypt.hash(password, 10);

    const userService = new UserService(new UserModel(pool));
    const result = await userService.createUser({ email, password: hashPassword, role, username });
    if (result) {
      return res.status(200).json({msg: `${role.toLocaleLowerCase()} account is created`});
    }
    
  } catch (e) {
    throw new Error(`Error: ${e}`);
  }
}

export async function updateUserByEmail(req: Request<{email: string}>, res: Response) {
  const email: string = req.params.email;

  const data = req.body;
  const userService = new UserService(new UserModel(pool));
  const result = await userService.updateUserByEmail(email, data)
  console.log(result)
}