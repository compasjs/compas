import {
  AnyOfType,
  ArrayType,
  ObjectType,
  ReferenceType,
  StringType,
} from "../../builders/index.js";
import { structureModels } from "./models.js";
import { referenceUtilsGetProperty } from "./reference-utils.js";
import { structureAddType } from "./structure.js";

/**
 * Build the 'returning' types for all models.
 *
 * @param {import("../generate").GenerateContext} generateContext
 * @returns {void}
 */
export function modelPartialReturningTypes(generateContext) {
  for (const model of structureModels(generateContext)) {
    const type = new AnyOfType(model.group, `${model.name}Returning`)
      .values(
        "*",
        new ArrayType().values(
          new StringType().oneOf(...Object.keys(model.keys)),
        ),
      )
      .default(`"*"`)
      .build();

    structureAddType(generateContext.structure, type, {
      skipReferenceExtraction: true,
    });
  }
}

/**
 * Build the 'insert' types for all models.
 *
 * @param {import("../generate").GenerateContext} generateContext
 * @returns {void}
 */
export function modelPartialInsertTypes(generateContext) {
  for (const model of structureModels(generateContext)) {
    const typePartial = new ObjectType(
      model.group,
      `${model.name}InsertPartial`,
    )
      .keys({})
      .build();

    const type = new ObjectType(model.group, `${model.name}Insert`)
      .keys({
        insert: new ArrayType().values(
          new ReferenceType(model.group, `${model.name}InsertPartial`),
        ),
        returning: new ReferenceType(model.group, `${model.name}Returning`),
      })
      .build();

    for (const modelKey of Object.keys(model.keys)) {
      const isPrimary = referenceUtilsGetProperty(
        generateContext,
        model.keys[modelKey],
        ["sql", "primary"],
      );
      const hasSqlDefault = referenceUtilsGetProperty(
        generateContext,
        model.keys[modelKey],
        ["sql", "hasDefaultValue"],
      );
      const isOptional = referenceUtilsGetProperty(
        generateContext,
        model.keys[modelKey],
        ["isOptional"],
      );

      typePartial.keys[modelKey] = {
        ...model.keys[modelKey],
        isOptional: isPrimary || hasSqlDefault || isOptional,
        validator: {
          ...model.keys[modelKey].validator,
          allowNull: isOptional || hasSqlDefault,
        },
      };
    }

    structureAddType(generateContext.structure, typePartial, {
      skipReferenceExtraction: true,
    });
    structureAddType(generateContext.structure, type, {
      skipReferenceExtraction: true,
    });
  }
}
