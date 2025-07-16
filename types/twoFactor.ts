export interface TwoFactorAuthDataType {
  code: number;
  message: string;
  result: {
    secret: string;
    url: string;
  };
}
