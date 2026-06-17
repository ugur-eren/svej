import {ErrorCodes} from '@svej/common';
import {FileSystem} from '@svej/file-system';
import mime from 'mime-types';
import {Prisma} from '@/Services';
import {ModuleError} from '@/Utils/Error';
import {assertMediaExists} from './Internal/Assert';

export const MediasModule = {
  async getById(viewerId: string, mediaId: string) {
    const media = await Prisma.media.findUnique({where: {id: mediaId}});

    assertMediaExists(media);

    return media;
  },

  async getFileMetadata(viewerId: string, fileKey: string) {
    const mimeType = mime.lookup(fileKey.split('.').pop() || '');
    if (!mimeType) {
      throw new ModuleError(ErrorCodes.UnknownError);
    }

    const stat = await FileSystem.stats(fileKey);
    if (!stat.ok) {
      if (stat.error === 'NotFound') {
        throw new ModuleError(ErrorCodes.FileNotFound);
      }

      throw new ModuleError(ErrorCodes.UnknownError);
    }

    const {size, lastModified} = stat.response;

    return {
      mimeType,
      size,
      lastModified,
    };
  },

  async getFileStream(viewerId: string, fileKey: string, range?: {start: number; end: number}) {
    const stream = await FileSystem.readStream(fileKey, range || undefined);

    if (!stream.ok) {
      if (stream.error === 'NotFound') {
        throw new ModuleError(ErrorCodes.FileNotFound);
      }

      throw new ModuleError(ErrorCodes.UnknownError);
    }

    return stream.response;
  },
};
