import {PROBLEM_CODE} from 'apisauce';

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
