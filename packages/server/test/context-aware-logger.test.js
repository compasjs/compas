import { mainTestFn, test } from "@compas/cli";
import { contextAwarelogger } from "@compas/stdlib";
import axios from "axios";
import { getApp } from "../src/app.js";
import { createTestAppAndClient } from "../src/testing.js";

mainTestFn(import.meta);

test("server/context-aware-logger", async (t) => {
  const app = await getApp();
  const logs = [];

  // Introspect logs
  app.use((ctx, next) => {
    const originalInfo = ctx.log.info;
    ctx.log.info = (...args) => {
      logs.push(args);
      originalInfo(...args);
    };

    return next();
  });

  // Call logger
  app.use((ctx) => {
    contextAwarelogger.info({ message: "my log" });

    ctx.body = "true";
  });

  const axiosInstance = axios.create();
  await createTestAppAndClient(app, axiosInstance);

  const response = await axiosInstance.get("/");

  t.equal(response.data, true);
  t.equal(logs.length, 3, "1 log, 1 event log, 1 request log");
  t.equal(logs[0][0].message, "my log");
});
