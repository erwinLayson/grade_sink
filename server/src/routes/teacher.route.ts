import { Router } from "express";
import { getAllTeachers, getTeacherById, getTeacherByEmail, createTeacher, updateTeacher, deleteTeacher, getMyTeacherProfile, updateMyTeacherProfile } from "../controller/teacher.controller";
import validateToken from "../middleware/validateToken";
import allowedRole from "../middleware/allowedRole";
import { ROLES } from "../constant/userRole";

const route: Router = Router();

route.get("/teachers", 
  validateToken,
  allowedRole([ROLES.ADMIN, ROLES.SUPER_ADMIN]),
  getAllTeachers
);

route.get("/teachers/:id", 
  validateToken,
  allowedRole([ROLES.ADMIN, ROLES.SUPER_ADMIN]),
  getTeacherById
);

route.get("/teachers/email/:email",
  validateToken,
  allowedRole([ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.TEACHER]),
  getTeacherByEmail
);

route.get(
  "/teachers/me/profile",
  validateToken,
  allowedRole([ROLES.TEACHER]),
  getMyTeacherProfile,
);

route.put(
  "/teachers/me/profile",
  validateToken,
  allowedRole([ROLES.TEACHER]),
  updateMyTeacherProfile,
);

route.post("/teachers", 
  validateToken,
  allowedRole([ROLES.ADMIN, ROLES.SUPER_ADMIN]),
  createTeacher
);

route.put("/teachers/:id", 
  validateToken,
  allowedRole([ROLES.ADMIN, ROLES.SUPER_ADMIN]),
  updateTeacher
);

route.delete("/teachers/:id", 
  validateToken,
  allowedRole([ROLES.ADMIN, ROLES.SUPER_ADMIN]),
  deleteTeacher
);

export default route;
