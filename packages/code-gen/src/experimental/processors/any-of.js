import { typesOptionalityIsOptional } from "../types/optionality.js";
import { referenceUtilsGetProperty } from "./reference-utils.js";
import { structureNamedTypes } from "./structure.js";
import { typeDefinitionTraverse } from "./type-definition-traverse.js";

/**
 * Preprocess 'anyOf' types
 *
 * - Make optional if one of the values is optional
 * - Make nullable if one of the values is nullable
 * - Pick the first 'defaultValue'
 *
 * @param {import("../generate").GenerateContext} generateContext
 */
export function anyOfPreProcess(generateContext) {
  for (const namedType of structureNamedTypes(generateContext.structure)) {
    typeDefinitionTraverse(
      namedType,
      (type, callback) => {
        callback(type);

        if (type.type === "anyOf") {
          let isOptional = type.isOptional ?? false;
          // @ts-expect-error
          let allowNull = type.validator?.allowNull ?? false;

          for (const value of type.values) {
            isOptional ||= typesOptionalityIsOptional(generateContext, value, {
              validatorState: "input",
            });
            allowNull ||= referenceUtilsGetProperty(
              generateContext,
              value,
              ["validator", "allowNull"],
              false,
            );
          }

          type.isOptional = isOptional;
          type.validator ??= {};
          // @ts-expect-error
          type.validator.allowNull = allowNull;
        }
      },
      {
        isInitialType: true,
        assignResult: false,
      },
    );
  }
}
