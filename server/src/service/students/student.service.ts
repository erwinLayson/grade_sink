import StudentModel from "../../model/student.model";
import { StudentDTO, StudentResponse } from "../../constant/student.constant";

export type ImportRowStatus = "valid" | "duplicate" | "conflict" | "invalid";

export interface NormalizedStudentImportRow {
  student_id?: number;
  first_name?: string;
  middle_name?: string;
  last_name?: string;
  age?: number;
  birth_date?: string;
  lrn?: string;
  sex?: string;
  level?: string;
}

export interface ImportPreviewRow {
  row: number;
  raw: Record<string, unknown>;
  normalized: NormalizedStudentImportRow;
  status: ImportRowStatus;
  valid: boolean;
  issues: string[];
}

export interface ImportSummary {
  inserted: number;
  duplicates: number;
  conflicts: number;
  skipped: number;
}

class StudentService {
  constructor(private studentModel: StudentModel) { }
  
  async createStudent(data: StudentDTO): Promise<number> {
    try {
      const studentId = await this.studentModel.createStudent(data);
      return studentId;
    } catch (e) {
      throw new Error(`Error: ${e}`);
    }
  }

  async getAllStudents(): Promise<StudentResponse[]> {
    try {
      const students = await this.studentModel.getAllStudents();
      return students.map(student => ({
        id: student.id,
        student_id: student.student_id,
        first_name: student.first_name,
        middle_name: student.middle_name,
        last_name: student.last_name,
        age: student.age,
        lrn: student.lrn,
        level: student.level
      }));
    } catch (e) {
      console.log(`Error ${e}`);
      throw new Error(`Error: ${e}`);  
    }
  }

  async getStudentById(id: number): Promise<StudentResponse | null> {
    try {
      const student = await this.studentModel.getStudentById(id);

      if (!student) {
        return null;
      }

      return {
        id: student.id,
        student_id: student.student_id,
        first_name: student.first_name,
        middle_name: student.middle_name,
        last_name: student.last_name,
        age: student.age,
        lrn: student.lrn,
        level: student.level
      };
    } catch (e) {
      console.log(`Error ${e}`);
      throw new Error(`Error: ${e}`);  
    }
  }

  async getStudentByStudentId(student_id: number): Promise<StudentResponse | null> {
    try {
      const student = await this.studentModel.getStudentByStudentId(student_id);

      if (!student) {
        return null;
      }

      return {
        id: student.id,
        student_id: student.student_id,
        first_name: student.first_name,
        middle_name: student.middle_name,
        last_name: student.last_name,
        age: student.age,
        lrn: student.lrn,
        level: student.level
      };
    } catch (e) {
      console.log(`Error ${e}`);
      throw new Error(`Error: ${e}`);  
    }
  }

  async getStudentByLrn(lrn: string): Promise<StudentResponse | null> {
    try {
      const student = await this.studentModel.getStudentByLrn(lrn);

      if (!student) {
        return null;
      }

      return {
        id: student.id,
        student_id: student.student_id,
        first_name: student.first_name,
        middle_name: student.middle_name,
        last_name: student.last_name,
        age: student.age,
        lrn: student.lrn,
        level: student.level
      };
    } catch (e) {
      console.log(`Error ${e}`);
      throw new Error(`Error: ${e}`);  
    }
  }

  async updateStudentById(id: number, data: Partial<StudentDTO>): Promise<number> {
    try {
      const result = await this.studentModel.updateStudentById(id, data);
      return result;
    } catch (e) {
      throw new Error(`Error: ${e}`);
    }
  }

  async deleteStudentById(id: number): Promise<number> {
    try {
      const result = await this.studentModel.deleteStudentById(id);
      return result;
    } catch (e) {
      throw new Error(`Error: ${e}`);
    }
  }

  async importStudents(rows: NormalizedStudentImportRow[]): Promise<{ summary: ImportSummary; skipped: Array<{ row: NormalizedStudentImportRow; reason: string }> }> {
    try {
      let inserted = 0;
      let duplicates = 0;
      let conflicts = 0;
      const skipped: Array<{ row: NormalizedStudentImportRow; reason: string }> = [];

      for (const r of rows) {
        const studentId = r.student_id ?? null;
        const lrn = r.lrn ? String(r.lrn).trim() : null;

        const studentMatch = studentId !== null ? await this.studentModel.getStudentByStudentId(studentId) : null;
        const lrnMatch = lrn ? await this.studentModel.getStudentByLrn(lrn) : null;

        if (studentMatch && lrnMatch && studentMatch.id !== lrnMatch.id) {
          conflicts++;
          skipped.push({ row: r, reason: "conflict: student_id and lrn point to different existing students" });
          continue;
        }

        if (studentMatch || lrnMatch) {
          duplicates++;
          skipped.push({ row: r, reason: "duplicate" });
          continue;
        }

        const dto: StudentDTO = {
          first_name: r.first_name ?? "",
          middle_name: r.middle_name ?? "",
          last_name: r.last_name ?? "",
          age: r.age ?? 0,
          birth_date: r.birth_date ?? "",
          lrn: r.lrn ?? "",
          sex: r.sex ?? "",
          level: r.level ?? "",
          ...(studentId !== null ? { student_id: studentId } : {}),
        };

        await this.studentModel.createStudent(dto);
        inserted++;
      }

      return {
        summary: { inserted, duplicates, conflicts, skipped: skipped.length },
        skipped,
      };
    } catch (e) {
      throw new Error(`Error importing students: ${e}`);
    }
  }
}

export default StudentService;
