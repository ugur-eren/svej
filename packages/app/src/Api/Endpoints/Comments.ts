import {Zod} from '@svej/common';
import ApiInstance from '../ApiInstance';

export type Comment = (Awaited<ReturnType<ReturnType<typeof ApiInstance.comments>['get']>> & {
  error: null;
})['data'];

export const getById = async (commentId: string) => {
  return ApiInstance.comments({commentId}).get();
};

export const getReactionCounts = async (commentId: string) => {
  return ApiInstance.comments({commentId}).reactions.get();
};

export const react = async (commentId: string, type: Zod.Reaction.TYPES) => {
  return ApiInstance.comments({commentId}).reactions.put({type});
};

export const removeReaction = async (commentId: string) => {
  return ApiInstance.comments({commentId}).reactions.delete();
};
