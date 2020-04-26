// eslint-disable-next-line import/no-unresolved
import { call, put, takeLeading, takeEvery, takeLatest } from 'redux-saga/effects';

import { AsyncOrchestrator, AsyncOrchestratorConfig, IAsyncOrchestrationResultMeta, AsyncSuccessActionCreator, AsyncExecutingActionCreator, AsyncFailureActionCreator } from '..';
import { sagaRegistry, EffectCreator, PromiseType,  } from './';

export interface SagaOrchestratorConfig {
  effect: EffectCreator;
  onBeforeExecute?: <RequestPayload, MethodProps>(
    action: ReturnType<AsyncExecutingActionCreator<RequestPayload, MethodProps>>
  ) => Generator;
  onSuccess?: <RequestPayload, ResponsePayload, MethodProps>(
    action: ReturnType<AsyncSuccessActionCreator<RequestPayload, ResponsePayload, MethodProps>>
  ) => Generator;
  onFailure?: <RequestPayload, MethodProps>(
    action: ReturnType<AsyncFailureActionCreator<RequestPayload, MethodProps>>,
    error: Error
  ) => Generator;
}

/**
 * A class that implements a default asynchronous saga against an endpoint.
 */
export class SagaOrchestrator implements AsyncOrchestrator {
  /** The effect creator to apply when watching for the endpoint actions to occur */
  protected config: SagaOrchestratorConfig;

  constructor(config: SagaOrchestratorConfig = { effect: takeEvery }) {
    this.config = config;
  };

  public orchestrate<RequestPayload = void, ResponsePayload = void, MethodProps = void>(
    config: AsyncOrchestratorConfig<RequestPayload, ResponsePayload, MethodProps>
  ) {
      const { name, actions, apiFunction } = config;
      const that = this;

      // Determine how to watch the execution scenario
      function *watcherSaga(): Generator {
        yield that.config.effect(actions.Execute, workerSaga);
      }

      // Default implementation of the saga to handle the Execution action workflow
      function *workerSaga(action: ReturnType<typeof actions.Execute>): Generator {
        const { onBeforeExecute, onFailure, onSuccess } = that.config;
        const params = action.payload;
        const props = action.meta.props;
        const asyncMeta: IAsyncOrchestrationResultMeta<RequestPayload, MethodProps> = {
          params,
          props
        };

        try {
          const executingAction = actions.Executing(params, action.meta);
          yield put(executingAction);

          if (onBeforeExecute) {
            yield onBeforeExecute(executingAction);
          }

          // Make the call to the API method
          const yielded = yield call(apiFunction, params, props);

          // We destructure away some items we don't want stored in Redux to reduce verbosity
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { config, data, request, ...slimResponse } = yielded as PromiseType<ReturnType<typeof apiFunction>>;
          asyncMeta.response = slimResponse;

          const successAction = actions.Success(data, asyncMeta);
          yield put(successAction);

          if (onSuccess) {
            yield onSuccess(successAction);
          }
        } catch (err) {
            const errorAction = actions.Failure(err, asyncMeta);
            yield put(errorAction);

            if (onFailure) {
              yield onFailure(errorAction, err);
            }
        }
      }

      // Register the saga with the middleware so it executes
      sagaRegistry.registerAnthology(name, [watcherSaga]);
  }
}

export const Orchestrators = {
  takeEvery: new SagaOrchestrator(),
  takeLeading: new SagaOrchestrator({ effect: takeLeading }),
  takeLatest: new SagaOrchestrator({ effect: takeLatest })
}
