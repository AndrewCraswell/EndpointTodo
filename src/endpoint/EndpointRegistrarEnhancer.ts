import { AnyAction, combineReducers, StoreCreator, StoreEnhancer, Reducer, ReducersMapObject } from 'redux';

import { reducerRegistry } from './ReducerRegistry';

export function endpointRegistrarEnhancer(): StoreEnhancer<any> {
  return (createStore: StoreCreator) => <S, A extends AnyAction>(
    reducer: Reducer<S, A>,
    ...args: any[]
  ) => {
    const store = createStore(reducer, ...args)

    reducerRegistry.setChangeListener((reducers: ReducersMapObject) => {
      store.replaceReducer(combineReducers(reducers));
    });

    return store;
  }
}
