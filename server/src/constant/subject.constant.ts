export interface Subject {
  id: number;
  code: string;
  name: string;
  created_at: Date;
  updated_at: Date | null;
}

export type SubjectDTO = {
  code: string;
  name: string;
};

export interface SubjectResponse {
  id: number;
  code: string;
  name: string;
}
