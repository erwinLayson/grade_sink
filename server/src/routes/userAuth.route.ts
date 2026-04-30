import { authUser, logoutUser, verifyAuthUser } from "../auth/user.auth";
import { confirmPasswordReset, requestPasswordReset } from "../controller/passwordReset.controller";
import { Router } from "express";
import validateToken from "../middleware/validateToken";
import loginLimiter from "../middleware/loginLimiter";

const route: Router = Router();

route.post("/auth", loginLimiter, authUser);
route.post("/auth/forgot-password", requestPasswordReset);
route.post("/auth/reset-password", confirmPasswordReset);
route.get("/auth/verify", validateToken, verifyAuthUser);
route.post("/logout", logoutUser);

export default route;