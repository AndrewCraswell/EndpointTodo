export interface IEndpointState {
  isFetching: boolean;
  isFetched: boolean;
  isError: boolean;
  requests: [];
}

export const defaultEndpointState: IEndpointState = {
  isFetching: false,
  isFetched: false,
  isError: false,
  requests: []
}
