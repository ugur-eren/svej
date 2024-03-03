import {useEffect, useRef, useState} from 'react';
import {SocketClient, getSocket} from '../Api';
import {useShowToast} from './useToast';
import {useLanguage} from './Language';

export const useSocketClient = () => {
  const ioClient = useRef<SocketClient>();

  const [connecting, setConnecting] = useState(true);

  const language = useLanguage();
  const showToast = useShowToast();

  useEffect(() => {
    (async () => {
      setConnecting(true);

      try {
        ioClient.current = await getSocket();

        await new Promise<void>((resolve, reject) => {
          ioClient.current?.on('connect', () => {
            resolve();
          });

          ioClient.current?.on('connect_error', (err) => {
            reject(err);
          });
        });
      } catch (e) {
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
  }, []);

  return {ioClient, connecting};
};
