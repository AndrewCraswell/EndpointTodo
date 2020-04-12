export type AsyncRegistrar<T> = (collection: AsyncMap<T>) => void;
export type AsyncItemRegistrar<T> = (name: string, item: T) => void;
export type AsyncMap<T> = {[name: string]: T; }

/**
 * A registry that allows you to dynamically add items and notify a listener
 */
export class AsyncRegistry<T> {
  /** A listener to notify the entire collection whenever an item has changed */
  private _emitMapChange: AsyncRegistrar<T> | undefined;

  /** A listener to notify the entire collection whenever an item has changed */
  private _emitItemChange: AsyncItemRegistrar<T> | undefined;

  /** The map of all registered items */
  private _registry: Map<string, T> = new Map<string, T>();

  /** Get the current map of all items */
  public getAll(): AsyncMap<T> {
    return Object.fromEntries(this._registry.entries());
  }

  /**
   * Register a new item in the map
   *
   * @param {string} name The name of the item to be added to the map
   * @param item The item to be added
   */
  public register(name: string, item: T): void {
    if (!this._registry.has(name)) {
      this._registry.set(name, item);

      if (this._emitMapChange) {
        this._emitMapChange(this.getAll());
      }

      if (this._emitItemChange) {
        this._emitItemChange(name, item);
      }
    }
  }

  /**
   * Set the listener to notify when there are changes to the map of items
   *
   * @param {AsyncRegistrar} listener - The listener function that registers new items
   */
  public setChangeListener(listener: AsyncRegistrar<T>): void {
    this._emitMapChange = listener;

    const items = this.getAll();
    const names = Object.keys(items);

    if (names.length) {
      this._emitMapChange(items);
    }
  }
  
    /**
   * Set the listener to notify for each individual new item registered
   *
   * @param {AsyncItemRegistrar} listener - The listener function that registers a new item
   */
  public setNewItemListener(listener: AsyncItemRegistrar<T>): void {
    this._emitItemChange = listener;

    const items = this.getAll();
    const names = Object.keys(items);

    if (names.length) {
      for (let name of names) {
        this._emitItemChange(name, items[name]);
      }
    }
  }
}

