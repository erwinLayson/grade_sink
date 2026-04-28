import { Request, Response } from "express";
import ClassStudentService from "../service/classStudent/classStudent.service";
import ClassStudentModel from "../model/classStudent.model";
import { pool } from "../config/dbConnection.config";
import { ClassStudentDTO } from "../constant/classStudent.constant";

export async function getAllClassStudents(req: Request, res: Response) {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = parseInt(req.query.offset as string) || 0;

    const csService = new ClassStudentService(new ClassStudentModel(pool));
    const classStudents = await csService.getAllClassStudents();
    
    const paginatedCS = classStudents.slice(offset, offset + limit);
    
    res.status(200).json({
      success: true,
      data: paginatedCS,
      pagination: { limit, offset, total: classStudents.length }
    });
  } catch (e) {
    res.status(500).json({ success: false, msg: `Error: ${e}` });
  }
}

export async function getClassStudentById(req: Request<{ id: string }>, res: Response) {
  try {
    const id = parseInt(req.params.id);
    const csService = new ClassStudentService(new ClassStudentModel(pool));
    const cs = await csService.getClassStudentById(id);
    
    if (!cs) {
      return res.status(404).json({ success: false, msg: "Class-Student entry not found" });
    }
    
    res.status(200).json({ success: true, data: cs });
  } catch (e) {
    res.status(500).json({ success: false, msg: `Error: ${e}` });
  }
}

export async function getStudentsByClass(req: Request<{ classId: string }>, res: Response) {
  try {
    const classId = parseInt(req.params.classId);
    const csService = new ClassStudentService(new ClassStudentModel(pool));
    const students = await csService.getStudentsByClassId(classId);
    
    res.status(200).json({ success: true, data: students });
  } catch (e) {
    res.status(500).json({ success: false, msg: `Error: ${e}` });
  }
}

export async function createClassStudent(req: Request, res: Response) {
  try {
    const { student_id, class_id }: ClassStudentDTO = req.body;

    if (!student_id || !class_id) {
      return res.status(400).json({ success: false, msg: "Student ID and Class ID are required" });
    }

    const csService = new ClassStudentService(new ClassStudentModel(pool));
    const result = await csService.createClassStudent({ student_id, class_id });
    
    if (result) {
      return res.status(201).json({ success: true, msg: "Student added to class successfully", data: { id: result } });
    }
  } catch (e) {
    res.status(500).json({ success: false, msg: `Error: ${e}` });
  }
}

export async function deleteClassStudent(req: Request<{ id: string }>, res: Response) {
  try {
    const id = parseInt(req.params.id);
    const csService = new ClassStudentService(new ClassStudentModel(pool));
    const result = await csService.deleteClassStudentById(id);
    
    if (result === 0) {
      return res.status(404).json({ success: false, msg: "Class-Student entry not found" });
    }

    res.status(200).json({ success: true, msg: "Student removed from class successfully" });
  } catch (e) {
    res.status(500).json({ success: false, msg: `Error: ${e}` });
  }
}
