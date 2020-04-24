import { Saga } from 'redux-saga';
import { all, fork } from 'redux-saga/effects';

import { AsyncRegistry, AsyncItemRegistrar } from '../';

export interface IAnthology {
  /** The name of the anthology */
  name: string;

  /** The root saga of the anthology */
  saga: Saga;
}

/**
 * SagaRegistry enables dynamic sagas.
 * It enables sagas to be added to the store after the store is created.
 * See more: https://manukyan.dev/posts/2019-04-15-code-splitting-for-redux-and-optional-redux-saga/
 */
class SagaRegistry {
  /** A map of all registered sagas */
  private _anthologies = new AsyncRegistry<Saga>();

  /* Sets a listener that will notify for every new item in the registry */
  public setChangeListener = (listener: AsyncItemRegistrar<Saga>) => {
    this._anthologies.setNewItemListener(listener);
  };

  /**
   * Take a dictionary of EndpointSagas and registers a new root saga
   *
   * @param name - The name of the anthology
   * @param endpointSagas - endpoint sagas
   */
  public registerAnthology = (name: string, sagas: Saga[]): IAnthology => {
    const saga = this.getAnthologySaga(sagas);
    this._anthologies.register(name, saga);

    return {
      name,
      saga,
    };
  };

  /**
   * Takes a dictionary of EndpointSagas and returns a root Saga
   *
   * @param sagas - The root saga of the anthology
   */
  private getAnthologySaga = (sagas: Saga[]): Saga => {
    return function*(): Generator {
      yield all(sagas.map((saga: Saga) => fork(saga)));
    };
  };
}

export const sagaRegistry = new SagaRegistry();
