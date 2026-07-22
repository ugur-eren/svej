import {ErrorCodesKeys} from '@svej/common';

export class ModuleError extends Error {
  public constructor(
    public code: ErrorCodesKeys,
    message?: string,
  ) {
    super(message ?? code);
  }
}
