import {ApisauceConfig, create} from 'apisauce';

const ApiOptions: ApisauceConfig = {
  // TODO: Add your own base URL here
  baseURL: 'api-url',
  timeout: 15000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
};

export default create(ApiOptions);
