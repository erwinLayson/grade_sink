import { Request, Response } from "express";
import ClassSubjectService from "../service/classSubject/classSubject.service";
import ClassSubjectModel from "../model/classSubject.model";
import { pool } from "../config/dbConnection.config";
import { ClassSubjectDTO } from "../constant/classSubject.constant";

export async function getAllClassSubjects(req: Request, res: Response) {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = parseInt(req.query.offset as string) || 0;

    const csService = new ClassSubjectService(new ClassSubjectModel(pool));
    const classSubjects = await csService.getAllClassSubjects();
    
    const paginatedCS = classSubjects.slice(offset, offset + limit);
    
    res.status(200).json({
      success: true,
      data: paginatedCS,
      pagination: { limit, offset, total: classSubjects.length }
    });
  } catch (e) {
    res.status(500).json({ success: false, msg: `Error: ${e}` });
  }
}

export async function getClassSubjectById(req: Request<{ id: string }>, res: Response) {
  try {
    const id = parseInt(req.params.id);
    const csService = new ClassSubjectService(new ClassSubjectModel(pool));
    const cs = await csService.getClassSubjectById(id);
    
    if (!cs) {
      return res.status(404).json({ success: false, msg: "Class-Subject entry not found" });
    }
    
    res.status(200).json({ success: true, data: cs });
  } catch (e) {
    res.status(500).json({ success: false, msg: `Error: ${e}` });
  }
}

export async function getSubjectsByClass(req: Request<{ classId: string }>, res: Response) {
  try {
    const classId = parseInt(req.params.classId);
    const csService = new ClassSubjectService(new ClassSubjectModel(pool));
    const subjects = await csService.getSubjectsByClassId(classId);
    
    res.status(200).json({ success: true, data: subjects });
  } catch (e) {
    res.status(500).json({ success: false, msg: `Error: ${e}` });
  }
}

export async function getClassesByTeacherSubjects(req: Request<{ teacherId: string }>, res: Response) {
  try {
    const teacherId = parseInt(req.params.teacherId);
    const csService = new ClassSubjectService(new ClassSubjectModel(pool));
    const classes = await csService.getClassesByTeacherId(teacherId);

    res.status(200).json({ success: true, data: classes });
  } catch (e) {
    res.status(500).json({ success: false, msg: `Error: ${e}` });
  }
}

export async function createClassSubject(req: Request, res: Response) {
  try {
    const { class_id, subject_id }: ClassSubjectDTO = req.body;

    if (!class_id || !subject_id) {
      return res.status(400).json({ success: false, msg: "Class ID and Subject ID are required" });
    }

    const csService = new ClassSubjectService(new ClassSubjectModel(pool));
    const result = await csService.createClassSubject({ class_id, subject_id });
    
    if (result) {
      return res.status(201).json({ success: true, msg: "Subject added to class successfully", data: { id: result } });
    }
  } catch (e) {
    res.status(500).json({ success: false, msg: `Error: ${e}` });
  }
}

export async function deleteClassSubject(req: Request<{ id: string }>, res: Response) {
  try {
    const id = parseInt(req.params.id);
    const csService = new ClassSubjectService(new ClassSubjectModel(pool));
    const result = await csService.deleteClassSubjectById(id);
    
    if (result === 0) {
      return res.status(404).json({ success: false, msg: "Class-Subject entry not found" });
    }

    res.status(200).json({ success: true, msg: "Subject removed from class successfully" });
  } catch (e) {
    res.status(500).json({ success: false, msg: `Error: ${e}` });
  }
}
