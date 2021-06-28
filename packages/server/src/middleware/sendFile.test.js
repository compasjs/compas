import { mainTestFn, test } from "@compas/cli";
import { isNil } from "@compas/stdlib";
import { sendFile } from "./sendFile.js";

mainTestFn(import.meta);

test("server/sendFile", (t) => {
  const ctxMock = (headers = {}) => {
    return {
      getHeaders: () => {
        return headers;
      },
      set: (key, val) => {
        headers[key] = val;
      },
      headers,
    };
  };

  const getFileFnMock = (returnCacheControl) => {
    return (file) => {
      if (returnCacheControl) {
        return {
          stream: file.id,
          cacheControl: "CacheControl",
        };
      }
      return {
        stream: file.id,
      };
    };
  };

  t.test("sets default headers", async (t) => {
    const ctx = ctxMock();
    const fileFn = getFileFnMock(false);
    const updatedAt = new Date();

    await sendFile(
      ctx,
      {
        id: 5,
        contentLength: 5,
        contentType: "application/png",
        updatedAt: updatedAt,
      },
      fileFn,
    );

    t.equal(ctx.getHeaders()["Accept-Ranges"], "bytes");
    t.equal(
      ctx.getHeaders()["Last-Modified"].toString(),
      String(updatedAt).toString(),
    );
    t.equal(ctx.type, "application/png");
  });

  t.test("default execution", async (t) => {
    const ctx = ctxMock();
    const fileFn = getFileFnMock(false);
    const updatedAt = new Date();

    await sendFile(
      ctx,
      {
        id: 5,
        contentLength: 5,
        contentType: "application/png",
        updatedAt: updatedAt,
      },
      fileFn,
    );

    t.equal(ctx.getHeaders()["Content-Length"], "5");
    t.equal(ctx.body, 5);
  });

  t.test("set cache-control", async (t) => {
    const ctx = ctxMock();
    const fileFn = getFileFnMock(true);
    const updatedAt = new Date();

    await sendFile(
      ctx,
      {
        id: 5,
        contentLength: 5,
        contentType: "application/png",
        updatedAt: updatedAt,
      },
      fileFn,
    );

    t.equal(ctx.getHeaders()["Content-Length"], "5");
    t.equal(ctx.getHeaders()["Cache-Control"], "CacheControl");
    t.equal(ctx.body, 5);
  });

  t.test("invalid range header", async (t) => {
    const ctx = ctxMock({ range: "=invalid" });
    const fileFn = getFileFnMock(false);
    const updatedAt = new Date();

    await sendFile(
      ctx,
      {
        id: 5,
        contentLength: 5,
        contentType: "application/png",
        updatedAt: updatedAt,
      },
      fileFn,
    );

    t.equal(ctx.getHeaders()["Content-Length"], "5");
    t.equal(ctx.body, 5);
    t.equal(ctx.status, 416);
  });

  t.test("too big range header", async (t) => {
    const ctx = ctxMock({ range: "=0-6" });
    const fileFn = getFileFnMock(false);
    const updatedAt = new Date();

    await sendFile(
      ctx,
      {
        id: 5,
        contentLength: 5,
        contentType: "application/png",
        updatedAt: updatedAt,
      },
      fileFn,
    );

    t.equal(ctx.getHeaders()["Content-Length"], "5");
    t.equal(ctx.getHeaders()["Content-Range"], `bytes 0-4/5`);
    t.equal(ctx.body, 5);
    t.equal(ctx.status, 206);
  });

  t.test("use if-modified-since", async (t) => {
    const updatedAt = new Date();

    const ctx = ctxMock({ "if-modified-since": updatedAt.toUTCString() });
    const fileFn = getFileFnMock(true);

    await sendFile(
      ctx,
      {
        id: 5,
        contentLength: 5,
        contentType: "application/png",
        updatedAt: updatedAt,
      },
      fileFn,
    );

    t.equal(ctx.status, 304);
    t.ok(isNil(ctx.body));
  });
});
