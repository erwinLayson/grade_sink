import { Router } from "express";
import { getAllStudents, getStudentById, createStudent, updateStudent, deleteStudent, importCommit, importPreview } from "../controller/student.controller";
import validateToken from "../middleware/validateToken";
import allowedRole from "../middleware/allowedRole";
import { ROLES } from "../constant/userRole";

const route: Router = Router();

route.get("/students", 
  validateToken,
  allowedRole([ROLES.ADMIN, ROLES.SUPER_ADMIN]),
  getAllStudents
);

route.get("/students/:id", 
  validateToken,
  allowedRole([ROLES.ADMIN, ROLES.SUPER_ADMIN]),
  getStudentById
);

route.post("/students", 
  validateToken,
  allowedRole([ROLES.ADMIN, ROLES.SUPER_ADMIN]),
  createStudent
);

// Import endpoints
route.post(
  "/students/import/preview",
  validateToken,
  allowedRole([ROLES.ADMIN, ROLES.SUPER_ADMIN]),
  // controller provides multer middleware in array
  ...importPreview,
);

route.post(
  "/students/import",
  validateToken,
  allowedRole([ROLES.ADMIN, ROLES.SUPER_ADMIN]),
  importCommit,
);

route.put("/students/:id", 
  validateToken,
  allowedRole([ROLES.ADMIN, ROLES.SUPER_ADMIN]),
  updateStudent
);

route.delete("/students/:id", 
  validateToken,
  allowedRole([ROLES.ADMIN, ROLES.SUPER_ADMIN]),
  deleteStudent
);

export default route;
