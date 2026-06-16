import {Zod} from '@svej/common';
import {Elysia} from 'elysia';
import {z} from 'zod';
import {onlyAuthenticated} from '@/Plugins';
import {PostsModule} from '@/Modules/Posts';

export default new Elysia().group(
  '/:postId/reactions',
  {params: z.object({postId: z.uuid()})},
  (app) =>
    app
      .use(onlyAuthenticated)
      .get('/', async ({params: {postId}}) => {
        return PostsModule.getReactionCounts(postId);
      })
      .put(
        '/',
        async ({session, params: {postId}, body: {type}}) => {
          return PostsModule.setReaction(postId, session.user.id, type);
        },
        {
          body: z.object({type: Zod.Reaction.type}),
        },
      )
      .delete('/', async ({session, params: {postId}}) => {
        return PostsModule.setReaction(postId, session.user.id, Zod.Reaction.ALL_TYPES.NONE);
      }),
);
