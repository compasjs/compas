#!/usr/bin/env node

import { isNil } from "@compas/stdlib";
import { configLoadEnvironment } from "../config.js";
import { ciMode } from "../main/ci/index.js";
import { developmentMode } from "../main/development/index.js";
import { productionMode } from "../main/production/index.js";

const env = await configLoadEnvironment("", !isNil(process.env.NODE_ENV));

if (env.isCI) {
  await ciMode(env);
} else if (!env.isDevelopment) {
  await productionMode(env);
} else {
  await developmentMode(env);
}
