import {useEffect, useRef, useState} from 'react';
import {SocketClient, getSocket} from '../Api';

export const useSocketClient = () => {
  const ioClient = useRef<SocketClient>();

  const [connecting, setConnecting] = useState(true);

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
        // TODO: show toast
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
