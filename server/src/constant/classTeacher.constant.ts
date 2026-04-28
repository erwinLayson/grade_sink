export interface ClassTeacher {
  id: number;
  class_id: number;
  teacher_id: number;
  create_at: Date;
  updated_at: Date | null;
}

export type ClassTeacherDTO = {
  class_id: number;
  teacher_id: number;
};

export interface ClassTeacherResponse {
  id: number;
  class_id: number;
  teacher_id: number;
}
