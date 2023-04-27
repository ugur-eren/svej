// eslint-disable-next-line import/no-extraneous-dependencies
import 'dotenv/config';

export default ({config}) => {
  return {
    ...config,
    extra: {
      ...config.extra,

      USE_CONFIG: process.env.USE_CONFIG,
    },
  };
};
