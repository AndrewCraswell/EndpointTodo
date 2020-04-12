export interface IEndpointState {
  isFetching: boolean;
  requests: []
}

export const defaultEndpointState: IEndpointState = {
  isFetching: false,
  requests: []
}
