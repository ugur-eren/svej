import type {CookieOptions} from 'express';
import {RequestCookieStore} from './RequestCookieStore';
import {ResponseCookieStore} from './ResponseCookieStore';
import {RequestCookie, ResponseCookie} from './Types';
import {getAllCookies, setCookie, clearCookie} from './Helpers';

/**
 * A utility class for managing cookies in the context of an Express request.
 * It provides methods to set, get, and delete cookies,
 * while ensuring that all operations are performed within the correct request context.
 */
export class CookieManager {
  private requestCookies: RequestCookieStore;
  private responseCookies: ResponseCookieStore;

  public constructor() {
    this.requestCookies = new RequestCookieStore(getAllCookies());
    this.responseCookies = new ResponseCookieStore();
  }

  /**
   * Returns the total number of cookies, including both request and response cookies (set during the current request).
   */
  public get size(): number {
    return this.responseCookies.size + this.requestCookies.size;
  }

  /**
   * Sets a cookie in the response.
   */
  public set(name: string, value: string, options?: Omit<ResponseCookie, 'name' | 'value'>): void {
    this.responseCookies.set(name, value, options);

    setCookie(name, value, options as CookieOptions);
  }

  /**
   * Checks if a cookie with the given name exists in either the request or the response cookies.
   * @param name The name of the cookie to check for existence.
   */
  public has(name: string): boolean {
    return this.responseCookies.has(name) || this.requestCookies.has(name);
  }

  /**
   * Retrieves a cookie by name, checking both the response cookies (set during the current request) and the request cookies.
   * @param name The name of the cookie to retrieve.
   * @returns The cookie if found, otherwise undefined.
   */
  public get(name: string): RequestCookie | ResponseCookie | undefined {
    return this.responseCookies.get(name) || this.requestCookies.get(name);
  }

  /**
   * Retrieves all cookies, including both request cookies and response cookies (set during the current request).
   * @returns An array of all cookies.
   */
  public getAll(): (RequestCookie | ResponseCookie)[] {
    return [...this.requestCookies.getAll(), ...this.responseCookies.getAll()];
  }

  /**
   * Deletes an already set response cookie by name.
   * It also clears the cookie from the response using Express's clearCookie method.
   * This method is intended to be used for cookies that have been set during the current request.
   * @param name The name of the cookie to delete.
   * @returns True if the cookie was found and deleted, false otherwise.
   */
  public deleteExisting(name: string): boolean {
    const entry = this.responseCookies.get(name);
    if (!entry) return false;

    const {name: _name, value: _value, ...options} = entry;

    this.responseCookies.delete(name);
    clearCookie(name, options);
    return true;
  }

  /**
   * Deletes a cookie by name, regardless of whether it was set in the request or response cookies.
   *
   * NOTE: Web browsers and other compliant clients will only clear the cookie if the given options
   * is identical to those given when the cookie was set.
   * @param name The name of the cookie to delete.
   * @param options The options to use when clearing the cookie.
   * Must match the options used when the cookie was set for the cookie to be successfully cleared in compliant clients.
   */
  public delete(name: string, options?: CookieOptions): void {
    clearCookie(name, options);
  }
}
