import axios from "axios";
import { setupCache } from 'axios-cache-adapter'


import { IRequestResponse, EndpointApiFunctionConfig } from "../../../endpoint";
import { ITodoItem } from "../../../models";


// TODO: Introduce a EndpointUrlMapper function to take the parameters and construct a Url
const cache = setupCache({
  maxAge: 15 * 60 * 1000,
  exclude: { query: false }
})

// Create `http` instance passing the newly created `cache.adapter`
const http = axios.create({
  adapter: cache.adapter
})


export class TodoApi {
  public static getTodos = (
    config: EndpointApiFunctionConfig
  ): Promise<IRequestResponse<ITodoItem[]>> => {
    const { url, method } = config;

    return http.request({
      url,
      method
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
