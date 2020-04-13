import { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import { EndpointMethod } from './';

// TODO: Implement hook to automatically execute the request() action
// TODO: Fix typing so the parameters of request() are typesafe

export const useEndpointMethod = <RequestPayload, ResponsePayload, ErrorPayload, MethodProps>(method: EndpointMethod<RequestPayload, ResponsePayload, ErrorPayload, MethodProps>) => {
  const dispatch = useDispatch();

  function wrap<Action extends Function>(action: Action): Action {
    var wrappedAction = (...args: any[]) => {
        dispatch(action.apply(undefined, args));
        return null;
    }
    return wrappedAction as any;
  }

  const action = method.Execute;
  return useCallback(wrap(action), []);
};
