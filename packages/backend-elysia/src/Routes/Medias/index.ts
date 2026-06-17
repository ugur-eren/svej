import {Elysia} from 'elysia';
import Medias from './Medias';
import Files from './Files';

export default new Elysia({prefix: '/medias'}).use(Medias).use(Files);
