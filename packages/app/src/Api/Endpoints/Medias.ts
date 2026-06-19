import ApiInstance from '../ApiInstance';

export const getById = (mediaId: string) => {
  return ApiInstance.medias({mediaId}).get();
};

export const getFileHeadByFileKey = (fileKey: string, range?: {start: number; end: number}) => {
  return ApiInstance.medias.files({fileKey}).head({
    headers: range
      ? {
          Range: `bytes=${range.start}-${range.end}`,
        }
      : undefined,
  });
};

export const downloadByFileKey = (fileKey: string, range?: {start: number; end: number}) => {
  return ApiInstance.medias.files({fileKey}).get({
    headers: range
      ? {
          Range: `bytes=${range.start}-${range.end}`,
        }
      : undefined,
  });
};
