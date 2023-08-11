#!/usr/bin/env node

import { isNil } from "@compas/stdlib";
import { configLoadEnvironment } from "./config.js";
import { ciMode } from "./mode/ci.js";
import { developmentMode } from "./mode/development.js";
import { productionMode } from "./mode/production.js";

const env = await configLoadEnvironment("", !isNil(process.env.NODE_ENV));

if (env.isCI) {
  await ciMode(env);
} else if (!env.isDevelopment) {
  await productionMode(env);
} else {
  await developmentMode(env);
}
