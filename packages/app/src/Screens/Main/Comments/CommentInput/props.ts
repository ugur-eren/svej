export type CommentInputProps = {
  onCommentSend: (comment: string) => void;

  editing?: boolean;
  cancelEditing: () => void;
};
