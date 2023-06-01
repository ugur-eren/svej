import express from 'express';
import HTTPStatus from '../Utils/HTTPStatus';

const Router = express.Router();

Router.get('/:name', async (req, res) => {
  const {name} = req.params;

  res.status(HTTPStatus.OK).send(`Hello ${name}!`);
});

export default Router;
