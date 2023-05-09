import { AppError } from "@compas/stdlib";
import {
  AnyOfType,
  ArrayType,
  BooleanType,
  NumberType,
  ObjectType,
  ReferenceType,
} from "../builders/index.js";
import { stringFormatNameForError, upperCaseFirst } from "../utils.js";
import { modelKeyGetSearchable } from "./model-keys.js";
import {
  modelRelationGetInformation,
  modelRelationGetInverse,
  modelRelationGetOwn,
} from "./model-relation.js";
import { modelQueryPartType, structureModels } from "./models.js";
import { referenceUtilsGetProperty } from "./reference-utils.js";
import { structureAddType, structureResolveReference } from "./structure.js";

/**
 * @typedef {"equal"|"notEqual"|"in"|"notIn"|"greaterThan"
 * |"lowerThan"|"like"|"iLike"|"notLike"
 * |"isNull"|"isNotNull"|"includeNotNull"
 * } ModelWhereVariant
 */

/**
 * @typedef {object} ModelWhereInformation
 * @property {{
 *   modelKey: string,
 *   whereKey: string,
 *   variant: ModelWhereVariant
 * }[]} fields
 */

const modelWhereTypeTable = {
  number: ["equal", "notEqual", "in", "notIn", "greaterThan", "lowerThan"],
  date: ["equal", "notEqual", "in", "notIn", "greaterThan", "lowerThan"],
  uuid: ["equal", "notEqual", "in", "notIn"],
  string: ["equal", "notEqual", "in", "notIn", "like", "iLike", "notLike"],
  boolean: ["equal"],
};

/**
 * Cache where information per model.
 *
 * @type {WeakMap<
 *   import("../generated/common/types.js").ExperimentalObjectDefinition,
 *   ModelWhereInformation
 * >}
 */
const whereCache = new WeakMap();

/**
 *
 * @param {import("../generated/common/types.js").ExperimentalObjectDefinition} model
 * @returns {ModelWhereInformation}
 */
export function modelWhereGetInformation(model) {
  const whereInformation = whereCache.get(model);

  if (!whereInformation) {
    throw AppError.serverError({
      message: `Could not find the 'whereInformation' object for ${stringFormatNameForError(
        model,
      )}. Is it a model? Did 'modelWhereBuildWhereInformation' before you called this?`,
    });
  }

  return whereInformation;
}

/**
 * Build the {@link ModelWhereInformation} object for each model. This way further
 * generation can just fetch the model from the cache instead of recalculating this.
 *
 * @param {import("../generate.js").GenerateContext} generateContext
 * @returns {void}
 */
export function modelWhereBuildWhereInformation(generateContext) {
  for (const model of structureModels(generateContext)) {
    /** @type {ModelWhereInformation} */
    const whereInformation = {
      fields: [],
    };

    for (const modelKey of modelKeyGetSearchable(generateContext, model)) {
      const field =
        model.keys[modelKey].type === "reference"
          ? structureResolveReference(
              generateContext.structure,
              model.keys[modelKey],
            )
          : model.keys[modelKey];

      const typeTable = modelWhereTypeTable[field.type] ?? [];

      for (const type of typeTable) {
        whereInformation.fields.push({
          modelKey,
          whereKey:
            type === "equal" ? modelKey : `${modelKey}${upperCaseFirst(type)}`,
          variant: type,
        });
      }

      if (modelKey === "deletedAt" && model.queryOptions?.withSoftDeletes) {
        whereInformation.fields.push({
          modelKey,
          whereKey: `${modelKey}IncludeNotNull`,
          variant: "includeNotNull",
        });
      } else if (
        referenceUtilsGetProperty(generateContext, model.keys[modelKey], [
          "isOptional",
        ])
      ) {
        whereInformation.fields.push(
          {
            modelKey,
            whereKey: `${modelKey}IsNull`,
            variant: "isNull",
          },
          {
            modelKey,
            whereKey: `${modelKey}IsNotNull`,
            variant: "isNotNull",
          },
        );
      }
    }

    whereCache.set(model, whereInformation);
  }
}

/**
 * Build the 'where' types for all models.
 *
 * @param {import("../generate.js").GenerateContext} generateContext
 * @returns {void}
 */
export function modelWhereBuildWhereTypes(generateContext) {
  for (const model of structureModels(generateContext)) {
    const defaults = {
      name: undefined,
      group: undefined,
      uniqueName: undefined,
      isOptional: true,
      defaultValue: undefined,
      docString: "",
    };

    const whereInformation = modelWhereGetInformation(model);
    const ownRelations = modelRelationGetOwn(model);
    const inverseRelations = modelRelationGetInverse(model);

    const type = new ObjectType(model.group, `${model.name}Where`)
      .keys({})
      .build();

    type.keys["$raw"] = modelQueryPartType().optional().build();
    type.keys["$or"] = new ArrayType()
      .values(new ReferenceType(type.group, type.name))
      .optional()
      .build();

    for (const whereField of whereInformation.fields) {
      if (["in", "notIn"].includes(whereField.variant)) {
        // We can't use the builders normally since we need to override some properties
        type.keys[whereField.whereKey] = {
          ...new AnyOfType().values(true).optional().build(),
          values: [
            {
              ...new ArrayType().values(true).build(),
              values: {
                ...model.keys[whereField.modelKey],
                ...defaults,

                // Array values should never be optional.
                isOptional: false,
              },
            },
            modelQueryPartType().build(),
          ],
        };
      } else if (
        ["isNull", "isNotNull", "includeNotNull"].includes(whereField.variant)
      ) {
        type.keys[whereField.whereKey] = new BooleanType().optional().build();
      } else {
        type.keys[whereField.whereKey] = {
          ...model.keys[whereField.modelKey],
          ...defaults,
        };
      }
    }

    for (const relation of ownRelations) {
      const relationInfo = modelRelationGetInformation(relation);

      type.keys[`via${upperCaseFirst(relationInfo.keyNameOwn)}`] =
        new ObjectType()
          .keys({
            where: new ReferenceType( // @ts-expect-error
              relationInfo.modelInverse.group,
              `${relationInfo.modelInverse.name}Where`,
            ).default("{}"),
            limit: new NumberType().min(1).optional(),
            offset: new NumberType().min(0).optional(),
          })
          .optional()
          .build();
    }

    for (const relation of inverseRelations) {
      const relationInfo = modelRelationGetInformation(relation);

      type.keys[`via${upperCaseFirst(relationInfo.relationInverse.ownKey)}`] =
        new ObjectType()
          .keys({
            where: new ReferenceType( // @ts-expect-error
              relationInfo.modelOwn.group,
              `${relationInfo.modelOwn.name}Where`,
            ).default("{}"),
            limit: new NumberType().min(1).optional(),
            offset: new NumberType().min(0).optional(),
          })
          .optional()
          .build();

      type.keys[`${relationInfo.relationInverse.ownKey}NotExists`] =
        new ReferenceType( // @ts-expect-error
          relationInfo.modelOwn.group,
          `${relationInfo.modelOwn.name}Where`,
        )
          .optional()
          .build();
    }

    structureAddType(generateContext.structure, type, {
      skipReferenceExtraction: true,
    });
  }
}
