import {Zod} from '@svej/common';
import ApiInstance from '../ApiInstance';

export type Comment = (Awaited<ReturnType<typeof getById>> & {
  ok: true;
})['data'];

export const getById = async (commentId: string) => {
  return ApiInstance.comments({commentId}).get();
};

export const getReactionCounts = async (commentId: string) => {
  return ApiInstance.comments({commentId}).reactions.get();
};

export const deleteComment = async (commentId: string) => {
  return ApiInstance.comments({commentId}).delete();
};

export const editComment = async (commentId: string, text: string) => {
  return ApiInstance.comments({commentId}).patch({text});
};

export const react = async (commentId: string, type: Zod.Reaction.TYPES) => {
  return ApiInstance.comments({commentId}).reactions.put({type});
};

export const removeReaction = async (commentId: string) => {
  return ApiInstance.comments({commentId}).reactions.delete();
};
