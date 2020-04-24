import { EntityState } from '@reduxjs/toolkit';

import { SlimRequestResponse, RequestMethod, RequestStatus } from './';

export interface IRequestRecord {
  id: string;
  type: string;
  status: RequestStatus
  params: any;
  method: RequestMethod;
  executedAt: Date;
  completedAt?: Date;
  response?: SlimRequestResponse;
}

export interface IEndpointState {
  requests: EntityState<IRequestRecord>;
}

