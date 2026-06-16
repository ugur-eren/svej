import {Elysia} from 'elysia';
import Auth from './Routes/Auth';
import Chat from './Routes/Chat';
import Comments from './Routes/Comments';
import Posts from './Routes/Posts';

export default new Elysia().use(Auth).use(Chat).use(Comments).use(Posts);
