import {ChatMessage} from 'database';
import {useEffect, useState} from 'react';
import {FlatList, View} from 'react-native';
import uuid from 'react-native-uuid';
import {ActivityIndicator} from 'react-native-paper';
import Message from './Message/Message';
import MessageInput from './MessageInput/MessageInput';
import {Avatar, Header, Placeholders} from '../../../Components';
import {PageContainer} from '../../../Containers';
import {
  useLanguage,
  useOnMount,
  useShowApiError,
  useShowToast,
  useSocketClient,
} from '../../../Hooks';
import {Selectors, useAppSelector} from '../../../Redux';
import {ChatApi} from '../../../Api';
import {ChatScreenProps} from '../../../Types';
import styles from './Chat.styles';

const Chat: React.FC<ChatScreenProps> = ({route}) => {
  const {userId, username, avatarKey} = route.params;

  const selfId = useAppSelector((state) => Selectors.Auth.User(state).id);

  const {ioClient, connecting: socketConnecting} = useSocketClient();
  const showApiError = useShowApiError();
  const showToast = useShowToast();
  const language = useLanguage();

  const [initialLoading, setInitialLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<(ChatMessage & {sending?: boolean})[]>([]);

  const getMessages = async () => {
    setLoading(true);

    try {
      const response = await ChatApi.getChatMessages(userId);
      if (!response.ok || !response.data) return;

      setMessages(response.data);
    } catch (err) {
      showApiError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  useOnMount(() => {
    (async () => {
      setInitialLoading(true);
      await getMessages();
      setInitialLoading(false);
    })();
  });

  useEffect(() => {
    if (ioClient.current) {
      const client = ioClient.current;

      client.on('message', (message) => {
        setMessages((prev) => [message, ...prev]);
      });

      return () => {
        client?.off('message');
      };
    }

    return undefined;
  }, [ioClient, socketConnecting]);

  const onSendMessage = async (message: string) => {
    if (ioClient.current) {
      try {
        const tempMessageId = uuid.v4().toString();

        setMessages((prev) => [
          {
            id: tempMessageId,
            createdAt: new Date(),
            updatedAt: new Date(),
            fromId: selfId,
            toId: userId,
            message,
            sending: true,
          },
          ...prev,
        ]);

        const ack = await ioClient.current.emitWithAck('sendMessage', userId, message);

        if (!ack.ok) {
          showToast({
            type: 'error',
            title: language.chat.couldnt_send_title,
            message: language.chat.couldnt_send_message,
          });
          return;
        }

        setMessages((prev) => [ack.message, ...prev.filter((m) => m.id !== tempMessageId)]);
      } catch (e) {
        console.error(e);
      }
    }
  };

  return (
    <PageContainer>
      <Header
        mode="small"
        title={username}
        left={<Avatar key={avatarKey} style={styles.headerAvatar} />}
      />

      {initialLoading || socketConnecting ? (
        <Placeholders.ChatList />
      ) : (
        <FlatList
          inverted
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({item}) => (
            <Message
              message={item}
              type={item.toId === userId ? 'sent' : 'received'}
              sending={item.sending}
              userAvatarKey={avatarKey}
            />
          )}
          ListFooterComponent={
            loading ? (
              <View style={styles.loader}>
                <ActivityIndicator size="large" />
              </View>
            ) : undefined
          }
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="handled"
          removeClippedSubviews
          automaticallyAdjustKeyboardInsets
        />
      )}

      <MessageInput onSendMessage={onSendMessage} />
    </PageContainer>
  );
};

export default Chat;
