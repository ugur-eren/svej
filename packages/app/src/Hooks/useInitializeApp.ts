import {useEffect, useState} from 'react';
import {SessionUser} from '@svej/common';
import {AuthActions, useAppDispatch} from '@/Redux';
import {AuthApi} from '@/Api';
import Storage from '@/Utils/Storage';

export const useInitializeApp = () => {
  const [initialized, setInitialized] = useState(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    (async () => {
      const refreshToken = await Storage.get('refreshToken');

      if (refreshToken) {
        let user: SessionUser | undefined;
        let accessToken: string | undefined;

        try {
          const refreshResult = await AuthApi.refresh(refreshToken);

          if (refreshResult.ok && refreshResult.data) {
            accessToken = refreshResult.data.accessToken;
            user = refreshResult.data.user;
          }
        } catch {
          user = undefined;
          accessToken = undefined;
        }

        if (!user || !accessToken) {
          dispatch(AuthActions.setAuthenticated(false));
          dispatch(AuthActions.setAccessToken());
          dispatch(AuthActions.setUser());
          return;
        }

        dispatch(AuthActions.setAuthenticated(true));
        dispatch(AuthActions.setAccessToken(accessToken));
        dispatch(AuthActions.setUser(user));
      }
    })().finally(() => setInitialized(true));
  }, [dispatch]);

  return initialized;
};
