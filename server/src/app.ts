import dotenv from "dotenv";
dotenv.config();
import express, { Express, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser"

import testConnection from "./config/dbConnection.config.js"
import userAuthRoute from "./routes/userAuth.route.js";
import userRoute from "./routes/user.route.js";
import teacherRoute from "./routes/teacher.route.js";
import studentRoute from "./routes/student.route.js";
import classRoute from "./routes/class.route.js";
import subjectRoute from "./routes/subject.route.js";
import studentGradeRoute from "./routes/studentGrade.route.js";
import classStudentRoute from "./routes/classStudent.route.js";
import classSubjectRoute from "./routes/classSubject.route.js";
import classTeacherRoute from "./routes/classTeacher.route.js";
import studentSubjectRoute from "./routes/studentSubject.route.js";
import teacherHandleSubjectRoute from "./routes/teacherHandleSubject.route.js";


const app: Express = express();

// database connection
testConnection();

// Middleware
app.use(express.json());
app.use(cors({
  origin: process.env.CLIENT_SIDE_URL,
  credentials: true
}))
app.use(cookieParser());

// Routes
app.use(userRoute);
app.use(userAuthRoute);
app.use(teacherRoute);
app.use(studentRoute);
app.use(classRoute);
app.use(subjectRoute);
app.use(studentGradeRoute);
app.use(classStudentRoute);
app.use(classSubjectRoute);
app.use(classTeacherRoute);
app.use(studentSubjectRoute);
app.use(teacherHandleSubjectRoute);


app.get("/", (req: Request, res: Response) => {
  res.json("Role base access example");
});

export default app;