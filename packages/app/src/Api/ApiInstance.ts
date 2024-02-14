import {ApisauceConfig, create} from 'apisauce';
import Env from '../Utils/Env';

const ApiOptions: ApisauceConfig = {
  baseURL: Env.SVEJ_PUBLIC_API_URL,
  timeout: 15000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
};

export default create(ApiOptions);
