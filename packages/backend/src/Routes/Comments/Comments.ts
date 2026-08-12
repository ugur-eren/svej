import {Zod} from '@svej/common';
import {Elysia} from 'elysia';
import {z} from 'zod';
import {onlyAuthenticated} from '@/Plugins';
import {CommentsModule} from '@/Modules/Comments';

export default new Elysia().group('/:commentId', {params: z.object({commentId: z.uuid()})}, (app) =>
  app
    .use(onlyAuthenticated)
    .get('/', async ({session, params: {commentId}}) => {
      return CommentsModule.getById(session.user.id, commentId);
    })
    .patch(
      '/',
      async ({session, params: {commentId}, body: {text}}) => {
        return CommentsModule.update(session.user.id, commentId, text);
      },
      {
        body: Zod.Comment.Content,
      },
    )
    .delete('/', async ({status, session, params: {commentId}}) => {
      await CommentsModule.delete(session.user.id, commentId);
      return status(204, undefined);
    }),
);
