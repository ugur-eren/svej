import type {PrismaTypes, PrismaIncludes, Post as PrismaPost} from 'database';
import type {ImagePickerAsset} from 'expo-image-picker';

export type Post = PrismaTypes.PostGetPayload<{include: ReturnType<typeof PrismaIncludes.Post>}> & {
  liked: boolean;
  disliked: boolean;
  mine: boolean;
};

export type ReactionCounts = {
  likes: number;
  dislikes: number;
  comments: number;
};

export type ReactionType = 'like' | 'dislike' | 'remove';

export type CreateBody = {
  description: string;
  medias: ImagePickerAsset[];
};

export type CreateResponse = PrismaPost;
