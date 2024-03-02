import {StyleSheet, View} from 'react-native';
import {Placeholder, Fade} from 'rn-placeholder';
import {PlaceholderLine, PlaceholderMedia} from '../Placeholder/Placeholder';
import {Spacing} from '../../Styles';

export const Comment: React.FC = () => {
  return (
    <Placeholder Animation={Fade}>
      <View style={styles.comment}>
        <View style={styles.avatar}>
          <PlaceholderMedia isRound size={45} />

          <View style={styles.username}>
            <PlaceholderLine width={30} height={10} />
            <PlaceholderLine width={40} height={10} noMargin />
          </View>
        </View>

        <PlaceholderLine width={100} />
        <PlaceholderLine width={100} />

        <View style={styles.counts}>
          <PlaceholderMedia isRound size={35} />
          <PlaceholderMedia isRound size={35} />
        </View>
      </View>
    </Placeholder>
  );
};

const styles = StyleSheet.create({
  comment: {
    paddingHorizontal: Spacing.pagePadding,
    marginBottom: Spacing.xxxlarge,
  },
  avatar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginVertical: Spacing.small,
  },
  username: {
    flex: 1,
    justifyContent: 'center',
  },
  counts: {
    flex: 1,
    flexDirection: 'row',
    gap: Spacing.large,
  },
});
