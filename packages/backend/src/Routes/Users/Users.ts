import {Elysia} from 'elysia';
import {z} from 'zod';
import {Config, Zod} from '@svej/common';
import {onlyAuthenticated} from '@/Plugins';
import {UsersModule} from '@/Modules/Users';

export default new Elysia()
  .use(onlyAuthenticated)
  .get(
    '/',
    async ({session, query}) => {
      const searchQuery = query.q;
      return UsersModule.search(session.user.id, searchQuery);
    },
    {
      query: z.object({
        q: z.string().trim().min(Config.searchQueryMinLength).max(Config.searchQueryMaxLength),
      }),
    },
  )
  .get(
    '/by-username/:username',
    async ({session, params: {username}}) => {
      return UsersModule.getByUsername(session.user.id, username);
    },
    {
      params: z.object({
        username: Zod.User.username,
      }),
    },
  )
  .get(
    '/:userId',
    async ({session, params: {userId}}) => {
      return UsersModule.getById(session.user.id, userId);
    },
    {
      params: z.object({
        userId: z.uuid(),
      }),
    },
  );
