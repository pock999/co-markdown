export interface ApiResponse<T> {
  message: string;
  code: string;
  httpStatus: number;
  data: T;
}