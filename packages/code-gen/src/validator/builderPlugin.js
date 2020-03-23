import { upperCaseFirst } from "../utils.js";

const store = new Set();

const init = (app) => {
  store.clear();
  app.hooks.addValidator = (validator) => {
    app.callHook("addModel", validator);

    store.add(validator);
  };
};

const build = (result) => {
  result.validators = [];

  for (const v of store.values()) {
    result.validators.push(upperCaseFirst(v.item.name));
  }
};

export const plugin = {
  init,
  build,
};
