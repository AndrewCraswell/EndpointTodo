import { EntityState } from '@reduxjs/toolkit';

import { IRequestRecord } from './';

export interface IEndpointState {
  requests: EntityState<IRequestRecord>;
}

