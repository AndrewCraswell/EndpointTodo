import { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import { EndpointMethod } from './';

type ExecuteActionCreatorHook<RequestPayload, MethodProps, Result> = (params: RequestPayload, props: MethodProps) => Result;

export const useEndpointMethod = <RequestPayload, ResponsePayload, MethodProps>(method: EndpointMethod<RequestPayload, ResponsePayload, MethodProps>) => {
  const dispatch = useDispatch();

  function wrap(action: ExecuteActionCreatorHook<RequestPayload, MethodProps, any>): ExecuteActionCreatorHook<RequestPayload, MethodProps, string> {
    const wrappedAction = (...args: [RequestPayload, MethodProps]): string => {
        const result = action.apply(undefined, args) as any;
        dispatch(result);

        return result.meta.id;
    }

    return wrappedAction as any;
  }

  return useCallback(wrap(method.Execute), []);
};
