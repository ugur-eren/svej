import {HTTPStatus} from '@svej/common';
import {FileSystem} from '@svej/file-system';
import express from 'express';
import mime from 'mime-types';
import {createRangeHeader, parseRangeOrFail} from '../Utils/Header';

const Router = express.Router();

const getFileSizeOrFail = async (
  fileKey: string,
  res: express.Response,
): Promise<false | number> => {
  const stat = await FileSystem.stats(fileKey);
  if (!stat.ok) {
    if (stat.error === 'NotFound') {
      res.status(HTTPStatus.NotFound).send();
      return false;
    }

    res.status(HTTPStatus.InternalServerError).send();
    return false;
  }

  return stat.response.size;
};

Router.head('/:fileKey', async (req, res) => {
  const {fileKey} = req.params;

  const mimeType = mime.lookup(fileKey.split('.').pop() || '');
  if (!mimeType) {
    res.status(HTTPStatus.InternalServerError).send();
    return;
  }

  const fileSize = await getFileSizeOrFail(fileKey, res);
  if (fileSize === false) return;

  const range = parseRangeOrFail(req.header('range'), fileSize, res);
  if (!range) return;

  res.writeHead(
    range ? HTTPStatus.PartialContent : HTTPStatus.OK,
    createRangeHeader(range, mimeType, fileSize),
  );

  res.end();
});

Router.get('/:fileKey', async (req, res) => {
  const {fileKey} = req.params;

  const mimeType = mime.lookup(fileKey.split('.').pop() || '');
  if (!mimeType) {
    res.status(HTTPStatus.InternalServerError).send();
    return;
  }

  const fileSize = await getFileSizeOrFail(fileKey, res);
  if (fileSize === false) return;

  const range = parseRangeOrFail(req.header('range'), fileSize, res);
  if (!range) return;

  const stream = await FileSystem.readStream(
    fileKey,
    range ? {start: range.start, end: range.end} : undefined,
  );

  if (!stream.ok) {
    if (stream.error === 'NotFound') {
      res.status(HTTPStatus.NotFound).send();
      return;
    }

    res.status(HTTPStatus.InternalServerError).send();
    return;
  }

  res.writeHead(
    range ? HTTPStatus.PartialContent : HTTPStatus.OK,
    createRangeHeader(range, mimeType, fileSize),
  );

  stream.response.pipe(res);
});

export default Router;
