/* tslint:disable */
import { Reducer, AnyAction } from "@reduxjs/toolkit";
import { produce, Draft } from "immer";

import {
  IEndpointState,
  defaultEndpointState,
  reducerRegistry,
  EndpointMethodMap,
} from "./";

// TODO: Create reductor base reducer

export class EndpointSlice<State> {
  public readonly name: string;
  public readonly baseUrl: string;
  public readonly initialState: State & IEndpointState;

  private _reducer: Reducer<State & IEndpointState> | undefined;
  private _reductor: Reducer<IEndpointState & State, AnyAction>;

  get reducer() {
    return this._reducer;
  }

  constructor(
    name: string,
    baseUrl: string,
    initialState: State,
    methods: EndpointMethodMap
  ) {
    this.name = name;
    this.baseUrl = baseUrl;

    this.initialState = {
      ...defaultEndpointState,
      ...initialState,
    } as State & IEndpointState;

    this._reductor = (
      baseState: IEndpointState & State = this.initialState,
      action: AnyAction
    ) => {
      return produce(baseState, (state: Draft<IEndpointState & State>) => {
        const actionType = action.type;

        if (actionType && isNaN(Number(actionType))) {
          const type = actionType as string;
          if (type.startsWith("@Restux")) {
            const asyncType = type.split("/").pop();
            switch (asyncType) {
              case "Execute":
                state.isFetching = true;
                state.isError = false;
                break;
              case "Success":
                state.isFetching = false;
                state.isFetched = true;
                state.isError = false;
                break;
              case "Failure":
                state.isFetching = false;
                state.isFetched = true;
                state.isError = true;
                break;
            }
          }
        }
      });
    };

    for (const [methodName, method] of Object.entries(methods)) {
      method.Orchestrate(this.name, this.baseUrl, methodName);
    }
  }

  public registerReducer(reducer: Reducer<State & IEndpointState>) {
    this._reducer = (
      state: IEndpointState & State = this.initialState,
      action: AnyAction
    ) => {
      return this._reductor(reducer(state, action), action);
    };

    reducerRegistry.register(this.name, this._reducer);
  }
}
