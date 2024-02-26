import type {ParsedQs} from 'qs';

export const GetPostgresTimestamp = (date: Date = new Date()): string => {
  /**
   * Date.prototype.toISOString returns: 2022-01-22T13:59:11.983Z
   * Postgres wants: 2022-01-22 13:59:11
   *
   * Replace T with ` ` (space)
   * Split by . (dot) to remove ms
   */
  return date.toISOString().replace('T', ' ').split('.')[0];
};

export const throwError = (message: string, options?: ErrorOptions): never => {
  throw new Error(message, options);
};

/**
 * Clamps the dimensions of an image to a maximum dimension while maintaining the aspect ratio
 * @param width Width of the image
 * @param height Height of the image
 * @param maxDimension Maximum dimension for the image
 * @returns Clamped dimensions `{width, height}`
 */
export const clampDimensions = (
  width: number,
  height: number,
  maxDimension: number,
): {width: number; height: number} => {
  if (width <= maxDimension && height <= maxDimension) {
    return {width, height};
  }

  const aspectRatio = width / height;

  if (width > height) {
    return {
      width: maxDimension,
      height: maxDimension / aspectRatio,
    };
  }

  return {
    width: maxDimension * aspectRatio,
    height: maxDimension,
  };
};

/**
 * Gets the crop area for an image with a given aspect ratio
 * @param width Width of the image
 * @param height Height of the image
 * @param aspectRatio Aspect ratio of the crop area `[x, y]`
 * @returns Crop area `{x, y, width, height}`
 */
export const getCropArea = (
  width: number,
  height: number,
  aspectRatio: [x: number, y: number],
): {
  x: number;
  y: number;
  width: number;
  height: number;
} => {
  const [aspectX, aspectY] = aspectRatio;
  const aspectRatioWidth = width / aspectX;
  const aspectRatioHeight = height / aspectY;

  let x = 0;
  let y = 0;
  let cropWidth = width;
  let cropHeight = height;

  if (aspectRatioWidth > aspectRatioHeight) {
    cropWidth = Math.round(aspectRatioHeight * aspectX);
    x = Math.round((width - cropWidth) / 2);
  } else {
    cropHeight = Math.round(aspectRatioWidth * aspectY);
    y = Math.round((height - cropHeight) / 2);
  }

  return {x, y, width: cropWidth, height: cropHeight};
};

export const getBeforeDate = (beforeDate: ParsedQs[string]): Date => {
  if (beforeDate && typeof beforeDate === 'string') {
    const date = new Date(beforeDate);

    if (!Number.isNaN(date.getTime())) return date;
  }

  return new Date();
};
