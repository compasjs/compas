/**
 * @param {Application} app
 * @param {AxiosInstance} axios
 */
export function createTestAppAndClient(app, axios) {
  return new Promise((resolve) => {
    app._server = app.listen(() => {
      const { port } = app._server.address();
      axios.defaults.baseURL = `http://127.0.0.1:${port}/`;
      resolve();
    });
  });
}

/**
 * @param {Application} app
 */
export function closeTestApp(app) {
  if (app._server && app._server.listening) {
    return new Promise((resolve) => {
      app._server.close(resolve);
    });
  }
}
