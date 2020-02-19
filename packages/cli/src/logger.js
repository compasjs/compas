const { newLogger } = require("@lbu/insight");

const logger = newLogger({
  ctx: {
    type: "CLI",
  },
});

module.exports = {
  logger,
};
