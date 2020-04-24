import { useCallback, useEffect, useRef, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { EndpointMethod } from './';
import { nanoid } from '@reduxjs/toolkit';
import { IEndpointState } from './EndpointState';
import { RequestStatus } from './RequestStatus';

type ExecuteActionCreatorHook<RequestPayload, MethodProps, Result> = (params: RequestPayload, props: MethodProps) => Result;
type ExecuteActionCreatorHookReturn<RequestPayload, MethodProps> = ExecuteActionCreatorHook<RequestPayload, MethodProps, string>;

export const useEndpointMethod = <RequestPayload, ResponsePayload, MethodProps>(
  method: EndpointMethod<RequestPayload, ResponsePayload, MethodProps>
): ExecuteActionCreatorHookReturn<RequestPayload, MethodProps> => {
  const executions = useRef<string[]>([]);
  const dispatch = useDispatch();

  // When component unmounts, remove any requests that were being tracked in the store
  useEffect(() => {
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      const requestIds = executions.current;
      if (requestIds?.length) {
        dispatch(method.ClearRequests(requestIds));
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, method]);

  const wrap = useCallback((
    action: ExecuteActionCreatorHook<RequestPayload, MethodProps, ReturnType<typeof method.Execute>>
  ): ExecuteActionCreatorHook<RequestPayload, MethodProps, string> => {

    const wrappedAction = (...args: [RequestPayload, MethodProps]): string => {
        const result = action.apply(undefined, args);
        const id = result.meta.props.id || nanoid();

        dispatch(result);
        executions.current.push(id);

        return id;
    }

    return wrappedAction as any;
  }, [dispatch, method])

  const executor = useCallback(wrap(method.Execute), []);
  return executor;
};

export const useEndpointMethodRequests = (
  method: EndpointMethod<any, any, any>
) => {
  const sliceName = method.Execute.type.split('/')[1];

  const [requests, isFetching] = useSelector((state: any) => {
    const slice: IEndpointState = state[sliceName];

    let isFetching = false;
    const requests = Object.values(slice.requests.entities).filter((r) => r?.type === method.Execute.type);
    for (const request of requests) {
      if (request && (request.status === RequestStatus.PENDING || request.status === RequestStatus.EXECUTING)) {
        isFetching = true;
        break;
      }
    }

    return [requests, isFetching];
  });

  return useMemo(() => ({
    requests,
    isFetching,
  }), [isFetching, requests]);
};
