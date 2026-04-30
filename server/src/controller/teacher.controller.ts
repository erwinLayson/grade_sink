import { Request, Response } from "express";
import TeacherService from "../service/teachers/teacher.service";
import TeacherModel from "../model/teacher.model";
import UserModel from "../model/user.model";
import { pool } from "../config/dbConnection.config";
import { TeacherDTO } from "../constant/teacher.constant";
import bcrypt from "bcrypt";
import { ROLES } from "../constant/userRole";

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
    const normalizedEmail = email?.trim().toLowerCase();

    if (!normalizedEmail) {
      return res.status(400).json({ success: false, msg: "Email is required" });
    }

    const teacherModel = new TeacherModel(pool);
    const userModel = new UserModel(pool);

    const [existingTeacher, existingUser] = await Promise.all([
      teacherModel.getTeacherByEmail(normalizedEmail),
      userModel.getUserByEmail(normalizedEmail),
    ]);

    if (existingTeacher || existingUser) {
      return res.status(409).json({
        success: false,
        msg: "A teacher or user with this email already exists",
      });
    }

    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const transactionalTeacherModel = new TeacherModel(connection as unknown as typeof pool);
      const transactionalUserModel = new UserModel(connection as unknown as typeof pool);

      const teacherId = await transactionalTeacherModel.createTeacher({
        first_name: first_name ?? null,
        middle_name: middle_name ?? null,
        last_name: last_name ?? null,
        email: normalizedEmail,
      });

      const defaultPassword = await bcrypt.hash("12345", 10);
      const userId = await transactionalUserModel.createUser({
        email: normalizedEmail,
        username: normalizedEmail,
        role: ROLES.TEACHER,
        password: defaultPassword,
      });

      await connection.commit();

      return res.status(201).json({
        success: true,
        msg: "Teacher created successfully",
        data: { teacher_id: teacherId, user_id: userId },
      });
    } catch (e) {
      await connection.rollback();
      throw e;
    } finally {
      connection.release();
    }
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : String(e);
    res.status(500).json({ success: false, msg: `Error: ${errorMessage}` });
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

export async function getMyTeacherProfile(req: Request, res: Response) {
  try {
    const authUser = (req as Request & { user?: { email?: string; role?: string } }).user;

    if (!authUser?.email) {
      return res.status(401).json({ success: false, msg: "Unauthorized" });
    }

    if (authUser.role !== ROLES.TEACHER) {
      return res.status(403).json({ success: false, msg: "Forbidden" });
    }

    const teacherService = new TeacherService(new TeacherModel(pool));
    const userModel = new UserModel(pool);

    const [teacher, user] = await Promise.all([
      teacherService.getTeacherByEmail(authUser.email),
      userModel.getUserByEmail(authUser.email),
    ]);

    if (!teacher || !user) {
      return res.status(404).json({ success: false, msg: "Teacher profile not found" });
    }

    return res.status(200).json({
      success: true,
      data: {
        first_name: teacher.first_name,
        middle_name: teacher.middle_name,
        last_name: teacher.last_name,
        email: user.email,
        username: user.username,
        role: user.role,
      },
    });
  } catch (e) {
    return res.status(500).json({ success: false, msg: `Error: ${e}` });
  }
}

type UpdateTeacherProfileBody = {
  first_name?: string;
  middle_name?: string;
  last_name?: string;
  username?: string;
  email?: string;
  current_password?: string;
  new_password?: string;
  confirm_password?: string;
};

export async function updateMyTeacherProfile(
  req: Request<unknown, unknown, UpdateTeacherProfileBody>,
  res: Response,
) {
  try {
    const authUser = (req as Request & { user?: { email?: string; role?: string } }).user;

    if (!authUser?.email) {
      return res.status(401).json({ success: false, msg: "Unauthorized" });
    }

    if (authUser.role !== ROLES.TEACHER) {
      return res.status(403).json({ success: false, msg: "Forbidden" });
    }

    const {
      first_name,
      middle_name,
      last_name,
      username,
      email,
      current_password,
      new_password,
      confirm_password,
    } = req.body;

    const teacherService = new TeacherService(new TeacherModel(pool));
    const userModel = new UserModel(pool);

    const [teacher, user] = await Promise.all([
      teacherService.getTeacherByEmail(authUser.email),
      userModel.getUserByEmail(authUser.email),
    ]);

    if (!teacher || !user) {
      return res.status(404).json({ success: false, msg: "Teacher profile not found" });
    }

    const hasTeacherChange =
      typeof first_name === "string" ||
      typeof middle_name === "string" ||
      typeof last_name === "string";
    const hasAccountChange =
      typeof username === "string" || typeof email === "string" || typeof new_password === "string";

    if (!hasTeacherChange && !hasAccountChange) {
      return res.status(400).json({ success: false, msg: "No profile changes submitted" });
    }

    if (hasAccountChange) {
      if (!current_password || !current_password.trim()) {
        return res.status(400).json({ success: false, msg: "Current password is required" });
      }

      const isCurrentPasswordValid = await bcrypt.compare(current_password, user.password);
      if (!isCurrentPasswordValid) {
        return res.status(400).json({ success: false, msg: "Current password is incorrect" });
      }
    }

    const teacherUpdate: Partial<TeacherDTO> = {};
    const userUpdate: Partial<{ username: string; email: string; password: string }> = {};

    if (typeof first_name === "string") {
      teacherUpdate.first_name = first_name.trim() || null;
    }

    if (typeof middle_name === "string") {
      teacherUpdate.middle_name = middle_name.trim() || null;
    }

    if (typeof last_name === "string") {
      teacherUpdate.last_name = last_name.trim() || null;
    }

    if (typeof username === "string") {
      const nextUsername = username.trim();
      if (!nextUsername) {
        return res.status(400).json({ success: false, msg: "Username cannot be empty" });
      }

      if (nextUsername !== user.username) {
        const existingUser = await userModel.getUserByUsername(nextUsername);
        if (existingUser && existingUser.id !== user.id) {
          return res.status(409).json({ success: false, msg: "Username is already in use" });
        }

        userUpdate.username = nextUsername;
      }
    }

    if (typeof email === "string") {
      const nextEmail = email.trim().toLowerCase();
      if (!nextEmail) {
        return res.status(400).json({ success: false, msg: "Email cannot be empty" });
      }

      if (nextEmail !== user.email) {
        const existingUser = await userModel.getUserByEmail(nextEmail);
        if (existingUser && existingUser.id !== user.id) {
          return res.status(409).json({ success: false, msg: "Email is already in use" });
        }

        userUpdate.email = nextEmail;
        teacherUpdate.email = nextEmail;
      }
    }

    if (typeof new_password === "string") {
      if (!new_password.trim()) {
        return res.status(400).json({ success: false, msg: "New password cannot be empty" });
      }

      if (new_password.length < 6) {
        return res.status(400).json({ success: false, msg: "New password must be at least 6 characters" });
      }

      if (new_password !== confirm_password) {
        return res.status(400).json({ success: false, msg: "Password confirmation does not match" });
      }

      userUpdate.password = await bcrypt.hash(new_password, 10);
    }

    if (Object.keys(teacherUpdate).length > 0) {
      await teacherService.updateTeacherById(teacher.id, teacherUpdate);
    }

    if (Object.keys(userUpdate).length > 0) {
      await userModel.updateUserById(user.id, userUpdate);
    }

    const latestUser = await userModel.getUserByEmail(userUpdate.email ?? user.email);

    if (!latestUser) {
      return res.status(500).json({ success: false, msg: "Profile updated but refresh failed" });
    }

    return res.status(200).json({
      success: true,
      msg: "Profile updated successfully",
      data: {
        id: latestUser.id,
        username: latestUser.username,
        email: latestUser.email,
        role: latestUser.role,
      },
    });
  } catch (e) {
    return res.status(500).json({ success: false, msg: `Error: ${e}` });
  }
}
