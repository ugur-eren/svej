/* eslint-disable @typescript-eslint/no-explicit-any */

import {create} from 'apisauce';
import type {Elysia, ELYSIA_FORM_DATA} from 'elysia';
import type {Treaty} from '@elysia/eden';
import type {PROBLEM_CODE, ApisauceConfig, ApisauceInstance} from 'apisauce';
import type {AxiosError, AxiosRequestConfig} from 'axios';

const METHODS = ['get', 'post', 'put', 'delete', 'patch', 'head'] as const;

export class ApiFile {
  public name: string;
  public uri: string;
  public type: string;

  public constructor(opts: {name: string; uri: string; type: string}) {
    this.name = opts.name;
    this.uri = opts.uri;
    this.type = opts.type;
  }
}

type MapFileType<T> = T extends File[] ? ApiFile[] : T extends File ? ApiFile : T;

type SuccessCodes = 200 | 201 | 202 | 203 | 204 | 205 | 206 | 207 | 208 | 226;

export type HEADERS = {[key: string]: string};

export type ApiResponse<TRes extends Record<number, unknown>> =
  | {
      ok: true;
      problem: null;
      originalError: null;

      data: TRes[Extract<keyof TRes, SuccessCodes>] extends {
        [ELYSIA_FORM_DATA]: infer Data;
      }
        ? Data
        : TRes[Extract<keyof TRes, SuccessCodes>];
      status: number;
      headers?: HEADERS;
      config?: AxiosRequestConfig;
      duration?: number;
    }
  | {
      ok: false;
      problem: PROBLEM_CODE;
      originalError: AxiosError<null>;

      data: Exclude<keyof TRes, SuccessCodes> extends never
        ? never
        : {
            [Status in keyof TRes]: TRes[Status] extends {
              [ELYSIA_FORM_DATA]: infer Data;
            }
              ? Data
              : TRes[Status];
          }[Exclude<keyof TRes, SuccessCodes>];
      status: number;
      headers?: HEADERS;
      config?: AxiosRequestConfig;
      duration?: number;
    };

export type RequestConfig<TQuery = Record<string, unknown>> = AxiosRequestConfig & {
  query?: TQuery;
};

export type BuildCustomClient<
  in out TApp extends Elysia<any, any, any, any, any, any, any>,
  in out TRoutes = Treaty.Create<TApp, any>,
> = {
  [K in keyof TRoutes]: TRoutes[K] extends (
    ...args: infer TArgs
  ) => Promise<Treaty.TreatyResponse<infer TRes>>
    ? K extends 'get' | 'head'
      ? (
          options?: NonNullable<TArgs[0]> extends {query?: infer TQuery}
            ? RequestConfig<TQuery>
            : never,
        ) => Promise<ApiResponse<TRes>>
      : undefined extends TArgs[0]
        ? (
            body?: unknown extends TArgs[0]
              ? TArgs[0]
              : {
                  [J in keyof Exclude<TArgs[0], undefined>]: MapFileType<
                    Exclude<TArgs[0], undefined>[J]
                  >;
                },
            options?: NonNullable<TArgs[1]> extends {query?: infer TQuery}
              ? RequestConfig<TQuery>
              : never,
          ) => Promise<ApiResponse<TRes>>
        : (
            body: {[J in keyof TArgs[0]]: MapFileType<TArgs[0][J]>},
            options?: NonNullable<TArgs[1]> extends {query?: infer TQuery}
              ? RequestConfig<TQuery>
              : never,
          ) => Promise<ApiResponse<TRes>>
    : TRoutes[K] extends ((...args: infer TArgs) => infer TReturn) & infer TRest
      ? ((...args: TArgs) => BuildCustomClient<TApp, TReturn>) & BuildCustomClient<TApp, TRest>
      : BuildCustomClient<TApp, TRoutes[K]>;
};

const isFile = (value: any): value is ApiFile => {
  return value instanceof ApiFile;
};

const hasFile = (obj: Record<string, any>) => {
  if (!obj) return false;

  for (const key of Object.keys(obj)) {
    if (isFile(obj[key])) {
      return true;
    }

    if (Array.isArray(obj[key]) && (obj[key] as unknown[]).find(isFile)) {
      return true;
    }
  }

  return false;
};

const shouldStringify = (value: any): boolean => {
  if (typeof value === 'string') return false;
  if (isFile(value)) return false;

  // Objects and Arrays should be stringified
  if (typeof value === 'object' && value !== null) {
    return true;
  }

  return false;
};

const prepareValue = (value: any): any => {
  if (isFile(value)) {
    return {
      uri: value.uri,
      name: value.name,
      type: value.type,
    };
  }

  if (shouldStringify(value)) {
    return JSON.stringify(value);
  }

  return value;
};

const createProxy = (instance: ApisauceInstance, paths = [] as string[]): any => {
  return new Proxy(() => {}, {
    get(_, param: string) {
      if (param === '~path') {
        return `/${paths.join('/')}`;
      }

      if (paths.length === 0 && (param === 'then' || param === 'catch' || param === 'finally')) {
        return undefined;
      }

      return createProxy(instance, [...paths, param]);
    },
    apply(_, __, [body, options]) {
      if (
        !!body &&
        !options &&
        !(typeof body === 'object' && Object.keys(body).length !== 1) &&
        !METHODS.includes(paths.at(-1) as any)
      ) {
        if (typeof body === 'object') {
          return createProxy(instance, [...paths, Object.values(body)[0] as string]);
        }

        return createProxy(instance, paths);
      }

      const methodPaths = [...paths];
      const method = methodPaths.pop() as (typeof METHODS)[number];
      const path = `/${methodPaths.join('/')}`;

      const isGetOrHead = method === 'get' || method === 'head';
      const hasBody = !isGetOrHead && method !== 'delete';

      let requestBody;
      let requestOptions;
      if (isGetOrHead) {
        requestOptions = body ?? {};
      } else {
        requestBody = body;
        requestOptions = options ?? {};
      }

      return (async () => {
        if (typeof requestBody === 'object' && hasFile(requestBody)) {
          const formData = new FormData();

          // FormData is 1 level deep
          Object.entries(requestBody).forEach(([key, field]) => {
            if (Array.isArray(field)) {
              const hasNonFileObjects = field.some(
                (item) => typeof item === 'object' && item !== null && !isFile(item),
              );

              if (hasNonFileObjects) {
                formData.append(key, JSON.stringify(field));
              } else {
                field.forEach((value) => {
                  formData.append(key, prepareValue(value));
                });
              }
            } else {
              formData.append(key, prepareValue(field));
            }
          });

          requestBody = formData;

          requestOptions = {
            ...requestOptions,
            headers: {
              ...requestOptions?.headers,
              'Content-Type': 'multipart/form-data',
            },
          };
        }

        const {query, params, ...restOptions} = requestOptions;

        return instance[method](path, hasBody ? requestBody : {...query, ...params}, {
          ...restOptions,
          params: {...query, ...params},
        });
      })();
    },
  });
};

export const createCustomClient = <const TApp extends Elysia<any, any, any, any, any, any, any>>(
  config: ApisauceConfig,
): {instance: ApisauceInstance; client: BuildCustomClient<TApp>} => {
  const instance = create(config);

  const proxy = createProxy(instance, []);

  return {instance, client: proxy};
};
