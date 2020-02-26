const { getApp } = require("./src/app");
const {
  createBodyParsers,
  getBodyParser,
  getMultipartBodyParser,
} = require("./src/middleware");
const compose = require("koa-compose");

module.exports = {
  getApp,

  createBodyParsers,
  getBodyParser,
  getMultipartBodyParser,

  compose,
};
