import { authUser } from "../auth/user.auth";
import { Router } from "express";

const route: Router = Router();

route.post("/auth", authUser);

export default route;