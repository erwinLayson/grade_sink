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
    const { class_id, subject_id, teacher_id }: ClassSubjectDTO = req.body;

    if (!class_id || !subject_id) {
      return res.status(400).json({ success: false, msg: "Class ID and Subject ID are required" });
    }

    if (!teacher_id) {
      return res.status(400).json({ success: false, msg: "Teacher ID is required" });
    }

    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      const classSubjectModel = new ClassSubjectModel(connection as unknown as typeof pool);
      const existing = await classSubjectModel.getClassSubjectByClassAndSubject(class_id, subject_id);
      if (existing) {
        await connection.rollback();
        return res.status(409).json({ success: false, msg: "Subject is already assigned to this class" });
      }

      const csService = new ClassSubjectService(classSubjectModel);
      const result = await csService.createClassSubject({ class_id, subject_id, teacher_id });

      await connection.query(
        `INSERT INTO teacher_handle_subject (teacher_id, subject_id)
         SELECT ?, ?
         WHERE NOT EXISTS (
           SELECT 1 FROM teacher_handle_subject WHERE teacher_id = ? AND subject_id = ?
         )`,
        [teacher_id, subject_id, teacher_id, subject_id],
      );

      await connection.query(
        `INSERT INTO student_subject (student_id, subject_id, teacher_id)
         SELECT cs.student_id, ?, ?
         FROM class_student cs
         WHERE cs.class_id = ?
         AND NOT EXISTS (
           SELECT 1 FROM student_subject ss
           WHERE ss.student_id = cs.student_id AND ss.subject_id = ?
         )`,
        [subject_id, teacher_id, class_id, subject_id],
      );

      await connection.commit();

      if (result) {
        return res.status(201).json({ success: true, msg: "Subject added to class successfully", data: { id: result } });
      }
    } catch (e) {
      await connection.rollback();
      throw e;
    } finally {
      connection.release();
    }
  } catch (e) {
    res.status(500).json({ success: false, msg: `Error: ${e}` });
  }
}

export async function updateClassSubjectTeacher(req: Request<{ id: string }>, res: Response) {
  try {
    const id = parseInt(req.params.id);
    const { teacher_id }: { teacher_id: number } = req.body;

    if (!teacher_id) {
      return res.status(400).json({ success: false, msg: "Teacher ID is required" });
    }

    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      const classSubjectModel = new ClassSubjectModel(connection as unknown as typeof pool);
      const classSubject = await classSubjectModel.getClassSubjectById(id);

      if (!classSubject) {
        await connection.rollback();
        return res.status(404).json({ success: false, msg: "Class-Subject entry not found" });
      }

      // Verify the new teacher handles this subject
      const [teacherHandlesSubject] = await connection.query(
        `SELECT 1 FROM teacher_handle_subject WHERE teacher_id = ? AND subject_id = ?`,
        [teacher_id, classSubject.subject_id],
      );

      if ((teacherHandlesSubject as any[]).length === 0) {
        await connection.rollback();
        return res.status(400).json({ success: false, msg: "Teacher does not handle this subject" });
      }

      const [updatedClassSubject] = await connection.query(
        `UPDATE class_subjects
         SET teacher_id = ?
         WHERE id = ? AND class_id = ? AND subject_id = ?`,
        [teacher_id, id, classSubject.class_id, classSubject.subject_id],
      );

      if ((updatedClassSubject as any).affectedRows === 0) {
        await connection.rollback();
        return res.status(404).json({ success: false, msg: "Class-Subject entry not found for update" });
      }

      // Update student_subject for all students in this class with the same school year
      await connection.query(
        `UPDATE student_subject ss
         INNER JOIN class_student cs ON cs.student_id = ss.student_id
         SET ss.teacher_id = ?
         WHERE cs.class_id = ?
           AND ss.subject_id = ?`,
        [teacher_id, classSubject.class_id, classSubject.subject_id],
      );

      await connection.commit();

      return res.status(200).json({ success: true, msg: "Teacher assignment updated successfully" });
    } catch (e) {
      await connection.rollback();
      throw e;
    } finally {
      connection.release();
    }
  } catch (e) {
    res.status(500).json({ success: false, msg: `Error: ${e}` });
  }
}

export async function deleteClassSubject(req: Request<{ id: string }>, res: Response) {
  try {
    const id = parseInt(req.params.id);
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      const classSubjectModel = new ClassSubjectModel(connection as unknown as typeof pool);
      const classSubject = await classSubjectModel.getClassSubjectById(id);

      if (!classSubject) {
        await connection.rollback();
        return res.status(404).json({ success: false, msg: "Class-Subject entry not found" });
      }

      await connection.query(
        `DELETE ss
         FROM student_subject ss
         INNER JOIN class_student cs ON cs.student_id = ss.student_id
         WHERE cs.class_id = ?
           AND ss.subject_id = ?`,
        [classSubject.class_id, classSubject.subject_id],
      );

      const result = await classSubjectModel.deleteClassSubjectById(id);
      await connection.commit();

      if (result === 0) {
        return res.status(404).json({ success: false, msg: "Class-Subject entry not found" });
      }

      return res.status(200).json({ success: true, msg: "Subject removed from class successfully" });
    } catch (e) {
      await connection.rollback();
      throw e;
    } finally {
      connection.release();
    }
  } catch (e) {
    res.status(500).json({ success: false, msg: `Error: ${e}` });
  }
}
