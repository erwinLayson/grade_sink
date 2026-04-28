import { Request, Response } from "express";
import ClassService from "../service/classes/class.service";
import ClassModel from "../model/class.model";
import { pool } from "../config/dbConnection.config";
import { ClassDTO } from "../constant/class.constant";

export async function getAllClasses(req: Request, res: Response) {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = parseInt(req.query.offset as string) || 0;

    const classService = new ClassService(new ClassModel(pool));
    const classes = await classService.getAllClasses();
    
    const paginatedClasses = classes.slice(offset, offset + limit);
    
    res.status(200).json({
      success: true,
      data: paginatedClasses,
      pagination: { limit, offset, total: classes.length }
    });
  } catch (e) {
    res.status(500).json({ success: false, msg: `Error: ${e}` });
  }
}

export async function getClassById(req: Request<{ id: string }>, res: Response) {
  try {
    const id = parseInt(req.params.id);
    const classService = new ClassService(new ClassModel(pool));
    const cls = await classService.getClassById(id);
    
    if (!cls) {
      return res.status(404).json({ success: false, msg: "Class not found" });
    }
    
    res.status(200).json({ success: true, data: cls });
  } catch (e) {
    res.status(500).json({ success: false, msg: `Error: ${e}` });
  }
}

export async function createClass(req: Request, res: Response) {
  try {
    const { name, section, school_year, school_level, teacher_id }: ClassDTO = req.body;

    if (!name || !section || !school_year || !school_level) {
      return res.status(400).json({ success: false, msg: "Name, section, school_year, and school_level are required" });
    }

    const classService = new ClassService(new ClassModel(pool));
    const result = await classService.createClass({ name, section, school_year, school_level, teacher_id });
    
    if (result) {
      return res.status(201).json({ success: true, msg: "Class created successfully", data: { id: result } });
    }
  } catch (e) {
    res.status(500).json({ success: false, msg: `Error: ${e}` });
  }
}

export async function updateClass(req: Request<{ id: string }>, res: Response) {
  try {
    const id = parseInt(req.params.id);
    const data: Partial<ClassDTO> = req.body;

    const classService = new ClassService(new ClassModel(pool));
    const result = await classService.updateClassById(id, data);
    
    if (result === 0) {
      return res.status(404).json({ success: false, msg: "Class not found" });
    }

    res.status(200).json({ success: true, msg: "Class updated successfully" });
  } catch (e) {
    res.status(500).json({ success: false, msg: `Error: ${e}` });
  }
}

export async function deleteClass(req: Request<{ id: string }>, res: Response) {
  try {
    const id = parseInt(req.params.id);
    const classService = new ClassService(new ClassModel(pool));
    const result = await classService.deleteClassById(id);
    
    if (result === 0) {
      return res.status(404).json({ success: false, msg: "Class not found" });
    }

    res.status(200).json({ success: true, msg: "Class deleted successfully" });
  } catch (e) {
    res.status(500).json({ success: false, msg: `Error: ${e}` });
  }
}
