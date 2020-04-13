/* tslint:disable */
import { Reducer } from "@reduxjs/toolkit";

import { IEndpointState, defaultEndpointState, reducerRegistry, EndpointMethodMap } from './';

// TODO: Create reductor base reducer

export class EndpointSlice<State> {
  public readonly name: string;
  public readonly baseUrl: string;
  public readonly initialState: State & IEndpointState;
  private _reducer: Reducer<State & IEndpointState> | undefined;

  get reducer() {
    return this._reducer;
  }

  constructor(name: string, baseUrl: string, initialState: State, methods: EndpointMethodMap) {
    this.name = name;
    this.baseUrl = baseUrl;

    this.initialState = {
      ...defaultEndpointState,
      ...initialState
    } as State & IEndpointState

    for (const [methodName, method] of Object.entries(methods)) {
      method.Orchestrate(this.name, this.baseUrl, methodName);
    }
  }

  public registerReducer(reducer: Reducer<State & IEndpointState>) {
    this._reducer = reducer;

    reducerRegistry.register(this.name, reducer);
  }
}
