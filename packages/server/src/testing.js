/**
 * Open the provided Koa app on a random port, and use the port to set the 'baseURL' on
 * the provided Axios instance.
 *
 * @since 0.1.0
 *
 * @param {import("./app.js").KoaApplication} app
 * @param {import("axios").AxiosInstance} axios
 * @returns {Promise<void>}
 */
export async function createTestAppAndClient(app, axios) {
  await new Promise((resolve, reject) => {
    let isListening = false;
    // @ts-ignore
    app._server = app.listen();

    // @ts-ignore
    app._server.on("listening", () => {
      isListening = true;
      // @ts-ignore
      resolve();
    });

    // @ts-ignore
    app._server.on("error", (err) => {
      if (!isListening) {
        reject(err);
      }
    });
  });

  // @ts-ignore
  const { port } = app._server.address();
  axios.defaults.baseURL = `http://127.0.0.1:${port}/`;
}

/**
 * Close the test app as created by `createTestAppAndClient`.
 *
 * @since 0.1.0
 *
 * @param {import("./app.js").KoaApplication} app
 * @returns {Promise<void>}
 */
export function closeTestApp(app) {
  return new Promise((resolve, reject) => {
    // @ts-ignore
    if (app._server && app._server.listening) {
      // @ts-ignore
      app._server.close((err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    } else {
      resolve();
    }
  });
}
