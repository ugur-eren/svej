export type PostData = {
  uri: string;
  ratio: number;
} & (
  | {
      type: 'image';
      thumbnail?: string;
    }
  | {
      type: 'video';
      poster?: string;
    }
);

export type PostContentProps = {
  data: PostData[];
};
