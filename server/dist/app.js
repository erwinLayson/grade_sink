"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const dbConnection_config_js_1 = __importDefault(require("./config/dbConnection.config.js"));
const userAuth_route_js_1 = __importDefault(require("./routes/userAuth.route.js"));
const user_route_js_1 = __importDefault(require("./routes/user.route.js"));
const teacher_route_js_1 = __importDefault(require("./routes/teacher.route.js"));
const student_route_js_1 = __importDefault(require("./routes/student.route.js"));
const activity_route_1 = __importDefault(require("./routes/activity.route"));
const class_route_js_1 = __importDefault(require("./routes/class.route.js"));
const subject_route_js_1 = __importDefault(require("./routes/subject.route.js"));
const studentGrade_route_js_1 = __importDefault(require("./routes/studentGrade.route.js"));
const classStudent_route_js_1 = __importDefault(require("./routes/classStudent.route.js"));
const classSubject_route_js_1 = __importDefault(require("./routes/classSubject.route.js"));
const classTeacher_route_js_1 = __importDefault(require("./routes/classTeacher.route.js"));
const studentSubject_route_js_1 = __importDefault(require("./routes/studentSubject.route.js"));
const teacherHandleSubject_route_js_1 = __importDefault(require("./routes/teacherHandleSubject.route.js"));
const pdf_route_1 = __importDefault(require("./routes/pdf.route"));
const app = (0, express_1.default)();
app.set("trust proxy", true);
// database connection
(0, dbConnection_config_js_1.default)();
// Middleware
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: process.env.CLIENT_SIDE_URL,
    credentials: true
}));
app.use((0, cookie_parser_1.default)());
// Routes
app.use(user_route_js_1.default);
app.use(userAuth_route_js_1.default);
app.use(teacher_route_js_1.default);
app.use(student_route_js_1.default);
app.use(activity_route_1.default);
app.use(class_route_js_1.default);
app.use(subject_route_js_1.default);
app.use(studentGrade_route_js_1.default);
app.use(classStudent_route_js_1.default);
app.use(classSubject_route_js_1.default);
app.use(classTeacher_route_js_1.default);
app.use(studentSubject_route_js_1.default);
app.use(teacherHandleSubject_route_js_1.default);
app.use(pdf_route_1.default);
app.get("/", (req, res) => {
    res.json("Role base access example");
});
exports.default = app;
//# sourceMappingURL=app.js.map