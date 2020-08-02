/**
 * @param {Application} app
 * @param {AxiosInstance} axios
 */
export async function createTestAppAndClient(app, axios) {
  await new Promise((resolve) => {
    app._server = app.listen(() => {
      resolve();
    });
  });
  const { port } = app._server.address();
  axios.defaults.baseURL = `http://127.0.0.1:${port}/`;
}

/**
 * @param {Application} app
 * @returns {Promise<void>}
 */
export function closeTestApp(app) {
  return new Promise((resolve) => {
    if (app._server && app._server.listening) {
      app._server.close(resolve);
    }
  });
}
