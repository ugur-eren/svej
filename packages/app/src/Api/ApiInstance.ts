import {ApisauceConfig, create} from 'apisauce';
import Env from '../Utils/Env';

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
  public cause: string;
  public code?: string;
  public error?: object;

  constructor(message: string, cause: string, code?: string, error?: object) {
    super(message);

    this.message = message;
    this.cause = cause;
    this.code = code;
    this.error = error;
  }
}

ApiInstance.addResponseTransform((response) => {
  if (!response.ok) {
    throw new ApiError(
      response.originalError.message,
      response.problem,
      response.data.code,
      response.data.error,
    );
  }
});

export default ApiInstance;
