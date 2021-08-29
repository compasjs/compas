/**
 * Check if a value is `null` or `undefined`
 *
 * @since 0.1.0
 *
 * @param {any|null|undefined} [item]
 * @returns {item is null | undefined}
 */
export function isNil(item?: any | null | undefined): item is null | undefined;
/**
 * Check if a value is a plain JavaScript object.
 *
 * @since 0.1.0
 *
 * @param {*} [item]
 * @returns {boolean}
 */
export function isPlainObject(item?: any): boolean;
/**
 * Flatten nested objects in to a new object where the keys represent the original access
 * path. Only goes through plain JavaScript objects and ignores arrays.
 *
 * @since 0.1.0
 *
 * @param {object} data The object to serialize
 * @param {*} [result]
 * @param {string} [path]
 * @returns {Record<string, any>}
 */
export function flatten(data: object, result?: any, path?: string | undefined): Record<string, any>;
/**
 * The opposite of 'flatten'.
 *
 * @since 0.1.0
 *
 * @param {Record<string, any>} data
 * @returns {object}
 */
export function unFlatten(data: Record<string, any>): object;
/**
 *
 * @since 0.1.0
 *
 * @param {string} input
 * @returns {string}
 */
export function camelToSnakeCase(input: string): string;
/**
 * Deep merge source objects on to 'target'. Mutates 'target' in place.
 *
 * @function
 * @since 0.1.0
 *
 * @type {(target: any, ...sources: any[]) => object}
 * @param {object} target The destination object.
 * @param {...object} [sources] The source objects.
 * @returns {object} Returns `object`.
 */
export const merge: (target: any, ...sources: any[]) => object;
//# sourceMappingURL=lodash.d.ts.map