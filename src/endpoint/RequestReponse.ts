export interface IRequestResponse<T = any> {
  config: { [key: string]: any };
  data: T;
  headers: { [key: string]: any };
  request: XMLHttpRequest;
  status: number;
  statusText: string;
  error: string;
}

export type SlimRequestResponse = Omit<IRequestResponse, 'data'|'config'|'request'>;
