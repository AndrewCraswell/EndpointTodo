import { useCallback, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Dictionary } from 'rtoolkit-immer-fix';

import { EndpointSlice, isRequestFetching, IRequestRecord, IEndpointState } from '..';
import { EndpointMethodMap } from '../EndpointMethod';

export const useEndpointRequests = <EndpointMethods extends EndpointMethodMap>(
  endpoint: EndpointSlice<any, EndpointMethods>,
  ids?: string | string[]
) => {
  const requestsRef = useRef<IRequestRecord[]>([]);
  const entitiesRef = useRef<Dictionary<IRequestRecord>>({});
  const dispatch = useDispatch();
  const sliceName = endpoint.name;

  let queryIds: string[] | undefined;
  if (ids && !Array.isArray(ids)) {
    queryIds = [ids];
  }

  const [requests, isFetching] = useSelector((state: any) => {
    const slice: IEndpointState = state[sliceName];
    const requests = Object.values(slice.requests.entities).filter((r) => (queryIds && r) ? queryIds.includes(r.id) : !!r) as IRequestRecord[];

    let isFetching = requests.some(r => r && isRequestFetching(r));

    requestsRef.current = requests;
    entitiesRef.current = slice.requests.entities;
    return [requests, isFetching];
  });

  const flushRequests = useCallback((idsToFlush?: string | string[]) => {
    let flushIds: string[] | undefined;
    if (idsToFlush) {
      flushIds = Array.isArray(idsToFlush) ? idsToFlush : [idsToFlush];
    }

    if (!flushIds) {
      flushIds = Object.keys(entitiesRef.current);
    }

    const entities = entitiesRef.current;
    const requestsMap: { [id: string]: string[] } = {};
    for(const id of flushIds) {
      const request = entities[id];
      if (request) {
        const type = request.type;
        if (requestsMap[type]) {
          requestsMap[type].push(request.id);
        } else {
          requestsMap[type] = [request.id];
        }
      }
    }

    const actions: EndpointMethodMap = endpoint.actions;
    for (const type of Object.keys(requestsMap)) {
      for (const action of Object.values(actions)) {
        if (Object.values(action.Types).includes(type)) {
          dispatch(action.ClearRequests(requestsMap[type]));
        }
      }
    }
  }, [dispatch, endpoint]);

  return useMemo(() => ({
    requests,
    isFetching,
    flushRequests
  }), [isFetching, requests, flushRequests]);
};
