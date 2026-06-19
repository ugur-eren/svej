import {Elysia} from 'elysia';
import {z} from 'zod';
import {onlyAuthenticated} from '@/Plugins';
import {NotificationsModule} from '@/Modules/Notifications';

export default new Elysia()
  .use(onlyAuthenticated)
  .get('/', async ({session}) => {
    return NotificationsModule.getAll(session.user.id);
  })
  .get('/count', async ({session}) => {
    const count = await NotificationsModule.getUnreadCount(session.user.id);
    return {count};
  })
  .get(
    '/:notificationId',
    async ({session, params: {notificationId}}) => {
      return NotificationsModule.getById(session.user.id, notificationId);
    },
    {
      params: z.object({
        notificationId: z.uuid(),
      }),
    },
  );
