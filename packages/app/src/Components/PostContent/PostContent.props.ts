export type PostData = {
  uri: string;
  ratio: number;
  blurhash?: string;
} & (
  | {
      type: 'image';
    }
  | {
      type: 'video';
    }
);

export type PostContentProps = {
  data: PostData[];
  onLike?: () => void;
};
