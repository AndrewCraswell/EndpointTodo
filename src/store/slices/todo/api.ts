import axios from "axios";
import { setupCache } from 'axios-cache-adapter'

import { IRequestResponse, EndpointApiFunctionConfig, OptionalMethodProps } from "../../../endpoint";
import { ITodoItem, ICacheProps } from "../../../models";
import { TodoSlice } from './';

// TODO: Introduce a EndpointUrlMapper function to take the parameters and construct a Url
export const cache = setupCache({
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

const http = axios.create({
  adapter: cache.adapter
})


export class TodoApi {
  public static getAllTodos = (
    config: EndpointApiFunctionConfig<void, OptionalMethodProps<ICacheProps>>,
  ): Promise<IRequestResponse<ITodoItem[]>> => {
    const { url, method, props } = config;

    let disableCache = false;
    if (props) {
      disableCache = props.disableCache ?? false;
    }

    return http.request({
      url,
      method,
      cache: {
        ignoreCache: disableCache
      }
    });
  };

  public static getTodoById = (
    config: EndpointApiFunctionConfig<string>
  ): Promise<IRequestResponse<ITodoItem>> => {
    const { method, payload } = config;

    return http.request({
      url: `${payload}`,
      method
    });
  };

  public static addTodo = (
    config: EndpointApiFunctionConfig<ITodoItem>
  ): Promise<IRequestResponse<ITodoItem>> => {
    const { url, method, payload } = config;

    return http.request({
      url,
      method,
      data: payload,
    });
  };

  public static deleteTodo = (
    config: EndpointApiFunctionConfig<ITodoItem>
  ): Promise<IRequestResponse<ITodoItem>> => {
    const { method, payload } = config;

    return http.request({
      url: `${payload?.url}`,
      method
    });
  };

  public static updateTodo = (
    config: EndpointApiFunctionConfig<ITodoItem>
  ): Promise<IRequestResponse<ITodoItem>> => {
    const { method, payload } = config;

    return http.request({
      url: `${payload?.url}`,
      method,
      data: payload
    });
  };
}
