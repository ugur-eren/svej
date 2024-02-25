import express from 'express';
import {HTTPStatus} from 'common';
import {fileSystem} from '../Services';

const Router = express.Router();

Router.get('/:fileKey', async (req, res) => {
  const {fileKey} = req.params;

  const stream = await fileSystem.readStream(fileKey);

  if (stream.ok) {
    stream.response.pipe(res.status(HTTPStatus.OK));
    return;
  }

  if (stream.error === 'NotFound') {
    res.status(HTTPStatus.NotFound).send();
    return;
  }

  res.status(HTTPStatus.InternalServerError).send();
});

export default Router;
