import { AppError } from "@compas/stdlib";
import { errorsThrowCombinedError } from "../errors.js";
import { stringFormatNameForError } from "../string-format.js";
import {
  crudInformationGetModel,
  crudInformationGetRelation,
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
 * @param {import("../generate").GenerateContext} generateContext
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
 * @param {import("../generate").GenerateContext} generateContext
 * @param {import("../types").NamedType<import("../generated/common/types").ExperimentalCrudDefinition>} crud
 */
function crudValidateType(generateContext, crud) {
  /**
   * @type {import("../types").NamedType<import("../generated/common/types").ExperimentalObjectDefinition>}
   */
  const model = structureResolveReference(
    generateContext.structure,
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

  if (
    (model.group === "store" && model.name === "file") ||
    model.relations.find(
      (it) =>
        it.reference.reference.group === "store" &&
        it.reference.reference.name === "file",
    )
  ) {
    throw AppError.serverError({
      message: `CRUD generation does not support generating routes that include files. This is used either directly via 'T.crud()' or via a relation of the defined '.entity()' in the '${crud.group}' group.`,
    });
  }

  if (
    crud.fromParent &&
    crudInformationGetRelation(crud).subType === "oneToOneReverse"
  ) {
    // One to one routes don't support list routes. So silently disable them
    crud.routeOptions.listRoute = false;
  }

  if (crud.basePath && !crud.basePath.startsWith("/")) {
    // Normalize the route
    crud.basePath = `/${crud.basePath}`;
  }

  crudInformationSetModel(crud, model);

  for (const relation of crud.inlineRelations) {
    crudValidateRelation(generateContext, crud, relation);
  }
  for (const relation of crud.nestedRelations) {
    crudValidateRelation(generateContext, crud, relation);
  }

  for (const relation of crud.inlineRelations) {
    crudValidateType(generateContext, relation);
  }
  for (const relation of crud.nestedRelations) {
    crudValidateType(generateContext, relation);
  }
}

/**
 * Resolve and validate the relation used in the nested crud.
 *
 * @param {import("../generate").GenerateContext} generateContext
 * @param {import("../types").NamedType<import("../generated/common/types").ExperimentalCrudDefinition>} crud
 * @param {import("../types").NamedType<import("../generated/common/types").ExperimentalCrudDefinition>} relation
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
      )} via '${relation.fromParent.field}' could not be resolved in the '${
        crud.group
      }' group. There should be a 'T.oneToOne("${
        relation.fromParent.field
      }", ...)' or 'T.oneToOne("...", T.reference("${model.group}", "${
        model.name
      }"), "${
        relation.fromParent.field
      }")' on the owning side of the relation.`,
    });
  }

  if (!["oneToMany", "oneToOneReverse"].includes(usedRelation.subType)) {
    throw AppError.serverError({
      message: `CRUD generation can't be generated from the owning side of a relation. This is done from entity ${stringFormatNameForError(
        model,
      )} via field '${relation.fromParent?.field}' in the '${
        crud.group
      }' group. See the docs for more information.`,
    });
  }

  relation.entity = usedRelation.reference;
  crudInformationSetRelationAndParent(relation, crud, usedRelation);
}
