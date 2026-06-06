import {HTTPStatus} from '@svej/common';
import {AuthActions, store} from '../Redux';
import Storage from '../Utils/Storage';
import {createApiInstance} from './CreateApiInstance';
import {refresh} from './Auth/Auth';

const ApiInstance = createApiInstance();

//
// Access Token Management
//

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

// Access Token Response interceptor
ApiInstance.axiosInstance.interceptors.response.use(
  (response) => response, // Pass through successful responses
  async (error) => {
    const originalRequest = error.config;

    if (
      !originalRequest.url?.includes('/api/auth/session') &&
      error.response?.status === HTTPStatus.Unauthorized &&
      !originalRequest._retry
    ) {
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({resolve, reject});
        })
          .then(() => {
            return ApiInstance.any(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = await Storage.get('refreshToken');
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        const response = await refresh(refreshToken);
        if (!response.ok || !response.data) {
          throw new Error('Failed to refresh access token');
        }

        store.dispatch(AuthActions.setAuthenticated(true));
        store.dispatch(AuthActions.setAccessToken(response.data.accessToken));
        store.dispatch(AuthActions.setUser(response.data.user));

        processQueue(null);
        isRefreshing = false;

        // Retry the original request
        return ApiInstance.any(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);
        isRefreshing = false;

        // Refresh failed
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default ApiInstance;
