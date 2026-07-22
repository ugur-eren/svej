import ApiInstance from '../ApiInstance';

export const getExplore = async (cursor?: string) => {
  return ApiInstance.feed.explore.get({query: {cursor}});
};
