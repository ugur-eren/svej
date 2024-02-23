// eslint-disable-next-line import/no-extraneous-dependencies
import 'dotenv/config';

export default ({config}) => {
  return {
    ...config,
    extra: {
      ...config.extra,

      ...Object.fromEntries(
        Object.entries(process.env).filter(([key]) => key.startsWith('SVEJ_PUBLIC_')),
      ),
    },
    plugins: ['expo-font'],
  };
};
