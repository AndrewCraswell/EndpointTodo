import { IEndpointMethodProps } from ".."

export type OptionalMethodProps<Props> = Props | void

export type MethodProps<Props> = Props & IEndpointMethodProps
