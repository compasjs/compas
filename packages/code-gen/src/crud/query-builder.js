import { isNil } from "@compas/stdlib";
import {
  crudInformationGetModel,
  crudInformationGetParamName,
  crudInformationGetParent,
  crudInformationGetRelation,
} from "../processors/crud-information.js";
import { modelKeyGetPrimary } from "../processors/model-keys.js";
import { upperCaseFirst } from "../utils.js";

/**
 * Get the query builder to use for the provided crud and options
 *
 * @param {import("../../types/advanced-types").NamedType<import("../generated/common/types").StructureCrudDefinition>} crud
 * @param {{
 *   includeOwnParam: boolean,
 *   includeJoins: boolean,
 *   traverseParents: boolean,
 *   partial?: Record<string, any>,
 * }} options
 * @returns {string}
 */
export function crudQueryBuilderGet(crud, options) {
  return JSON.stringify(crudQueryBuilderBuild(crud, options), null, 2).replace(
    /"/gi,
    "",
  );
}

/**
 * @param {import("../../types/advanced-types").NamedType<import("../generated/common/types").StructureCrudDefinition>} crud
 * @param {{
 *   includeOwnParam: boolean,
 *   includeJoins: boolean,
 *   traverseParents: boolean,
 *   partial?: Record<string, any>,
 * }} options
 */
function crudQueryBuilderBuild(crud, options) {
  const model = crudInformationGetModel(crud);
  const relation = crudInformationGetRelation(crud);
  const { primaryKeyName } = modelKeyGetPrimary(model);

  const result = { ...options.partial };
  result.where ??= {};

  if (options.includeJoins) {
    for (const inlineCrud of crud.inlineRelations) {
      // @ts-expect-error
      result[inlineCrud.fromParent.field] = crudQueryBuilderBuild(inlineCrud, {
        includeOwnParam: false,
        includeJoins: true,
        traverseParents: false,
      });
    }
  }

  if (
    options.includeOwnParam &&
    (isNil(relation) || relation?.subType === "oneToMany")
  ) {
    result.where[
      primaryKeyName
    ] = `ctx.validatedParams.${crudInformationGetParamName(crud)}`;
  }

  if (options.traverseParents && crudInformationGetParent(crud)) {
    result.where[`via${upperCaseFirst(relation.referencedKey)}`] =
      // @ts-expect-error
      crudQueryBuilderBuild(crudInformationGetParent(crud), {
        includeOwnParam: true,
        includeJoins: false,
        traverseParents: true,
      });
  }

  return result;
}
