import {z} from 'zod';
import Config from '../Config';

export const Create = z.object({
  text: z
    .string()
    .trim()
    .max(Config.commentMaxLength)
    .refine((comment) => comment.split(/\r\n|\r|\n/).length <= Config.commentMaxLines, {
      error: `Comment must have less than ${Config.commentMaxLines} lines`,
    }),
});
