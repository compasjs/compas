import { mainTestFn, test } from "../../cli/index.js";
import { AppError } from "./error.js";

mainTestFn(import.meta);

test("stdlib/error", (t) => {
  // We do basic AppError testing here, specific use cases, related to external error
  // formatting, are handled throughout other test files.

  t.test("throws on incorrect arguments: key", (t) => {
    const e = new AppError(500, 500);

    t.equal(AppError.instanceOf(e), true);
    t.equal(e.message, "AppError: error.server.internal");
    t.equal(e.key, "error.server.internal");
    t.equal(e.info.appErrorConstructParams.key, 500);
    t.equal(e.cause.key, 500);
  });

  t.test("throws on incorrect arguments: status", (t) => {
    const e = new AppError("test.error", "500");

    t.equal(AppError.instanceOf(e), true);
    t.equal(e.message, "AppError: error.server.internal");
    t.equal(e.key, "error.server.internal");
    t.equal(e.info.appErrorConstructParams.key, "test.error");
    t.equal(e.info.appErrorConstructParams.status, "500");
    t.equal(e.cause.key, "test.error");
    t.equal(e.cause.status, "500");
  });

  t.test("AppError sets Error#message based on info object", (t) => {
    t.equal(new AppError("foo", 200, {}).message, "AppError: foo");
    t.equal(
      new AppError("foo", 200, {
        message: "message prop",
      }).message,
      "AppError: foo: message prop",
    );
    t.equal(
      new AppError("foo", 200, {
        type: "type prop",
      }).message,
      "AppError: foo: type prop",
    );
    t.equal(
      new AppError("foo", 200, {
        type: "type prop",
        message: "prefers message",
      }).message,
      "AppError: foo: prefers message",
    );
  });

  t.test("AppError#format with stack", (t) => {
    try {
      throw AppError.validationError("test.error", {});
    } catch (e) {
      t.ok(AppError.instanceOf(e));
      t.equal(e.message, "AppError: test.error");

      const formatted = AppError.format(e);
      t.equal(formatted.key, "test.error");
      t.ok(Array.isArray(formatted.stack));
      t.deepEqual(formatted.info, {});
    }
  });

  t.test("AppError#format with original AppError", (t) => {
    try {
      throw AppError.validationError("test.error", {}, AppError.serverError());
    } catch (e) {
      t.ok(AppError.instanceOf(e));

      const formatted = AppError.format(e);
      t.equal(formatted.key, "test.error");
      t.ok(Array.isArray(formatted.stack));
      t.deepEqual(formatted.info, {});

      t.equal(formatted.cause.key, "error.server.internal");
      t.equal(formatted.cause.status, 500);
      t.ok(Array.isArray(formatted.cause.stack));
    }
  });

  t.test("AppError#format with original Error", (t) => {
    try {
      throw AppError.validationError(
        "test.error",
        {},
        new Error("test message"),
      );
    } catch (e) {
      t.ok(AppError.instanceOf(e));

      const formatted = AppError.format(e);
      t.equal(formatted.key, "test.error");
      t.ok(Array.isArray(formatted.stack));
      t.deepEqual(formatted.info, {});

      t.equal(formatted.cause.message, "test message");
      t.equal(formatted.cause.name, "Error");
      t.ok(Array.isArray(formatted.cause.stack));
    }
  });

  t.test("AppError#format cause with toJSON", (t) => {
    try {
      throw AppError.validationError(
        "test.error",
        {},
        {
          toJSON() {
            return {
              name: "JSONError",
              message: "JSON message",
            };
          },
        },
      );
    } catch (e) {
      t.ok(AppError.instanceOf(e));

      const formatted = AppError.format(e);
      t.equal(formatted.key, "test.error");
      t.ok(Array.isArray(formatted.stack));
      t.deepEqual(formatted.info, {});

      t.equal(formatted.cause.message, "JSON message");
      t.equal(formatted.cause.name, "JSONError");
      t.ok(Array.isArray(formatted.cause.stack));
    }
  });

  t.test("AppError#format with Error#cause property", (t) => {
    try {
      const err = AppError.validationError("foo");
      throw new Error("Bar", { cause: err });
    } catch (e) {
      const formatted = AppError.format(e);
      t.ok(AppError.instanceOf(formatted.cause));
      t.equal(formatted.message, "Bar");
      t.equal(formatted.cause.key, "foo");
    }
  });

  t.test("AppError.format primitives", (t) => {
    const str = AppError.format("str");
    const symbol = AppError.format(Symbol.for("symbol"));
    const fn = AppError.format(function sum(a, b) {
      return a + b;
    });

    t.equal(str.value, "str");
    t.ok(symbol.warning);
    t.equal(fn.name, "sum");
    t.equal(fn.parameterLength, 2);
  });

  t.test("AppError#format Aggregate error", (t) => {
    const err = AppError.format(
      new AggregateError(
        [new Error("foo"), AppError.serverError({})],
        "message",
      ),
    );

    t.equal(err.name, "AggregateError");
    t.ok(err.stack);
    t.ok(err.message);
    t.ok(Array.isArray(err.cause));
    t.equal(err.cause[1].key, "error.server.internal");
  });

  t.test("AppError#format already formatted cause", (t) => {
    const err = AppError.format(
      AppError.validationError("foo", {}, AppError.format(new Error())),
    );

    t.equal(err.key, "foo");
    t.equal(err.cause.name, "Error");
    t.ok(Array.isArray(err.cause.stack));
  });
});
