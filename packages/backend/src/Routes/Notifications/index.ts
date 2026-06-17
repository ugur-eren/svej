import {Elysia} from 'elysia';
import Notifications from './Notifications';

export default new Elysia({prefix: '/notifications'}).use(Notifications);
