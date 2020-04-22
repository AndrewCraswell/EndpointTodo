// eslint-disable-next-line import/no-unresolved
import { call, put, takeLeading, takeEvery, takeLatest } from 'redux-saga/effects';
import { AnyAction } from 'redux';

import { EffectCreator, PromiseType, AsyncOrchestrator, AsyncOrchestratorConfig, IAsyncOrchestrationResultMeta } from '.';
import { sagaRegistry } from './SagaRegistry';

// TODO: Implement saga chaining, or action chaining

class SagaOrchestrator implements AsyncOrchestrator {
  /** The effect creator to apply when watching for the endpoint actions to occur */
  protected effect: EffectCreator;

  constructor(effect: EffectCreator) {
    this.effect = effect;
  };

  public orchestrate<RequestPayload = void, ResponsePayload = void, MethodProps = void>(
    config: AsyncOrchestratorConfig<RequestPayload, ResponsePayload, MethodProps>
  ) {
      const { name, actions, apiFunction } = config;
      const that = this;

      // Determine how to watch the execution scenario
      function *rootSaga(): Generator {
        yield that.effect(actions.Execute, asyncSaga);
      }

      // Default implementation of the saga to handle the Execution action workflow
      // TODO: Fix the typings on AnyAction
      function *asyncSaga(action: AnyAction): Generator {
        const params: RequestPayload = action.payload;
        const props: MethodProps = action.meta.props;
        const resultMeta = {
          params,
          props
        } as IAsyncOrchestrationResultMeta<RequestPayload, MethodProps>;

        try {
          const yielded = yield call(apiFunction, params, props);

          // We destructure away some items we don't want stored in Redux to reduce verbosity
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { config = {}, data, request, ...slimResponse } = yielded as PromiseType<ReturnType<typeof apiFunction>>;
          resultMeta.response = slimResponse;

          const successAction = actions.Success(data, resultMeta);
          yield put(successAction);
          //yield* this.onSuccessExecuted(successAction, actionResult);
        } catch (err) {
          if (err.request) {
            // The request was made and the server responded with a
            // status code that falls out of the range of 2xx
            const errorAction = actions.Failure(err, resultMeta);
            yield put(errorAction);
            //yield* this.onErrorExecuted(errorAction, err.stack!, err.response);
          } else if (err instanceof Error) {
            // Something happened in setting up the request and triggered an Error
            const errorAction = actions.Failure(err, resultMeta);
            yield put(errorAction);
            //yield* this.onErrorExecuted(errorAction, err.message, actionResult);
          }
        }
      }

      // Register the saga with the middleware so it executes
      sagaRegistry.registerAnthology(name, [rootSaga]);
  }
}

export const Orchestrators = {
  takeLeading: new SagaOrchestrator(takeLeading),
  takeEvery: new SagaOrchestrator(takeEvery),
  takeLatest: new SagaOrchestrator(takeLatest)
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
