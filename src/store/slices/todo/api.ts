import axios, { AxiosRequestConfig } from "axios";
import { setupCache } from 'axios-cache-adapter'

import { IRequestResponse, EndpointApiFunctionConfig, OptionalMethodProps } from "../../../endpoint";
import { ITodoItem, ICacheProps } from "../../../models";
import { TodoSlice } from './';

export class TodoApi {
  public static cache = setupCache({
    maxAge: 15 * 60 * 1000,
    exclude: { query: false },
    invalidate: async (config, request) => {
      const method = request.method;

      if (method && method.toLowerCase() !== 'get') {
        if (config) {
          const store = (config.store as any).store;
          delete store[TodoSlice.baseUrl];
        }

      }
    }
  })

  protected static http = axios.create({
    adapter: TodoApi.cache.adapter
  });

  public static cacheOverridableRequest = (
    config: EndpointApiFunctionConfig<void, OptionalMethodProps<ICacheProps>>,
  ): Promise<IRequestResponse<ITodoItem[]>> => {
    const { props } = config;

    let ignoreCache = false;
    if (props) {
      ignoreCache = props.disableCache ?? false;
    }

    return TodoApi.request(config, {
      cache: {
        ignoreCache
      }
    });
  };

  public static request = (
    config: EndpointApiFunctionConfig<any>,
    requestConfig?: Partial<AxiosRequestConfig>
  ): Promise<IRequestResponse<any>> => {
    const { url, method, payload } = config;

    return TodoApi.http.request({
      ...requestConfig,
      url,
      method,
      data: payload,
    });
  };
}
