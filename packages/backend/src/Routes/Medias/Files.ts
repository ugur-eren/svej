import {Elysia} from 'elysia';
import {z} from 'zod';
import {MediasModule} from '@/Modules/Medias';
import {createRangeHeaders, parseRange, ValidRange} from '@/Utils/RangeHeader';
import {Config, HTTPStatus} from '@svej/common';

type FileHeadNoServeResult = {
  ok: false;
  status: (typeof HTTPStatus)[keyof typeof HTTPStatus];
  headers: Record<string, string | number>;
};

type FileHeadSuccessResult = {
  ok: true;
  status: (typeof HTTPStatus)['OK'] | (typeof HTTPStatus)['PartialContent'];
  headers: Record<string, string | number>;
  range: ValidRange | undefined;
};

const getFileHead = async (fileKey: string, headers: Record<string, string | undefined>) => {
  const {
    mimeType,
    size,
    lastModified: lastModifiedDate,
  } = await MediasModule.getFileMetadata(fileKey);

  const sizeHex = size.toString(16);
  const lastModifiedHex = lastModifiedDate.getTime().toString(16);
  const etag = `"${sizeHex}-${lastModifiedHex}"`;

  const lastModified = lastModifiedDate.toUTCString();

  const commonHeaders: Record<string, string> = {
    'Content-Type': mimeType,
    'Accept-Ranges': 'bytes',

    ETag: etag,
    'Last-Modified': lastModified,
    'Cache-Control': `public, max-age=${Config.defaultFileCacheTTL}, immutable`,
  };

  const ifNoneMatch = headers['if-none-match'];
  if (
    ifNoneMatch &&
    ifNoneMatch
      .split(',')
      .map((value) => value.trim())
      .includes(etag)
  ) {
    return {
      ok: false,
      status: HTTPStatus.NotModified,
      headers: commonHeaders,
    } satisfies FileHeadNoServeResult;
  }

  const ifModifiedSince = headers['if-modified-since'];
  if (ifModifiedSince) {
    const modifiedSince = Date.parse(ifModifiedSince);

    if (!Number.isNaN(modifiedSince) && lastModifiedDate.getTime() <= modifiedSince) {
      return {
        ok: false,
        status: HTTPStatus.NotModified,
        headers: commonHeaders,
      } satisfies FileHeadNoServeResult;
    }
  }

  const range = parseRange(headers.range, size);
  if (range?.invalid) {
    return {
      ok: false,
      status: HTTPStatus.RangeNotSatisfiable,
      headers: {
        ...commonHeaders,
        'Content-Range': `bytes */${size}`,
      },
    } satisfies FileHeadNoServeResult;
  }

  return {
    ok: true,
    range,
    status: range ? HTTPStatus.PartialContent : HTTPStatus.OK,
    headers: {
      ...commonHeaders,
      ...createRangeHeaders(range, size),
    },
  } satisfies FileHeadSuccessResult;
};

export default new Elysia().group(
  '/files/:fileKey',
  {params: z.object({fileKey: z.string()})},
  (app) =>
    app
      .head('/', async ({set, status, headers, params: {fileKey}}) => {
        const fileHead = await getFileHead(fileKey, headers);

        Object.assign(set.headers, fileHead.headers);

        return status(fileHead.status, undefined);
      })
      .get('/', async ({set, status, headers, params: {fileKey}}) => {
        const fileHead = await getFileHead(fileKey, headers);
        if (!fileHead.ok) {
          Object.assign(set.headers, fileHead.headers);
          return status(fileHead.status, undefined);
        }

        const stream = await MediasModule.getFileStream(fileKey, fileHead.range);

        Object.assign(set.headers, fileHead.headers);

        return status(fileHead.status, stream);
      }),
);
