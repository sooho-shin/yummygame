export interface IResponse<T> {
  code: number;
  message: string;
  result: T;
}
