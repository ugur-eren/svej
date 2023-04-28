import {StyleSheet, View, ViewProps} from 'react-native';
import {useTheme} from '../../Hooks';
import getStyles from './styles';

export type AuthPageContentProps = ViewProps;

const Content: React.FC<AuthPageContentProps> = ({children, style: styleProp, ...props}) => {
  const theme = useTheme();

  const styles = getStyles(theme);

  return (
    <View style={StyleSheet.compose(styles.content, styleProp)} {...props}>
      {children}
    </View>
  );
};

export default Content;
