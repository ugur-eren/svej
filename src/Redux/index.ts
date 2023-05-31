import {useDispatch, useSelector, type TypedUseSelectorHook} from 'react-redux';
import {store, persistor, type RootState, type AppDispatch} from './store';

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export {store, persistor, type RootState, type AppDispatch};

export * from './Reducers';
export * from './Selectors';
