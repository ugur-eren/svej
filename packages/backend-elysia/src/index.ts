import {Env} from '@svej/server-side';
import {node} from '@elysia/node';
import {Elysia} from 'elysia';
import router from './router';

const app = new Elysia({adapter: node()})
  .onBeforeHandle((req) => {
    console.info(`${req.request.method} ${req.request.url}`);
  })
  .use(router);

app.listen(Env.BACKEND_PORT, () => {
  console.info(`Express server started listening on port ${Env.BACKEND_PORT}`);
});
