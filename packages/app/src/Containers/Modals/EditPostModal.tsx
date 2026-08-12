import {Config, Zod} from '@svej/common';
import {useQueryClient} from '@tanstack/react-query';
import {useState} from 'react';
import {View} from 'react-native';
import {Button, Input} from '@/Components';
import {useLanguage} from '@/Hooks/Language';
import {useShowToast} from '@/Hooks/useToast';
import {useShowDialog} from '@/Hooks/useDialog';
import {useMutation} from '@/Hooks/useMutation';
import {PostsApi} from '@/Api';
import {parseLanguageParts} from '@/Utils/Helpers';
import {createModal} from './Modal';

export const modalKey = 'editPost';

export const Modal = createModal<{post: PostsApi.Post}>(({post, modalizeRef}) => {
  const [description, setDescription] = useState(post.description || '');

  const language = useLanguage();

  const showToast = useShowToast();
  const showDialog = useShowDialog();

  const queryClient = useQueryClient();

  const editPost = useMutation({
    mutationKey: ['post', 'edit', post.id],
    mutationFn: (newDescription?: string) => PostsApi.editPost(post.id, newDescription),
  });

  const onSubmit = () => {
    const messageValidation = Zod.Post.Metadata.safeParse({description});
    if (!messageValidation.success) {
      showToast({
        title: language.share.message_too_long_title,
        message: parseLanguageParts(language.share.message_too_long_message, {
          max: Config.postDescriptionMaxLength,
        }),
        type: 'warning',
      });
      return;
    }

    const newDescription = messageValidation.data.description;

    if (post.medias.length === 0 && !newDescription) {
      showToast({
        title: language.common.warning,
        message: language.api_errors.PostDoesntHaveMediaOrDescription,
        type: 'warning',
      });
      return;
    }

    showDialog({
      title: language.post.edit_dialog_title,
      message: language.post.edit_dialog_message,
      actions: [
        {
          label: language.common.edit,
          type: 'destructive',
          hideOnPress: true,
          onPress: async () => {
            await editPost.mutateAsync(newDescription, {
              onSuccess: () => {
                modalizeRef.current?.close();

                showToast({
                  title: language.post.edit_success_title,
                  message: language.post.edit_success_message,
                  type: 'success',
                });

                queryClient.invalidateQueries({
                  queryKey: ['post', post.id],
                });
                queryClient.invalidateQueries({
                  queryKey: ['posts', 'profile', post.author.id],
                });
                queryClient.invalidateQueries({
                  queryKey: ['posts', 'explore'],
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

  return (
    <View>
      <Input
        value={description}
        onChangeText={setDescription}
        placeholder={language.share.message_placeholder}
        leftIcon="message-square"
        multiline
      />

      <Button title={language.common.edit} onPress={onSubmit} />
    </View>
  );
});
