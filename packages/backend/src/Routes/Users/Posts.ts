import {Elysia} from 'elysia';
import {z} from 'zod';
import {onlyAuthenticated} from '@/Plugins';
import {PostsModule} from '@/Modules/Posts';

export default new Elysia().group('/:userId', {params: z.object({userId: z.uuid()})}, (app) =>
  app.use(onlyAuthenticated).get(
    '/posts',
    async ({session, query, params: {userId}}) => {
      return PostsModule.getByUserId(session.user.id, userId, query.cursor);
    },
    {
      query: z.object({
        cursor: z.string().optional(),
      }),
    },
  ),
);
