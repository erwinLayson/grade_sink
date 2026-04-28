export interface ClassStudent {
  id: number;
  student_id: number;
  class_id: number;
  create_at: Date;
  updated_at: Date | null;
}

export type ClassStudentDTO = {
  student_id: number;
  class_id: number;
};

export interface ClassStudentResponse {
  id: number;
  student_id: number;
  class_id: number;
}
