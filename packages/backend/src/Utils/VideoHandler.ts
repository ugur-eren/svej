import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import {Config} from '@svej/common';
import {MediaType, PrismaTypes} from '@svej/database';
import {FileSystem, TEMP_DIR} from '@svej/file-system';
import {encode} from 'blurhash';
import sharp from 'sharp';
import {Spawn} from './Spawn';
import {clampDimensions} from './Helpers';

export const VideoHandler = async (file: Express.Multer.File) => {
  const tempFilePath = `${TEMP_DIR}/${crypto.randomUUID()}.tmp`;
  const tempProcessedFilePath = `${TEMP_DIR}/${crypto.randomUUID()}-processed.tmp`;
  const tempThumbnailPath = `${TEMP_DIR}/${crypto.randomUUID()}-thumb.tmp`;
  const fileId = crypto.randomUUID();
  const fileName = `${fileId}.mp4`;

  await fs.writeFile(tempFilePath, new Uint8Array(file.buffer));

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

  const [newWidth, newHeight] = clampDimensions(oldWidth, oldHeight, Config.maxPostVideoDimension);

  const ffmpegProcess = await Spawn('ffmpeg', [
    ['-hide_banner'],
    ['-loglevel', 'error'],
    '-y',
    ['-movflags', '+faststart'],
    ['-i', tempFilePath],
    ['-s', `${newWidth}x${newHeight}`],
    ['-c:v', 'libx264'],
    ['-maxrate', '600K'],
    ['-preset', 'fast'],
    ['-crf', '28'],
    ['-c:a', 'aac'],
    ['-ac', '2'],
    ['-b:a', '64K'],
    ['-f', 'mp4'],
    tempProcessedFilePath,
  ]);

  if (!ffmpegProcess.status) {
    throw new Error(ffmpegProcess.stderr.join('\n'));
  }

  const processedFile = await fs.readFile(tempProcessedFilePath);
  await FileSystem.write(fileName, processedFile, 'video/mp4');

  const thumbnailProcess = await Spawn('ffmpeg', [
    ['-i', tempProcessedFilePath],
    ['-vf', 'select=eq(n,34)'],
    ['-vframes', '1'],
    tempThumbnailPath,
  ]);

  let thumbnail: string | null = null;

  if (thumbnailProcess.status) {
    try {
      const [thumbWidth, thumbHeight] = clampDimensions(newWidth, newHeight, 32);

      const thumbnailBuffer = await sharp(tempThumbnailPath)
        .raw()
        .ensureAlpha()
        .resize(thumbWidth, thumbHeight, {fit: 'inside'})
        .toBuffer();

      thumbnail = encode(new Uint8ClampedArray(thumbnailBuffer), thumbWidth, thumbHeight, 4, 4);
    } catch (_) {
      //
    }
  }

  return {
    type: MediaType.VIDEO,
    fileKey: fileName,
    width: newWidth,
    height: newHeight,
    thumbnail,
  } satisfies PrismaTypes.MediaCreateInput;
};
