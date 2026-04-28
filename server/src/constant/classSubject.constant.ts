export interface ClassSubject {
  id: number;
  class_id: number;
  subject_id: number;
  created_at: Date;
  updated_at: Date | null;
}

export type ClassSubjectDTO = {
  class_id: number;
  subject_id: number;
};

export interface ClassSubjectResponse {
  id: number;
  class_id: number;
  subject_id: number;
  code?: string;
  name?: string;
  teacher_id?: number | null;
  teacher_name?: string | null;
}
