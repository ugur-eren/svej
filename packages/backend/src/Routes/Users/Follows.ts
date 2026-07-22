import {Elysia} from 'elysia';
import {z} from 'zod';
import {onlyAuthenticated} from '@/Plugins';
import {UsersModule} from '@/Modules/Users';

export default new Elysia()
  .group('/:userId', {params: z.object({userId: z.uuid()})}, (app) =>
    app
      .use(onlyAuthenticated)
      .get(
        '/followers',
        async ({session, query, params: {userId}}) => {
          return UsersModule.getFollowers(session.user.id, userId, query.cursor);
        },
        {
          query: z.object({
            cursor: z.string().optional(),
          }),
        },
      )
      .get(
        '/following',
        async ({session, query, params: {userId}}) => {
          return UsersModule.getFollowing(session.user.id, userId, query.cursor);
        },
        {
          query: z.object({
            cursor: z.string().optional(),
          }),
        },
      ),
  )
  .group('/me/following/:userId', {params: z.object({userId: z.uuid()})}, (app) =>
    app
      .use(onlyAuthenticated)
      .post('/', async ({session, params: {userId}}) => {
        return UsersModule.follow(session.user.id, userId);
      })
      .delete('/', async ({session, params: {userId}}) => {
        return UsersModule.unfollow(session.user.id, userId);
      }),
  );
