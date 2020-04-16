/* tslint:disable */
import { Reducer, AnyAction } from "@reduxjs/toolkit";
import { produce, enablePatches, Patch, applyPatches } from "immer";

import {
  IEndpointState,
  defaultEndpointState,
  reducerRegistry,
  EndpointMethodMap,
} from "./";

// Enable the Immer patches feature
enablePatches();

export class EndpointSlice<State> {
  public readonly name: string;
  public readonly baseUrl: string;
  public readonly initialState: State & IEndpointState;

  private _reducer: Reducer<State & IEndpointState> | undefined;
  private _reductor: Reducer<IEndpointState & State, AnyAction>;
  private _patches: Map<string, Patch[]> = new Map<string, Patch[]>();

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

    // TODO: Bind this reducer to only handle events from the slice
    this._reductor = (
      baseState: IEndpointState & State = this.initialState,
      action: AnyAction
    ) => {
      return produce(baseState, (state) => {
        const actionType = action.type;

        if (actionType && isNaN(Number(actionType))) {
          const type = actionType as string;
          if (type.startsWith("@Restux")) {
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
          }
        }
      });
    };

    for (const [methodName, method] of Object.entries(methods)) {
      method.Orchestrate(this.name, this.baseUrl, methodName);
    }
  }

  // Allow the different reducers to be registered
  public registerReducer(reducer: Reducer<State & IEndpointState>) {
    const that = this;

    this._reducer = (
      state: IEndpointState & State = this.initialState,
      action: AnyAction
    ) => {
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

      return this._reductor(injectImmer(state, action), action);
    };

    reducerRegistry.register(this.name, this._reducer);
  }
}
