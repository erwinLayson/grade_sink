import { Request, Response } from "express";
import ClassTeacherService from "../service/classTeacher/classTeacher.service";
import ClassTeacherModel from "../model/classTeacher.model";
import { pool } from "../config/dbConnection.config";
import { ClassTeacherDTO } from "../constant/classTeacher.constant";

export async function getAllClassTeachers(req: Request, res: Response) {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = parseInt(req.query.offset as string) || 0;

    const ctService = new ClassTeacherService(new ClassTeacherModel(pool));
    const classTeachers = await ctService.getAllClassTeachers();
    
    const paginatedCT = classTeachers.slice(offset, offset + limit);
    
    res.status(200).json({
      success: true,
      data: paginatedCT,
      pagination: { limit, offset, total: classTeachers.length }
    });
  } catch (e) {
    res.status(500).json({ success: false, msg: `Error: ${e}` });
  }
}

export async function getClassTeacherById(req: Request<{ id: string }>, res: Response) {
  try {
    const id = parseInt(req.params.id);
    const ctService = new ClassTeacherService(new ClassTeacherModel(pool));
    const ct = await ctService.getClassTeacherById(id);
    
    if (!ct) {
      return res.status(404).json({ success: false, msg: "Class-Teacher entry not found" });
    }
    
    res.status(200).json({ success: true, data: ct });
  } catch (e) {
    res.status(500).json({ success: false, msg: `Error: ${e}` });
  }
}

export async function getTeachersByClass(req: Request<{ classId: string }>, res: Response) {
  try {
    const classId = parseInt(req.params.classId);
    const ctService = new ClassTeacherService(new ClassTeacherModel(pool));
    const teachers = await ctService.getTeachersByClassId(classId);
    
    res.status(200).json({ success: true, data: teachers });
  } catch (e) {
    res.status(500).json({ success: false, msg: `Error: ${e}` });
  }
}

export async function getClassesByTeacher(req: Request<{ teacherId: string }>, res: Response) {
  try {
    const teacherId = parseInt(req.params.teacherId);
    const ctService = new ClassTeacherService(new ClassTeacherModel(pool));
    const classes = await ctService.getClassesByTeacherId(teacherId);
    
    res.status(200).json({ success: true, data: classes });
  } catch (e) {
    res.status(500).json({ success: false, msg: `Error: ${e}` });
  }
}

export async function createClassTeacher(req: Request, res: Response) {
  try {
    const { class_id, teacher_id }: ClassTeacherDTO = req.body;

    if (!class_id || !teacher_id) {
      return res.status(400).json({ success: false, msg: "Class ID and Teacher ID are required" });
    }

    const ctService = new ClassTeacherService(new ClassTeacherModel(pool));
    const result = await ctService.createClassTeacher({ class_id, teacher_id });
    
    if (result) {
      return res.status(201).json({ success: true, msg: "Teacher added to class successfully", data: { id: result } });
    }
  } catch (e) {
    res.status(500).json({ success: false, msg: `Error: ${e}` });
  }
}

export async function deleteClassTeacher(req: Request<{ id: string }>, res: Response) {
  try {
    const id = parseInt(req.params.id);
    const ctService = new ClassTeacherService(new ClassTeacherModel(pool));
    const result = await ctService.deleteClassTeacherById(id);
    
    if (result === 0) {
      return res.status(404).json({ success: false, msg: "Class-Teacher entry not found" });
    }

    res.status(200).json({ success: true, msg: "Teacher removed from class successfully" });
  } catch (e) {
    res.status(500).json({ success: false, msg: `Error: ${e}` });
  }
}
