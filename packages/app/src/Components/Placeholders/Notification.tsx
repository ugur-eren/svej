import {StyleSheet, View} from 'react-native';
import {Placeholder, Fade} from 'rn-placeholder';
import {PlaceholderLine, PlaceholderMedia} from '../Placeholder/Placeholder';
import {Spacing} from '../../Styles';

export const Notification: React.FC = () => {
  return (
    <Placeholder Animation={Fade}>
      <View style={styles.container}>
        <View style={styles.avatar}>
          <PlaceholderMedia isRound size={60} />

          <View style={styles.username}>
            <PlaceholderLine width={60} height={10} />
            <PlaceholderLine width={100} height={10} />
            <PlaceholderLine width={40} height={10} noMargin />
          </View>
        </View>
      </View>
    </Placeholder>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.pagePadding,
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
});
