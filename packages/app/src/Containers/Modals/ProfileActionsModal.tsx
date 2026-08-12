import {useQueryClient} from '@tanstack/react-query';
import {List} from 'react-native-paper';
import {ListItem} from '@/Components';
import {useLanguage} from '@/Hooks/Language';
import {useMutation} from '@/Hooks/useMutation';
import {useShowDialog} from '@/Hooks/useDialog';
import {useShowToast} from '@/Hooks/useToast';
import {UsersApi} from '@/Api';
import {parseLanguageParts} from '@/Utils/Helpers';
import {createModal} from './Modal';

export const modalKey = 'profileActions';

export const Modal = createModal<{user: {id: string; username: string}}>(({user, modalizeRef}) => {
  const language = useLanguage();

  const showToast = useShowToast();
  const showDialog = useShowDialog();

  const queryClient = useQueryClient();

  const block = useMutation({
    mutationKey: ['block'],
    mutationFn: UsersApi.block,
  });

  const showBlockDialog = () => {
    showDialog({
      title: parseLanguageParts(language.profile.block_dialog_title, {username: user.username}),
      message: language.profile.block_dialog_message,
      actions: [
        {
          label: language.profile.block,
          type: 'destructive',
          hideOnPress: true,
          onPress: async () => {
            await block.mutateAsync(user.id, {
              onSuccess: () => {
                modalizeRef.current?.close();

                showToast({
                  title: language.profile.block_success_title,
                  message: language.profile.block_success_message,
                  type: 'success',
                });

                queryClient.invalidateQueries({queryKey: ['user', user.username]});
                queryClient.invalidateQueries({queryKey: ['posts', 'profile', user.id]});
                queryClient.invalidateQueries({queryKey: ['blockedUsers']});
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
    <List.Section>
      <ListItem title={language.profile.block} onPress={showBlockDialog} icon="slash" />

      {/** TODO: Report? */}
      <ListItem title="Report" onPress={() => {}} icon="alert-circle" />
    </List.Section>
  );
});
