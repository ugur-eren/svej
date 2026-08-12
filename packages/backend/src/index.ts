import {Env} from '@svej/server-side';
import {ErrorCodes, HTTPStatus} from '@svej/common';
import {node} from '@elysia/node';
import {Elysia} from 'elysia';
import router from './router';
import {ModuleError} from './Utils/Error';

const app = new Elysia({adapter: node()})
  .onBeforeHandle(({request}) => {
    console.info(`${request.method} ${request.url}`);
  })
  .onError(({code, error, status}) => {
    if (code === 'VALIDATION') {
      return status(HTTPStatus.BadRequest, {
        code: ErrorCodes.FillAllFields,
        error: error.valueError,
        message: error.customError,
      });
    }

    if (error instanceof ModuleError) {
      let statusCode: number = HTTPStatus.BadRequest;
      if (error.code.includes('NotFound')) statusCode = HTTPStatus.NotFound;
      if (error.code === ErrorCodes.Forbidden) statusCode = HTTPStatus.Forbidden;

      return status(statusCode, {
        code: error.code,
        message: error.message,
      });
    }

    return status(HTTPStatus.InternalServerError, {
      code: ErrorCodes.UnknownError,
      message: error instanceof Error ? error.message : 'An unknown error occurred',
    });
  })
  .use(router);

app.listen(Env.BACKEND_PORT, () => {
  console.info(`Elysia server started listening on port ${Env.BACKEND_PORT}`);
});

export type App = typeof app;
