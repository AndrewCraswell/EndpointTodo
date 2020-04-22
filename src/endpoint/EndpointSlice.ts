import { Reducer, AnyAction, createEntityAdapter, PayloadAction } from "@reduxjs/toolkit";
import { produce, enablePatches, Patch, applyPatches } from "immer";

import {
  IEndpointState,
  reducerRegistry,
  EndpointMethodMap,
  IRequestRecord
} from "./";
import { IEndpointMethodProps, IAsyncOrchestrationRequestMeta, IAsyncOrchestrationResultMeta } from "./AsyncOrchestrationMeta";

// Enable the Immer patches feature
enablePatches();

export class EndpointSlice<State, EndpointMethods extends EndpointMethodMap> {
  public readonly name: string;
  public readonly baseUrl: string;
  public readonly initialState: State & IEndpointState;
  public readonly actions: EndpointMethods;
  public readonly requests = createEntityAdapter<IRequestRecord>({
    sortComparer: (a, b) => a.executedAt && b.executedAt ? a.executedAt.getTime() - b.executedAt.getTime() : 0,
  });
  public readonly requestSelectors = this.requests.getSelectors();

  private _defaultInitialState: IEndpointState = {
    isFetching: false,
    requests: this.requests.getInitialState()
  }
  private _reducer: Reducer<State & IEndpointState> | undefined;
  private _patches: Map<string, Patch[]> = new Map<string, Patch[]>();

  get reducer() {
    return this._reducer;
  }

  constructor(name: string, baseUrl: string, initialState: State, methods: EndpointMethods) {
    this.name = name;
    this.baseUrl = baseUrl;
    this.actions = methods;

    this.initialState = {
      ...this._defaultInitialState,
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
          const { selectAll } = this.requestSelectors;
          const asyncType = type.split("/").pop();
          const id = action.meta.props.id;

          switch (asyncType) {
            case "Execute": {
              const { meta, payload } = action as PayloadAction<any, string, IAsyncOrchestrationRequestMeta<Required<IEndpointMethodProps>>>;

              state.isFetching = true;
              this.requests.addOne(state.requests, {
                executedAt: new Date(),
                id,
                isError: false,
                isFetched: false,
                isFetching: true,
                params: payload,
                method: meta.props.method
              });
              break;
            }
            case "Success": {
              const { meta } = action as PayloadAction<any, string, IAsyncOrchestrationResultMeta<Required<IEndpointMethodProps>>>;

              this.requests.updateOne(state.requests, {
                id,
                changes: {
                  completedAt: new Date(),
                  isFetched: true,
                  isFetching: false,
                  response: meta.response
                }
              });

              // Determine if any requests are still in progress
              state.isFetching = !!selectAll(state.requests).filter((r) => r && r.isFetching).length;

              // Remove any patches being tracked for rollback
              this._patches.delete(id);
              break;
            }
            case "Failure": {
              const { meta } = action as PayloadAction<any, string, IAsyncOrchestrationResultMeta<Required<IEndpointMethodProps>>>;

              this.requests.updateOne(state.requests, {
                id,
                changes: {
                  completedAt: new Date(),
                  isFetched: false,
                  isFetching: false,
                  isError: true,
                  response: meta.response
                }
              });

              // Determine if any requests are still in progress
              state.isFetching = !!selectAll(state.requests).filter((r) => r && r.isFetching).length;

              // Rollback any changes that were made optimistically
              if (this._patches.has(id)) {
                applyPatches(state, this._patches.get(id)!);
                this._patches.delete(id);
              }
              break;
            }
          }
        });
      }
    }

    return baseState;
  };
}
