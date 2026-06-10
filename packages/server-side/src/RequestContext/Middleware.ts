/* eslint-disable @typescript-eslint/no-explicit-any */

import type express from 'express';
import type * as core from 'express-serve-static-core';
import {RequestContextStorage} from './RequestContext';
import {CookieManager} from './Cookie';

export const RequestContextMiddleware = async <
  P = core.ParamsDictionary,
  ResBody = any,
  ReqBody = any,
  ReqQuery = core.Query,
  LocalsObj extends Record<string, any> = Record<string, any>,
>(
  req: express.Request<P, ResBody, ReqBody, ReqQuery>,
  res: express.Response<ResBody, LocalsObj>,
  next: express.NextFunction,
): Promise<void> => {
  if (!RequestContextStorage.getStore()) {
    let cookieManager: CookieManager | undefined;
    const helpers = {
      get cookieManager() {
        if (!cookieManager) {
          cookieManager = new CookieManager();
        }

        return cookieManager;
      },
    };

    RequestContextStorage.run({req: req as any, res: res as any, helpers}, next);
  } else {
    next();
  }
};
