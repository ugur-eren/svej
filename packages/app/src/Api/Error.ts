export const PROBLEM_CODE = {
  TIMEOUT_ERROR: 'TIMEOUT_ERROR',
  CONNECTION_ERROR: 'CONNECTION_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR',
  CANCEL_ERROR: 'CANCEL_ERROR',
  CLIENT_ERROR: 'CLIENT_ERROR',
  SERVER_ERROR: 'SERVER_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
} as const;
export type PROBLEM_CODE = (typeof PROBLEM_CODE)[keyof typeof PROBLEM_CODE];

export class ApiError extends Error {
  public message: string;
  public problemCode: PROBLEM_CODE;
  public code?: string;
  public error?: object;

  constructor(message: string, problemCode: PROBLEM_CODE, code?: string, error?: object) {
    super(message);

    this.message = message;
    this.problemCode = problemCode;
    this.code = code;
    this.error = error;
  }
}
