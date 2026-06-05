/* eslint-disable @typescript-eslint/no-explicit-any */

import {AsyncLocalStorage} from 'node:async_hooks';
import {RequestContext} from './Types';

const STORAGE_KEY = Symbol.for('@svej/request-context/storage');
(globalThis as any)[STORAGE_KEY] = (globalThis as any)[STORAGE_KEY] ?? new AsyncLocalStorage();

export const RequestContextStorage: AsyncLocalStorage<RequestContext> = (globalThis as any)[
  STORAGE_KEY
];

/**
 * A helper function to get the current request context, which includes the Express request and response objects.
 * This function will throw an error if it is called outside of a valid request context,
 * so it should only be used within the scope of an Express request handler that has been wrapped with the RequestContextMiddleware.
 * @returns The current request context containing the Express request and response objects.
 */
export function getRequestContext() {
  const context = RequestContextStorage.getStore();

  if (!context) {
    throw new Error(
      'No request context available. Make sure to use RequestContextMiddleware in your Express app.',
    );
  }

  return context;
}
