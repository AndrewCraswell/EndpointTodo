import { Reducer, AnyAction } from 'redux';

import { AsyncRegistry } from './AsyncRegistry';

export const reducerRegistry = new AsyncRegistry<Reducer<any, AnyAction>>();
