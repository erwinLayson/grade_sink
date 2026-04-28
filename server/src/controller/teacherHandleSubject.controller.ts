import { Request, Response } from "express";
import TeacherHandleSubjectService from "../service/teacherHandleSubject/teacherHandleSubject.service";
import TeacherHandleSubjectModel from "../model/teacherHandleSubject.model";
import { pool } from "../config/dbConnection.config";
import { TeacherHandleSubjectDTO } from "../constant/teacherHandleSubject.constant";

export async function getAllTeacherHandleSubjects(req: Request, res: Response) {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = parseInt(req.query.offset as string) || 0;

    const thsService = new TeacherHandleSubjectService(new TeacherHandleSubjectModel(pool));
    const assignments = await thsService.getAllTeacherHandleSubjects();
    
    const paginatedAssignments = assignments.slice(offset, offset + limit);
    
    res.status(200).json({
      success: true,
      data: paginatedAssignments,
      pagination: { limit, offset, total: assignments.length }
    });
  } catch (e) {
    res.status(500).json({ success: false, msg: `Error: ${e}` });
  }
}

export async function getTeacherHandleSubjectById(req: Request<{ id: string }>, res: Response) {
  try {
    const id = parseInt(req.params.id);
    const thsService = new TeacherHandleSubjectService(new TeacherHandleSubjectModel(pool));
    const assignment = await thsService.getTeacherHandleSubjectById(id);
    
    if (!assignment) {
      return res.status(404).json({ success: false, msg: "Teacher-Subject assignment not found" });
    }
    
    res.status(200).json({ success: true, data: assignment });
  } catch (e) {
    res.status(500).json({ success: false, msg: `Error: ${e}` });
  }
}

export async function getSubjectsByTeacher(req: Request<{ teacherId: string }>, res: Response) {
  try {
    const teacherId = parseInt(req.params.teacherId);
    const thsService = new TeacherHandleSubjectService(new TeacherHandleSubjectModel(pool));
    const subjects = await thsService.getSubjectsByTeacherId(teacherId);
    
    res.status(200).json({ success: true, data: subjects });
  } catch (e) {
    res.status(500).json({ success: false, msg: `Error: ${e}` });
  }
}

export async function createTeacherHandleSubject(req: Request, res: Response) {
  try {
    const { teacher_id, subject_id }: TeacherHandleSubjectDTO = req.body;

    if (!teacher_id || !subject_id) {
      return res.status(400).json({ success: false, msg: "Teacher ID and Subject ID are required" });
    }

    const thsService = new TeacherHandleSubjectService(new TeacherHandleSubjectModel(pool));
    const result = await thsService.createTeacherHandleSubject({ teacher_id, subject_id });
    
    if (result) {
      return res.status(201).json({ success: true, msg: "Subject assigned to teacher successfully", data: { id: result } });
    }
  } catch (e) {
    res.status(500).json({ success: false, msg: `Error: ${e}` });
  }
}

export async function deleteTeacherHandleSubject(req: Request<{ id: string }>, res: Response) {
  try {
    const id = parseInt(req.params.id);
    const thsService = new TeacherHandleSubjectService(new TeacherHandleSubjectModel(pool));
    const result = await thsService.deleteTeacherHandleSubjectById(id);
    
    if (result === 0) {
      return res.status(404).json({ success: false, msg: "Teacher-Subject assignment not found" });
    }

    res.status(200).json({ success: true, msg: "Subject removed from teacher successfully" });
  } catch (e) {
    res.status(500).json({ success: false, msg: `Error: ${e}` });
  }
}
