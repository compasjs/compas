const utils = require("./utils");

const processRoutes = routes => {
  for (const r of routes) {
    r.name = utils.lowerCaseFirst(r.name);
  }
  return routes;
};

module.exports = {
  processRoutes,
};
