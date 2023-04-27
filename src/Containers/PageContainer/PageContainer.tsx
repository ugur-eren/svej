import {View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Props} from './PageContainer.props';
import {useTheme} from '../../Hooks';
import getStyles from './PageContainer.styles';

const PageContainer: React.FC<Props> = (props) => {
  const {
    children,
    withPadding,
    withMargin,
    withSafeArea,
    edges,
    style,
    containerStyle,
    ...restProps
  } = props;

  const theme = useTheme();

  const styles = getStyles(theme, !!withPadding, !!withMargin);

  const ContainerComponent = withSafeArea ? SafeAreaView : View;

  return (
    <ContainerComponent
      edges={withSafeArea ? edges : undefined}
      style={[styles.container, containerStyle]}
    >
      <View style={[styles.content, style]} {...restProps}>
        {children}
      </View>
    </ContainerComponent>
  );
};

export default PageContainer;
