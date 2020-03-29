export class TodoStore {
  constructor() {
    /**
     * @type {Map<string, TodoCollection>}
     */
    this.items = new Map();
  }

  /**
   * @param {string} key
   * @return {TodoCollection}
   */
  get(key) {
    if (!this.items.has(key)) {
      this.setDefault(key);
    }

    return this.items.get(key);
  }

  setDefault(key) {
    this.items.set(key, {
      "Default List": {
        name: "Default List",
        items: [
          {
            completed: false,
            name: "Todo 1",
          },
          {
            completed: false,
            name: "Todo 2",
          },
        ],
      },
    });
  }
}
