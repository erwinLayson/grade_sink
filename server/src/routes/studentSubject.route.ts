import { Router } from "express";
import { getAllStudentSubjects, getStudentSubjectById, getSubjectsByStudent, createStudentSubject, deleteStudentSubject } from "../controller/studentSubject.controller";
import validateToken from "../middleware/validateToken";
import allowedRole from "../middleware/allowedRole";
import { ROLES } from "../constant/userRole";

const route: Router = Router();

route.get("/student-subjects", 
  validateToken,
  allowedRole([ROLES.ADMIN, ROLES.SUPER_ADMIN]),
  getAllStudentSubjects
);

route.get("/student-subjects/:id", 
  validateToken,
  allowedRole([ROLES.ADMIN, ROLES.SUPER_ADMIN]),
  getStudentSubjectById
);

route.get("/student-subjects/student/:studentId", 
  validateToken,
  allowedRole([ROLES.ADMIN, ROLES.SUPER_ADMIN]),
  getSubjectsByStudent
);

route.post("/student-subjects", 
  validateToken,
  allowedRole([ROLES.ADMIN, ROLES.SUPER_ADMIN]),
  createStudentSubject
);

route.delete("/student-subjects/:id", 
  validateToken,
  allowedRole([ROLES.ADMIN, ROLES.SUPER_ADMIN]),
  deleteStudentSubject
);

export default route;
