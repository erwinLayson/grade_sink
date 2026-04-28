import { Router } from "express";
import { getAllTeacherHandleSubjects, getTeacherHandleSubjectById, getSubjectsByTeacher, createTeacherHandleSubject, deleteTeacherHandleSubject } from "../controller/teacherHandleSubject.controller";
import validateToken from "../middleware/validateToken";
import allowedRole from "../middleware/allowedRole";
import { ROLES } from "../constant/userRole";

const route: Router = Router();

route.get("/teacher-subjects", 
  validateToken,
  allowedRole([ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.TEACHER]),
  getAllTeacherHandleSubjects
);

route.get("/teacher-subjects/:id", 
  validateToken,
  allowedRole([ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.TEACHER]),
  getTeacherHandleSubjectById
);

route.get("/teacher-subjects/teacher/:teacherId", 
  validateToken,
  allowedRole([ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.TEACHER]),
  getSubjectsByTeacher
);

route.post("/teacher-subjects", 
  validateToken,
  allowedRole([ROLES.ADMIN, ROLES.SUPER_ADMIN]),
  createTeacherHandleSubject
);

route.delete("/teacher-subjects/:id", 
  validateToken,
  allowedRole([ROLES.ADMIN, ROLES.SUPER_ADMIN]),
  deleteTeacherHandleSubject
);

export default route;
