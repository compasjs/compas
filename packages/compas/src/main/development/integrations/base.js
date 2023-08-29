import { debugPrint } from "../../../shared/output.js";

export class BaseIntegration {
  /**
   * @param {import("../state.js").State} state
   * @param {string} name
   */
  constructor(state, name) {
    /**
     * @type {import("../state.js").State}
     */
    this.state = state;

    /**
     * @type {string} name
     */
    this.name = name;
  }

  // eslint-disable-next-line require-await
  async init() {
    debugPrint(`${this.name} :: init`);
  }

  // eslint-disable-next-line require-await
  async onCacheUpdated() {
    debugPrint(`${this.name} :: onCacheUpdated`);
  }

  /**
   * @param {{
   *   name: string
   * }} key
   * @returns {Promise<void>}
   */
  // eslint-disable-next-line require-await,no-unused-vars
  async onKeypress(key) {
    debugPrint(`${this.name} :: onKeypress`);
  }

  /**
   * @param {string[]} paths
   * @returns {Promise<void>}
   */
  // eslint-disable-next-line require-await,no-unused-vars
  async onFileChanged(paths) {
    debugPrint(`${this.name} :: onFileChanged`);
  }

  // eslint-disable-next-line require-await
  async onConfigUpdated() {
    debugPrint(`${this.name} :: onConfigUpdated`);
  }

  // eslint-disable-next-line require-await
  async onExit() {
    debugPrint(`${this.name} :: onExit`);
  }
}
