import express from 'express';

import Hello from './Routes/Hello';

const Router = express.Router();

Router.use('/', Hello);

export default Router;
