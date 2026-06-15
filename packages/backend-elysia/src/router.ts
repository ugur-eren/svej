import {Elysia} from 'elysia';
import Auth from './Routes/Auth';
import Comments from './Routes/Comments';
import Chat from './Routes/Chat';

export default new Elysia().use(Auth).use(Comments).use(Chat);
