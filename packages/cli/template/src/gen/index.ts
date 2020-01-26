import { createApp, V } from "@lbu/code-gen";
import { join } from "path";

const app = createApp();

app.validator(
  V("TestType").object({
    myKey: V.string(),
  }),
);

app.build(join(process.cwd(), "src/generated"));
