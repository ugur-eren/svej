import express from 'express';
import {ErrorCodes, HTTPStatus} from 'common';
import {Prisma} from '../Services';
import {onlyAuthorized} from '../Middlewares';

const Router = express.Router();

Router.get('/:id', onlyAuthorized, async (req, res) => {
  const {id} = req.params;

  const user = await Prisma.media.findUnique({where: {id}});

  if (!user) {
    res.status(HTTPStatus.NotFound).send({code: ErrorCodes.UserNotFound});
    return;
  }

  res.status(HTTPStatus.OK).send(user);
});

export default Router;
