import { Reducer, AnyAction, createEntityAdapter, PayloadAction, Update, createNextState } from "@reduxjs/toolkit";
import { enablePatches, Patch, applyPatches } from "immer";

import {
  IEndpointState,
  reducerRegistry,
  EndpointMethodMap,
  IRequestRecord,
  IEndpointMethodProps,
  IAsyncOrchestrationRequestMeta,
  IAsyncOrchestrationResultMeta,
  RequestStatus
} from "./";

export class EndpointSlice<State, EndpointMethods extends EndpointMethodMap> {
  public readonly name: string;
  public readonly baseUrl: string;
  public readonly initialState: State & IEndpointState;
  public readonly actions: EndpointMethods;
  public readonly requests = createEntityAdapter<IRequestRecord>({
    sortComparer: (a, b) => a.executedAt && b.executedAt ? a.executedAt - b.executedAt : a.executedAt,
  });
  public readonly requestSelectors = this.requests.getSelectors();

  private _defaultInitialState: IEndpointState = {
    requests: this.requests.getInitialState()
  }
  private _reducer: Reducer<State & IEndpointState> | undefined;
  private _patches: Map<string, Patch[]> = new Map<string, Patch[]>();

  get reducer() {
    return this._reducer;
  }

  constructor(name: string, baseUrl: string, initialState: State, methods: EndpointMethods) {
    // Enable the Immer patches feature
    enablePatches();

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
      return createNextState(baseState, (draft: any) => { reducer(draft, action); }, (patches, inverse) => {
        const id = action?.meta?.props?.id;
        const isDisabled = action?.meta?.props?.disableRollback;

        if (id && !isDisabled) {
          if(that._patches.has(id)) {
            that._patches.get(id)!.concat(inverse);
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
        return createNextState(baseState, (state) => {
          const asyncType = type.split("/").pop();
          const { selectAll } = this.requestSelectors;

          switch (asyncType) {
            case "Execute": {
              const { meta, payload } = action as PayloadAction<any, string, IAsyncOrchestrationRequestMeta<Required<IEndpointMethodProps>>>;
              const id = action.meta.props.id;

              this.requests.addOne(state.requests, {
                executedAt: Date.now(),
                id,
                type,
                status: RequestStatus.PENDING,
                params: payload,
                method: meta.props.method
              });
              break;
            }
            case "Executing": {
              const { meta } = action as PayloadAction<any, string, IAsyncOrchestrationRequestMeta<Required<IEndpointMethodProps>>>;
              const id = meta.props.id;

              this.requests.updateOne(state.requests, {
                id,
                changes: {
                  status: RequestStatus.EXECUTING,
                }
              });
              break;
            }
            case "Success": {
              const { meta } = action as PayloadAction<any, string, IAsyncOrchestrationResultMeta<any, Required<IEndpointMethodProps>>>;
              const id = meta.props.id;

              const changes = {
                completedAt: Date.now(),
                status: RequestStatus.SUCCESS,
                response: meta.response
              }

              // Update the original requests, and any that it may have superseded and are still in PENDING state waiting for a resolution
              const changeRequests: Update<IRequestRecord>[] = selectAll(state.requests)
                .filter((r) => r.status === RequestStatus.PENDING)
                .map(r => ({ id: r.id, changes }))
                .concat({ id, changes });

              this.requests.updateMany(state.requests, changeRequests);

              // Remove any patches being tracked for rollback
              this._patches.delete(id);
              break;
            }
            case "Failure": {
              const { meta } = action as PayloadAction<any, string, IAsyncOrchestrationResultMeta<any, Required<IEndpointMethodProps>>>;
              const id = meta.props.id;

              this.requests.updateOne(state.requests, {
                id,
                changes: {
                  completedAt: Date.now(),
                  status: RequestStatus.FAILURE,
                  response: meta.response
                }
              });

              // Rollback any changes that were made optimistically
              if (this._patches.has(id)) {
                applyPatches(state, this._patches.get(id)!);
                this._patches.delete(id);
              }
              break;
            }
            case "ClearRequests": {
              this.requests.removeMany(state.requests, action.payload);
              break;
            }
          }
        });
      }
    }

    return baseState;
  };
}
