import { useCallback, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';

import { EndpointMethod } from './';
import { nanoid } from '@reduxjs/toolkit';

type ExecuteActionCreatorHook<RequestPayload, MethodProps, Result> = (params: RequestPayload, props: MethodProps) => Result;

type ExecutionMap = {
  [type: string]: string[]
}

export const useEndpointMethod = <RequestPayload, ResponsePayload, MethodProps>(method: EndpointMethod<RequestPayload, ResponsePayload, MethodProps>) => {
  const executions = useRef<ExecutionMap>({});
  const dispatch = useDispatch();

  // When component unmounts, remove any requests that were being tracked in the store
  useEffect(() => {
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      const requestIds = executions.current[method.Execute.type];
      if (requestIds?.length) {
        dispatch(method.ClearRequests(requestIds));
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, method]);

  const wrap = useCallback((action: ExecuteActionCreatorHook<RequestPayload, MethodProps, ReturnType<typeof method.Execute>>): ExecuteActionCreatorHook<RequestPayload, MethodProps, string> => {

    const wrappedAction = (...args: [RequestPayload, MethodProps]): string => {
        const result = action.apply(undefined, args);
        const id = result.meta.props.id || nanoid();

        dispatch(result);

        const requestIds = executions.current[method.Execute.type];
        if (requestIds) {
          requestIds.push(id);
        } else {
          executions.current[method.Execute.type] = [id];
        }

        return id;
    }

    return wrappedAction as any;
  }, [dispatch, method])

  return useCallback(wrap(method.Execute), []);
};
