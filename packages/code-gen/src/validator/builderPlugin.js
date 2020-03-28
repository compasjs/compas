import { upperCaseFirst } from "../utils.js";

const store = new Set();

export const plugin = {
  init,
  build,
};

function init(app) {
  store.clear();
  app.hooks.addValidator = (validator) => {
    app.callHook("addModel", validator);

    store.add(validator);
  };
}

function build(result) {
  result.validators = [];

  for (const v of store.values()) {
    result.validators.push(upperCaseFirst(v.item.name));
  }
}
