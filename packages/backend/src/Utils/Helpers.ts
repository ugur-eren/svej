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
