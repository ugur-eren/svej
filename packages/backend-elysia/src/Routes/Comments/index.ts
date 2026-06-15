import {Elysia} from 'elysia';
import Comments from './Comments';
import Reactions from './Reactions';

export default new Elysia({prefix: '/comments'}).use(Comments).use(Reactions);
