/**
 * Open the provided Koa app on a random port, and use the port to set the 'baseURL' on
 * the provided Axios instance.
 *
 * @since 0.1.0
 *
 * @param {Application} app
 * @param {AxiosInstance} axios
 * @returns {Promise<undefined>}
 */
export async function createTestAppAndClient(app, axios) {
  await new Promise((resolve, reject) => {
    let isListening = false;
    app._server = app.listen();

    app._server.on("listening", () => {
      isListening = true;
      resolve();
    });

    app._server.on("error", (err) => {
      if (!isListening) {
        reject(err);
      }
    });
  });

  const { port } = app._server.address();
  axios.defaults.baseURL = `http://127.0.0.1:${port}/`;
}

/**
 * Close the test app as created by `createTestAppAndClient`.
 *
 * @since 0.1.0
 *
 * @param {Application} app
 * @returns {Promise<undefined>}
 */
export function closeTestApp(app) {
  return new Promise((resolve, reject) => {
    if (app._server && app._server.listening) {
      app._server.close((err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    }
  });
}
