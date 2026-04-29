import { Request, Response } from "express";
import StudentGradeService from "../service/studentGrade/studentGrade.service";
import StudentGradeModel from "../model/studentGrade.model";
import TeacherModel from "../model/teacher.model";
import { pool } from "../config/dbConnection.config";
import { StudentGradeDTO } from "../constant/studentGrade.constant";

async function resolveTeacherIdFromRequest(req: Request) {
  const user = (req as any).user as { email?: string; role?: string } | undefined;

  if (!user?.email) {
    return null;
  }

  const teacherModel = new TeacherModel(pool);
  const teacher = await teacherModel.getTeacherByEmail(user.email);

  return teacher?.id ?? null;
}

export async function getAllGrades(req: Request, res: Response) {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = parseInt(req.query.offset as string) || 0;

    const gradeService = new StudentGradeService(new StudentGradeModel(pool));
    const grades = await gradeService.getAllStudentGrades();
    
    const paginatedGrades = grades.slice(offset, offset + limit);
    
    res.status(200).json({
      success: true,
      data: paginatedGrades,
      pagination: { limit, offset, total: grades.length }
    });
  } catch (e) {
    res.status(500).json({ success: false, msg: `Error: ${e}` });
  }
}

export async function getGradeById(req: Request<{ id: string }>, res: Response) {
  try {
    const id = parseInt(req.params.id);
    const gradeService = new StudentGradeService(new StudentGradeModel(pool));
    const grade = await gradeService.getStudentGradeById(id);
    
    if (!grade) {
      return res.status(404).json({ success: false, msg: "Grade not found" });
    }
    
    res.status(200).json({ success: true, data: grade });
  } catch (e) {
    res.status(500).json({ success: false, msg: `Error: ${e}` });
  }
}

export async function getGradesByStudent(req: Request<{ studentId: string }>, res: Response) {
  try {
    const studentId = parseInt(req.params.studentId);
    const gradeService = new StudentGradeService(new StudentGradeModel(pool));
    const grades = await gradeService.getGradesByStudentId(studentId);
    
    res.status(200).json({ success: true, data: grades });
  } catch (e) {
    res.status(500).json({ success: false, msg: `Error: ${e}` });
  }
}

export async function createGrade(req: Request, res: Response) {
  try {
    const { student_id, subject_id, teacher_id, grade, quarter }: StudentGradeDTO = req.body;
    const user = (req as any).user as { role?: string } | undefined;
    const gradeService = new StudentGradeService(new StudentGradeModel(pool));

    const resolvedTeacherId = user?.role === "teacher"
      ? await resolveTeacherIdFromRequest(req)
      : teacher_id;

    if (!student_id || !subject_id || !resolvedTeacherId || grade === undefined || !quarter) {
      return res.status(400).json({ success: false, msg: "All grade fields are required" });
    }

    const existingGrade = await gradeService.getStudentGradeByStudentSubjectQuarter(student_id, subject_id, quarter);

    if (existingGrade) {
      return res.status(409).json({
        success: false,
        msg: "Grade already exists for this student, subject, and quarter. Use edit instead.",
        data: existingGrade,
      });
    }

    const result = await gradeService.createStudentGrade({
      student_id,
      subject_id,
      teacher_id: resolvedTeacherId,
      grade,
      quarter,
    });
    
    if (result) {
      return res.status(201).json({ success: true, msg: "Grade created successfully", data: { id: result } });
    }
  } catch (e) {
    res.status(500).json({ success: false, msg: `Error: ${e}` });
  }
}

export async function updateGrade(req: Request<{ id: string }>, res: Response) {
  try {
    const id = parseInt(req.params.id);
    const data: Partial<StudentGradeDTO> = req.body;
    const user = (req as any).user;

    const gradeService = new StudentGradeService(new StudentGradeModel(pool));
    
    // Check if teacher is updating their own grade
    if (user.role === "teacher") {
      const teacherId = await resolveTeacherIdFromRequest(req);
      const grade = await gradeService.getStudentGradeById(id);
      if (!grade || !teacherId || grade.teacher_id !== teacherId) {
        return res.status(403).json({ success: false, msg: "You can only update your own grades" });
      }
    }

    const result = await gradeService.updateStudentGradeById(id, data);
    
    if (result === 0) {
      return res.status(404).json({ success: false, msg: "Grade not found" });
    }

    res.status(200).json({ success: true, msg: "Grade updated successfully" });
  } catch (e) {
    res.status(500).json({ success: false, msg: `Error: ${e}` });
  }
}

export async function deleteGrade(req: Request<{ id: string }>, res: Response) {
  try {
    const id = parseInt(req.params.id);
    const gradeService = new StudentGradeService(new StudentGradeModel(pool));
    const result = await gradeService.deleteStudentGradeById(id);
    
    if (result === 0) {
      return res.status(404).json({ success: false, msg: "Grade not found" });
    }

    res.status(200).json({ success: true, msg: "Grade deleted successfully" });
  } catch (e) {
    res.status(500).json({ success: false, msg: `Error: ${e}` });
  }
}
