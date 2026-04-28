import { Router } from "express";
import { getAllClassStudents, getClassStudentById, getStudentsByClass, createClassStudent, deleteClassStudent } from "../controller/classStudent.controller";
import validateToken from "../middleware/validateToken";
import allowedRole from "../middleware/allowedRole";
import { ROLES } from "../constant/userRole";

const route: Router = Router();

route.get("/class-students", 
  validateToken,
  allowedRole([ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.TEACHER]),
  getAllClassStudents
);

route.get("/class-students/:id", 
  validateToken,
  allowedRole([ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.TEACHER]),
  getClassStudentById
);

route.get("/class-students/class/:classId", 
  validateToken,
  allowedRole([ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.TEACHER]),
  getStudentsByClass
);

route.post("/class-students", 
  validateToken,
  allowedRole([ROLES.ADMIN, ROLES.SUPER_ADMIN]),
  createClassStudent
);

route.delete("/class-students/:id", 
  validateToken,
  allowedRole([ROLES.ADMIN, ROLES.SUPER_ADMIN]),
  deleteClassStudent
);

export default route;
