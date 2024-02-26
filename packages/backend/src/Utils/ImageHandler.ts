import {Config} from 'common';
import {MediaType, PrismaTypes} from 'database';
import sharp from 'sharp';
import {v4 as uuid} from 'uuid';
import {encode} from 'blurhash';
import {fileSystem} from '../Services';
import {clampDimensions, getCropArea} from './Helpers';

export const ImageHandler = async (
  file: Express.Multer.File,
  type: 'post' | 'profile' | 'cover',
) => {
  const fileId = uuid();
  const fileName = `${fileId}.webp`;

  const maxDimension = {
    post: Config.maxPostImageDimension,
    profile: Config.maxProfilePhotoDimension,
    cover: Config.maxCoverPhotoDimension,
  }[type];

  const image = sharp(file.buffer);
  let {width: oldWidth = maxDimension, height: oldHeight = maxDimension} = await image.metadata();

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

  const {width: newWidth, height: newHeight} = clampDimensions(oldWidth, oldHeight, maxDimension);

  image.resize({
    width: newWidth,
    height: newHeight,
  });
  image.toFormat('webp');

  const buffer = await image.toBuffer();
  await fileSystem.write(fileName, buffer, 'image/webp');

  let thumbnail: string | null = null;
  try {
    const thumbnailBuffer = await image
      .clone()
      .raw()
      .ensureAlpha()
      .resize({width: 32, height: 32})
      .toBuffer();

    thumbnail = encode(new Uint8ClampedArray(thumbnailBuffer), 32, 32, 4, 4);
  } catch (_) {
    //
  }

  return {
    type: MediaType.IMAGE,
    fileKey: fileName,
    width: newWidth,
    height: newHeight,
    thumbnail,
  } satisfies PrismaTypes.MediaCreateInput;
};
