import { AppError, isNil } from "@compas/stdlib";
import {
  errorsThrowCombinedError,
  stringFormatNameForError,
} from "../utils.js";
import {
  crudInformationGetHasCustomReadableType,
  crudInformationGetModel,
  crudInformationGetParent,
  crudInformationGetRelation,
  crudInformationSetHasCustomReadableType,
  crudInformationSetModel,
  crudInformationSetRelationAndParent,
} from "./crud-information.js";
import { structureCrud } from "./crud.js";
import { structureResolveReference } from "./structure.js";

/**
 * Validate CRUD types.
 *
 * TODO: Expand docs
 *
 * @param {import("../generate.js").GenerateContext} generateContext
 */
export function crudValidation(generateContext) {
  /** @type {import("@compas/stdlib").AppError[]} */
  const errors = [];

  for (const crud of structureCrud(generateContext)) {
    try {
      crudValidateType(generateContext, crud);
    } catch (/** @type {any} */ error) {
      errors.push(error);
    }
  }

  return errorsThrowCombinedError(errors);
}

/**
 * @param {import("../generate.js").GenerateContext} generateContext
 * @param {import("../../types/advanced-types").NamedType<import("../generated/common/types").StructureCrudDefinition>} crud
 */
function crudValidateType(generateContext, crud) {
  /**
   * @type {import("../../types/advanced-types").NamedType<import("../generated/common/types").StructureObjectDefinition>}
   */
  // @ts-expect-error
  const model = structureResolveReference(
    generateContext.structure, // @ts-expect-error
    crud.entity,
  );

  if (!model.enableQueries) {
    throw AppError.serverError({
      message: `CRUD generation requires an entity which has '.enableQueries()'. Found a 'T.crud()' in the '${crud.group}' group which did not call '.entity()' or called '.entity()' with an invalid type.`,
    });
  }

  if (model.queryOptions?.withSoftDeletes) {
    throw AppError.serverError({
      message: `CRUD generation does not yet support soft deletes, but ${stringFormatNameForError(
        model,
      )} is used in a 'T.crud()' in the '${crud.group}' group.`,
    });
  }

  if (model.group === "store" && model.name === "file") {
    throw AppError.serverError({
      message: `CRUD generation does not support generating routes for ${stringFormatNameForError(
        model,
      )}.`,
    });
  }

  if (model.queryOptions?.isView) {
    if (
      crud.routeOptions.createRoute ||
      crud.routeOptions.updateRoute ||
      crud.routeOptions.deleteRoute
    ) {
      throw AppError.serverError({
        message: `CRUD generation on database views does not allow generating a 'create', 'update' or 'delete' route. Make sure to disable these in the '${crud.group}' group.`,
      });
    }
  }

  if (crud.fromParent) {
    const relation = crudInformationGetRelation(crud);

    if (relation.subType === "oneToOneReverse") {
      // One to one routes don't support list routes. So silently disable them
      crud.routeOptions.listRoute = false;
    }

    if (["oneToOne", "manyToOne"].includes(relation.subType)) {
      // Don't allow list, create and delete routes on the owning side of a relation.
      // These always reference to a single entity and when removed or recreated don't
      // link to this entity anymore.
      crud.routeOptions ??= {};

      Object.assign(crud.routeOptions, {
        listRoute: false,
        createRoute: false,
        deleteRoute: false,
      });
    }

    if (
      relation.subType === "oneToMany" &&
      isNil(crud.fromParent?.options?.name)
    ) {
      throw AppError.serverError({
        message: `'T.crud().fromParent("field", { name: "singular" })' is mandatory when the inferred relation is 'oneToMany'. This singular name is used in the route parameter.`,
      });
    }
  }

  if (crud.basePath && !crud.basePath.startsWith("/")) {
    // Normalize the route
    crud.basePath = `/${crud.basePath}`;
  }

  crudInformationSetModel(crud, model);

  for (const relation of crud.inlineRelations) {
    relation.group = crud.group;
    // @ts-expect-error
    crudValidateRelation(generateContext, crud, relation);
  }

  for (const relation of crud.nestedRelations) {
    relation.group = crud.group;
    // @ts-expect-error
    crudValidateRelation(generateContext, crud, relation);
  }

  // Resolve custom readable type
  const parent = crudInformationGetParent(crud);
  const isInlineRelation = parent?.inlineRelations.includes(crud) ?? false;
  const hasCustomReadableType = !isNil(crud.fieldOptions.readableType);

  if (parent && isInlineRelation) {
    if (hasCustomReadableType) {
      throw AppError.serverError({
        message: `Inline relations in a 'T.crud()' definition can not have custom 'readable' type. Remove the custom 'readable' type for the 'T.crud().fromParent("${crud.fromParent?.field}").fieldOptions()' call in '${parent.group}'.`,
      });
    }

    if (
      crudInformationGetHasCustomReadableType(parent) &&
      crud.fieldOptions.readable
    ) {
      throw AppError.serverError({
        message: `Inline relations in a 'T.crud()' definition can not specify 'readable' field options when a parent has defined a custom readable type. Remove the custom 'readable' type for the 'T.crud().fromParent("${crud.fromParent?.field}").fieldOptions()' call in '${parent.group}'.`,
      });
    }
  }

  crudInformationSetHasCustomReadableType(crud, hasCustomReadableType);

  // Recurse in to the relations
  for (const relation of crud.inlineRelations) {
    // @ts-expect-error
    crudValidateType(generateContext, relation);
  }
  for (const relation of crud.nestedRelations) {
    // @ts-expect-error
    crudValidateType(generateContext, relation);
  }
}

/**
 * Resolve and validate the relation used in the nested crud.
 *
 * @param {import("../generate.js").GenerateContext} generateContext
 * @param {import("../../types/advanced-types").NamedType<import("../generated/common/types").StructureCrudDefinition>} crud
 * @param {import("../../types/advanced-types").NamedType<import("../generated/common/types").StructureCrudDefinition>} relation
 */
function crudValidateRelation(generateContext, crud, relation) {
  const model = crudInformationGetModel(crud);

  const usedRelation = model.relations.find(
    (it) => it.ownKey === relation.fromParent?.field,
  );

  if (!usedRelation) {
    throw AppError.serverError({
      message: `Relation in 'T.crud()' from ${stringFormatNameForError(
        model,
      )} via '${relation.fromParent?.field}' could not be resolved in the '${
        crud.group
      }' group. Make sure there is a relation with '${relation.fromParent
        ?.field}' on ${stringFormatNameForError(model)}.`,
    });
  }

  relation.entity = usedRelation.reference;
  crudInformationSetRelationAndParent(relation, crud, usedRelation);
}
