/* eslint @typescript-eslint/no-explicit-any: "off" */

export type FirstArgument<T> = T extends (arg1: infer U, ...args: any[]) => any ? U : any;

export type SecondArgument<T> = T extends (arg1: any, arg2: infer U, ...args: any[]) => any
  ? U
  : any;
