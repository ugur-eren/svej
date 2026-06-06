import express from 'express';
import {JWTAuth} from '@svej/server-side';
import {ErrorCodes, HTTPStatus} from '@svej/common';
import {onlyAuthorized} from '../../Middlewares';

const Router = express.Router();

Router.post('/logout', onlyAuthorized, async (req, res) => {
  await JWTAuth.logout();

  res.status(HTTPStatus.OK).send({ok: true});
});

Router.post('/refresh', async (req, res) => {
  const result = await JWTAuth.rotateTokens();

  if (!result) {
    res.status(HTTPStatus.Unauthorized).send({code: ErrorCodes.InvalidAuthToken});
    return;
  }

  res.status(HTTPStatus.OK).send({accessToken: result.accessToken, user: result.user});
});

export default Router;
