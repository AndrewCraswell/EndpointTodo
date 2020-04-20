/* tslint:disable */
import { Reducer, AnyAction } from "@reduxjs/toolkit";
import { produce, enablePatches, Patch, applyPatches } from "immer";

import {
  IEndpointState,
  defaultEndpointState,
  reducerRegistry,
  EndpointMethodMap,
  SlimRequestResponse,
} from "./";

// Enable the Immer patches feature
enablePatches();

export interface IEndpointRequest {
  id: string;
  params: any;
  request: SlimRequestResponse;
  isFetching: boolean;
  isFetched: boolean;
  isError: boolean;
}

export type StoredEndpointRequest = Partial<IEndpointRequest>;

export class EndpointSlice<State, EndpointMethods extends EndpointMethodMap> {
  public readonly name: string;
  public readonly baseUrl: string;
  public readonly initialState: State & IEndpointState;
  public readonly Actions: EndpointMethods;

  private _reducer: Reducer<State & IEndpointState> | undefined;
  private _patches: Map<string, Patch[]> = new Map<string, Patch[]>();

  get reducer() {
    return this._reducer;
  }

  constructor(name: string, baseUrl: string, initialState: State, methods: EndpointMethods) {
    this.name = name;
    this.baseUrl = baseUrl;
    this.Actions = methods;

    this.initialState = {
      ...defaultEndpointState,
      ...initialState,
    } as State & IEndpointState;

    for (const [methodName, method] of Object.entries(methods)) {
      method.Orchestrate(this.name, this.baseUrl, methodName);
    }
  }

  // TODO: Allow the different reducers to be registered
  public registerReducer(reducer: Reducer<State & IEndpointState>) {
    const that = this;

    function injectImmer(baseState: IEndpointState & State, action: AnyAction) {
      return produce(baseState, (draft: any) => { reducer(draft, action); }, (patches, inverse) => {
        const id = action?.meta?.id;
        const isDisabled = action?.meta?.disableRollback;

        if (id && !isDisabled && patches.length) {
          if(that._patches.has(id)) {
            that._patches.get(id)?.concat(inverse);
          } else {
            that._patches.set(id, inverse);
          }
        }
      });
    }

    this._reducer = (state = this.initialState, action) => {
      return this.reductor(injectImmer(state, action), action);
    };

    reducerRegistry.register(this.name, this._reducer);
  }

  // The base reducer which process any endpoint method actions before the slice reducers executes
  private reductor(
    baseState: IEndpointState & State = this.initialState,
    action: AnyAction
  ) {
    const actionType = action.type;

    if (actionType && isNaN(Number(actionType))) {
      const type = actionType as string;
      if (type.startsWith(`@Restux/${this.name}`)) {
        return produce(baseState, (state) => {
          const asyncType = type.split("/").pop();
          const id = action.meta.id;
          switch (asyncType) {
            case "Execute":
              state.isFetching = true;
              state.isError = false;
              break;
            case "Success":
              state.isFetching = false;
              state.isFetched = true;
              state.isError = false;

              // Remove any patches being tracked for rollback
              this._patches.delete(id);
              break;
            case "Failure":
              state.isFetching = false;
              state.isFetched = true;
              state.isError = true;

              // Rollback any changes that were made optimistically
              if (this._patches.has(id)) {
                applyPatches(state, this._patches.get(id)!);
                this._patches.delete(id);
              }
              break;
          }
        });
      }
    }

    return baseState;
  };
}
