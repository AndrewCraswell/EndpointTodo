import { configureStore, getDefaultMiddleware } from 'rtoolkit-immer-fix'
import createSagaMiddleware from 'redux-saga'
import { Saga } from 'redux-saga';

import { endpointRegistrarEnhancer } from '../endpoint';
import { TodoSlice } from './slices/todo';
import { sagaRegistry } from '../endpoint/saga';

export type ApplicationState = {
  // This breaks code-splitting
  Todo: typeof TodoSlice.initialState
}

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: () => {},
  middleware: [...getDefaultMiddleware({ thunk: false }), sagaMiddleware],
  enhancers: [endpointRegistrarEnhancer()]
})

sagaRegistry.setChangeListener((name: string, saga: Saga) => {
  sagaMiddleware.run(saga);
});
