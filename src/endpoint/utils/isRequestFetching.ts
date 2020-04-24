import { IRequestRecord, RequestStatus } from "..";

export const isRequestFetching = (request: IRequestRecord) => {
  return request.status === RequestStatus.EXECUTING || request.status === RequestStatus.PENDING;
}
