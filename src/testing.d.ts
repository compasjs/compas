/**
 * Inject services that can be used in tests across this repo.
 *
 * @returns {Promise<void>}
 */
export function injectTestServices(): Promise<void>;
/**
 * Destroy services that are used for testing
 *
 * @returns {Promise<void>}
 */
export function destroyTestServices(): Promise<void>;
/**
 * @type {import("@compas/store").Postgres}
 */
export let sql: import("@compas/store").Postgres;
/**
 * @type {import("@compas/store").S3Client}
 */
export let s3Client: import("@compas/store").S3Client;
/**
 * @type {string}
 */
export const testBucketName: string;
/**
 * A temporary directory to write files to. Automatically accounts for multiple threads
 * when running in tests.
 *
 * @type {string}
 */
export let testTemporaryDirectory: string;
//# sourceMappingURL=testing.d.ts.map
