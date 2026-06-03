import {z} from 'zod';
import Config from '../Config';

export const Message = z
  .string()
  .trim()
  .min(1, 'Message cannot be empty')
  .max(Config.chatMessageMaxLength)
  .refine((message) => message.split(/\r\n|\r|\n/).length <= Config.chatMessageMaxLines, {
    message: 'too_many_lines',
  });

export const SendMessage = z.object({
  toUserId: z.string().uuid(),
  message: Message,
});
