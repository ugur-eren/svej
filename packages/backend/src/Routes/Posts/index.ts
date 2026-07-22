import {Elysia} from 'elysia';
import Posts from './Posts';
import Comments from './Comments';
import Reactions from './Reactions';

export default new Elysia({prefix: '/posts'}).use(Posts).use(Comments).use(Reactions);
