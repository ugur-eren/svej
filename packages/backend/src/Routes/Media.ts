import express from 'express';
import {ErrorCodes, HTTPStatus} from 'common';
import {Prisma} from '../Services';
import {onlyAuthorized} from '../Middlewares';

const Router = express.Router();

Router.get('/:id', onlyAuthorized, async (req, res) => {
  const {id} = req.params;

  const media = await Prisma.media.findUnique({where: {id}});

  if (!media) {
    res.status(HTTPStatus.NotFound).send({code: ErrorCodes.MediaNotFound});
    return;
  }

  res.status(HTTPStatus.OK).send(media);
});

export default Router;
