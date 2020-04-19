import { IEndpointMethodProps } from "../endpoint";

export interface ICacheProps extends IEndpointMethodProps {
  disableCache?: boolean;
}
