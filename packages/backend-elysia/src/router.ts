import {Elysia} from 'elysia';
import Auth from './Routes/Auth';
import Chats from './Routes/Chats';
import Comments from './Routes/Comments';
import Posts from './Routes/Posts';
import Users from './Routes/Users';
import Notifications from './Routes/Notifications';

export default new Elysia()
  .use(Auth)
  .use(Chats)
  .use(Comments)
  .use(Posts)
  .use(Users)
  .use(Notifications);
