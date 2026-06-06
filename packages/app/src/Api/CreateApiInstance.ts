import {ApisauceConfig, create} from 'apisauce';
import Env from '../Utils/Env';
import {store} from '../Redux';
import {ApiError} from './Error';

const DefaultOptions: ApisauceConfig = {
  baseURL: Env.SVEJ_PUBLIC_API_URL,
  timeout: 15_000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
};

export const createApiInstance = (options?: ApisauceConfig) => {
  const ApiInstance = create({
    ...DefaultOptions,
    ...options,

    headers: {
      ...DefaultOptions.headers,
      ...options?.headers,
    },
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

  // Attach access token to all requests
  ApiInstance.addRequestTransform(async (request) => {
    const token = store.getState().auth.accessToken;

    request.headers = {
      ...request.headers,
      Authorization: token ? `Bearer ${token}` : undefined,
    };
  });

  return ApiInstance;
};
