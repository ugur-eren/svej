import {useEffect, useState} from 'react';
import {AuthActions, useAppDispatch} from '../Redux';
import {AuthApi, UserApi} from '../Api';
import {PrismaUser} from '../Api/User/User.types';
import Storage from '../Utils/Storage';

export const useInitializeApp = () => {
  const [initialized, setInitialized] = useState(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    (async () => {
      const token = await Storage.get('token');

      if (token) {
        let user: PrismaUser | undefined;

        try {
          const verifyResult = await AuthApi.verify({token});

          if (verifyResult.ok && verifyResult.data?.ok) {
            const meResult = await UserApi.getMe();

            if (meResult.ok) {
              user = meResult.data;
            }
          }
        } catch (error) {
          user = undefined;
        }

        if (!user) {
          dispatch(AuthActions.setAuthenticated(false));
          dispatch(AuthActions.setUser());
          return;
        }

        dispatch(AuthActions.setAuthenticated(true));
        dispatch(AuthActions.setUser(user));
      }
    })().finally(() => setInitialized(true));
  }, [dispatch]);

  return initialized;
};
