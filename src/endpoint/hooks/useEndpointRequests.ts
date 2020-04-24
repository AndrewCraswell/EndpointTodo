import { useCallback, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { EndpointSlice, isRequestFetching, IRequestRecord, IEndpointState } from '..';

export const useEndpointRequests = (
  endpoint: EndpointSlice<any, any>,
  ids?: string | string[]
) => {
  const requestsRef = useRef<IRequestRecord[]>([]);
  const dispatch = useDispatch();
  const sliceName = endpoint.name;

  let queryIds: string[] | undefined;
  if (ids && !Array.isArray(ids)) {
    queryIds = [ids];
  }

  const [requests, isFetching] = useSelector((state: any) => {
    const slice: IEndpointState = state[sliceName];

    let isFetching = false;
    const requests = Object.values(slice.requests.entities).filter((r) => (queryIds && r) ? queryIds.includes(r.id) : !!r) as IRequestRecord[];
    for (const request of requests) {
      if (request && isRequestFetching(request)) {
        isFetching = true;
        break;
      }
    }

    requestsRef.current = requests;
    return [requests, isFetching];
  });

  const flushRequests = useCallback((idsToFlush?: string | string[]) => {
    let flushIds: string[] | undefined;
    if (idsToFlush && !Array.isArray(idsToFlush)) {
      flushIds = [idsToFlush];
    }

    const requests = requestsRef.current;
    const requestsToFlush = requests.filter(r => {
      if (flushIds) {
        const foundIndex = flushIds.findIndex(id => id === r.id);
        if (foundIndex) {
          flushIds.splice(foundIndex, 1);
          return true;
        }
      }
      return false;
    }).map(r => r.id)

    if (requestsToFlush.length) {
      dispatch(endpoint.actions.ClearRequests(requestsToFlush));
    }
  }, [dispatch, endpoint]);

  return useMemo(() => ({
    requests,
    isFetching,
    flushRequests
  }), [isFetching, requests, flushRequests]);
};
