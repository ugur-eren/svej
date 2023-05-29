import {View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Button, Text, TextButton} from '../../Components';
import {useTheme} from '../../Hooks';
import getStyles from './styles';

export type AuthPageFooterProps = {
  /**
   * Title of the button
   */
  buttonTitle: string;

  /**
   * Title to show under the button
   */
  contentTitle: string;

  /**
   * Subtitle to show under the button
   */
  contentSubtitle: string;

  onButtonPress?: () => Promise<void> | void;
  onContentPress?: () => Promise<void> | void;
};

const Footer: React.FC<AuthPageFooterProps> = (props) => {
  const {buttonTitle, contentTitle, contentSubtitle, onButtonPress, onContentPress} = props;

  const theme = useTheme();

  const styles = getStyles(theme);

  return (
    <View style={styles.footerContainer}>
      <SafeAreaView edges={['bottom']}>
        <Text color="textLight">
          You will be navigated to the app when you press the button below
        </Text>

        <Button
          title={buttonTitle}
          showLoading
          onPress={onButtonPress}
          containerStyle={styles.footerButtonContainer}
        />

        <TextButton align="center" onPress={onContentPress}>
          {contentTitle}
          <Text color="primary" align="right" weight="semiBold">
            {'\n\n'}
            {contentSubtitle}
          </Text>
        </TextButton>
      </SafeAreaView>
    </View>
  );
};

export default Footer;
