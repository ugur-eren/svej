import express from 'express';
import Auth from './Auth';
import Credentials from './Credentials';

const Router = express.Router();

Router.use('/', Auth);
Router.use('/credentials', Credentials);

export default Router;
