import {
  AnyOfType,
  ArrayType,
  NumberType,
  ObjectType,
  ReferenceType,
} from "../builders/index.js";
import { upperCaseFirst } from "../utils.js";
import {
  modelRelationGetInformation,
  modelRelationGetInverse,
  modelRelationGetOwn,
} from "./model-relation.js";
import { structureModels } from "./models.js";
import { referenceUtilsGetProperty } from "./reference-utils.js";
import { structureAddType } from "./structure.js";

/**
 * Build the 'queryXxx' input types for all models.
 *
 * @param {import("../generate.js").GenerateContext} generateContext
 * @returns {void}
 */
export function modelQueryBuilderTypes(generateContext) {
  for (const model of structureModels(generateContext)) {
    const type = new ObjectType(model.group, `${model.name}QueryBuilder`)
      .keys({
        where: new ReferenceType(model.group, `${model.name}Where`).optional(),
        orderBy: new ReferenceType(
          model.group,
          `${model.name}OrderBy`,
        ).optional(),
        orderBySpec: new ReferenceType(
          model.group,
          `${model.name}OrderBySpec`,
        ).optional(),
        limit: new NumberType().min(1).optional(),
        offset: new NumberType().min(0).optional(),
        select: new ReferenceType(
          model.group,
          `${model.name}Returning`,
        ).default(JSON.stringify(Object.keys(model.keys))),
      })
      .build();

    for (const relation of modelRelationGetOwn(model)) {
      const relationInfo = modelRelationGetInformation(relation);

      type.keys[relationInfo.keyNameOwn] = new ReferenceType( // @ts-expect-error
        relationInfo.modelInverse.group,
        `${relationInfo.modelInverse.name}QueryBuilder`,
      )
        .optional()
        .build();
    }

    for (const relation of modelRelationGetInverse(model)) {
      const relationInfo = modelRelationGetInformation(relation);

      type.keys[relationInfo.virtualKeyNameInverse] = new ReferenceType( // @ts-expect-error
        relationInfo.modelOwn.group,
        `${relationInfo.modelOwn.name}QueryBuilder`,
      )
        .optional()
        .build();
    }

    structureAddType(generateContext.structure, type, {
      skipReferenceExtraction: true,
    });
  }
}

/**
 * Build the 'xxxQueryResult' output types for all models.
 *
 * @param {import("../generate.js").GenerateContext} generateContext
 * @returns {void}
 */
export function modelQueryResultTypes(generateContext) {
  for (const model of structureModels(generateContext)) {
    const type = new ObjectType(
      "queryResult",
      model.group + upperCaseFirst(model.name),
    )
      .keys({})
      .build();

    type.keys = {
      ...model.keys,
    };

    for (const relation of modelRelationGetOwn(model)) {
      const relationInfo = modelRelationGetInformation(relation);

      const existingType = type.keys[relationInfo.keyNameOwn];
      const isOptional = referenceUtilsGetProperty(
        generateContext,
        type.keys[relationInfo.keyNameOwn],
        ["isOptional"],
      );
      const joinedType = new ReferenceType(
        "queryResult",
        `${relationInfo.modelInverse.group}${upperCaseFirst(
          relationInfo.modelInverse.name,
        )}`,
      ).build();

      const anyOfType = new AnyOfType().values(true);
      if (isOptional) {
        anyOfType.optional();
      }
      type.keys[relationInfo.keyNameOwn] = anyOfType.build();

      type.keys[relationInfo.keyNameOwn].values = [existingType, joinedType];
    }

    for (const relation of modelRelationGetInverse(model)) {
      const relationInfo = modelRelationGetInformation(relation);

      const joinedType =
        relation.subType === "oneToMany" ?
          new ArrayType().values(
            new ReferenceType(
              "queryResult",
              `${relationInfo.modelOwn.group}${upperCaseFirst(
                relationInfo.modelOwn.name,
              )}`,
            ),
          )
        : new ReferenceType(
            "queryResult",
            `${relationInfo.modelOwn.group}${upperCaseFirst(relationInfo.modelOwn.name)}`,
          );

      type.keys[relationInfo.virtualKeyNameInverse] = joinedType
        .optional()
        .build();
    }

    structureAddType(generateContext.structure, type, {
      skipReferenceExtraction: true,
    });
  }
}
