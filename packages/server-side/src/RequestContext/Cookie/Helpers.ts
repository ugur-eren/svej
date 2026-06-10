import type express from 'express';
import {getRequestContext} from '../RequestContext';

/**
 * A helper function to get all cookies from the current request context.
 * @returns An object containing all cookies.
 */
export function getAllCookies() {
  return getRequestContext().req.cookies;
}

/**
 * A helper function to get a cookie value from the current request context.
 * @param name The name of the cookie to retrieve.
 * @returns The value of the cookie if it exists, otherwise undefined.
 */
export function getCookie(name: string) {
  return getAllCookies()[name];
}

/**
 * A helper function to set a cookie in the current response context.
 * @param name The name of the cookie to set.
 * @param value The value of the cookie to set.
 * @param options Optional cookie options to configure the cookie's behavior (e.g., maxAge, httpOnly, secure).
 */
export function setCookie(name: string, value: string, options?: express.CookieOptions) {
  getRequestContext().res.cookie(name, value, options as express.CookieOptions);
}

/**
 * A helper function to clear a cookie in the current response context.
 *
 * NOTE: Web browsers and other compliant clients will only clear the cookie if the given options
 * is identical to those given when the cookie was set.
 * @param name The name of the cookie to delete.
 * @param options The options to use when clearing the cookie.
 * Must match the options used when the cookie was set for the cookie to be successfully cleared in compliant clients.
 */
export function clearCookie(name: string, options?: express.CookieOptions) {
  getRequestContext().res.clearCookie(name, options as express.CookieOptions);
}
