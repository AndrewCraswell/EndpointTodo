// eslint-disable-next-line import/no-unresolved
import { call, put } from 'redux-saga/effects';
import { AnyAction } from 'redux';

import { EffectCreator, PromiseType, AsyncOrchestrator, AsyncOrchestratorConfig } from '.';
import { sagaRegistry } from './SagaRegistry';

export class SagaOrchestrator implements AsyncOrchestrator {
  /** The effect creator to apply when watching for the endpoint actions to occur */
  protected effect: EffectCreator;

  constructor(effect: EffectCreator) {
    this.effect = effect;
  };

  public orchestrate<RequestPayload = undefined, ResponsePayload = undefined, ErrorPayload = undefined, MethodProps = undefined>(
    config: AsyncOrchestratorConfig<RequestPayload, ResponsePayload, ErrorPayload, MethodProps>
  ) {
      const { name, actions, apiFunction } = config;
      const that = this;

      // Determine how to watch the execution scenario
      function *rootSaga(): Generator {
        yield that.effect(actions.request, asyncSaga);
      }

      // Default implementation of the saga to handle the Execution action workflow
      function *asyncSaga<MethodAction extends AnyAction>(action: MethodAction): Generator {
        // const request = action.meta.request;
        // const props: PassThroughProps = {
        //   ...this._defaultPassThroughProps,
        //   ...action.meta.props,
        // };
    
        // Construct a result object with meta data representing all aspects of the request
        //  to be handed to the success or error callbacks
        // const actionResult: IEndpointActionMeta<RequestBody, PassThroughProps> = {
        //   request,
        //   props,
        // };
    
        try {
          // Attempt to call the Api endpoint
          //if (!props.reducerOnly) {
            // TODO: Fix the return type being set to ANY
            // TODO: action.meta should be a config object that includes props
            let response: PromiseType<ReturnType<typeof apiFunction>> | any = yield call(apiFunction, action.payload, action.meta);
          //}
    
          // Add the response data to the result object
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          //const { config = {}, data = {}, ...trimmedResponse } = response || {};
          //actionResult.response = trimmedResponse;
    
          // Reset the failed count before executing the success handler
          // actionResult.props = {
          //   ...actionResult.props,
          //   ...this._defaultPassThroughProps,
          // };
    
          const data = response ? response.data : undefined;
          const successAction = actions.success(data, {} as MethodProps);
          yield put(successAction);
          //yield* this.onSuccessExecuted(successAction, actionResult);
        } catch (err) {
          // Increment the response object failed count
          // actionResult.props = {
          //   ...actionResult.props,
          //   failedCount: ((actionResult.props && actionResult.props.failedCount) || 0) + 1,
          // } as PassThroughProps & IEndpointPassThroughProps;
    
          if (err.request) {
            // The request was made and the server responded with a
            // status code that falls out of the range of 2xx
            const errorAction = actions.failure(err.stack! as ErrorPayload, {} as MethodProps);
            yield put(errorAction);
            //yield* this.onErrorExecuted(errorAction, err.stack!, err.response);
          } else if (err instanceof Error) {
            // Something happened in setting up the request and triggered an Error
            const errorAction = actions.failure({} as ErrorPayload, {} as MethodProps);
            yield put(errorAction);
            //yield* this.onErrorExecuted(errorAction, err.message, actionResult);
          }
        }
      }

      // Register the saga
      sagaRegistry.registerAnthology(name, [rootSaga]);
  }
}

// /**
//  * A class that implements a default saga against an endpoint.
//  * Pieces of the default behavior can be overriden by creating a new class and extending from this class.
//  */
// export class EndpointSaga<RequestBody = any, ResponseBody = any, PassThroughProps extends IEndpointPassThroughProps = any> {

//   /**
//    * A hook meant to be overridden by a subclass to extend the default behavior of the EndpointSaga.
//    * This function is executed by the Saga after a ExecuteSuccess action has been dispatched.
//    *
//    * @param action The action that was successful
//    * @param response The response from the Api method
//    */
//   /* eslint-disable @typescript-eslint/no-unused-vars */
//   protected *onSuccessExecuted(
//     action: IEndpointAction<RequestBody, PassThroughProps>,
//     result: IEndpointActionMeta<RequestBody, PassThroughProps>
//   ): IterableIterator<any> {
//     // Left intentionally blank.
//     //  This hook should be overridden by a subclass to get custom behavior integrated with the default Saga
//   }
//   /* eslint-enable @typescript-eslint/no-unused-vars */

//   /**
//    * A hook meant to be overridden by a subclass to extend the default behavior of the EndpointSaga.
//    * This function is executed by the Saga after a ExecuteError action has been dispatched.
//    *
//    * @param action The action that was unsuccessful
//    */
//   /* eslint-disable @typescript-eslint/no-unused-vars */
//   protected *onErrorExecuted(
//     action: IEndpointAction<RequestBody, PassThroughProps>,
//     errorMessage: string,
//     result: IEndpointActionMeta<RequestBody, PassThroughProps>
//   ): IterableIterator<any> {
//     // Left intentionally blank.
//     //  This hook should be overridden by a subclass to get custom behavior integrated with the default Saga
//   }
//   /* eslint-enable @typescript-eslint/no-unused-vars */
// }
