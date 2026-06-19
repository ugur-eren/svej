import {useCallback} from 'react';
import {SessionUser} from '@svej/common';
import {AuthApi} from '@/Api';
import {AuthActions, useAppDispatch} from '@/Redux';
import Storage from '@/Utils/Storage';

export const useRotateToken = () => {
  const dispatch = useAppDispatch();

  const rotateToken = useCallback(async () => {
    const refreshToken = await Storage.get('refreshToken');

    if (refreshToken) {
      let user: SessionUser | undefined;
      let accessToken: string | undefined;

      try {
        const refreshResult = await AuthApi.refresh(refreshToken);

        if (!refreshResult.error && refreshResult.data) {
          accessToken = refreshResult.data.accessToken;
          user = refreshResult.data.user;
        }
      } catch {
        user = undefined;
        accessToken = undefined;
      }

      if (!user || !accessToken) {
        dispatch(AuthActions.logout());
        return;
      }

      dispatch(AuthActions.login({accessToken, user}));
    }
  }, [dispatch]);

  return rotateToken;
};
