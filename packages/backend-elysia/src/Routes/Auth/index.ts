import {Elysia} from 'elysia';
import Auth from './Auth';
import Credentials from './Credentials';

export default new Elysia({prefix: '/auth'}).use(Auth).use(Credentials);
