import { mainTestFn, test } from "../../cli/index.js";
import { AppError } from "./error.js";

mainTestFn(import.meta);

test("stdlib/error", (t) => {
  // We do basic AppError testing here, specific use cases, related to external error
  // formatting, are handled throughout other test files.

  t.test("throws on incorrect arguments: key", (t) => {
    const e = new AppError(500, 500);

    t.equal(AppError.instanceOf(e), true);
    t.equal(e.key, "error.server.internal");
    t.equal(e.info.appErrorConstructParams.key, 500);
    t.equal(e.originalError.key, 500);
  });

  t.test("throws on incorrect arguments: status", (t) => {
    const e = new AppError("test.error", "500");

    t.equal(AppError.instanceOf(e), true);
    t.equal(e.key, "error.server.internal");
    t.equal(e.info.appErrorConstructParams.key, "test.error");
    t.equal(e.info.appErrorConstructParams.status, "500");
    t.equal(e.originalError.key, "test.error");
    t.equal(e.originalError.status, "500");
  });

  t.test("AppError#format with stack", (t) => {
    try {
      throw AppError.validationError("test.error", {});
    } catch (e) {
      t.ok(AppError.instanceOf(e));

      const formatted = AppError.format(e);
      t.equal(formatted.key, "test.error");
      t.ok(Array.isArray(formatted.stack));
      t.deepEqual(formatted.info, {});
    }
  });

  t.test("AppError#format without stack", (t) => {
    try {
      throw AppError.validationError("test.error", {});
    } catch (e) {
      t.ok(AppError.instanceOf(e));

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

      t.equal(formatted.originalError.key, "error.server.internal");
      t.equal(formatted.originalError.status, 500);
      t.ok(Array.isArray(formatted.originalError.stack));
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

      t.equal(formatted.originalError.message, "test message");
      t.equal(formatted.originalError.name, "Error");
      t.ok(Array.isArray(formatted.originalError.stack));
    }
  });

  t.test("AppError#format originalError with toJSON", (t) => {
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

      t.equal(formatted.originalError.message, "JSON message");
      t.equal(formatted.originalError.name, "JSONError");
      t.ok(Array.isArray(formatted.originalError.stack));
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
});
