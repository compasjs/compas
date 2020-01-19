import { log } from "@lbu/insight";
import { getApp } from "@lbu/koa";

log.info("Hi!");

const app = getApp({
  enableHealthRoute: true,
});

app.listen(3001);
