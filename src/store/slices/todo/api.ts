import axios from "axios";

import { IRequestResponse, EndpointApiFunctionConfig } from "../../../endpoint";
import { ITodoItem } from "../../../models";

// TODO: Introduce a EndpointUrlMapper function to take the parameters and construct a Url
export class TodoApi {
  public static getTodos = (
    config: EndpointApiFunctionConfig
  ): Promise<IRequestResponse<ITodoItem[]>> => {
    const { url, method } = config;

    return axios.request({
      url,
      method
    });
  };

  public static getTodoById = (
    config: EndpointApiFunctionConfig<string>
  ): Promise<IRequestResponse<ITodoItem>> => {
    const { url, method, payload } = config;

    return axios.request({
      url: `${url}${payload}`,
      method
    });
  };

  public static addTodo = (
    config: EndpointApiFunctionConfig<ITodoItem>
  ): Promise<IRequestResponse<ITodoItem>> => {
    const { url, method, payload } = config;

    return axios.request({
      url,
      method,
      data: payload,
    });
  };

  public static deleteTodo = (
    config: EndpointApiFunctionConfig<ITodoItem>
  ): Promise<IRequestResponse<ITodoItem>> => {
    const { url, method, payload } = config;

    return axios.request({
      url: `${url}${payload?.id}`,
      method
    });
  };

  public static updateTodo = (
    config: EndpointApiFunctionConfig<ITodoItem>
  ): Promise<IRequestResponse<ITodoItem>> => {
    const { url, method, payload } = config;

    return axios.request({
      url: `${url}${payload?.id}`,
      method,
      data: payload
    });
  };
}
