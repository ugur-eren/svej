import {Elysia, fileType} from 'elysia';
import {z} from 'zod';
import {Config, Zod} from '@svej/common';
import {onlyAuthenticated} from '@/Plugins';
import {PostsModule} from '@/Modules/Posts';

export default new Elysia()
  .use(onlyAuthenticated)
  .post(
    '/',
    async ({session, body: {medias, description}}) => {
      return PostsModule.create(session.user.id, medias ?? [], description);
    },
    {
      body: Zod.Post.Metadata.extend({
        medias: z.preprocess(
          // eslint-disable-next-line no-nested-ternary
          (val) => (!val ? val : Array.isArray(val) ? val : [val]),
          z
            .array(
              z
                .file()
                .max(Config.maxFileSize)
                .refine((file) => fileType(file, ['image', 'video'])),
            )
            .min(0)
            .max(Config.maxMediasPerPost)
            .optional(),
        ),
      }),
    },
  )
  .group('/:postId', {params: z.object({postId: z.uuid()})}, (app) =>
    app
      .get('/', async ({session, params: {postId}}) => {
        return PostsModule.getById(session.user.id, postId);
      })
      .patch(
        '/',
        async ({session, params: {postId}, body: {description}}) => {
          return PostsModule.update(session.user.id, postId, description);
        },
        {
          body: Zod.Post.Metadata,
        },
      )
      .delete('/', async ({status, session, params: {postId}}) => {
        await PostsModule.delete(session.user.id, postId);
        return status(204, {});
      }),
  );
