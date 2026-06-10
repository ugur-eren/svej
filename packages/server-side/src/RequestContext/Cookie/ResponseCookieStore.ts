import {ResponseCookie} from './Types';

/**
 * Mutable collection of cookies to be sent in the response.
 * It allows setting, getting, and deleting cookies (only from the store), as well as iterating over all set cookies.
 * NOTE: This is just a store for cookies to be sent in the response. It does not interact with the actual response object.
 */
export class ResponseCookieStore {
  private cookies: Map<string, ResponseCookie>;

  public [Symbol.iterator]() {
    return this.cookies.values();
  }

  public constructor() {
    this.cookies = new Map<string, ResponseCookie>();
  }

  public get size(): number {
    return this.cookies.size;
  }

  public set(name: string, value: string, options?: Omit<ResponseCookie, 'name' | 'value'>): void {
    this.cookies.set(name, {name, value, ...options});
  }

  public has(name: string): boolean {
    return this.cookies.has(name);
  }

  public get(name: string): ResponseCookie | undefined {
    return this.cookies.get(name);
  }

  public getAll(): ResponseCookie[] {
    return Array.from(this.cookies.values());
  }

  public delete(name: string): boolean {
    return this.cookies.delete(name);
  }
}
