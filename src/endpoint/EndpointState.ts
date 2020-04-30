import { EntityState } from 'rtoolkit-immer-fix';

import { IRequestRecord } from './';

export interface IEndpointState {
  requests: EntityState<IRequestRecord>;
}

