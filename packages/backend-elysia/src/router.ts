import {Elysia} from 'elysia';
import Auth from './Routes/Auth';
import Chats from './Routes/Chats';
import Comments from './Routes/Comments';
import Medias from './Routes/Medias';
import Notifications from './Routes/Notifications';
import Posts from './Routes/Posts';
import Users from './Routes/Users';

export default new Elysia()
  .use(Auth)
  .use(Chats)
  .use(Comments)
  .use(Medias)
  .use(Notifications)
  .use(Posts)
  .use(Users);
