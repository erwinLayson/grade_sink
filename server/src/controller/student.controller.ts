import { Request, Response } from "express";
import StudentService from "../service/students/student.service";
import StudentModel from "../model/student.model";
import { pool } from "../config/dbConnection.config";
import { StudentDTO } from "../constant/student.constant";

export async function getAllStudents(req: Request, res: Response) {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = parseInt(req.query.offset as string) || 0;

    const studentService = new StudentService(new StudentModel(pool));
    const students = await studentService.getAllStudents();
    
    const paginatedStudents = students.slice(offset, offset + limit);
    
    res.status(200).json({
      success: true,
      data: paginatedStudents,
      pagination: { limit, offset, total: students.length }
    });
  } catch (e) {
    res.status(500).json({ success: false, msg: `Error: ${e}` });
  }
}

export async function getStudentById(req: Request<{ id: string }>, res: Response) {
  try {
    const id = parseInt(req.params.id);
    const studentService = new StudentService(new StudentModel(pool));
    const student = await studentService.getStudentById(id);
    
    if (!student) {
      return res.status(404).json({ success: false, msg: "Student not found" });
    }
    
    res.status(200).json({ success: true, data: student });
  } catch (e) {
    res.status(500).json({ success: false, msg: `Error: ${e}` });
  }
}

export async function createStudent(req: Request, res: Response) {
  try {
    const { student_id, first_name, middle_name, last_name, age, birth_date, lrn, sex, level }: StudentDTO = req.body;

    if (!first_name || !middle_name || !last_name || !age || !birth_date || !lrn || !sex || !level) {
      return res.status(400).json({ success: false, msg: "All student fields are required" });
    }

    const studentService = new StudentService(new StudentModel(pool));
    const result = await studentService.createStudent({ student_id, first_name, middle_name, last_name, age, birth_date, lrn, sex, level });
    
    if (result) {
      return res.status(201).json({ success: true, msg: "Student created successfully", data: { id: result } });
    }
  } catch (e) {
    res.status(500).json({ success: false, msg: `Error: ${e}` });
  }
}

export async function updateStudent(req: Request<{ id: string }>, res: Response) {
  try {
    const id = parseInt(req.params.id);
    const data: Partial<StudentDTO> = req.body;

    const studentService = new StudentService(new StudentModel(pool));
    const result = await studentService.updateStudentById(id, data);
    
    if (result === 0) {
      return res.status(404).json({ success: false, msg: "Student not found" });
    }

    res.status(200).json({ success: true, msg: "Student updated successfully" });
  } catch (e) {
    res.status(500).json({ success: false, msg: `Error: ${e}` });
  }
}

export async function deleteStudent(req: Request<{ id: string }>, res: Response) {
  try {
    const id = parseInt(req.params.id);
    const studentService = new StudentService(new StudentModel(pool));
    const result = await studentService.deleteStudentById(id);
    
    if (result === 0) {
      return res.status(404).json({ success: false, msg: "Student not found" });
    }

    res.status(200).json({ success: true, msg: "Student deleted successfully" });
  } catch (e) {
    res.status(500).json({ success: false, msg: `Error: ${e}` });
  }
}
