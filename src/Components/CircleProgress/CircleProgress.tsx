import Svg, {Circle} from 'react-native-svg';
import Animated, {useAnimatedProps, useDerivedValue, withTiming} from 'react-native-reanimated';
import {useTheme} from '../../Hooks';
import {CircleProgressProps} from './CircleProgress.props';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const CircleProgress: React.FC<CircleProgressProps> = (props) => {
  const {progress, radius, strokeWidth, color = 'primary', ...svgProps} = props;

  const theme = useTheme();

  const diameter = radius * 2;
  const innerRadius = radius - strokeWidth / 2;
  const circumference = 2 * Math.PI * innerRadius;

  const progressWithTiming = useDerivedValue(
    () => withTiming(progress.value * circumference, {duration: 300}),
    [progress],
  );

  const animatedProps = useAnimatedProps(() => {
    return {
      strokeDasharray: [progressWithTiming.value, circumference],
    };
  }, [progressWithTiming]);

  return (
    <Svg viewBox={`0 0 ${diameter} ${diameter}`} {...svgProps}>
      <AnimatedCircle
        animatedProps={animatedProps}
        cx={radius}
        cy={radius}
        r={innerRadius}
        fill="transparent"
        stroke={theme.colors[color]}
        strokeWidth={strokeWidth}
        strokeDasharray={[0, circumference]}
        strokeDashoffset={0}
        strokeLinecap="round"
        transform="rotate(-90 50 50)"
      />
    </Svg>
  );
};

export default CircleProgress;
