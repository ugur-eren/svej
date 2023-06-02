import 'dotenv/config';
import {USE_CONFIG} from './src/Utils/Env';

if (USE_CONFIG !== 'true') {
  throw new Error(`
    Please fill in the .env file with your config.
    You can find the example in .env.sample file in the root of the project.
  `);
}

// eslint-disable-next-line import/first
import './src';
