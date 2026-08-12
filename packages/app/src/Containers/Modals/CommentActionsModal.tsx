import {useQueryClient} from '@tanstack/react-query';
import {List} from 'react-native-paper';
import {ListItem} from '@/Components';
import {useLanguage} from '@/Hooks/Language';
import {useShowToast} from '@/Hooks/useToast';
import {useShowDialog} from '@/Hooks/useDialog';
import {useMutation} from '@/Hooks/useMutation';
import {Selectors, useAppSelector} from '@/Redux';
import {CommentsApi} from '@/Api';
import {createModal} from './Modal';

export const modalKey = 'commentActions';

export const Modal = createModal<{comment: CommentsApi.Comment; onEditPress: () => void}>(
  ({comment, onEditPress: onEditPressProp, modalizeRef}) => {
    const language = useLanguage();

    const isSelf = useAppSelector((state) =>
      Selectors.Auth.UserIsSelf(state, comment.author.username),
    );

    const showToast = useShowToast();
    const showDialog = useShowDialog();

    const queryClient = useQueryClient();

    const deleteComment = useMutation({
      mutationKey: ['comment', 'delete', comment.id],
      mutationFn: () => CommentsApi.deleteComment(comment.id),
    });

    const showDeleteDialog = () => {
      showDialog({
        title: language.comments.delete_dialog_title,
        message: language.comments.delete_dialog_message,
        actions: [
          {
            label: language.common.delete,
            type: 'destructive',
            hideOnPress: true,
            onPress: async () => {
              await deleteComment.mutateAsync(undefined, {
                onSuccess: () => {
                  modalizeRef.current?.close();

                  showToast({
                    title: language.comments.delete_success_title,
                    message: language.comments.delete_success_message,
                    type: 'success',
                  });

                  queryClient.invalidateQueries({
                    queryKey: ['comments', comment.postId],
                  });
                },
              });
            },
          },
          {
            label: language.common.cancel,
            hideOnPress: true,
            type: 'cancel',
          },
        ],
      });
    };

    const onEditPress = () => {
      modalizeRef.current?.close();
      onEditPressProp();
    };

    return (
      <List.Section>
        {/** TODO: Report? */}
        {!isSelf && <ListItem title="Report" onPress={() => {}} icon="alert-circle" />}

        {isSelf && (
          <ListItem title={language.common.delete} onPress={showDeleteDialog} icon="trash-2" />
        )}

        {isSelf && <ListItem title={language.common.edit} onPress={onEditPress} icon="edit" />}
      </List.Section>
    );
  },
);
