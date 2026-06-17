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

export function assertUserExists<T>(user: T | null): asserts user is T {
  if (!user) {
    throw new ModuleError(ErrorCodes.UserNotFound);
  }
}

export function assertNotificationExists<T>(notification: T | null): asserts notification is T {
  if (!notification) {
    throw new ModuleError(ErrorCodes.NotificationNotFound);
  }
}

export function assertConversationExists<T>(conversation: T | null): asserts conversation is T {
  if (!conversation) {
    throw new ModuleError(ErrorCodes.ConversationNotFound);
  }
}

export function assertMediaExists<T>(media: T | null): asserts media is T {
  if (!media) {
    throw new ModuleError(ErrorCodes.MediaNotFound);
  }
}
