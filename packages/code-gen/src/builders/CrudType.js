import { AppError, isNil } from "@compas/stdlib";
import { TypeBuilder } from "./TypeBuilder.js";
import { buildOrInfer } from "./index.js";

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
  constructor(group, basePath) {
    super("crud", group, `internalCrud`);

    /**
     * @private
     */
    this.inlineRelationsCache = [];

    /**
     * @private
     */
    this.nestedRelationsCache = [];

    /**
     * @private
     */
    this.readableType = undefined;

    /** @type {any} */
    this.data = {
      ...this.data,
      basePath,
      routeOptions: {},
      fieldOptions: {},
      inlineRelations: [],
      nestedRelations: [],
    };
  }

  /**
   * Entity for which this crud route is created
   *
   * @param {import("../../types/advanced-types.d.ts").TypeBuilderLike} reference
   * @returns {CrudType}
   */
  entity(reference) {
    this.data.entity = buildOrInfer(reference);

    return this;
  }

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
  fromParent(field, options = {}) {
    this.data.name = undefined;

    this.data.fromParent = { field, options };

    return this;
  }

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
  routes(routeOptions) {
    this.data.routeOptions = routeOptions;

    return this;
  }

  /**
   * Omit or pick fields that can be set or are returned from the routes.
   * It is still possible to provide these fields via the generated controller hooks
   *
   * @param {{
   *   readable: {
   *     $omit?: Array<string>,
   *     $pick?: Array<string>,
   *   }|import("../../types/advanced-types.js").TypeBuilderLike,
   *   writable: {
   *     $omit?: Array<string>,
   *     $pick?: Array<string>,
   *   }
   * }} fieldOptions
   * @returns {CrudType}
   */
  fields(fieldOptions) {
    const { readable, writable } = fieldOptions;

    if (readable instanceof TypeBuilder) {
      if (!readable.data.name && !readable.data.reference?.name) {
        throw AppError.serverError({
          message:
            "A custom readable type should have a name, e.g 'T.object('item').keys(...)'.",
        });
      }

      this.data.fieldOptions = {
        readable: {},
        writable,
      };
      this.readableType = readable;
    } else {
      this.data.fieldOptions = fieldOptions;
    }

    return this;
  }

  /**
   *
   * @param {...import("../../types/advanced-types.d.ts").TypeBuilderLike} builders
   * @returns {CrudType}
   */
  inlineRelations(...builders) {
    this.inlineRelationsCache = builders;

    return this;
  }

  /**
   *
   * @param {...import("../../types/advanced-types.d.ts").TypeBuilderLike} builders
   * @returns {CrudType}
   */
  nestedRelations(...builders) {
    this.nestedRelationsCache = builders;

    return this;
  }

  build() {
    if (isNil(this.data.entity) && isNil(this.data.fromParent)) {
      throw AppError.serverError({
        message: `T.crud() should either call '.entity()' when toplevel, or '.fromParent()' when nested.`,
      });
    }

    if (!isNil(this.data.entity) && !this.data.basePath) {
      throw AppError.serverError({
        message: `T.crud(path) should be called a top-level path.`,
      });
    }

    const result = super.build();

    if (this.readableType) {
      result.fieldOptions.readableType = buildOrInfer(this.readableType);
    }

    result.inlineRelations = this.inlineRelationsCache.map((it) =>
      this.processRelation("inline", result, it),
    );

    result.nestedRelations = this.nestedRelationsCache.map((it) =>
      this.processRelation("nested", result, it),
    );

    return result;
  }

  /**
   * @private
   * @param {string} type
   * @param {any} result
   * @param {CrudType} it
   */
  processRelation(type, result, it) {
    it.data.group = result.group;
    it.data.name = undefined;

    const build = buildOrInfer(it);

    if (build.type !== "crud") {
      throw AppError.serverError({
        message: `Values passed to 'T.crud().${type}Relations' should be created via 'T.crud().fromParent()`,
        found: build.type,
      });
    }

    if (typeof build.fromParent?.field !== "string") {
      throw AppError.serverError({
        message: `Values passed to 'T.crud().${type}Relations' should pass the key of the relation that is ${type} to 'T.crud().fromParent().`,
      });
    }

    if (type === "nested" && !it.data.basePath) {
      throw AppError.serverError({
        message:
          "T.crud()'s provided in 'nestedRelations' should have a path specified.",
      });
    }

    if (type === "nested" && it.data.isOptional) {
      throw AppError.serverError({
        message: `T.crud()'s provided in 'nestedRelations' can't be '.optional()'`,
      });
    }

    if (type === "inline" && Object.keys(it.data.routeOptions).length > 0) {
      throw AppError.serverError({
        message: `Inline CRUD can't specify 'routeOptions'.`,
      });
    }

    return build;
  }
}
