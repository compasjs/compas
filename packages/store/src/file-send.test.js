import { Duplex, Readable, Writable } from "stream";
import { mainTestFn, test } from "@compas/cli";
import Koa from "koa";
import { s3Client, sql, testBucketName } from "../../../src/testing.js";
import {
  fileSendResponse,
  fileSendTransformedImageResponse,
} from "./file-send.js";
import { fileCreateOrUpdate } from "./file.js";
import { queryFile } from "./generated/database/file.js";

mainTestFn(import.meta);

/**
 * From
 * https://github.com/koajs/koa/blob/eea921a6033a96ae3e8334507903a51009c00b6a/test-helpers/context.js#L1
 * Create Koa context without real request
 *
 * @param {*} [req]
 * @param {*} [res]
 * @param {*} [app]
 * @returns {Application.ParameterizedContext<Application.DefaultState>}
 */
function createKoaContext(req, res, app) {
  const socket = new Duplex();
  req = Object.assign({ headers: {}, socket }, Readable.prototype, req);
  res = Object.assign({ _headers: {}, socket }, Writable.prototype, res);
  req.socket.remoteAddress = req.socket.remoteAddress || "127.0.0.1";
  app = app || new Koa();

  res.getHeader = (k) => res._headers[k.toLowerCase()];
  res.setHeader = (k, v) => {
    res._headers[k.toLowerCase()] = v;
  };
  res.removeHeader = (k) => delete res._headers[k.toLowerCase()];
  return app.createContext(req, res);
}

test("store/file-send", async (t) => {
  const imagePath = "./docs/public/favicon/favicon-16x16.png";
  let file = await fileCreateOrUpdate(
    sql,
    s3Client,
    {
      bucketName: testBucketName,
    },
    {
      name: "image.png",
    },
    imagePath,
  );

  // These functions operator on the in memory file object, so make sure to reload before
  // each test case.
  const reloadFile = async () => {
    const [refetched] = await queryFile({
      where: {
        id: file.id,
      },
    }).exec(sql);

    file = refetched;
  };

  t.test("fileSendResponse", (t) => {
    t.test("default headers", async (t) => {
      const ctx = createKoaContext();
      await fileSendResponse(s3Client, ctx, file);

      t.equal(ctx.res.getHeader("Accept-Ranges"), "bytes");
      t.equal(
        ctx.res.getHeader("Cache-Control"),
        "max-age=120, must-revalidate",
      );
      t.equal(ctx.res.getHeader("Content-Type"), "image/png");

      // Weak validation, ignores milliseconds.
      const lastModified = new Date(file.updatedAt);
      lastModified.setMilliseconds(0);

      t.deepEqual(new Date(ctx.res.getHeader("Last-Modified")), lastModified);
    });

    t.test("if-modified-since", async (t) => {
      const ctx = createKoaContext();

      const d = new Date(file.updatedAt);
      d.setMilliseconds(0);
      ctx.req.headers["if-modified-since"] = d.toString();

      await fileSendResponse(s3Client, ctx, file);

      t.equal(ctx.status, 304);
    });

    t.test("range header", async (t) => {
      const ctx = createKoaContext();

      ctx.req.headers["range"] = "bytes=0-10";
      await fileSendResponse(s3Client, ctx, file);

      t.equal(ctx.res.getHeader("Content-Length"), "11");
      t.equal(
        ctx.res.getHeader("Content-Range"),
        `bytes 0-10/${file.contentLength}`,
      );
    });

    t.test("overwrite cache-control", async (t) => {
      const ctx = createKoaContext();

      await fileSendResponse(s3Client, ctx, file, {
        cacheControlHeader: "empty",
      });

      t.equal(ctx.res.getHeader("Cache-Control"), "empty");
    });
  });

  t.test("fileSendTransformedImageResponse", (t) => {
    t.test("requires validatedQuery", async (t) => {
      const ctx = createKoaContext();

      try {
        await fileSendTransformedImageResponse(sql, s3Client, ctx, file);
      } catch (e) {
        t.ok(
          e.info.message.includes(
            `T.reference("store", "imageTransformOptions")`,
          ),
        );
      }
    });

    t.test("accept webp", async (t) => {
      await reloadFile();
      const ctx = createKoaContext();

      ctx.validatedQuery = {
        w: 10,
        q: 75,
      };
      ctx.req.headers["accept"] = "*/*";

      await fileSendTransformedImageResponse(sql, s3Client, ctx, file);
      await reloadFile();

      t.equal(ctx.res.getHeader("Content-Type"), "image/webp");
      t.ok(file.meta.transforms["compas-image-transform-webp-w10-q75"]);
    });

    t.test("accept avif", async (t) => {
      await reloadFile();
      const ctx = createKoaContext();

      ctx.validatedQuery = {
        w: 10,
        q: 75,
      };
      ctx.req.headers["accept"] = "image/avif";

      await fileSendTransformedImageResponse(sql, s3Client, ctx, file);
      await reloadFile();

      t.equal(ctx.res.getHeader("Content-Type"), "image/avif");
      t.ok(file.meta.transforms["compas-image-transform-avif-w10-q75"]);
    });

    t.test("caches response", async (t) => {
      await reloadFile();
      const ctx = createKoaContext();

      ctx.validatedQuery = {
        w: 8,
        q: 75,
      };
      ctx.req.headers["accept"] = "*/*";

      await fileSendTransformedImageResponse(sql, s3Client, ctx, file);
      await reloadFile();

      const firstLastModified = new Date(ctx.res.getHeader("Last-Modified"));

      await fileSendTransformedImageResponse(sql, s3Client, ctx, file);
      await reloadFile();

      const secondLastModified = new Date(ctx.res.getHeader("Last-Modified"));

      t.deepEqual(firstLastModified, secondLastModified);
    });
  });
});
