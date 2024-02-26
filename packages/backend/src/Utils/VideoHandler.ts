import {Config} from 'common';
import {MediaType, PrismaTypes} from 'database';
import fs from 'fs/promises';
import {v4 as uuid} from 'uuid';
import {encode} from 'blurhash';
import sharp from 'sharp';
import {Spawn} from './Spawn';
import {TEMP_DIR} from './Constants';
import {fileSystem} from '../Services';
import {clampDimensions} from './Helpers';

export const VideoHandler = async (file: Express.Multer.File) => {
  const tempFilePath = `${TEMP_DIR}/${uuid()}.tmp`;
  const tempProcessedFilePath = `${TEMP_DIR}/${uuid()}-processed.tmp`;
  const tempThumbnailPath = `${TEMP_DIR}/${uuid()}-thumb.tmp`;
  const fileId = uuid();
  const fileName = `${fileId}.mp4`;

  await fs.writeFile(tempFilePath, file.buffer);

  const ffprobeProcess = await Spawn('ffprobe', [
    ['-v', 'error'],
    ['-select_streams', 'v:0'],
    ['-show_entries', 'stream=width,height'],
    ['-of', 'csv=s=x:p=0'],
    tempFilePath,
  ]);

  if (!ffprobeProcess.status || ffprobeProcess.stdout.length !== 1) {
    throw new Error(ffprobeProcess.stderr.join('\n'));
  }

  const [oldWidth = Config.maxPostVideoDimension, oldHeight = Config.maxPostVideoDimension] =
    ffprobeProcess.stdout[0].split('x').map((x) => parseInt(x, 10));

  const {width: newWidth, height: newHeight} = clampDimensions(
    oldWidth,
    oldHeight,
    Config.maxPostVideoDimension,
  );

  const ffmpegProcess = await Spawn('ffmpeg', [
    ['-hide_banner'],
    ['-loglevel', 'error'],
    '-y',
    ['-i', tempFilePath],
    ['-s', `${newWidth}x${newHeight}`],
    ['-c:v', 'libx264'],
    ['-maxrate', '600K'],
    ['-preset', 'fast'],
    ['-crf', '28'],
    ['-c:a', 'aac'],
    ['-b:a', '64K'],
    ['-f', 'mp4'],
    tempProcessedFilePath,
  ]);

  if (!ffmpegProcess.status) {
    throw new Error(ffmpegProcess.stderr.join('\n'));
  }

  const processedFile = await fs.readFile(tempProcessedFilePath);
  fileSystem.write(fileName, processedFile, 'video/mp4');

  const thumbnailProcess = await Spawn('ffmpeg', [
    ['-vf', 'select=eq(n,34)'],
    ['-vframes', '1'],
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

  return {
    type: MediaType.VIDEO,
    fileKey: fileName,
    width: 300,
    height: 300,
    thumbnail,
  } satisfies PrismaTypes.MediaCreateInput;
};
