import { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import { EndpointMethod } from './';

export const useEndpointMethod = <RequestPayload, ResponsePayload, MethodProps>(method: EndpointMethod<RequestPayload, ResponsePayload, MethodProps>) => {
  const dispatch = useDispatch();

  function wrap<ActionFunction extends Function>(action: ActionFunction): ActionFunction {
    var wrappedAction = (...args: any[]) => {
        dispatch(action.apply(undefined, args));
        return null;
    }
    return wrappedAction as any;
  }

  return useCallback(wrap(method.Execute), []);
};
