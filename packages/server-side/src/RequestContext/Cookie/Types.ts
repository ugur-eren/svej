import type express from 'express';

export interface CookieItem extends express.CookieOptions {
  /** The name of the cookie. */
  name: string;
  /** The value of the cookie. */
  value: string;
}

export type RequestCookie = Pick<CookieItem, 'name' | 'value'>;
export type ResponseCookie = CookieItem;
