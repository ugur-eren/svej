import crypto from 'node:crypto';
import {Config} from '@svej/common';
import {MediaType, PrismaTypes} from '@svej/database';
import {FileSystem} from '@svej/file-system';
import sharp from 'sharp';
import {encode} from 'blurhash';
import {clampDimensions, getCropArea} from './Helpers';

export const ImageHandler = async (
  file: Express.Multer.File,
  type: 'post' | 'profile' | 'cover',
) => {
  const fileId = crypto.randomUUID();
  const fileName = `${fileId}.webp`;

  const maxDimension = {
    post: Config.maxPostImageDimension,
    profile: Config.maxProfilePhotoDimension,
    cover: Config.maxCoverPhotoDimension,
  }[type];

  const image = sharp(file.buffer);
  let {width: oldWidth, height: oldHeight} = await image.metadata();

  if (
    !oldWidth ||
    !oldHeight ||
    oldWidth < Config.minImageDimension ||
    oldHeight < Config.minImageDimension
  ) {
    throw new Error('Image dimensions are too small');
  }

  if (type === 'profile' || type === 'cover') {
    const aspectRatio = {
      profile: Config.profilePhotoAspectRatio,
      cover: Config.coverPhotoAspectRatio,
    }[type];

    const cropArea = getCropArea(oldWidth, oldHeight, [...aspectRatio]);

    image.extract({
      left: cropArea.x,
      top: cropArea.y,
      width: cropArea.width,
      height: cropArea.height,
    });

    oldWidth = cropArea.width;
    oldHeight = cropArea.height;
  }

  const [newWidth, newHeight] = clampDimensions(oldWidth, oldHeight, maxDimension);

  image.resize({
    width: newWidth,
    height: newHeight,
  });
  image.toFormat('webp');

  const buffer = await image.toBuffer();
  await FileSystem.write(fileName, buffer, 'image/webp');

  let blurhash: string | null = null;
  try {
    const [thumbWidth, thumbHeight] = clampDimensions(newWidth, newHeight, 32);

    const blurhashBuffer = await image
      .clone()
      .raw()
      .ensureAlpha()
      .resize({width: thumbWidth, height: thumbHeight})
      .toBuffer();

    blurhash = encode(new Uint8ClampedArray(blurhashBuffer), thumbWidth, thumbHeight, 4, 4);
  } catch (_) {
    //
  }

  return {
    type: MediaType.IMAGE,
    fileKey: fileName,
    width: newWidth,
    height: newHeight,
    blurhash,
  } satisfies PrismaTypes.MediaCreateInput;
};
