"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateClassStudentPDFs = generateClassStudentPDFs;
const puppeteer_1 = __importDefault(require("puppeteer"));
const archiver_1 = __importDefault(require("archiver"));
const dbConnection_config_1 = require("../config/dbConnection.config");
const class_model_1 = __importDefault(require("../model/class.model"));
const classStudent_model_1 = __importDefault(require("../model/classStudent.model"));
const student_model_1 = __importDefault(require("../model/student.model"));
const studentGrade_model_1 = __importDefault(require("../model/studentGrade.model"));
const activity_model_1 = __importDefault(require("../model/activity.model"));
const activity_service_1 = __importDefault(require("../service/activity.service"));
const activityLogger_1 = require("../middleware/activityLogger");
function renderGradeReportHTML(opts) {
    const { student, grades, classInfo, average, logoUrl, school_year } = opts;
    const fullName = [student.first_name, student.middle_name, student.last_name].filter(Boolean).join(" ");
    const currentDate = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
    const rows = grades
        .map((g) => {
        const gradeValue = typeof g.grade === 'number' ? g.grade.toFixed(2) : g.grade ?? "-";
        return `<tr>
        <td style="padding:12px;border-bottom:1px solid #e5e7eb;font-weight:500">${g.subject_name || g.subject_id || "-"}</td>
        <td style="padding:12px;border-bottom:1px solid #e5e7eb;text-align:center;font-weight:600;color:#065f46">${gradeValue}</td>
      </tr>`;
    })
        .join("\n");
    return `
  <!doctype html>
  <html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Grade Report - ${fullName}</title>
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        color: #1f2937;
        line-height: 1.6;
        background: #fff;
      }
      
      /* Watermark */
      body::before {
        content: "CONFIDENTIAL";
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) rotate(-45deg);
        font-size: 120px;
        color: rgba(0, 0, 0, 0.08);
        font-weight: bold;
        white-space: nowrap;
        pointer-events: none;
        z-index: -1;
      }
      
      .page-container { padding: 40px; max-width: 900px; margin: 0 auto; position: relative; }
      
      .header {
        display: flex;
        align-items: center;
        gap: 20px;
        padding-bottom: 20px;
        border-bottom: 3px solid #0f766e;
        margin-bottom: 30px;
      }
      
      .logo-box {
        width: 90px;
        height: 90px;
        border-radius: 12px;
        overflow: hidden;
        border: 2px solid #0f766e;
        flex-shrink: 0;
      }
      
      .logo-box img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      
      .school-info h1 {
        font-size: 28px;
        font-weight: 700;
        color: #0f766e;
        margin-bottom: 4px;
      }
      
      .school-info p {
        font-size: 14px;
        color: #6b7280;
        margin: 2px 0;
      }
      
      .student-section {
        background: #f0fdfa;
        border-left: 4px solid #0f766e;
        padding: 20px;
        margin-bottom: 30px;
        border-radius: 8px;
      }
      
      .student-section h2 {
        font-size: 22px;
        font-weight: 700;
        color: #1f2937;
        margin-bottom: 8px;
      }
      
      .student-meta {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 15px;
        font-size: 14px;
        color: #4b5563;
      }
      
      .student-meta-item {
        display: flex;
        gap: 8px;
      }
      
      .student-meta-label {
        font-weight: 600;
        color: #0f766e;
      }
      
      .grades-section { margin-bottom: 30px; }
      .grades-section h3 {
        font-size: 16px;
        font-weight: 700;
        color: #1f2937;
        margin-bottom: 15px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        border-bottom: 2px solid #e5e7eb;
        padding-bottom: 10px;
      }
      
      table {
        width: 100%;
        border-collapse: collapse;
        background: #fff;
      }
      
      table thead {
        background: #f3f4f6;
      }
      
      table th {
        padding: 12px;
        text-align: left;
        font-weight: 700;
        color: #1f2937;
        font-size: 13px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        border-bottom: 2px solid #0f766e;
      }
      
      table th:last-child {
        text-align: center;
      }
      
      table tbody tr:hover {
        background: #f9fafb;
      }
      
      .summary-box {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 20px;
        margin-top: 25px;
        padding-top: 25px;
        border-top: 2px solid #e5e7eb;
      }
      
      .summary-item {
        padding: 15px;
        background: #f0fdfa;
        border-radius: 8px;
        border-left: 3px solid #0f766e;
      }
      
      .summary-item label {
        font-size: 12px;
        font-weight: 700;
        color: #6b7280;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        display: block;
        margin-bottom: 5px;
      }
      
      .summary-item .value {
        font-size: 24px;
        font-weight: 700;
        color: #0f766e;
      }
      
      .footer {
        margin-top: 50px;
        padding-top: 20px;
        border-top: 1px solid #e5e7eb;
        text-align: center;
        font-size: 12px;
        color: #9ca3af;
      }
      
      .footer-divider {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        margin: 10px 0;
      }
      
      .footer-divider::before,
      .footer-divider::after {
        content: "";
        flex: 1;
        height: 1px;
        background: #e5e7eb;
      }
    </style>
  </head>
  <body>
    <div class="page-container">
      <!-- Header with Logo and School Info -->
      <div class="header">
        <div class="logo-box">
          <img src="${logoUrl || "https://th.bing.com/th/id/OIP.pyCJLlr1nrBCaHdOdKXbbAHaHa?o=7rm=3&rs=1&pid=ImgDetMain&o=7&rm=3"}" alt="School Logo" />
        </div>
        <div class="school-info">
          <h1>Grade Sink</h1>
          <p><strong>Official Grade Report</strong></p>
          <p>Academic Year: ${school_year || "N/A"}</p>
          <p>Report Generated: ${currentDate}</p>
        </div>
      </div>

      <!-- Student Information Section -->
      <div class="student-section">
        <h2>${fullName}</h2>
        <div class="student-meta">
          <div class="student-meta-item">
            <span class="student-meta-label">Student ID:</span>
            <span>${student.student_id || student.id || "-"}</span>
          </div>
          <div class="student-meta-item">
            <span class="student-meta-label">Class:</span>
            <span>${classInfo?.name || "-"}</span>
          </div>
          <div class="student-meta-item">
            <span class="student-meta-label">Section:</span>
            <span>${classInfo?.section || "-"}</span>
          </div>
          <div class="student-meta-item">
            <span class="student-meta-label">Level:</span>
            <span>${classInfo?.school_level || "-"}</span>
          </div>
        </div>
      </div>

      <!-- Grades Section -->
      <div class="grades-section">
        <h3>Subject Grades</h3>
        <table>
          <thead>
            <tr>
              <th>Subject</th>
              <th style="width: 20%; text-align: center;">Grade</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
      </div>

      <!-- Summary Section -->
      <div class="summary-box">
        <div class="summary-item">
          <label>Overall Average</label>
          <div class="value">${typeof average === 'number' ? average.toFixed(2) : '-'}</div>
        </div>
        <div class="summary-item">
          <label>Total Subjects</label>
          <div class="value">${grades.length}</div>
        </div>
      </div>

      <!-- Footer -->
      <div class="footer">
        <div class="footer-divider">Grade Sink System</div>
        <p>This is an official document issued by Grade Sink. Keep it safe for your records.</p>
        <p style="margin-top: 8px;">© 2026 Grade Sink. All rights reserved.</p>
      </div>
    </div>
  </body>
  </html>
  `;
}
async function generateClassStudentPDFs(req, res) {
    try {
        const classId = Number(req.params.classId || req.body.classId);
        if (!classId)
            return res.status(400).json({ success: false, msg: "classId is required" });
        const requester = req.user;
        if (!requester)
            return res.status(401).json({ success: false, msg: "Unauthorized" });
        const classModel = new class_model_1.default(dbConnection_config_1.pool);
        const classInfo = await classModel.getClassById(classId);
        if (!classInfo)
            return res.status(404).json({ success: false, msg: "Class not found" });
        // Only adviser (class.teacher_id) or super_admin can generate
        if (requester.role !== "super_admin" && classInfo.teacher_id !== requester.id) {
            return res.status(403).json({ success: false, msg: "Forbidden: only class adviser can generate reports" });
        }
        const csModel = new classStudent_model_1.default(dbConnection_config_1.pool);
        let students = await csModel.getStudentsByClassId(classId);
        // If studentIds provided, filter
        const studentIds = Array.isArray(req.body.studentIds) ? req.body.studentIds.map(Number) : [];
        if (studentIds.length > 0) {
            students = students.filter((s) => studentIds.includes(s.student_id));
        }
        if (!students || students.length === 0) {
            return res.status(404).json({ success: false, msg: "No students found for this class" });
        }
        const browser = await puppeteer_1.default.launch({ args: ["--no-sandbox", "--disable-setuid-sandbox"] });
        try {
            const archive = (0, archiver_1.default)("zip", { zlib: { level: 9 } });
            res.setHeader("Content-Type", "application/zip");
            res.setHeader("Content-Disposition", `attachment; filename="class_${classId}_grades.zip"`);
            archive.on("error", (err) => {
                throw err;
            });
            archive.pipe(res);
            const studentGradeModel = new studentGrade_model_1.default(dbConnection_config_1.pool);
            const studentModel = new student_model_1.default(dbConnection_config_1.pool);
            for (const s of students) {
                // s.student_id is the students.id; fetch grades
                const grades = await studentGradeModel.getGradesByStudentId(s.student_id);
                // For nicer output, if grade rows reference subject ids only, keep as-is
                const gradeItems = grades.map((g) => ({ subject_id: g.subject_id, subject_name: g.subject_name ?? null, grade: g.grade }));
                // compute average if numeric grades present
                const numericGrades = grades.map((g) => Number(g.grade)).filter((v) => !Number.isNaN(v));
                const average = numericGrades.length > 0 ? numericGrades.reduce((a, b) => a + b, 0) / numericGrades.length : null;
                const student = await studentModel.getStudentById(s.student_id);
                const logoUrl = (process.env.CLIENT_SIDE_URL || "http://localhost:5173").replace(/\/$/, "") + "/logo.png";
                const html = renderGradeReportHTML({
                    student: student || s,
                    grades: gradeItems,
                    classInfo,
                    average,
                    logoUrl,
                    school_year: classInfo.school_year,
                });
                const page = await browser.newPage();
                await page.setContent(html, { waitUntil: "networkidle0" });
                const pdfBuffer = await page.pdf({ format: "A4", landscape: true, printBackground: true });
                await page.close();
                const fullName = [student?.first_name, student?.middle_name, student?.last_name].filter(Boolean).join("_") || `student_${s.student_id}`;
                const filename = `${fullName.replace(/\s+/g, "_")}_${classInfo.name || "class"}_${classInfo.school_year || ""}.pdf`;
                archive.append(pdfBuffer, { name: filename });
            }
            // Record activity once
            try {
                const activitySvc = new activity_service_1.default(new activity_model_1.default(dbConnection_config_1.pool));
                await activitySvc.recordActivity({
                    user_id: requester.id,
                    role: requester.role,
                    action: "generate_grade_reports",
                    resource: "grades_pdf",
                    details: JSON.stringify({ classId, count: students.length }),
                    ip: (0, activityLogger_1.resolveClientIp)(req),
                    user_agent: req.get("user-agent") || "",
                });
            }
            catch (e) {
                console.error("Failed to record activity", e);
            }
            await archive.finalize();
            // response will be streamed by archiver
        }
        finally {
            await browser.close();
        }
    }
    catch (e) {
        console.error(e);
        if (!res.headersSent) {
            return res.status(500).json({ success: false, msg: `PDF generation failed: ${e}` });
        }
    }
}
exports.default = generateClassStudentPDFs;
//# sourceMappingURL=pdf.controller.js.map