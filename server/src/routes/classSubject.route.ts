import { Router } from "express";
import { getAllClassSubjects, getClassSubjectById, getSubjectsByClass, createClassSubject, deleteClassSubject, getClassesByTeacherSubjects } from "../controller/classSubject.controller";
import validateToken from "../middleware/validateToken";
import allowedRole from "../middleware/allowedRole";
import { ROLES } from "../constant/userRole";

const route: Router = Router();

route.get("/class-subjects", 
  validateToken,
  allowedRole([ROLES.ADMIN, ROLES.SUPER_ADMIN]),
  getAllClassSubjects
);

route.get("/class-subjects/:id", 
  validateToken,
  allowedRole([ROLES.ADMIN, ROLES.SUPER_ADMIN]),
  getClassSubjectById
);

route.get("/class-subjects/class/:classId", 
  validateToken,
  allowedRole([ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.TEACHER]),
  getSubjectsByClass
);

route.get("/class-subjects/teacher/:teacherId",
  validateToken,
  allowedRole([ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.TEACHER]),
  getClassesByTeacherSubjects
);

route.post("/class-subjects", 
  validateToken,
  allowedRole([ROLES.ADMIN, ROLES.SUPER_ADMIN]),
  createClassSubject
);

route.delete("/class-subjects/:id", 
  validateToken,
  allowedRole([ROLES.ADMIN, ROLES.SUPER_ADMIN]),
  deleteClassSubject
);

export default route;
