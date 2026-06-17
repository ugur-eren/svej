import {Config, Zod} from '@svej/common';
import {Elysia, fileType} from 'elysia';
import {z} from 'zod';
import {onlyAuthenticated} from '@/Plugins';
import {UsersModule} from '@/Modules/Users';

export default new Elysia({prefix: '/me'})
  .use(onlyAuthenticated)
  .get('/', async ({session}) => {
    return UsersModule.getViewer(session.user.id);
  })
  .patch(
    '/',
    async ({session, body}) => {
      return UsersModule.updateViewer(session.user.id, body);
    },
    {body: Zod.User.Edit},
  )
  .put(
    '/profile-photo',
    async ({session, body: {media}}) => {
      return UsersModule.changeViewerProfilePhoto(session.user.id, media);
    },
    {
      body: z.object({
        media: z
          .file()
          .max(Config.maxFileSize)
          .refine((file) => fileType(file, 'image')),
      }),
    },
  )
  .put(
    '/cover-photo',
    async ({session, body: {media}}) => {
      return UsersModule.changeViewerCoverPhoto(session.user.id, media);
    },
    {
      body: z.object({
        media: z
          .file()
          .max(Config.maxFileSize)
          .refine((file) => fileType(file, 'image')),
      }),
    },
  );
