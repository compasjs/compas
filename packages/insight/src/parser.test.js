import { Transform } from "stream";
import test from "tape";
import { executeLogParser, newLogger, newLogParserContext } from "../index.js";

test("insight/writer", async (t) => {
  const stream = new Transform({});

  stream._transform = function (chunk, encoding, callback) {
    this.push(chunk);
    callback();
  };

  const logger = newLogger({
    pretty: false,
    stream: stream,
  });

  const lpc = newLogParserContext(stream);

  const textCalls = [];
  const jsonCalls = [];
  let dataCalls = 0;

  lpc.textProcessor = (data) => textCalls.push(data);
  lpc.jsonProcessor = (data) => jsonCalls.push(data);

  const readableStream = executeLogParser(lpc);
  readableStream.on("data", () => dataCalls++);

  t.test("text writes", async (t) => {
    stream.write("hallo\n");
    t.equal(textCalls.length, 1);
    t.equal(textCalls[0], "hallo");
  });

  t.test("logger writes", async (t) => {
    logger.info("hallo");
    t.equal(jsonCalls.length, 1);
    t.equal(jsonCalls[0].level, "info");
    t.equal(jsonCalls[0].message, "hallo");

    logger.error({ foo: true });

    t.equal(jsonCalls.length, 2);
    t.equal(jsonCalls[1].level, "error");
    t.deepEqual(jsonCalls[1].message, { foo: true });
  });

  t.test("close", async (t) => {
    t.equal(dataCalls, 3);
    readableStream.end();
  });
});
