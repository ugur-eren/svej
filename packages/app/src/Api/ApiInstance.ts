import {HTTPStatus} from '@svej/common';
import type {App} from '@svej/backend';
import {AuthActions, store} from '@/Redux';
import Storage from '@/Utils/Storage';
import {refresh} from './Endpoints/Auth';
import {DEFAULT_BASE_URL, DEFAULT_HEADERS} from './Utils';
import {createCustomClient} from './CustomClient';

const {instance, client} = createCustomClient<App>({
  baseURL: DEFAULT_BASE_URL,
  headers: DEFAULT_HEADERS,
  timeout: 15_000,
});

// Attach access token to all requests
instance.axiosInstance.interceptors.request.use(async (request) => {
  const token = store.getState().auth.accessToken;

  if (token) {
    request.headers.set('Authorization', `Bearer ${token}`);
  }

  return request;
});

// Auto refresh access token on 401 responses
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

instance.axiosInstance.interceptors.response.use(
  (response) => response, // Pass through successful responses
  async (error) => {
    const originalRequest = error.config;

    if (
      originalRequest.url?.includes(client.auth.refresh['~path']) ||
      error.response?.status !== HTTPStatus.Unauthorized ||
      originalRequest._retry
    ) {
      throw error;
    }

    if (isRefreshing) {
      // If already refreshing, queue this request
      return new Promise((resolve, reject) => {
        failedQueue.push({resolve, reject});
      }).then(() => {
        return instance.any(originalRequest);
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const refreshToken = await Storage.get('refreshToken');
      if (!refreshToken) {
        await Storage.remove('refreshToken');
        store.dispatch(AuthActions.logout());
        throw new Error('No refresh token available');
      }

      const refreshResponse = await refresh(refreshToken);
      if (!refreshResponse.ok || !refreshResponse.data) {
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
      return instance.any(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError);

      // Refresh failed
      throw refreshError;
    } finally {
      isRefreshing = false;
    }
  },
);

const ApiInstance = client;

export default ApiInstance;
