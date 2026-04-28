export interface Student {
  id: number;
  student_id: number;
  first_name: string;
  middle_name: string;
  last_name: string;
  age: number;
  birth_date: string;
  lrn: string;
  sex: string;
  level: string;
  created_at: Date;
  updated_at: Date | null;
}

export type StudentDTO = {
  student_id?: number;
  first_name: string;
  middle_name: string;
  last_name: string;
  age: number;
  birth_date: string;
  lrn: string;
  sex: string;
  level: string;
};

export interface StudentResponse {
  id: number;
  student_id: number;
  first_name: string;
  middle_name: string;
  last_name: string;
  age: number;
  lrn: string;
  level: string;
}
