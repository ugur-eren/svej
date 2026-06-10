import {RequestCookie} from './Types';

/**
 * Read-only collection of cookies from the incoming request. It is designed to be immutable.
 * It provides methods to access cookies by name and to iterate over all cookies.
 */
export class RequestCookieStore {
  private cookies: Map<string, RequestCookie>;

  public [Symbol.iterator]() {
    return this.cookies.values();
  }

  public constructor(cookies?: Record<string, string>) {
    this.cookies = new Map<string, RequestCookie>();
    if (cookies) {
      Object.entries(cookies).forEach(([name, value]) => {
        if (name) this.cookies.set(name, {name, value});
      });
    }
  }

  public get size(): number {
    return this.cookies.size;
  }

  public has(name: string): boolean {
    return this.cookies.has(name);
  }

  public get(name: string): RequestCookie | undefined {
    return this.cookies.get(name);
  }

  public getAll(name?: string): RequestCookie[] {
    if (name) {
      const cookie = this.cookies.get(name);
      return cookie ? [cookie] : [];
    }

    return Array.from(this.cookies.values());
  }
}
