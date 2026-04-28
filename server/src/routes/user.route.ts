import {  Router } from "express";
import { getAllUser, createUser, getUserByEmail, updateUserByEmail } from "../controller/user.controller";
import validateToken from "../middleware/validateToken";
import allowedRole from "../middleware/allowedRole";
import { ROLES } from "../constant/userRole";

const route: Router = Router();

route.get("/users", validateToken,
  allowedRole([ROLES.SUPER_ADMIN]),
  getAllUser)
route.get("/users/:email", validateToken, getUserByEmail)

route.put("/users/:email", validateToken, updateUserByEmail)
route.post("/users", createUser)

export default route;