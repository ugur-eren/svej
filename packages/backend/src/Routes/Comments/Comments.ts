import {Elysia} from 'elysia';
import {z} from 'zod';
import {onlyAuthenticated} from '@/Plugins';
import {CommentsModule} from '@/Modules/Comments';

export default new Elysia().group('/:commentId', {params: z.object({commentId: z.uuid()})}, (app) =>
  app
    .use(onlyAuthenticated)
    .get('/', async ({session, params: {commentId}}) => {
      return CommentsModule.getById(session.user.id, commentId);
    })
    .patch('/', async ({status}) => {
      // TODO: comment editing
      return status(501, 'Not Implemented');
    })
    .delete('/', async ({status}) => {
      // TODO: comment deletion
      return status(501, 'Not Implemented');
    }),
);
