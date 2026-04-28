import { Request, Response } from "express";
import SubjectService from "../service/subjects/subject.service";
import SubjectModel from "../model/subject.model";
import { pool } from "../config/dbConnection.config";
import { SubjectDTO } from "../constant/subject.constant";

export async function getAllSubjects(req: Request, res: Response) {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = parseInt(req.query.offset as string) || 0;

    const subjectService = new SubjectService(new SubjectModel(pool));
    const subjects = await subjectService.getAllSubjects();
    
    const paginatedSubjects = subjects.slice(offset, offset + limit);
    
    res.status(200).json({
      success: true,
      data: paginatedSubjects,
      pagination: { limit, offset, total: subjects.length }
    });
  } catch (e) {
    res.status(500).json({ success: false, msg: `Error: ${e}` });
  }
}

export async function getSubjectById(req: Request<{ id: string }>, res: Response) {
  try {
    const id = parseInt(req.params.id);
    const subjectService = new SubjectService(new SubjectModel(pool));
    const subject = await subjectService.getSubjectById(id);
    
    if (!subject) {
      return res.status(404).json({ success: false, msg: "Subject not found" });
    }
    
    res.status(200).json({ success: true, data: subject });
  } catch (e) {
    res.status(500).json({ success: false, msg: `Error: ${e}` });
  }
}

export async function createSubject(req: Request, res: Response) {
  try {
    const { code, name }: SubjectDTO = req.body;

    if (!code || !name) {
      return res.status(400).json({ success: false, msg: "Code and name are required" });
    }

    const subjectService = new SubjectService(new SubjectModel(pool));
    const result = await subjectService.createSubject({ code, name });
    
    if (result) {
      return res.status(201).json({ success: true, msg: "Subject created successfully", data: { id: result } });
    }
  } catch (e) {
    res.status(500).json({ success: false, msg: `Error: ${e}` });
  }
}

export async function updateSubject(req: Request<{ id: string }>, res: Response) {
  try {
    const id = parseInt(req.params.id);
    const data: Partial<SubjectDTO> = req.body;

    const subjectService = new SubjectService(new SubjectModel(pool));
    const result = await subjectService.updateSubjectById(id, data);
    
    if (result === 0) {
      return res.status(404).json({ success: false, msg: "Subject not found" });
    }

    res.status(200).json({ success: true, msg: "Subject updated successfully" });
  } catch (e) {
    res.status(500).json({ success: false, msg: `Error: ${e}` });
  }
}

export async function deleteSubject(req: Request<{ id: string }>, res: Response) {
  try {
    const id = parseInt(req.params.id);
    const subjectService = new SubjectService(new SubjectModel(pool));
    const result = await subjectService.deleteSubjectById(id);
    
    if (result === 0) {
      return res.status(404).json({ success: false, msg: "Subject not found" });
    }

    res.status(200).json({ success: true, msg: "Subject deleted successfully" });
  } catch (e) {
    res.status(500).json({ success: false, msg: `Error: ${e}` });
  }
}
