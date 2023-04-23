import { AppError } from "@compas/stdlib";
import { ReferenceType, RelationType } from "../../builders/index.js";
import { errorsThrowCombinedError } from "../errors.js";
import {
  stringFormatNameForError,
  stringFormatRelation,
} from "../string-format.js";
import { typesOptionalityIsOptional } from "../types/optionality.js";
import { modelKeyGetPrimary } from "./model-keys.js";
import { structureModels } from "./models.js";
import { structureNamedTypes, structureResolveReference } from "./structure.js";

/**
 * @typedef {{
 *   modelOwn:
 *   import("../generated/common/types").ExperimentalObjectDefinition,
 *   modelInverse:
 *   import("../generated/common/types").ExperimentalObjectDefinition,
 *   relationOwn:
 *   import("../generated/common/types").ExperimentalRelationDefinition,
 *   relationInverse:
 *   import("../generated/common/types").ExperimentalRelationDefinition,
 *   keyNameOwn: string,
 *   keyDefinitionOwn:
 *   import("../generated/common/types").ExperimentalTypeSystemDefinition,
 *   virtualKeyNameInverse: string,
 *   primaryKeyNameInverse: string,
 *   primaryKeyDefinitionInverse:
 *   import("../generated/common/types").ExperimentalTypeSystemDefinition,
 * }} ModelRelationInformation
 */

/**
 * Cache to resolve various relations related types.
 *
 * @type {WeakMap<
 *   import("../generated/common/types").ExperimentalRelationDefinition,
 *   ModelRelationInformation
 * >}
 */
const relationCache = new WeakMap();

/**
 * Get the owned relations of the provided model. The 'relation.ownKey' of these
 * relations is a field on the model that it belongs to.
 *
 * @param {import("../generated/common/types").ExperimentalObjectDefinition} model
 * @returns {import("../generated/common/types").ExperimentalRelationDefinition[]}
 */
export function modelRelationGetOwn(model) {
  /** @type {import("../generated/common/types").ExperimentalRelationDefinition[]} */
  const result = [];

  for (const relation of model.relations) {
    if (relation.subType === "manyToOne" || relation.subType === "oneToOne") {
      result.push(relation);
    }
  }

  return result;
}

/**
 * Get the inverse relations of the provided model. The 'relation.ownKey' is a virtual
 * key on this model, which is not populated by default.
 *
 * @param {import("../generated/common/types").ExperimentalObjectDefinition} model
 * @returns {import("../generated/common/types").ExperimentalRelationDefinition[]}
 */
export function modelRelationGetInverse(model) {
  /** @type {import("../generated/common/types").ExperimentalRelationDefinition[]} */
  const result = [];

  for (const relation of model.relations) {
    if (
      relation.subType === "oneToMany" ||
      relation.subType === "oneToOneReverse"
    ) {
      result.push(relation);
    }
  }

  return result;
}

/**
 * Get the related information for the provided relation.
 * This object is always built through the eyes of the owning model. So when an inverse
 * relation is passed in, the 'modelOwn' will be of the owning side.
 *
 * By returning both models and both relations, other code only needs to pass in a
 * relation to get the full picture.
 *
 * @param {import("../generated/common/types").ExperimentalRelationDefinition} relation
 * @returns {ModelRelationInformation}
 */
export function modelRelationGetInformation(relation) {
  if (relationCache.has(relation)) {
    // @ts-expect-error
    //
    // There is no way this can go wrong, so ignore TS
    return relationCache.get(relation);
  }

  throw AppError.serverError({
    message:
      "Unexpected relation found, this can only be used when all relations are resolved",
    relation,
  });
}

/**
 * Follow all relations of each model;
 *
 * - Checks all named types for invalid `.relations()` usages. These relations are not
 * checked or used.
 * - Check if the relation resolves to its inverse or own relation
 * - Add the inverse relation of a `oneToOne` -> `oneToOneReverse`
 * - Check if the referenced model has enabled queries
 * - Error on unnecessary or invalid relations
 *
 * @param {import("../generate").GenerateContext} generateContext
 * @returns {void}
 */
export function modelRelationCheckAllRelations(generateContext) {
  /** @type {import("@compas/stdlib").AppError[]} */
  const errors = [];
  const reservedRelationNames = [
    "as",
    "limit",
    "offset",
    "orderBy",
    "orderBySpec",
    "select",
    "where",
  ];

  // Ensure that each object that has relations also has queries enabled, this is an easy
  // mistake to make. At some point we may auto enable queries when this is done, but
  // feels better to just throw a nice error.
  for (const namedType of structureNamedTypes(generateContext.structure)) {
    if (namedType.type !== "object") {
      continue;
    }

    if (namedType.relations.length > 0 && namedType.enableQueries !== true) {
      errors.push(
        AppError.serverError({
          message: `${stringFormatNameForError(
            namedType,
          )} has relations, but '.enableQueries()' was not called. Either remove the relations or add '.enableQueries()'.`,
        }),
      );
    }
  }

  // Errors in this function transition in to more errors, so throw earlier
  errorsThrowCombinedError(errors);

  const inverseRelationsUsed = new Set();

  // Add oneToOneInverse relations and check if each own relation resolves to an inverse
  // relation
  for (const model of structureModels(generateContext)) {
    for (const relation of modelRelationGetOwn(model)) {
      /** @type {import("../types").NamedType<import("../generated/common/types").ExperimentalObjectDefinition>} */
      // @ts-expect-error
      const inverseModel = structureResolveReference(
        generateContext.structure,
        relation.reference,
      );

      // The user has now way of building a one to one inverse, so create it manually and
      // at it.
      if (relation.subType === "oneToOne") {
        inverseModel.relations.push(
          // @ts-expect-error
          new RelationType(
            "oneToOneReverse",
            relation.referencedKey,
            new ReferenceType(model.group, model.name),
            relation.ownKey,
          ).build(),
        );
      }

      const inverseRelations = modelRelationGetInverse(inverseModel).filter(
        (it) =>
          it.ownKey === relation.referencedKey &&
          it.reference.reference.group === model.group &&
          it.reference.reference.name === model.name,
      );

      if (inverseRelations.length === 0) {
        errors.push(
          AppError.serverError({
            message: `Relation ${stringFormatRelation(
              model.name,
              inverseModel.name,
              relation.ownKey,

              // @ts-expect-error
              //
              // We set the referenced key earlier in the
              // processors
              relation.referencedKey,
            )} can not be found on ${stringFormatNameForError(
              inverseModel,
            )}. Add 'T.oneToMany("${relation.referencedKey}", T.reference("${
              model.group
            }", "${model.name}"))' inside a '.relations()' on the 'T.object("${
              inverseModel.name
            }")' definition.`,
          }),
        );
      } else if (inverseRelations.length !== 1) {
        errors.push(
          AppError.serverError({
            message: `Relation ${stringFormatRelation(
              model.name,
              inverseModel.name,
              relation.ownKey,

              // @ts-expect-error
              //
              // We set the referenced key earlier in the
              // processors
              relation.referencedKey,
            )} resolves to many inverse relations on ${stringFormatNameForError(
              inverseModel,
            )}. Make sure that each relation has a unique inverse relation.`,
          }),
        );
      } else {
        inverseRelationsUsed.add(inverseRelations[0]);
        inverseRelations[0].referencedKey = relation.ownKey;
      }
    }
  }

  // Errors in this function transition in to more errors, so throw earlier
  errorsThrowCombinedError(errors);

  // Make sure that each relation key is unique
  for (const model of structureModels(generateContext)) {
    const uniqueOwnRelationKeys = new Set(
      model.relations.map((it) => it.ownKey),
    );

    if (uniqueOwnRelationKeys.size !== model.relations.length) {
      for (const relation of model.relations) {
        if (uniqueOwnRelationKeys.has(relation.ownKey)) {
          uniqueOwnRelationKeys.delete(relation.ownKey);
        } else {
          errors.push(
            AppError.serverError({
              message: `Model ${stringFormatNameForError(
                model,
              )} has multiple relations with the same 'own' key '${
                relation.ownKey
              }'. Rename one the usages so each 'own' key is unique.`,
            }),
          );
        }
      }
    }
  }

  // Errors in this function transition in to more errors, so throw earlier
  errorsThrowCombinedError(errors);

  // Ensure that each inverse relation is used
  for (const model of structureModels(generateContext)) {
    for (const relation of modelRelationGetInverse(model)) {
      if (!inverseRelationsUsed.has(relation)) {
        errors.push(
          AppError.serverError({
            message: `The inverse relation 'T.oneToMany("${
              relation.ownKey
            }", T.reference("${relation.reference.reference.group}", "${
              relation.reference.reference.name
            }"))' on ${stringFormatNameForError(
              model,
            )} is not used. Either remove it from the definition of ${stringFormatNameForError(
              model,
            )} or add an 'T.manyToOne()' to ${stringFormatNameForError(
              relation.reference.reference,
            )}`,
          }),
        );
      }
    }
  }

  // Errors in this function transition in to more errors, so throw earlier
  errorsThrowCombinedError(errors);

  for (const model of structureModels(generateContext)) {
    for (const relation of model.relations) {
      if (reservedRelationNames.includes(relation.ownKey)) {
        errors.push(
          AppError.serverError({
            message: `Relation name '${
              relation.ownKey
            }' on ${stringFormatNameForError(
              model,
            )} is a reserved keyword. Use another relation name.`,
          }),
        );
      }
    }
  }

  // Errors in this function transition in to more errors, so throw earlier
  errorsThrowCombinedError(errors);
}

/**
 * Add keys to the models that are needed by relations. This assumes that all relations
 * exist and are valid.
 *
 * @param {import("../generate").GenerateContext} generateContext
 * @returns {void}
 */
export function modelRelationAddKeys(generateContext) {
  /** @type {import("@compas/stdlib").AppError[]} */
  const errors = [];

  for (const model of structureModels(generateContext)) {
    for (const relation of modelRelationGetOwn(model)) {
      // We allow the user to define their own key for this relation, however it should
      // have the same type as the referenced primary key.
      if (model.keys[relation.ownKey]) {
        /** @type {import("../types").NamedType<import("../generated/common/types").ExperimentalObjectDefinition>} */
        // @ts-expect-error
        const modelInverse = structureResolveReference(
          generateContext.structure,
          relation.reference,
        );

        const { primaryKeyDefinition } = modelKeyGetPrimary(modelInverse);

        if (model.keys[relation.ownKey].type !== primaryKeyDefinition.type) {
          errors.push(
            AppError.serverError({
              message: `The relation ${stringFormatRelation(
                model.name,
                modelInverse.name,
                relation.ownKey,

                // @ts-expect-error
                //
                // Referenced key is set earlier in the
                // process
                relation.referencedKey,
              )} uses a user defined type for '${relation.ownKey}' ('${
                model.keys[relation.ownKey].type
              }'). However, the type of that field is not compatible with the primary key of '${
                modelInverse.name
              }' ('${
                primaryKeyDefinition.type
              }'). Compas.js is able to automatically create the correct key based on the known primary key if you remove the '${
                relation.ownKey
              }' from the definition of '${model.name}'.`,
            }),
          );
        }

        if (
          typesOptionalityIsOptional(
            generateContext,
            model.keys[relation.ownKey],
            {
              validatorState: "output",
            },
          ) !== relation.isOptional
        ) {
          AppError.serverError({
            message: `The relation ${stringFormatRelation(
              model.name,
              modelInverse.name,
              relation.ownKey,

              // @ts-expect-error
              //
              // Referenced key is set earlier in the
              // process
              relation.referencedKey,
            )} uses a user defined type for '${relation.ownKey}' ('${
              model.keys[relation.ownKey].type
            }'). However, the type of that field is optional, while the provided relation is not. Either make the relation optional, or remove '.optional()' from the defined type for '${
              relation.ownKey
            }'. Compas.js is able to automatically create the correct key based on the known primary key if you remove the '${
              relation.ownKey
            }' from the definition of '${model.name}'.`,
          });
        }
      } else {
        // The inverse field doesn't exist yet, create it.

        const { primaryKeyDefinition } = modelKeyGetPrimary(
          // @ts-expect-error
          //
          // The return value from
          // structureResolveReference
          // is always a valid model
          // type. We also can't use
          // 'modelRelationGetInformation'
          // yet, since the cache has
          // not built yet.
          structureResolveReference(
            generateContext.structure,
            relation.reference,
          ),
        );

        // Copy over the full type, removing 'primary' but keeping it searchable.
        model.keys[relation.ownKey] = Object.assign({}, primaryKeyDefinition, {
          sql: {
            primary: false,
            searchable: true,
            hasDefaultValue: false,
          },
          isOptional: relation.isOptional,
        });
      }
    }
  }

  return errorsThrowCombinedError(errors);
}

/**
 * Prime the relation cache. This way sub functions can just pass a relation to
 * 'modelRelationGetInformation' and get all related information.
 *
 * @param {import("../generate").GenerateContext} generateContext
 * @returns {void}
 */
export function modelRelationBuildRelationInformationCache(generateContext) {
  for (const model of structureModels(generateContext)) {
    for (const relation of modelRelationGetOwn(model)) {
      /** @type { import("../generated/common/types").ExperimentalObjectDefinition} */
      // @ts-expect-error
      const modelInverse = structureResolveReference(
        generateContext.structure,
        relation.reference,
      );

      const relationInverse = modelRelationGetInverse(modelInverse).find(
        (it) => it.ownKey === relation.referencedKey,
      );

      const { primaryKeyName, primaryKeyDefinition } =
        modelKeyGetPrimary(modelInverse);

      relationCache.set(relation, {
        modelOwn: model,
        modelInverse,
        relationOwn: relation,

        // @ts-expect-error
        //
        // Relation is for sure found, we validated that earlier in the processors.
        relationInverse,
        keyNameOwn: relation.ownKey,
        keyDefinitionOwn: model.keys[relation.ownKey],
        virtualKeyNameInverse: relation.referencedKey ?? "",
        primaryKeyNameInverse: primaryKeyName,
        primaryKeyDefinitionInverse: primaryKeyDefinition,
      });
    }
  }

  for (const model of structureModels(generateContext)) {
    for (const relation of modelRelationGetInverse(model)) {
      /** @type { import("../generated/common/types").ExperimentalObjectDefinition} */
      // @ts-expect-error
      const modelOwn = structureResolveReference(
        generateContext.structure,
        relation.reference,
      );

      const relationOwn = modelRelationGetOwn(modelOwn).find(
        (it) => it.ownKey === relation.referencedKey,
      );

      const { primaryKeyName, primaryKeyDefinition } =
        modelKeyGetPrimary(model);

      relationCache.set(relation, {
        modelOwn: modelOwn,
        modelInverse: model,

        // @ts-expect-error
        //
        // Relation is for sure found, we validated that earlier in the processors
        relationOwn: relationOwn,
        relationInverse: relation,

        // @ts-expect-error
        //
        // Referenced key is already resolved here.
        keyNameOwn: relation.referencedKey,
        keyDefinitionOwn: modelOwn.keys[relation.referencedKey ?? ""],
        virtualKeyNameInverse: relation.ownKey,
        primaryKeyNameInverse: primaryKeyName,
        primaryKeyDefinitionInverse: primaryKeyDefinition,
      });
    }
  }
}
