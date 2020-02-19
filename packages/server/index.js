const { getApp } = require("./src/app");
const {
  createBodyParsers,
  getBodyParser,
  getMultipartBodyParser,
} = require("./src/middleware");

module.exports = {
  createBodyParsers,
  getApp,
  getBodyParser,
  getMultipartBodyParser,
};
