/**
 * Open the provided Koa app on a random port, and use the port to set the 'baseURL' on
 * the provided Axios instance.
 *
 * @since 0.1.0
 *
 * @param {import("./app").KoaApplication} app
 * @param {import("axios").AxiosInstance} axios
 * @returns {Promise<void>}
 */
export function createTestAppAndClient(app: import("./app").KoaApplication, axios: import("axios").AxiosInstance): Promise<void>;
/**
 * Close the test app as created by `createTestAppAndClient`.
 *
 * @since 0.1.0
 *
 * @param {import("./app").KoaApplication} app
 * @returns {Promise<void>}
 */
export function closeTestApp(app: import("./app").KoaApplication): Promise<void>;
//# sourceMappingURL=testing.d.ts.map