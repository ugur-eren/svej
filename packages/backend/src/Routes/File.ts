import type {OutgoingHttpHeaders} from 'node:http';
import {Config, HTTPStatus} from '@svej/common';
import {FileSystem} from '@svej/file-system';
import express from 'express';
import mime from 'mime-types';
import {createRangeHeaders, parseRange, type ValidRange} from '../Utils/RangeHeader';

const Router = express.Router();

const getFileHead = async (
  fileKey: string,
  req: express.Request,
  res: express.Response,
): Promise<
  | undefined
  | {
      status: number;
      headers: OutgoingHttpHeaders;
      range: ValidRange | undefined;
    }
> => {
  const mimeType = mime.lookup(fileKey.split('.').pop() || '');
  if (!mimeType) {
    res.status(HTTPStatus.InternalServerError).send();
    return undefined;
  }

  const stat = await FileSystem.stats(fileKey);
  if (!stat.ok) {
    if (stat.error === 'NotFound') {
      res.status(HTTPStatus.NotFound).send();
      return undefined;
    }

    res.status(HTTPStatus.InternalServerError).send();
    return undefined;
  }

  const fileSize = stat.response.size;

  const sizeHex = fileSize.toString(16);
  const lastModifiedHex = stat.response.lastModified.getTime().toString(16);
  const etag = `"${sizeHex}-${lastModifiedHex}"`;

  const lastModified = stat.response.lastModified.toUTCString();

  const commonHeaders: OutgoingHttpHeaders = {
    'Content-Type': mimeType,
    'Accept-Ranges': 'bytes',

    ETag: etag,
    'Last-Modified': lastModified,
    'Cache-Control': `public, max-age=${Config.defaultFileCacheTTL}, immutable`,
  };

  const ifNoneMatch = req.header('if-none-match');
  if (
    ifNoneMatch &&
    ifNoneMatch
      .split(',')
      .map((value) => value.trim())
      .includes(etag)
  ) {
    res.writeHead(HTTPStatus.NotModified, commonHeaders).end();
    return undefined;
  }

  const ifModifiedSince = req.header('if-modified-since');
  if (ifModifiedSince) {
    const modifiedSince = Date.parse(ifModifiedSince);

    if (!Number.isNaN(modifiedSince) && stat.response.lastModified.getTime() <= modifiedSince) {
      res.writeHead(HTTPStatus.NotModified, commonHeaders).end();
      return undefined;
    }
  }

  const range = parseRange(req.header('range'), fileSize);
  if (range?.invalid) {
    res.writeHead(HTTPStatus.RangeNotSatisfiable, {
      ...commonHeaders,
      'Content-Range': `bytes */${fileSize}`,
    });
    res.end();
    return undefined;
  }

  return {
    range,
    status: range ? HTTPStatus.PartialContent : HTTPStatus.OK,
    headers: {
      ...commonHeaders,
      ...createRangeHeaders(range, fileSize),
    },
  };
};

// TODO: Cache control headers

Router.head('/:fileKey', async (req, res) => {
  const {fileKey} = req.params;

  const fileHead = await getFileHead(fileKey, req, res);
  if (!fileHead) return;

  res.writeHead(fileHead.status, fileHead.headers).end();
});

Router.get('/:fileKey', async (req, res) => {
  const {fileKey} = req.params;

  const fileHead = await getFileHead(fileKey, req, res);
  if (!fileHead) return;

  const stream = await FileSystem.readStream(
    fileKey,
    fileHead.range ? {start: fileHead.range.start, end: fileHead.range.end} : undefined,
  );

  if (!stream.ok) {
    if (stream.error === 'NotFound') {
      res.status(HTTPStatus.NotFound).send();
      return;
    }

    res.status(HTTPStatus.InternalServerError).send();
    return;
  }

  res.writeHead(fileHead.status, fileHead.headers);
  stream.response.pipe(res);
});

export default Router;
