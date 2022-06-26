import { AnyAction, configureStore, ThunkAction, Action, Store, Reducer, ReducersMapObject, combineReducers } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import authentication from './shared/reducers/authentication';
import profile from './shared/reducers/profile';




const store = configureStore({
  reducer: {
    authentication: authentication,
    profile: profile,

  }
});

// Allow lazy loading of reducers https://github.com/reduxjs/redux/blob/master/docs/usage/CodeSplitting.md
interface InjectableStore<S = any, A extends Action = AnyAction> extends Store<S, A> {
  asyncReducers: ReducersMapObject;
  injectReducer(key: string, reducer: Reducer): void;
}

export function configureInjectableStore(storeToInject: any) {
  const injectableStore = storeToInject as InjectableStore<any, any>;
  injectableStore.asyncReducers = {};

  injectableStore.injectReducer = (key, asyncReducer) => {
    injectableStore.asyncReducers[key] = asyncReducer;
    injectableStore.replaceReducer(
      combineReducers({
        authentication: authentication,
        profile: profile,

        ...injectableStore.asyncReducers,
      })
    );
  };

  return injectableStore;
}

const injectableStore = configureInjectableStore(store);

const getStore = () => injectableStore;

export type IRootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppSelector: TypedUseSelectorHook<IRootState> = useSelector;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, IRootState, unknown, AnyAction>;

export default getStore;
