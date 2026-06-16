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
      return PostsModule.create(session.user.id, medias, description);
    },
    {
      body: Zod.Post.Create.extend({
        medias: z
          .array(
            z
              .file()
              .max(Config.maxFileSize)
              .refine((file) => fileType(file, ['image', 'video'])),
          )
          .min(0)
          .max(Config.maxMediasPerPost),
      }),
    },
  )
  .group('/:postId', {params: z.object({postId: z.uuid()})}, (app) =>
    app
      .get('/', async ({session, params: {postId}}) => {
        return PostsModule.getById(postId, session.user.id);
      })
      .patch('/', async ({status}) => {
        // TODO: post editing
        return status(501, 'Not Implemented');
      })
      .delete('/', async ({status}) => {
        // TODO: post deletion
        return status(501, 'Not Implemented');
      }),
  );
