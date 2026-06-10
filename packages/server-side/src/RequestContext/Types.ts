import type express from 'express';
import type {CookieManager} from './Cookie';

export type RequestContext = {
  req: express.Request;
  res: express.Response;
  helpers: {
    cookieManager: CookieManager;
  };
};
