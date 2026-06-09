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

  const [oldWidth, oldHeight] = ffprobeProcess.stdout[0].split('x').map((x) => parseInt(x, 10));
  if (Number.isNaN(oldWidth) || Number.isNaN(oldHeight)) {
    throw new Error('Invalid video dimensions');
  }
  if (oldWidth < Config.minVideoDimension || oldHeight < Config.minVideoDimension) {
    throw new Error('Video dimensions are too small');
  }

  const [newWidth, newHeight] = clampDimensions(oldWidth, oldHeight, Config.maxPostVideoDimension);

  // eslint-disable-next-line no-bitwise
  const [evenWidth, evenHeight] = [newWidth & ~1, newHeight & ~1];

  const ffmpegProcess = await Spawn('ffmpeg', [
    '-hide_banner',
    ['-loglevel', 'error'],
    '-y',
    ['-i', tempFilePath],
    ['-map', '0:v:0'],
    ['-map', '0:a:0?'],
    ['-map_metadata', '-1'],
    ['-map_chapters', '-1'],
    ['-sn', '-dn'],
    ['-vf', "fps=fps='min(30,source_fps)'"],
    ['-s', `${evenWidth}x${evenHeight}`],
    ['-c:v', 'libx264'],
    ['-b:v', '600k'],
    ['-maxrate', '900k'],
    ['-bufsize', '1200k'],
    ['-preset', 'medium'],
    ['-profile:v', 'high'],
    ['-level', '4.0'],
    ['-pix_fmt', 'yuv420p'],
    ['-c:a', 'aac'],
    ['-profile:a', 'aac_low'],
    ['-ac', '2'],
    ['-b:a', '96K'],
    ['-f', 'mp4'],
    ['-movflags', '+faststart'],
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

  let blurhash: string | null = null;

  if (thumbnailProcess.status) {
    try {
      const [thumbWidth, thumbHeight] = clampDimensions(newWidth, newHeight, 128);

      const blurhashBuffer = await sharp(tempThumbnailPath)
        .ensureAlpha()
        .resize(thumbWidth, thumbHeight, {fit: 'inside'})
        .raw()
        .toBuffer();

      blurhash = encode(
        new Uint8ClampedArray(blurhashBuffer),
        thumbWidth,
        thumbHeight,
        4,
        thumbHeight < thumbWidth ? 3 : 4,
      );
    } catch (_) {
      //
    }
  }

  return {
    type: MediaType.VIDEO,
    fileKey: fileName,
    width: newWidth,
    height: newHeight,
    blurhash,
  } satisfies PrismaTypes.MediaCreateInput;
};
