import {FlatList} from 'react-native';
import {Image} from 'expo-image';
import Message from './Message/Message';
import MessageInput from './MessageInput/MessageInput';
import {Header} from '../../../Components';
import {PageContainer} from '../../../Containers';
import styles from './Chat.styles';

const Chat: React.FC = () => {
  return (
    <PageContainer>
      <Header
        mode="small"
        title="ugur-eren"
        avatar={
          <Image
            source={{uri: `https://unsplash.it/600/600/?random=${Math.random()}`}}
            style={styles.headerAvatar}
          />
        }
      />

      <FlatList
        inverted
        data={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]}
        renderItem={({item}) => <Message type={item % 2 ? 'sent' : 'received'} />}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
        removeClippedSubviews
        automaticallyAdjustKeyboardInsets
      />

      <MessageInput style={styles.messageInput} />
    </PageContainer>
  );
};

export default Chat;
