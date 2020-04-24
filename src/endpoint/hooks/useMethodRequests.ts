import { useCallback, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { EndpointMethod, isRequestFetching, IEndpointState, IRequestRecord  } from '..';

export const useMethodRequests = (
  method: EndpointMethod<any, any, any>
) => {
  const requestsRef = useRef<IRequestRecord[]>([]);
  const dispatch = useDispatch();
  const sliceName = method.Execute.type.split('/')[1];

  const [requests, isFetching] = useSelector((state: any) => {
    const slice: IEndpointState = state[sliceName];

    let isFetching = false;
    const requests = Object.values(slice.requests.entities).filter((r) => r && r.type === method.Execute.type) as IRequestRecord[];
    for (const request of requests) {
      if (request && isRequestFetching(request)) {
        isFetching = true;
        break;
      }
    }

    requestsRef.current = requests;
    return [requests, isFetching];
  });

  const flushRequests = useCallback((ids?: string | string[]) => {
    let flushIds: string[] | undefined;
    if (ids && !Array.isArray(ids)) {
      flushIds = [ids];
    }

    const requests = requestsRef.current;
    const requestsToFlush = requests.filter(r => {
      if (flushIds) {
        const foundIndex = flushIds.findIndex(id => id === r.id);
        if (foundIndex) {
          flushIds.splice(foundIndex, 1);
          return true;
        }
        return false
      }
      return true;
    }).map(r => r.id)

    if (requestsToFlush.length) {
      dispatch(method.ClearRequests(requestsToFlush));
    }
  }, [dispatch, method]);

  return useMemo(() => ({
    requests,
    isFetching,
    flushRequests
  }), [isFetching, requests, flushRequests]);
};
