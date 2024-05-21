import express from 'express';
import {HTTPStatus} from 'common';
import mime from 'mime-types';
import {fileSystem} from '../Services';

const Router = express.Router();

Router.get('/:fileKey', async (req, res) => {
  const {fileKey} = req.params;

  const mimeType = mime.lookup(fileKey.split('.').pop() || '');
  if (!mimeType) {
    res.status(HTTPStatus.InternalServerError).send();
    return;
  }

  const stat = await fileSystem.stats(fileKey);
  if (!stat.ok) {
    if (stat.error === 'NotFound') {
      res.status(HTTPStatus.NotFound).send();
      return;
    }

    res.status(HTTPStatus.InternalServerError).send();
    return;
  }
  const fileSize = stat.response.size;

  let partialConfig:
    | undefined
    | {
        start: number;
        end: number;
        fileSize: number;
        chunkSize: number;
      };

  const rangeHeader = req.header('range');
  if (rangeHeader) {
    const parts = rangeHeader.replace(/bytes=/, '').split('-');
    const start = parseInt(parts[0], 10);
    const end = (parts[1] ? parseInt(parts[1], 10) : 0) || fileSize - 1;
    const chunkSize = end - start + 1;

    partialConfig = {
      start,
      end,
      fileSize,
      chunkSize,
    };
  }

  // No range header
  const stream = await fileSystem.readStream(
    fileKey,
    partialConfig ? {start: partialConfig.start, end: partialConfig.end} : undefined,
  );

  if (!stream.ok) {
    if (stream.error === 'NotFound') {
      res.status(HTTPStatus.NotFound).send();
      return;
    }

    res.status(HTTPStatus.InternalServerError).send();
    return;
  }

  res.writeHead(partialConfig ? HTTPStatus.PartialContent : HTTPStatus.OK, {
    'Content-Type': mimeType,
    'Accept-Ranges': 'bytes',
    'Cross-Origin-Resource-Policy': 'cross-origin',

    ...(partialConfig
      ? {
          'Content-Range': `bytes ${partialConfig.start}-${partialConfig.end}/${partialConfig.fileSize}`,
          'Content-Length': partialConfig.chunkSize,
        }
      : {
          'Content-Length': fileSize,
        }),
  });

  stream.response.pipe(res);
});

export default Router;
