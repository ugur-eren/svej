import {useQueryClient} from '@tanstack/react-query';
import {List} from 'react-native-paper';
import {ListItem} from '@/Components';
import {useLanguage} from '@/Hooks/Language';
import {useShowToast} from '@/Hooks/useToast';
import {useShowDialog} from '@/Hooks/useDialog';
import {useMutation} from '@/Hooks/useMutation';
import {useOpenModal} from '@/Hooks/useModal';
import {Selectors, useAppSelector} from '@/Redux';
import {PostsApi} from '@/Api';
import {createModal} from './Modal';

export const modalKey = 'postActions';

export const Modal = createModal<{post: PostsApi.Post}>(({post, modalizeRef}) => {
  const language = useLanguage();

  const isSelf = useAppSelector((state) => Selectors.Auth.UserIsSelf(state, post.author.username));

  const showToast = useShowToast();
  const showDialog = useShowDialog();
  const openModal = useOpenModal();

  const queryClient = useQueryClient();

  const deletePost = useMutation({
    mutationKey: ['post', 'delete', post.id],
    mutationFn: () => PostsApi.deletePost(post.id),
  });

  const showDeleteDialog = () => {
    showDialog({
      title: language.post.delete_dialog_title,
      message: language.post.delete_dialog_message,
      actions: [
        {
          label: language.common.delete,
          type: 'destructive',
          hideOnPress: true,
          onPress: async () => {
            await deletePost.mutateAsync(undefined, {
              onSuccess: () => {
                modalizeRef.current?.close();

                showToast({
                  title: language.post.delete_success_title,
                  message: language.post.delete_success_message,
                  type: 'success',
                });

                queryClient.invalidateQueries({queryKey: ['post', post.id]});
                queryClient.invalidateQueries({queryKey: ['posts', 'profile', post.author.id]});
                queryClient.invalidateQueries({queryKey: ['posts', 'explore']});
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

  const showEditModal = () => {
    openModal('editPost', {post});
    modalizeRef.current?.close();
  };

  return (
    <List.Section>
      {/** TODO: Share? */}
      <ListItem title={language.common.share} icon="share-2" />

      {/** TODO: Report? */}
      {!isSelf && <ListItem title="Report" onPress={() => {}} icon="alert-circle" />}

      {isSelf && (
        <ListItem title={language.common.delete} onPress={showDeleteDialog} icon="trash-2" />
      )}

      {isSelf && <ListItem title={language.common.edit} onPress={showEditModal} icon="edit" />}
    </List.Section>
  );
});
