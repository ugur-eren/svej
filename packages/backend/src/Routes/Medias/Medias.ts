import {Elysia} from 'elysia';
import {z} from 'zod';
import {onlyAuthenticated} from '@/Plugins';
import {MediasModule} from '@/Modules/Medias';

export default new Elysia().use(onlyAuthenticated).get(
  '/:mediaId',
  async ({session, params: {mediaId}}) => {
    return MediasModule.getById(session.user.id, mediaId);
  },
  {
    params: z.object({
      mediaId: z.uuid(),
    }),
  },
);
