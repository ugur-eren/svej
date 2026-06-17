import {Zod} from '@svej/common';
import {Elysia} from 'elysia';
import {z} from 'zod';
import {onlyAuthenticated} from '@/Plugins';
import {CommentsModule} from '@/Modules/Comments';

export default new Elysia().group(
  '/:commentId/reactions',
  // TODO: error code for invalid comment id
  {params: z.object({commentId: z.uuid()})},
  (app) =>
    app
      .use(onlyAuthenticated)
      .get('/', async ({params: {commentId}}) => {
        return CommentsModule.getReactionCounts(commentId);
      })
      .put(
        '/',
        async ({session, params: {commentId}, body: {type}}) => {
          // TODO: move reactions to a separate table and optimize queries
          return CommentsModule.setReaction(session.user.id, commentId, type);
        },
        {
          body: z.object({type: Zod.Reaction.type}),
        },
      )
      .delete('/', async ({session, params: {commentId}}) => {
        return CommentsModule.setReaction(session.user.id, commentId, Zod.Reaction.ALL_TYPES.NONE);
      }),
);
