import {useEffect, useState} from 'react';
import {FlatList, View} from 'react-native';
import uuid from 'react-native-uuid';
import {ActivityIndicator} from 'react-native-paper';
import {InfiniteData, skipToken, useQueryClient} from '@tanstack/react-query';
import {Avatar, Header, Placeholders} from '@/Components';
import {PageContainer} from '@/Containers';
import {
  useInfiniteQuery,
  useLanguage,
  useOnMount,
  useShowApiError,
  useShowToast,
  useSocketClient,
} from '@/Hooks';
import {Selectors, useAppSelector} from '@/Redux';
import {ChatsApi, throwApiError} from '@/Api';
import {ChatScreenProps} from '@/Types';
import Message from './Message';
import MessageInput from './MessageInput';
import styles from './styles';

const Chat: React.FC<ChatScreenProps> = ({route}) => {
  const {conversationId: conversationIdParam, userId, username, avatar} = route.params;

  const selfId = useAppSelector((state) => Selectors.Auth.User(state).id);

  const {ioClient, connecting: socketConnecting} = useSocketClient();
  const queryClient = useQueryClient();
  const showApiError = useShowApiError();
  const showToast = useShowToast();
  const language = useLanguage();

  const [conversationId, setConversationId] = useState<string | undefined>(conversationIdParam);
  const [pendingMessages, setPendingMessages] = useState<
    (ChatsApi.ChatMessage & {sending: true})[]
  >([]);

  const {
    data: messages,
    isLoading,
    isFetching,
  } = useInfiniteQuery({
    queryKey: ['chat', conversationId],
    queryFn: conversationId
      ? async ({pageParam}) => ChatsApi.getConversationMessages(conversationId, pageParam)
      : skipToken,
    select: (data) => {
      return data.pages
        .map((page) => page.messages)
        .filter((page): page is NonNullable<typeof page> => !!page)
        .flat();
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage, _, lastPageParam) => {
      const nextPageParam = lastPage?.nextCursor;
      if (nextPageParam && nextPageParam !== lastPageParam) {
        return nextPageParam;
      }
      return undefined;
    },
  });

  const getConversationIdByParticipant = async (create: boolean) => {
    try {
      const response = await (
        create
          ? ChatsApi.getOrCreateConversationByParticipant
          : ChatsApi.getConversationByParticipant
      )(userId);

      throwApiError(response);

      if (response.data?.id) {
        setConversationId(response.data.id);
        return response.data.id;
      }

      return undefined;
    } catch (err) {
      showApiError(err as Error);
      return undefined;
    }
  };

  useOnMount(() => {
    if (!conversationIdParam) {
      getConversationIdByParticipant(false);
    }
  });

  const appendMessage = (message: ChatsApi.ChatMessage) => {
    return queryClient.setQueryData(
      ['chat', message.conversationId],
      (old: InfiniteData<{messages: ChatsApi.ChatMessage[]}> | undefined) => {
        if (!old) return old;

        return {
          ...old,
          pages: [
            {
              ...old.pages[0],
              messages: [message, ...old.pages[0].messages],
            },
            ...old.pages.slice(1),
          ],
        };
      },
    );
  };

  useEffect(() => {
    if (!ioClient.current) return undefined;

    const client = ioClient.current;

    const onMessage = (message: ChatsApi.ChatMessage) => {
      appendMessage(message);
    };

    client.on('message', onMessage);

    return () => {
      client?.off('message', onMessage);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryClient, socketConnecting]);

  const onSendMessage = async (message: string) => {
    if (!ioClient.current) return;

    let resolvedConversationId = conversationId;
    if (!resolvedConversationId) {
      resolvedConversationId = await getConversationIdByParticipant(true);

      if (!resolvedConversationId) {
        showToast({
          type: 'error',
          title: language.chat.couldnt_send_title,
          message: language.chat.couldnt_send_message,
        });
        return;
      }
    }

    try {
      const tempMessageId = uuid.v4().toString();

      setPendingMessages((prev) => [
        {
          conversationId: resolvedConversationId,
          id: tempMessageId,
          createdAt: new Date(),
          updatedAt: new Date(),
          fromId: selfId,
          message,
          sending: true,
        },
        ...prev,
      ]);

      const ack = await ioClient.current.emitWithAck(
        'sendMessage',
        resolvedConversationId,
        message,
      );

      if (!ack.ok) {
        // TODO: retry logic
        setPendingMessages((prev) => prev.filter((m) => m.id !== tempMessageId));
        showApiError({code: ack.code}, language.chat.couldnt_send_message);
        return;
      }

      appendMessage(ack.message);

      setPendingMessages((prev) => prev.filter((m) => m.id !== tempMessageId));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <PageContainer>
      <Header
        mode="small"
        title={username}
        left={<Avatar image={avatar} style={styles.headerAvatar} />}
      />

      {isLoading || socketConnecting ? (
        <Placeholders.ChatList />
      ) : (
        <FlatList
          inverted
          data={[...pendingMessages, ...(messages ?? [])] as typeof pendingMessages}
          keyExtractor={(item) => item.id}
          renderItem={({item}) => (
            <Message
              message={item}
              type={item.fromId === selfId ? 'sent' : 'received'}
              sending={item.sending}
              userAvatar={avatar}
            />
          )}
          ListFooterComponent={
            isFetching ? (
              <View style={styles.loader}>
                <ActivityIndicator size="large" />
              </View>
            ) : undefined
          }
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="handled"
          removeClippedSubviews
        />
      )}

      <MessageInput onSendMessage={onSendMessage} />
    </PageContainer>
  );
};

export default Chat;
