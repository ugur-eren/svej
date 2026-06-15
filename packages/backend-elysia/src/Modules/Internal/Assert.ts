import {ErrorCodes} from '@svej/common';
import {ModuleError} from '@/Utils/Error';

export function assertCommentExists<T>(comment: T | null): asserts comment is T {
  if (!comment) {
    throw new ModuleError(ErrorCodes.CommentNotFound);
  }
}

export function assertPostExists<T>(post: T | null): asserts post is T {
  if (!post) {
    throw new ModuleError(ErrorCodes.PostNotFound);
  }
}
