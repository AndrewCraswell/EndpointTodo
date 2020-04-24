import { Reducer, AnyAction } from 'redux';

import { AsyncRegistry } from './';

export const reducerRegistry = new AsyncRegistry<Reducer<any, AnyAction>>();
