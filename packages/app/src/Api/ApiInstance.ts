import {HTTPStatus} from '@svej/common';
import type {App} from '@svej/backend';
import {treaty, Treaty} from '@elysia/eden';
import {AuthActions, store} from '@/Redux';
import Storage from '@/Utils/Storage';
import {refresh} from './Endpoints/Auth';
import {DEFAULT_BASE_URL, DEFAULT_HEADERS, fetchWithAuth} from './Utils';

export const createApiInstance = (config?: Treaty.Config) => {
  let isRefreshing = false;
  let failedQueue: {
    resolve: (value: unknown) => void;
    reject: (reason?: unknown) => void;
  }[] = [];

  const processQueue = (error: unknown) => {
    failedQueue.forEach((prom) => {
      if (error) {
        prom.reject(error);
      } else {
        prom.resolve(null);
      }
    });

    failedQueue = [];
  };

  const apiInstance = treaty<App>(DEFAULT_BASE_URL, {
    ...config,
    headers: {
      ...DEFAULT_HEADERS,
      ...config?.headers,
    },
    throwHttpError: false,
    parseDate: false,
    fetcher: async (input, init) => {
      const response = await fetchWithAuth(input, init);

      // Pass through successful responses
      if (response.ok) return response;

      let url = '';
      if (typeof input === 'string') url = input;
      if (input instanceof Request) url = input.url;
      if (input instanceof URL) url = input.toString();

      if (
        url.includes(apiInstance.auth.refresh['~path']) ||
        response.status !== HTTPStatus.Unauthorized
      ) {
        // Do not attempt to refresh the token
        return response;
      }

      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({resolve, reject});
        }).then(() => fetchWithAuth(input, init));
      }

      isRefreshing = true;

      try {
        const refreshToken = await Storage.get('refreshToken');
        if (!refreshToken) {
          await Storage.remove('refreshToken');
          store.dispatch(AuthActions.logout());
          throw new Error('No refresh token available');
        }

        const refreshResponse = await refresh(refreshToken);
        if (refreshResponse.error || !refreshResponse.data) {
          await Storage.remove('refreshToken');
          store.dispatch(AuthActions.logout());
          throw new Error('Failed to refresh access token');
        }

        store.dispatch(
          AuthActions.login({
            accessToken: refreshResponse.data.accessToken,
            user: refreshResponse.data.user,
          }),
        );

        processQueue(null);

        // Retry the original request
        return fetchWithAuth(input, init);
      } catch (refreshError) {
        processQueue(refreshError);

        // Refresh failed
        throw refreshError;
      } finally {
        isRefreshing = false;
      }
    },
  });

  return apiInstance;
};

const ApiInstance = createApiInstance();

export default ApiInstance;
