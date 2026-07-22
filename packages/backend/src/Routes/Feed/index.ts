import {Elysia} from 'elysia';
import Feed from './Feed';

export default new Elysia({prefix: '/feed'}).use(Feed);
