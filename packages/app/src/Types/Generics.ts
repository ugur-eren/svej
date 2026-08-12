/* eslint @typescript-eslint/no-explicit-any: "off" */

export type FirstArgument<T> = T extends (arg1: infer U, ...args: any[]) => any ? U : any;

export type SecondArgument<T> = T extends (arg1: any, arg2: infer U, ...args: any[]) => any
  ? U
  : any;

// Converts a union type to an intersection type (e.g., A | B | C becomes A & B & C)
export type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
  k: infer I,
) => void
  ? I
  : never;
