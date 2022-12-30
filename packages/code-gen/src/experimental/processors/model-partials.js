import {
  AnyOfType,
  AnyType,
  ArrayType,
  BooleanType,
  NumberType,
  ObjectType,
  ReferenceType,
  StringType,
} from "../../builders/index.js";
import { structureModels } from "./models.js";
import { referenceUtilsGetProperty } from "./reference-utils.js";
import { structureAddType, structureResolveReference } from "./structure.js";

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
    if (model.queryOptions?.isView) {
      continue;
    }

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

/**
 * Build the 'update' types for all models.
 *
 * @param {import("../generate").GenerateContext} generateContext
 * @returns {void}
 */
export function modelPartialUpdateTypes(generateContext) {
  for (const model of structureModels(generateContext)) {
    if (model.queryOptions?.isView) {
      continue;
    }

    const typePartial = new ObjectType(
      model.group,
      `${model.name}UpdatePartial`,
    )
      .keys({})
      .build();

    const type = new ObjectType(model.group, `${model.name}Update`)
      .keys({
        update: new ArrayType().values(
          new ReferenceType(model.group, `${model.name}UpdatePartial`),
        ),
        where: new ReferenceType(model.group, `${model.name}Where`),
        returning: new ReferenceType(model.group, `${model.name}Returning`),
      })
      .build();

    for (const modelKey of Object.keys(model.keys)) {
      const isPrimary = referenceUtilsGetProperty(
        generateContext,
        model.keys[modelKey],
        ["sql", "primary"],
      );

      if (isPrimary) {
        continue;
      }

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
        ...new AnyOfType().values(true).optional().build(),
        values: [
          {
            ...model.keys[modelKey],
            isOptional: true,
            validator: {
              ...model.keys[modelKey].validator,
              allowNull: isOptional && !hasSqlDefault,
            },
          },
        ],
      };

      const originalField =
        model.keys[modelKey].type === "reference"
          ? structureResolveReference(
              generateContext.structure,
              model.keys[modelKey],
            )
          : model.keys[modelKey];

      if (originalField.type === "number") {
        for (const atomicField of [
          "$add",
          "$subtract",
          "$multiply",
          "$divide",
        ]) {
          typePartial.keys[modelKey].values.push(
            new ObjectType()
              .keys({
                [atomicField]: originalField.validator.floatingPoint
                  ? new NumberType().float()
                  : new NumberType(),
              })
              .build(),
          );
        }
      } else if (originalField.type === "date") {
        for (const atomicField of ["$add", "$subtract"]) {
          typePartial.keys[modelKey].values.push(
            new ObjectType()
              .keys({
                [atomicField]: new StringType(),
              })
              .build(),
          );
        }
      } else if (originalField.type === "string") {
        for (const atomicField of ["$append"]) {
          typePartial.keys[modelKey].values.push(
            new ObjectType()
              .keys({
                [atomicField]: new StringType(),
              })
              .build(),
          );
        }
      } else if (originalField.type === "boolean") {
        for (const atomicField of ["$negate"]) {
          typePartial.keys[modelKey].values.push(
            new ObjectType()
              .keys({
                [atomicField]: new BooleanType(),
              })
              .build(),
          );
        }
      } else if (
        ["any", "anyOf", "array", "generic", "object"].includes(
          originalField.type,
        )
      ) {
        const pathType = new ArrayType().values(
          new AnyOfType().values(new NumberType(), new StringType()),
        );

        typePartial.keys[modelKey].values.push(
          new ObjectType()
            .keys({
              $set: new ObjectType().keys({
                path: pathType,
                value: new AnyType(),
              }),
            })
            .build(),
          new ObjectType()
            .keys({
              $remove: new ObjectType().keys({
                path: pathType,
              }),
            })
            .build(),
        );
      }
    }

    structureAddType(generateContext.structure, typePartial, {
      skipReferenceExtraction: true,
    });
    structureAddType(generateContext.structure, type, {
      skipReferenceExtraction: true,
    });
  }
}
