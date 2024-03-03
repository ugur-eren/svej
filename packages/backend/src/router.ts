import express from 'express';

import Auth from './Routes/Auth';
import Post from './Routes/Post';
import User from './Routes/User';
import Comment from './Routes/Comment';
import Media from './Routes/Media';
import File from './Routes/File';
import Notification from './Routes/Notification';
import Chat from './Routes/Chat';

const Router = express.Router();

Router.use('/auth', Auth);
Router.use('/post', Post);
Router.use('/user', User);
Router.use('/comment', Comment);
Router.use('/media', Media);
Router.use('/file', File);
Router.use('/notification', Notification);
Router.use('/chat', Chat);

export default Router;
