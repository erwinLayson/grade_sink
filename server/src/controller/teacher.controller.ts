import { Request, Response } from "express";
import TeacherService from "../service/teachers/teacher.service";
import TeacherModel from "../model/teacher.model";
import { pool } from "../config/dbConnection.config";
import { TeacherDTO } from "../constant/teacher.constant";

export async function getAllTeachers(req: Request, res: Response) {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = parseInt(req.query.offset as string) || 0;

    const teacherService = new TeacherService(new TeacherModel(pool));
    const teachers = await teacherService.getAllTeachers();
    
    const paginatedTeachers = teachers.slice(offset, offset + limit);
    
    res.status(200).json({
      success: true,
      data: paginatedTeachers,
      pagination: { limit, offset, total: teachers.length }
    });
  } catch (e) {
    res.status(500).json({ success: false, msg: `Error: ${e}` });
  }
}

export async function getTeacherById(req: Request<{ id: string }>, res: Response) {
  try {
    const id = parseInt(req.params.id);
    const teacherService = new TeacherService(new TeacherModel(pool));
    const teacher = await teacherService.getTeacherById(id);
    
    if (!teacher) {
      return res.status(404).json({ success: false, msg: "Teacher not found" });
    }
    
    res.status(200).json({ success: true, data: teacher });
  } catch (e) {
    res.status(500).json({ success: false, msg: `Error: ${e}` });
  }
}

export async function getTeacherByEmail(req: Request<{ email: string }>, res: Response) {
  try {
    const email = req.params.email;
    const teacherService = new TeacherService(new TeacherModel(pool));
    const teacher = await teacherService.getTeacherByEmail(email);

    if (!teacher) {
      return res.status(404).json({ success: false, msg: "Teacher not found" });
    }

    res.status(200).json({ success: true, data: teacher });
  } catch (e) {
    res.status(500).json({ success: false, msg: `Error: ${e}` });
  }
}

export async function createTeacher(req: Request, res: Response) {
  try {
    const { first_name, middle_name, last_name, email }: TeacherDTO = req.body;

    if (!email) {
      return res.status(400).json({ success: false, msg: "Email is required" });
    }

    const teacherService = new TeacherService(new TeacherModel(pool));
    const result = await teacherService.createTeacher({ first_name, middle_name, last_name, email });
    
    if (result) {
      return res.status(201).json({ success: true, msg: "Teacher created successfully", data: { id: result } });
    }
  } catch (e) {
    res.status(500).json({ success: false, msg: `Error: ${e}` });
  }
}

export async function updateTeacher(req: Request<{ id: string }>, res: Response) {
  try {
    const id = parseInt(req.params.id);
    const data: Partial<TeacherDTO> = req.body;

    const teacherService = new TeacherService(new TeacherModel(pool));
    const result = await teacherService.updateTeacherById(id, data);
    
    if (result === 0) {
      return res.status(404).json({ success: false, msg: "Teacher not found" });
    }

    res.status(200).json({ success: true, msg: "Teacher updated successfully" });
  } catch (e) {
    res.status(500).json({ success: false, msg: `Error: ${e}` });
  }
}

export async function deleteTeacher(req: Request<{ id: string }>, res: Response) {
  try {
    const id = parseInt(req.params.id);
    const teacherService = new TeacherService(new TeacherModel(pool));
    const result = await teacherService.deleteTeacherById(id);
    
    if (result === 0) {
      return res.status(404).json({ success: false, msg: "Teacher not found" });
    }

    res.status(200).json({ success: true, msg: "Teacher deleted successfully" });
  } catch (e) {
    res.status(500).json({ success: false, msg: `Error: ${e}` });
  }
}
