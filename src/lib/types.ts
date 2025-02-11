export interface Statement {
  id: string;
  name: string;
  size: number;
  created_at: string;
  lastname?: string;
  dob?: number;
  phone_number?: string;
  file_path?: string;
  file_url?: string;
}

export interface StatementUpload {
  name: string;
  content: ArrayBuffer;
  size: number;
}

export interface SearchParams {
  lastname: string;
  dob: string;
  phone_number?: string;
}