import {Elysia} from 'elysia';
import {z} from 'zod';
import {onlyAuthenticated} from '@/Plugins';
import {PostsModule} from '@/Modules/Posts';

export default new Elysia().use(onlyAuthenticated).get(
  '/explore',
  async ({session, query}) => {
    return PostsModule.getExploreFeed(session.user.id, query.cursor);
  },
  {
    query: z.object({
      cursor: z.string().optional(),
    }),
  },
);
