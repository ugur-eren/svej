import {Request} from 'express';

interface ParamsDictionary {
  [key: string]: string;
}

export type ReqBody<Req extends Record<PropertyKey, any>> = Request<
  ParamsDictionary,
  any,
  Partial<Req>
>;
