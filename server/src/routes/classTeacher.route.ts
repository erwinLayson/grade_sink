import { Router } from "express";
import { getAllClassTeachers, getClassTeacherById, getTeachersByClass, getClassesByTeacher, createClassTeacher, deleteClassTeacher } from "../controller/classTeacher.controller";
import validateToken from "../middleware/validateToken";
import allowedRole from "../middleware/allowedRole";
import { ROLES } from "../constant/userRole";

const route: Router = Router();

route.get("/class-teachers", 
  validateToken,
  allowedRole([ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.TEACHER]),
  getAllClassTeachers
);

route.get("/class-teachers/teacher/:teacherId", 
  validateToken,
  allowedRole([ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.TEACHER]),
  getClassesByTeacher
);

route.get("/class-teachers/class/:classId", 
  validateToken,
  allowedRole([ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.TEACHER]),
  getTeachersByClass
);

route.get("/class-teachers/:id", 
  validateToken,
  allowedRole([ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.TEACHER]),
  getClassTeacherById
);

route.post("/class-teachers", 
  validateToken,
  allowedRole([ROLES.ADMIN, ROLES.SUPER_ADMIN]),
  createClassTeacher
);

route.delete("/class-teachers/:id", 
  validateToken,
  allowedRole([ROLES.ADMIN, ROLES.SUPER_ADMIN]),
  deleteClassTeacher
);

export default route;
