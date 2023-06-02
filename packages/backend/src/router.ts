import express from 'express';

import User from './Routes/User';

const Router = express.Router();

Router.use('/user', User);

export default Router;
