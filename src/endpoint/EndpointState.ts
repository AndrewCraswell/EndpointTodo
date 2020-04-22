import { EntityState } from '@reduxjs/toolkit';

import { SlimRequestResponse, RequestMethod } from './';

export interface IRequestRecord {
  id: string;
  type: string;
  isFetching: boolean;
  isFetched: boolean;
  isError: boolean;
  params: any;
  method: RequestMethod;
  executedAt: Date;
  completedAt?: Date;
  response?: SlimRequestResponse;
}

export interface IEndpointState {
  isFetching: boolean;
  requests: EntityState<IRequestRecord>;
}

