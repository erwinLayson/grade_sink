import { Router } from "express";
import { getAllGrades, getGradeById, getGradesByStudent, createGrade, updateGrade, deleteGrade } from "../controller/studentGrade.controller";
import validateToken from "../middleware/validateToken";
import allowedRole from "../middleware/allowedRole";
import { ROLES } from "../constant/userRole";

const route: Router = Router();

route.get("/grades", 
  validateToken,
  allowedRole([ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.TEACHER]),
  getAllGrades
);

route.get("/grades/:id", 
  validateToken,
  allowedRole([ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.TEACHER]),
  getGradeById
);

route.get("/grades/student/:studentId", 
  validateToken,
  allowedRole([ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.TEACHER]),
  getGradesByStudent
);

route.post("/grades", 
  validateToken,
  allowedRole([ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.TEACHER]),
  createGrade
);

route.put("/grades/:id", 
  validateToken,
  allowedRole([ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.TEACHER]),
  updateGrade
);

route.delete("/grades/:id", 
  validateToken,
  allowedRole([ROLES.ADMIN, ROLES.SUPER_ADMIN]),
  deleteGrade
);

export default route;
