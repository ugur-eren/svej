import {StyleSheet, View} from 'react-native';
import {Placeholder, Fade} from 'rn-placeholder';
import {PlaceholderLine, PlaceholderMedia} from '../Placeholder/Placeholder';
import {Spacing} from '../../Styles';

export const Chat: React.FC = () => {
  return (
    <Placeholder Animation={Fade}>
      <View style={styles.container}>
        <View style={styles.chat}>
          <PlaceholderMedia isRound size={40} />
          <PlaceholderLine width={70} height={60} noMargin />
        </View>

        <View style={[styles.chat, styles.chatReversed]}>
          <PlaceholderLine width={70} height={60} noMargin />
          <PlaceholderMedia isRound size={40} />
        </View>

        <View style={[styles.chat, styles.chatReversed]}>
          <PlaceholderLine width={70} height={60} noMargin />
          <PlaceholderMedia isRound size={40} />
        </View>
      </View>
    </Placeholder>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.pagePadding,
  },
  chat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginVertical: Spacing.small,
  },

  chatReversed: {
    justifyContent: 'flex-end',
  },
});
