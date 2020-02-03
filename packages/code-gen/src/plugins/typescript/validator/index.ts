import { TypeMap, WrappedAbstractTree } from "../../../types";
import { upperCaseFirst } from "../../../util";
import { getErrorClass } from "./errors";
import { createFunctionsForSchemas } from "./functions";

export function buildValidator(tree: WrappedAbstractTree): string {
  return [
    getImports(tree.validators),
    getErrorClass(),
    createFunctionsForSchemas(tree.validators),
  ].join("\n");
}

function getImports(validators: TypeMap) {
  const types = Object.keys(validators).map(it => upperCaseFirst(it));

  return `
  import { isNil } from "@lbu/stdlib";
  import { ${types.join(",\n")} } from "./types";
`;
}
