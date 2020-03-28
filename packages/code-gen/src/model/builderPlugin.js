import { isNil } from "@lbu/stdlib";
import { upperCaseFirst } from "../utils.js";
import { M } from "./ModelBuilder.js";

const store = new Set();

export const plugin = {
  init,
  build,
};

function init(app) {
  store.clear();
  app.hooks.addModel = (model) => {
    if (!M.instanceOf(model)) {
      throw new Error("Model only accpets instances of ModelBuilder. See M");
    }

    if (!model.item.name) {
      throw new Error("Registered models should have a name.");
    }

    model.item.name = upperCaseFirst(model.item.name);

    store.add(model);
  };
}

function build(result) {
  result.models = {};
  for (const model of store.values()) {
    const build = model.build();
    build.name = upperCaseFirst(build.name);
    result.models[build.name] = build;
  }

  for (const model of Object.keys(result.models)) {
    replaceReferences(result.models, result.models[model]);
  }
}

/**
 * Registered nested named models & replace others with references to them
 * @param models
 * @param model
 */
function replaceReferences(models, model) {
  if (!isNil(model.name)) {
    model.name = upperCaseFirst(model.name);

    if (!models[model.name]) {
      models[model.name] = model;
    }
  }

  switch (model.type) {
    case "object":
      for (const key of Object.keys(model.keys)) {
        replaceReferences(models, model.keys[key]);
        if (!isNil(model.keys[key].name)) {
          model.keys[key] = {
            type: "reference",
            docs: undefined,
            optional: false,
            referenceModel: model.keys[key].name,
            referenceField: undefined,
          };
        }
      }
      break;
    case "array":
      replaceReferences(models, model.values);
      if (!isNil(model.values.name)) {
        model.values = {
          type: "reference",
          docs: undefined,
          optional: false,
          referenceModel: model.values.name,
          referenceField: undefined,
        };
      }
      break;
    case "anyOf":
      for (let i = 0; i < model.values.length; ++i) {
        const innerValidator = model.values[i];
        replaceReferences(models, innerValidator);
        if (!isNil(innerValidator.name)) {
          model.values[i] = {
            type: "reference",
            docs: undefined,
            optional: false,
            referenceModel: innerValidator.name,
            referenceField: undefined,
          };
        }
      }
      break;
    case "generic":
      replaceReferences(models, model.keys);
      if (!isNil(model.keys.name)) {
        model.keys = {
          type: "reference",
          docs: undefined,
          optional: false,
          referenceModel: model.keys.name,
          referenceField: undefined,
        };
      }
      replaceReferences(models, model.values);
      if (!isNil(model.values.name)) {
        model.values = {
          type: "reference",
          docs: undefined,
          optional: false,
          referenceModel: model.values.name,
          referenceField: undefined,
        };
      }
      break;
  }
}
