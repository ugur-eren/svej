import ApiInstance from '../ApiInstance';

export const getExplore = async () => {
  return ApiInstance.feed.explore.get();
};
