import ApiInstance from '../ApiInstance';

export const getFileURL = (fileKey?: string): string => {
  if (!fileKey) return '';

  const baseURL = ApiInstance.getBaseURL();

  return `${baseURL}/file/${fileKey}`;
};
