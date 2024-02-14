import {ApiResponse} from 'apisauce';

export type ApiError = {code?: number; error?: object};

export type Response<T> = Promise<ApiResponse<T, ApiError>>;
