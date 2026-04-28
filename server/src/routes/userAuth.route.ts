import { authUser, logoutUser, verifyAuthUser } from "../auth/user.auth";
import { Router } from "express";
import validateToken from "../middleware/validateToken";

const route: Router = Router();

route.post("/auth", authUser);
route.get("/auth/verify", validateToken, verifyAuthUser);
route.post("/logout", logoutUser);

export default route;