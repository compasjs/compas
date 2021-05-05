import { mainTestFn, test } from "@compas/cli";
import { bytesToHumanReadable, printProcessMemoryUsage } from "./memory.js";

mainTestFn(import.meta);

test("insight/memory", (t) => {
  t.test("bytesToHumanReadable", (t) => {
    t.equal(bytesToHumanReadable(0), "0 Byte");
    t.equal(bytesToHumanReadable(11), "11 Bytes");
    t.equal(bytesToHumanReadable(1024), "1 KiB");
    t.equal(bytesToHumanReadable(1111), "1.08 KiB");
    t.equal(bytesToHumanReadable(1130), "1.1 KiB");
  });

  t.test("printProcessMemoryUsage", (t) => {
    let result = {};
    const mock = {
      info: (arg) => {
        result = arg;
      },
      isProduction: () => false,
    };
    printProcessMemoryUsage(mock);

    t.ok(result.rss);
    t.ok(result.heapUsed);
    t.ok(result.heapTotal);
    t.ok(result.external);
    t.ok(result.arrayBuffers);
  });
});
