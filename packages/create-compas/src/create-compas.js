#! /usr/bin/env node

import { mainFn } from "@compas/stdlib";

mainFn(import.meta, main);

function main(logger) {
  logger.info(`
Create Compas based projects from the examples or custom templates.

This package is a work in progress. Follow https://github.com/compasjs/compas/issues/1907 for updates.`);
}
