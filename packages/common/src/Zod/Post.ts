import {z} from 'zod';
import Config from '../Config';

export const Create = z.object({
  description: z
    .string()
    .trim()
    .max(Config.postDescriptionMaxLength)
    .refine((desc) => desc.split(/\r\n|\r|\n/).length <= Config.postDescriptionMaxLines, {
      message: `Description must have less than ${Config.postDescriptionMaxLines} lines`,
    })
    .optional(),
});
