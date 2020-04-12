import axios from "axios";

import { IRequestResponse, EndpointApiFunctionConfig } from "../../endpoint";
import { ITodoItem } from "../../models";

// TODO: Introduce a EndpointUrlMapper function to take the parameters and construct a Url
export class TodoApi {
  public static getTodos = (
    config: EndpointApiFunctionConfig<string | undefined>
  ): Promise<IRequestResponse<ITodoItem[] | ITodoItem>> => {
    const { url, method, payload } = config;

    return axios.request({
      url: `${url}${payload ? payload : ""}`,
      method,
      data: payload,
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
}
