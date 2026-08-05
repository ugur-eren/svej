import {Elysia} from 'elysia';
import Users from './Users';
import Me from './Me';
import Follows from './Follows';
import Posts from './Posts';
import Blocks from './Blocks';

export default new Elysia({prefix: '/users'})
  .use(Users)
  .use(Me)
  .use(Follows)
  .use(Posts)
  .use(Blocks);
