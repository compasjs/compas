/**
 * Type builder for generating CRUD routes
 */
export class CrudType extends TypeBuilder {
  /**
   * Create a new Crud route;
   *
   * Not supported yet;
   * - soft deletable entities
   * - Relations to StoreFile
   *
   * @example
   * T.crud()
   *  .entity(T.reference("database", "post"))
   *  .nestedRelations(
   *     T.crud()
   *      .fromParent("comments", { name: "comment" })
   *      .routes({
   *        createRoute: false,
   *        updateRoute: false,
   *        deleteRoute: false,
   *      })
   *  );
   * @param {string} group
   * @param {string} [basePath]
   */
  constructor(group: string, basePath?: string | undefined);
  /**
   * @private
   */
  private inlineRelationsCache;
  /**
   * @private
   */
  private nestedRelationsCache;
  /**
   * @private
   */
  private readableType;
  /**
   * Entity for which this crud route is created
   *
   * @param {import("../../types/advanced-types.d.ts").TypeBuilderLike} reference
   * @returns {CrudType}
   */
  entity(
    reference: import("../../types/advanced-types.d.ts").TypeBuilderLike,
  ): CrudType;
  /**
   * Create a nested or inline CRUD configuration. The field should correspond to one of
   * the relations of the parent entity. The relation defined on 'field' should be the
   * owning side of the relation, resolving to the parent entity. Path part is mandatory
   * for nested relations.
   *
   * Note that options.name is mandatory if the 'field' is a `oneToMany` relation.
   * If no `path` is passed to `T.crud()` it defaults to `/$options.name`.
   *
   * @param {string} field
   * @param {{
   *   name?: string
   * }} options
   * @returns {CrudType}
   */
  fromParent(
    field: string,
    options?: {
      name?: string;
    },
  ): CrudType;
  /**
   * Enable routes that should be generated. Can not be used on inline relations
   *
   * @param {{
   *   listRoute?: boolean,
   *   singleRoute?: boolean,
   *   createRoute?: boolean,
   *   updateRoute?: boolean,
   *   deleteRoute?: boolean,
   * }} routeOptions
   * @returns {CrudType}
   */
  routes(routeOptions: {
    listRoute?: boolean;
    singleRoute?: boolean;
    createRoute?: boolean;
    updateRoute?: boolean;
    deleteRoute?: boolean;
  }): CrudType;
  /**
   * Omit or pick fields that can be set or are returned from the routes.
   * It is still possible to provide these fields via the generated controller hooks
   *
   * @param {{
   *   readable: {
   *     $omit?: string[],
   *     $pick?: string[],
   *   }|import("../../types/advanced-types.js").TypeBuilderLike,
   *   writable: {
   *     $omit?: string[],
   *     $pick?: string[],
   *   }
   * }} fieldOptions
   * @returns {CrudType}
   */
  fields(fieldOptions: {
    readable:
      | {
          $omit?: string[];
          $pick?: string[];
        }
      | import("../../types/advanced-types.js").TypeBuilderLike;
    writable: {
      $omit?: string[];
      $pick?: string[];
    };
  }): CrudType;
  /**
   *
   * @param {...import("../../types/advanced-types.d.ts").TypeBuilderLike} builders
   * @returns {CrudType}
   */
  inlineRelations(
    ...builders: import("../../types/advanced-types.d.ts").TypeBuilderLike[]
  ): CrudType;
  /**
   *
   * @param {...import("../../types/advanced-types.d.ts").TypeBuilderLike} builders
   * @returns {CrudType}
   */
  nestedRelations(
    ...builders: import("../../types/advanced-types.d.ts").TypeBuilderLike[]
  ): CrudType;
  /**
   * @private
   * @param {string} type
   * @param {any} result
   * @param {CrudType} it
   */
  private processRelation;
}
import { TypeBuilder } from "./TypeBuilder.js";
//# sourceMappingURL=CrudType.d.ts.map
