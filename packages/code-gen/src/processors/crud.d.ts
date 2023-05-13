/**
 * Get a list of CRUD objects in the structure
 *
 * @param {import("../generate.js").GenerateContext} generateContext
 * @returns {(import("../../types/advanced-types").NamedType<import("../generated/common/types").StructureCrudDefinition>)[]}
 */
export function structureCrud(
  generateContext: import("../generate.js").GenerateContext,
): import("../../types/advanced-types").NamedType<
  import("../generated/common/types").StructureCrudDefinition
>[];
/**
 * Call the route specific functions that are enabled on the CRUD object.
 *
 * @template {any[]} X
 * @param {import("../../types/advanced-types").NamedType<import("../generated/common/types").StructureCrudDefinition>} crud
 * @param {{
 *   listRoute: (...X) => void,
 *   singleRoute: (...X) => void,
 *   createRoute: (...X) => void,
 *   updateRoute: (...X) => void,
 *   deleteRoute: (...X) => void,
 * }} functions
 * @param {X} args
 */
export function crudRouteSwitch<X extends any[]>(
  crud: import("../../types/advanced-types").NamedType<
    import("../generated/common/types").StructureCrudDefinition
  >,
  functions: {
    listRoute: (...X: any[]) => void;
    singleRoute: (...X: any[]) => void;
    createRoute: (...X: any[]) => void;
    updateRoute: (...X: any[]) => void;
    deleteRoute: (...X: any[]) => void;
  },
  args: X,
): void;
//# sourceMappingURL=crud.d.ts.map
