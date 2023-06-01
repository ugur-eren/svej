import 'dotenv/config';

if (process.env.USE_CONFIG !== 'true') {
  throw new Error(`
    Please fill in the .env file with your config.
    You can find the example in .env.sample file in the root of the project.
  `);
}

// eslint-disable-next-line import/first
import './src';
