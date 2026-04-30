import { Request, Response } from "express";
import ReportCardModel from "../model/reportCard.model";
import TeacherModel from "../model/teacher.model";
import ClassTeacherService from "../service/classTeacher/classTeacher.service";
import ClassTeacherModel from "../model/classTeacher.model";
import generateGradePDF from "../helper/generateGrade.pdf";
import { pool } from "../config/dbConnection.config";
import { generatePdfGrade } from "../service/generateCardPdf.service";

export async function getReport(req: Request, res: Response) {
  try {
    // support both :classId and :_id route params
    const rawId = req.params.classId ?? req.params._id ?? req.query.classId;
    const classId = Number(rawId);
    if (!rawId || isNaN(classId)) {
      return res.status(400).json({ msg: "Invalid Class Id" });
    }

    // Authorization: if requester is a teacher, ensure they advise this class
    const decoded = (req as any).user as { email?: string; role?: string } | undefined;

    if (decoded?.role === "teacher") {
      const teacherModel = new TeacherModel(pool);
      const teacher = await teacherModel.getTeacherByEmail(decoded.email ?? "");
      if (!teacher) {
        return res.status(401).json({ msg: "Unauthorized" });
      }

      const ctService = new ClassTeacherService(new ClassTeacherModel(pool));
      const teachers = await ctService.getTeachersByClassId(classId);
      const advisingTeacherIds = (teachers || []).map((t: any) => t.teacher_id);

      if (!advisingTeacherIds.includes(teacher.id)) {
        return res.status(403).json({ msg: "Forbidden: you are not the advising teacher for this class" });
      }
    }

    const rcModel = new ReportCardModel(pool);
    const data = await rcModel.getStudentGradeByClassId(classId);

    if (!data || data.length === 0) {
      return res.status(404).json({ msg: "No students or grades found for this class" });
    }

    const map = new Map<number, any>();

    for (const row of data) {
      if (!map.has(row.studentId)) {
        map.set(row.studentId, {
          studentId: row.studentId,
          fullName: row.fullName,
          className: row.className,
          classSection: row.classSection,
          schoolLevel: row.schoolLevel ?? null,
          LRN: row.LRN ?? null,
          sex: row.sex ?? null,
          age: row.age ?? null,
          subjects: []
        });
      }

      const student = map.get(row.studentId);

      student.subjects.push({
        name: row.subjectName,
        grades: row.grades ?? null,
        quarter: row.quarter ?? null
      });
    }

    const result = Array.from(map.values());
    const html = generateGradePDF(result);

    const pdf = await generatePdfGrade(html);

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="report_${classId}.pdf"`,
    });

    return res.send(pdf);

  } catch (err) {
    console.error("getReport error:", err);
    return res.status(500).json({ msg: "Failed to build report" });
  }
}