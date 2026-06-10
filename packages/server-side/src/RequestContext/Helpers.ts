import {getRequestContext} from './RequestContext';

export function cookies() {
  return getRequestContext().helpers.cookieManager;
}
