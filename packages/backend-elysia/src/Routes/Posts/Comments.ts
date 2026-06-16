import {Zod} from '@svej/common';
import {Elysia} from 'elysia';
import {z} from 'zod';
import {onlyAuthenticated} from '@/Plugins';
import {CommentsModule} from '@/Modules/Comments';

export default new Elysia().group(
  '/:postId/comments',
  {params: z.object({postId: z.uuid()})},
  (app) =>
    app
      .use(onlyAuthenticated)
      .get('/', async ({session, params: {postId}}) => {
        return CommentsModule.getByPostId(postId, session.user.id);
      })
      .post(
        '/',
        async ({session, params: {postId}, body: {text}}) => {
          return CommentsModule.create(postId, session.user.id, text);
        },
        {
          body: Zod.Comment.Create,
        },
      ),
);
