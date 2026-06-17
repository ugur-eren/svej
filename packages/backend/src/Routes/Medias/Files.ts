import {Elysia} from 'elysia';
import {z} from 'zod';
import {onlyAuthenticated} from '@/Plugins';
import {MediasModule} from '@/Modules/Medias';
import {createRangeHeaders, parseRange, ValidRange} from '@/Utils/RangeHeader';
import {Config, HTTPStatus} from '@svej/common';

const getFileHead = async (
  viewerId: string,
  fileKey: string,
  headers: Record<string, string | undefined>,
): Promise<
  | {
      ok: false;
      status: number;
      headers: Record<string, string | number>;
    }
  | {
      ok: true;
      status: number;
      headers: Record<string, string | number>;
      range: ValidRange | undefined;
    }
> => {
  const {
    mimeType,
    size,
    lastModified: lastModifiedDate,
  } = await MediasModule.getFileMetadata(viewerId, fileKey);

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
    };
  }

  const ifModifiedSince = headers['if-modified-since'];
  if (ifModifiedSince) {
    const modifiedSince = Date.parse(ifModifiedSince);

    if (!Number.isNaN(modifiedSince) && lastModifiedDate.getTime() <= modifiedSince) {
      return {
        ok: false,
        status: HTTPStatus.NotModified,
        headers: commonHeaders,
      };
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
    };
  }

  return {
    ok: true,
    range,
    status: range ? HTTPStatus.PartialContent : HTTPStatus.OK,
    headers: {
      ...commonHeaders,
      ...createRangeHeaders(range, size),
    },
  };
};

export default new Elysia()
  .use(onlyAuthenticated)
  .group('/files/:fileKey', {params: z.object({fileKey: z.uuid()})}, (app) =>
    app
      .head('/', async ({set, status, session, headers, params: {fileKey}}) => {
        const fileHead = await getFileHead(session.user.id, fileKey, headers);

        Object.assign(set.headers, fileHead.headers);

        return status(fileHead.status);
      })
      .get('/', async ({set, status, session, headers, params: {fileKey}}) => {
        const fileHead = await getFileHead(session.user.id, fileKey, headers);
        if (!fileHead.ok) {
          Object.assign(set.headers, fileHead.headers);
          return status(fileHead.status);
        }

        const stream = await MediasModule.getFileStream(session.user.id, fileKey, fileHead.range);

        Object.assign(set.headers, fileHead.headers);

        return status(fileHead.status, stream);
      }),
  );
