import {Elysia} from 'elysia';
import {onlyAuthenticated} from '@/Plugins';
import {PostsModule} from '@/Modules/Posts';

export default new Elysia().use(onlyAuthenticated).get('/explore', async ({session}) => {
  return PostsModule.getExploreFeed(session.user.id);
});
