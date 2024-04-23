export interface IUploadResponse {
  message: string;
  originFileHash: string;
  errorFileHash: string;
  headers: IHeader[];
  records: IRecord[];
  total: number;
  error: number;
  success: number;
}

export interface IHeader {
  name: string;
  title: string;
  required: boolean;
  received: boolean;
}

export interface IRecord {
  email: string;
  firstName: string;
  middleName: string;
  lastName: string;
  h21ProLogin: number;
  password: string;
}
