const { isNil } = require("@lbu/stdlib");
const { App } = require("../core");

App.withPlugin(appPluginCallback);

/**
 * @name App#route
 * @function
 * @param {RouteBuilder} route
 * @return {App}
 */
App.prototype.route = function(route) {
  if (!this.store.routes) {
    this.store.routes = [];
  }
  this.store.routes.push(route.build());

  return this;
};

function appPluginCallback(result, store) {
  result.routes = [];
  for (const r of store.routes) {
    r.paramsyValidator = addValidator(store, r.paramsyValidator);
    r.queryValidator = addValidator(store, r.queryValidator);
    r.bodyValidator = addValidator(store, r.bodyValidator);

    result.routes.push(r);
  }
}

function addValidator(store, v) {
  if (v === undefined) {
    return undefined;
  }

  // A bit of a hack to get validators generated
  if (v._addValidator) {
    if (!isNil(store.processValidator)) {
      store.processValidator(v.name, v);
    } else {
      store.validators.push(v);
    }
    delete v._addValidator;
  }

  return {
    typeName: v.name,
    funcName: `validate${v.name}`,
  };
}
