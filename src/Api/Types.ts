import {ApiResponse} from 'apisauce';

// TODO: Add your own error type here
export type ApiError = {code: number} & Record<string, string[]>;

export type Response<T> = Promise<ApiResponse<T, ApiError>>;
