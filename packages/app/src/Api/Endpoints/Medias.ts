import ApiInstance from '../ApiInstance';
import {DEFAULT_BASE_URL} from '../Utils';

export type Media = (Awaited<ReturnType<typeof getById>> & {
  error: null;
})['data'];

export type Avatar = Media;

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

export const getFileURL = (fileKey?: string): string => {
  if (!fileKey) return '';

  const path = ApiInstance.medias.files({fileKey})['~path'];

  return `${DEFAULT_BASE_URL}${path}`;
};
