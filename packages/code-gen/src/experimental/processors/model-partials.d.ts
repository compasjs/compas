/**
 * Build the 'returning' types for all models.
 *
 * @param {import("../generate").GenerateContext} generateContext
 * @returns {void}
 */
export function modelPartialReturningTypes(
  generateContext: import("../generate").GenerateContext,
): void;
/**
 * Build the 'insert' types for all models.
 *
 * @param {import("../generate").GenerateContext} generateContext
 * @returns {void}
 */
export function modelPartialInsertTypes(
  generateContext: import("../generate").GenerateContext,
): void;
/**
 * Build the 'update' types for all models.
 *
 * @param {import("../generate").GenerateContext} generateContext
 * @returns {void}
 */
export function modelPartialUpdateTypes(
  generateContext: import("../generate").GenerateContext,
): void;
/**
 * Build the 'orderBy' types for all models.
 *
 * @param {import("../generate").GenerateContext} generateContext
 * @returns {void}
 */
export function modelPartialOrderByTypes(
  generateContext: import("../generate").GenerateContext,
): void;
/**
 * Get unnamed orderBy & orderBySpec type
 *
 * @param {import("../generate").GenerateContext} generateContext
 * @param {import("../generated/common/types").ExperimentalObjectDefinition} model
 * @returns {{
 *   orderByType: any,
 *   orderBySpecType: any,
 * }}
 */
export function modelPartialGetOrderByTypes(
  generateContext: import("../generate").GenerateContext,
  model: import("../generated/common/types").ExperimentalObjectDefinition,
): {
  orderByType: any;
  orderBySpecType: any;
};
//# sourceMappingURL=model-partials.d.ts.map
