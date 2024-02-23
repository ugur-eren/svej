import {ApisauceConfig, PROBLEM_CODE, create} from 'apisauce';
import Env from '../Utils/Env';
import Storage from '../Utils/Storage';

const ApiOptions: ApisauceConfig = {
  baseURL: Env.SVEJ_PUBLIC_API_URL,
  timeout: 15000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
};

const ApiInstance = create(ApiOptions);

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

ApiInstance.addAsyncRequestTransform(async (request) => {
  const token = await Storage.get('token');

  request.headers = {
    ...request.headers,
    Authorization: `Bearer ${token}`,
  };
});

ApiInstance.addResponseTransform((response) => {
  if (!response.ok) {
    throw new ApiError(
      response.originalError.message,
      response.problem,
      response.data?.code,
      response.data?.error,
    );
  }
});

export default ApiInstance;
