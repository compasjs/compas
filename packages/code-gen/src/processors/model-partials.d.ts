/**
 * Build the 'returning' types for all models.
 *
 * @param {import("../generate.js").GenerateContext} generateContext
 * @returns {void}
 */
export function modelPartialReturningTypes(
  generateContext: import("../generate.js").GenerateContext,
): void;
/**
 * Build the 'insert' types for all models.
 *
 * @param {import("../generate.js").GenerateContext} generateContext
 * @returns {void}
 */
export function modelPartialInsertTypes(
  generateContext: import("../generate.js").GenerateContext,
): void;
/**
 * Build the 'update' types for all models.
 *
 * @param {import("../generate.js").GenerateContext} generateContext
 * @returns {void}
 */
export function modelPartialUpdateTypes(
  generateContext: import("../generate.js").GenerateContext,
): void;
/**
 * Build the 'orderBy' types for all models.
 *
 * @param {import("../generate.js").GenerateContext} generateContext
 * @returns {void}
 */
export function modelPartialOrderByTypes(
  generateContext: import("../generate.js").GenerateContext,
): void;
/**
 * Get unnamed orderBy & orderBySpec type
 *
 * @param {import("../generate.js").GenerateContext} generateContext
 * @param {import("../generated/common/types.js").StructureObjectDefinition} model
 * @returns {{
 *   orderByType: any,
 *   orderBySpecType: any,
 * }}
 */
export function modelPartialGetOrderByTypes(
  generateContext: import("../generate.js").GenerateContext,
  model: import("../generated/common/types.js").StructureObjectDefinition,
): {
  orderByType: any;
  orderBySpecType: any;
};
//# sourceMappingURL=model-partials.d.ts.map
