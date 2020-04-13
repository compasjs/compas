import { M } from "../model/index.js";

export function decorateModels() {
  /**
   * @name LbuBool#mock
   * @param {string} mockFn Raw mock function, use _mocker or '__' to get access to the
   *   Chance instance
   * @return {LbuBool}
   */
  M.types.LbuBool.prototype.mock = function (mockFn) {
    checkMocks(this);
    this.item.mocks.rawMock = mockFn.replace(/__/g, "_mocker");

    return this;
  };

  /**
   * @name LbuNumber#mock
   * @param {string} mockFn Raw mock function, use _mocker or '__' to get access to the
   *   Chance instance
   * @return {LbuNumber}
   */
  M.types.LbuNumber.prototype.mock = function (mockFn) {
    checkMocks(this);
    this.item.mocks.rawMock = mockFn.replace(/__/g, "_mocker");

    return this;
  };
  /**
   * @name LbuString#mock
   * @param {string} mockFn Raw mock function, use _mocker or '__' to get access to the
   *   Chance instance
   * @return {LbuString}
   */
  M.types.LbuString.prototype.mock = function (mockFn) {
    checkMocks(this);
    this.item.mocks.rawMock = mockFn.replace(/__/g, "_mocker");

    return this;
  };
}

function checkMocks(builder) {
  if (M.instanceOf(builder)) {
    builder.item.mocks = builder.item.mocks || {};
  }
}
