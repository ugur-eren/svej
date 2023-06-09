import {Config} from 'common';
import {MediaType, PrismaTypes} from 'database';
import fs from 'fs/promises';
import {v4 as uuid} from 'uuid';
import {encode} from 'blurhash';
import sharp from 'sharp';
import {Spawn} from './Spawn';
import {TEMP_DIR, UPLOADS_DIR} from './Constants';

export const VideoHandler = async (file: Express.Multer.File) => {
  const tempFilePath = `${TEMP_DIR}/${uuid()}.tmp`;
  const tempThumbnailPath = `${TEMP_DIR}/${uuid()}-thumb.tmp`;
  const fileId = uuid();

  await fs.writeFile(tempFilePath, file.buffer);

  const ffprobeProcess = await Spawn('ffprobe', [
    ...'-v error -select_streams v:0 -show_entries stream=width,height -of csv=s=x:p=0'.split(' '),
    tempFilePath,
  ]);

  if (!ffprobeProcess.status || ffprobeProcess.stdout.length !== 1) {
    throw new Error(ffprobeProcess.stderr.join('\n'));
  }

  const [oldWidth = Config.maxImageDimension, oldHeight = Config.maxImageDimension] =
    ffprobeProcess.stdout[0].split('x').map((x) => parseInt(x, 10));

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

  const ffmpegProcess = await Spawn('ffmpeg', [
    ...'-hide_banner -loglevel error -y'.split(' '),
    '-i',
    tempFilePath,
    '-s',
    `${newWidth}x${newHeight}`,
    ...'-c:v libx264 -maxrate 600K -preset fast -crf 28 -c:a aac -b:a 64K'.split(' '),
    `${UPLOADS_DIR}/${fileId}.mp4`,
  ]);

  if (!ffmpegProcess.status) {
    throw new Error(ffmpegProcess.stderr.join('\n'));
  }

  const thumbnailProcess = await Spawn('ffmpeg', [
    ...'-vf "select=eq(n,34)" -vframes 1'.split(' '),
    tempThumbnailPath,
  ]);

  let thumbnail: string | null = null;

  if (thumbnailProcess.status) {
    try {
      const thumbnailBuffer = await sharp(tempThumbnailPath)
        .raw()
        .ensureAlpha()
        .resize(32, 32, {fit: 'inside'})
        .toBuffer();

      thumbnail = encode(new Uint8ClampedArray(thumbnailBuffer), 32, 32, 4, 4);
    } catch (_) {
      //
    }
  }

  // TODO: Thumbnail generation

  return {
    type: MediaType.VIDEO,
    url: fileId,
    width: 300,
    height: 300,
    thumbnail,
  } satisfies PrismaTypes.MediaCreateInput;
};
