import { isNil } from "@lbu/stdlib";
import { upperCaseFirst } from "../../utils.js";

export function processExtendsFrom(models, extendsFrom) {
  const nonUnique = [];

  for (const extender of extendsFrom) {
    for (const m of Object.keys(extender.models)) {
      if (!isNil(models[m])) {
        nonUnique.push(m);
      }

      models[m] = extender.models[m];
    }
  }

  return nonUnique;
}

export function processStore(models, store) {
  const nonUnique = [];

  for (const model of store) {
    const build = model.build();
    build.name = upperCaseFirst(build.name);

    if (!isNil(models[build.name])) {
      nonUnique.push(build.name);
    }

    models[build.name] = build;
  }

  return nonUnique;
}
