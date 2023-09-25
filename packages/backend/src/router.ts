import express from 'express';

import Auth from './Routes/Auth';
import Post from './Routes/Post';
import User from './Routes/User';
import Comment from './Routes/Comment';

const Router = express.Router();

Router.use('/auth', Auth);
Router.use('/post', Post);
Router.use('/user', User);
Router.use('/comment', Comment);

export default Router;
