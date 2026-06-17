import {Elysia} from 'elysia';
import Chats from './Chats';

export default new Elysia({prefix: '/chats'}).use(Chats);
