import { AppError, isNil } from "@compas/stdlib";
import { typesOptionalityIsOptional } from "../types/optionality.js";
import { stringFormatNameForError } from "../utils.js";
import { referenceUtilsGetProperty } from "./reference-utils.js";
import { structureNamedTypes, structureResolveReference } from "./structure.js";
import { typeDefinitionTraverse } from "./type-definition-traverse.js";

/**
 * Preprocess 'anyOf' types
 *
 * - Make optional if one of the values is optional
 * - Make nullable if one of the values is nullable
 *
 * Double check on discriminant usage
 *
 * @param {import("../generate.js").GenerateContext} generateContext
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

        if (type.type === "anyOf" && type.validator.discriminant) {
          anyOfPreprocessDiscriminant(generateContext, type);
        }
      },
      {
        isInitialType: true,
        assignResult: false,
      },
    );
  }
}

/**
 * Check discriminant usage
 *
 * - All values should resolve to an object type
 * - The discriminant should be unique and a single `oneOf` string
 *
 * @param {import("../generate.js").GenerateContext} generateContext
 * @param {import("../generated/common/types.d.ts").StructureAnyOfDefinition} type
 */
function anyOfPreprocessDiscriminant(generateContext, type) {
  const discriminantSet = new Set();

  if (!type.validator.discriminant) {
    return;
  }

  for (const subType of type.values) {
    const resolvedSubType =
      subType.type === "reference"
        ? structureResolveReference(generateContext.structure, subType)
        : subType;

    if (resolvedSubType.type !== "object") {
      throw AppError.serverError({
        message: `'T.anyOf().values(...).discriminant("${
          type.validator.discriminant
        }")' can only be used if all values are an object. Found '${
          resolvedSubType.type
        }' in ${stringFormatNameForError(type)}.`,
      });
    }

    const oneOf = referenceUtilsGetProperty(
      generateContext,
      resolvedSubType.keys[type.validator.discriminant],
      ["oneOf"],
      [],
    );

    if (
      isNil(oneOf) ||
      !Array.isArray(oneOf) ||
      typeof oneOf[0] !== "string" ||
      discriminantSet.has(oneOf[0])
    ) {
      throw AppError.serverError({
        message: `'T.anyOf().values(...).discriminant("${
          type.validator.discriminant
        }")' is used, but '${
          type.validator.discriminant
        }' does not exists, does not resolve to a string literal or is not unique on ${stringFormatNameForError(
          resolvedSubType,
        )} via ${stringFormatNameForError(type)}.`,
        foundDiscriminantValues: [...discriminantSet],
      });
    }

    discriminantSet.add(oneOf[0]);
  }
}
