"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ReportCardModel {
    pool;
    constructor(pool) {
        this.pool = pool;
    }
    async getStudentGradeByClassId(classId) {
        try {
            const sql = `
      SELECT
      s.student_id AS studentId,
      CONCAT_WS(" ", s.first_name, s.middle_name, s.last_name) AS fullName,
      c.name AS className,
      c.section AS classSection,
      c.school_level AS schoolLevel,
      s.lrn AS LRN,
      s.sex AS sex,
      s.age AS age,
      ss.name AS subjectName,
      sg.grade AS grades,
      sg.quarter AS quarter 
      FROM class c 
      LEFT JOIN class_student cs
      ON cs.class_id = c.id
      LEFT JOIN students s
      ON cs.student_id = s.id
      LEFT JOIN student_grades sg
      ON sg.student_id = s.id
      LEFT JOIN class_subjects css
      ON css.class_id = c.id AND css.subject_id = sg.subject_id
      LEFT JOIN subjects ss
      ON css.subject_id = ss.id
      WHERE c.id = ?
      `;
            const [rows] = await this.pool.query(sql, [classId]);
            return rows;
        }
        catch (e) {
            throw new Error(`Error: ${e}`);
        }
    }
}
exports.default = ReportCardModel;
//# sourceMappingURL=reportCard.model.js.map