import { AnyType, RouteBuilder } from "../../builders/index.js";
import { Generator } from "../generator.js";
import { structureRoutes } from "./routes.js";
import { structureAddType, structureNamedTypes } from "./structure.js";

/**
 * Cache the api structure string based on the current generate context.
 *
 * @type {WeakMap<object, string>}
 */
const routeStructureCache = new WeakMap();

/**
 * Extract the route structure from generate context
 *
 * @param {import("../generate").GenerateContext} generateContext
 */
export function routeStructureCreate(generateContext) {
  if (!generateContext.options.generators.router?.exposeApiStructure) {
    return;
  }

  const generator = new Generator(generateContext.log);
  generator.addStructure(JSON.parse(JSON.stringify(generateContext.structure)));

  // Remove relations, so the whole entity graph isn't included when an entity is used as the respons type.
  for (const type of structureNamedTypes(generator.internalStructure)) {
    if (
      "relations" in type &&
      Array.isArray(type.relations) &&
      type.relations.length
    ) {
      type.relations = [];
    }
  }

  const selection = structureRoutes(generateContext).map((it) => ({
    group: it.group,
    name: it.name,
  }));

  const routesOnlyGenerator = generator.selectTypes(selection);

  routeStructureCache.set(
    generateContext,
    JSON.stringify(routesOnlyGenerator.internalStructure).replace(
      /([`\\])/gm,
      (v) => `\\${v}`,
    ),
  );

  structureAddType(
    generateContext.structure,
    new RouteBuilder("GET", "compas", "structure", "_compas/structure.json")
      .response(new AnyType())
      .tags("_compas")
      .docs("Return the full available API structure")
      .build(),
    {
      skipReferenceExtraction: false,
    },
  );
}

/**
 * Get the saved route structure
 *
 * @param {import("../generate").GenerateContext} generateContext
 * @returns {string}
 */
export function routeStructureGet(generateContext) {
  return routeStructureCache.get(generateContext) ?? "";
}
