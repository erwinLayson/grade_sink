import { Request, Response } from "express";
import StudentSubjectService from "../service/studentSubject/studentSubject.service";
import StudentSubjectModel from "../model/studentSubject.model";
import { pool } from "../config/dbConnection.config";
import { StudentSubjectDTO } from "../constant/studentSubject.constant";

export async function getAllStudentSubjects(req: Request, res: Response) {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = parseInt(req.query.offset as string) || 0;

    const ssService = new StudentSubjectService(new StudentSubjectModel(pool));
    const studentSubjects = await ssService.getAllStudentSubjects();
    
    const paginatedSS = studentSubjects.slice(offset, offset + limit);
    
    res.status(200).json({
      success: true,
      data: paginatedSS,
      pagination: { limit, offset, total: studentSubjects.length }
    });
  } catch (e) {
    res.status(500).json({ success: false, msg: `Error: ${e}` });
  }
}

export async function getStudentSubjectById(req: Request<{ id: string }>, res: Response) {
  try {
    const id = parseInt(req.params.id);
    const ssService = new StudentSubjectService(new StudentSubjectModel(pool));
    const ss = await ssService.getStudentSubjectById(id);
    
    if (!ss) {
      return res.status(404).json({ success: false, msg: "Student-Subject entry not found" });
    }
    
    res.status(200).json({ success: true, data: ss });
  } catch (e) {
    res.status(500).json({ success: false, msg: `Error: ${e}` });
  }
}

export async function getSubjectsByStudent(req: Request<{ studentId: string }>, res: Response) {
  try {
    const studentId = parseInt(req.params.studentId);
    const ssService = new StudentSubjectService(new StudentSubjectModel(pool));
    const subjects = await ssService.getSubjectsByStudentId(studentId);
    
    res.status(200).json({ success: true, data: subjects });
  } catch (e) {
    res.status(500).json({ success: false, msg: `Error: ${e}` });
  }
}

export async function createStudentSubject(req: Request, res: Response) {
  try {
    const { student_id, subject_id, teacher_id }: StudentSubjectDTO = req.body;

    if (!student_id || !subject_id || !teacher_id) {
      return res.status(400).json({ success: false, msg: "Student ID, Subject ID, and Teacher ID are required" });
    }

    const ssService = new StudentSubjectService(new StudentSubjectModel(pool));
    const result = await ssService.createStudentSubject({ student_id, subject_id, teacher_id });
    
    if (result) {
      return res.status(201).json({ success: true, msg: "Subject assigned to student successfully", data: { id: result } });
    }
  } catch (e) {
    res.status(500).json({ success: false, msg: `Error: ${e}` });
  }
}

export async function deleteStudentSubject(req: Request<{ id: string }>, res: Response) {
  try {
    const id = parseInt(req.params.id);
    const ssService = new StudentSubjectService(new StudentSubjectModel(pool));
    const result = await ssService.deleteStudentSubjectById(id);
    
    if (result === 0) {
      return res.status(404).json({ success: false, msg: "Student-Subject entry not found" });
    }

    res.status(200).json({ success: true, msg: "Subject removed from student successfully" });
  } catch (e) {
    res.status(500).json({ success: false, msg: `Error: ${e}` });
  }
}
