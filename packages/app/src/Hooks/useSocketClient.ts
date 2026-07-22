import {useEffect, useRef, useState} from 'react';
import {SocketClient, getSocket} from '@/Api';
import {store} from '@/Redux';
import {useShowToast} from './useToast';
import {useLanguage} from './Language';
import {useRotateToken} from './useRotateToken';

// TODO: make it a context provider
export const useSocketClient = () => {
  const ioClient = useRef<SocketClient>(undefined);

  const [connecting, setConnecting] = useState(true);

  const language = useLanguage();
  const showToast = useShowToast();
  const rotateToken = useRotateToken();

  useEffect(() => {
    (async () => {
      setConnecting(true);

      try {
        ioClient.current = getSocket();

        await new Promise<void>((resolve, reject) => {
          const onConnect = () => {
            resolve();
            ioClient.current?.off('connect', onConnect);
            ioClient.current?.off('connect_error', onConnectError);
          };

          const onConnectError = (err: Error) => {
            reject(err);
            ioClient.current?.off('connect', onConnect);
            ioClient.current?.off('connect_error', onConnectError);
          };

          ioClient.current?.on('connect', onConnect);
          ioClient.current?.on('connect_error', onConnectError);
        });

        ioClient.current.on('disconnect', async (reason) => {
          if (!ioClient.current || reason !== 'io server disconnect') return;

          await rotateToken();

          ioClient.current.auth = {
            token: store.getState().auth.accessToken,
          };
          ioClient.current.connect();
        });
      } catch {
        showToast({
          type: 'error',
          title: language.errors.socket_connection_title,
          message: language.errors.socket_connection_message,
        });
      } finally {
        setConnecting(false);
      }
    })();

    return () => {
      ioClient.current?.disconnect();
    };
  }, [language, showToast, rotateToken]);

  return {ioClient, connecting};
};
