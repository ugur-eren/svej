import {Config} from 'common';
import {MediaType, PrismaTypes} from 'database';
import sharp from 'sharp';
import {v4 as uuid} from 'uuid';
import {encode} from 'blurhash';
import {UPLOADS_DIR} from './Constants';

export const ImageHandler = async (file: Express.Multer.File) => {
  const fileId = uuid();

  const image = sharp(file.buffer);
  const {width: oldWidth = Config.maxImageDimension, height: oldHeight = Config.maxImageDimension} =
    await image.metadata();

  let newWidth: number = Config.maxImageDimension;
  let newHeight: number = Config.maxImageDimension;

  if (oldWidth > oldHeight && oldWidth > Config.maxImageDimension) {
    newWidth = Config.maxImageDimension;
    newHeight = Math.round((oldHeight / oldWidth) * Config.maxImageDimension);
  }

  if (oldHeight > oldWidth && oldHeight > Config.maxImageDimension) {
    newWidth = Math.round((oldWidth / oldHeight) * Config.maxImageDimension);
    newHeight = Config.maxImageDimension;
  }

  image.resize({
    width: newWidth,
    height: newHeight,
  });
  image.toFormat('webp');

  await image.toFile(`${UPLOADS_DIR}/${fileId}.webp`);

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
    url: fileId,
    width: newWidth,
    height: newHeight,
    thumbnail,
  } satisfies PrismaTypes.MediaCreateInput;
};
