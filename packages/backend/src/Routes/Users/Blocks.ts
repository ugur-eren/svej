import {Elysia} from 'elysia';
import {z} from 'zod';
import {onlyAuthenticated} from '@/Plugins';
import {UsersModule} from '@/Modules/Users';

export default new Elysia()
  .use(onlyAuthenticated)
  .get(
    '/me/blocks',
    async ({session, query}) => {
      return UsersModule.getBlockedUsers(session.user.id, query.cursor);
    },
    {
      query: z.object({
        cursor: z.string().optional(),
      }),
    },
  )
  .group('/me/blocks/:userId', {params: z.object({userId: z.uuid()})}, (app) =>
    app
      .post('/', async ({session, params: {userId}}) => {
        return UsersModule.block(session.user.id, userId);
      })
      .delete('/', async ({session, params: {userId}}) => {
        return UsersModule.unblock(session.user.id, userId);
      }),
  );
