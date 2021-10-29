/* eslint-disable import/no-unresolved */
import { createReadStream } from "fs";
import { mainTestFn, test } from "@compas/cli";
import { isNil, streamToBuffer, uuid } from "@compas/stdlib";
import {
  cleanupTestPostgresDatabase,
  createOrUpdateFile,
  createTestPostgresDatabase,
  ensureBucket,
  FileCache,
  newMinioClient,
  removeBucketAndObjectsInBucket,
} from "@compas/store";
import Axios from "axios";
import { queryFile } from "../../../../generated/testing/sql/database/file.js";
import { getApp } from "../app.js";
import { closeTestApp, createTestAppAndClient } from "../testing.js";
import { sendFile } from "./sendFile.js";

mainTestFn(import.meta);

test("server/sendFile", async (t) => {
  const sql = await createTestPostgresDatabase();
  const minio = await newMinioClient({});
  const bucketName = uuid();
  const fileCache = new FileCache(sql, minio, bucketName, {});

  const app = getApp();
  const axiosInstance = Axios.create();

  app.use(async (ctx, next) => {
    const fileName = ctx.path.substring(1);
    const [file] = await queryFile({
      where: {
        id: fileName,
      },
    }).exec(sql);

    await sendFile(ctx, file, fileCache.getStreamFn);

    return next();
  });

  await ensureBucket(minio, bucketName, "us-east-1");
  await createTestAppAndClient(app, axiosInstance);

  const [imageBuffer, videoBuffer] = await Promise.all([
    streamToBuffer(createReadStream("./__fixtures__/server/image.png")),
    streamToBuffer(createReadStream("./__fixtures__/server/video.mp4")),
  ]);
  const [image, video] = await Promise.all([
    createOrUpdateFile(
      sql,
      minio,
      bucketName,
      {
        name: "image.png",
      },
      "./__fixtures__/server/image.png",
    ),
    createOrUpdateFile(
      sql,
      minio,
      bucketName,
      {
        name: "video.mp4",
      },
      "./__fixtures__/server/video.mp4",
    ),
  ]);

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

  t.test("e2e - image", async (t) => {
    const response = await axiosInstance.get(`/${image.id}`, {
      responseType: "stream",
    });

    const buffer = await streamToBuffer(response.data);

    t.equal(buffer.length, imageBuffer.length);

    t.ok(response.headers["accept-ranges"]);
    t.equal(response.headers["content-type"], image.contentType);
    t.equal(Number(response.headers["content-length"]), image.contentLength);
  });

  t.test("e2e - video", async (t) => {
    const response = await axiosInstance.get(`/${video.id}`, {
      responseType: "stream",
    });

    const buffer = await streamToBuffer(response.data);

    t.equal(buffer.length, videoBuffer.length);

    t.ok(response.headers["accept-ranges"]);
    t.equal(response.headers["content-type"], video.contentType);
    t.equal(Number(response.headers["content-length"]), video.contentLength);
  });

  // Disabled below test:
  // - Koa is flaky when the `on(error)` is fired
  // - It's hard to set a good timeout value on Axios

  // t.test("e2e - video - kill stream", async (t) => {
  //   let err = undefined;
  //
  //   app.on("error", (error) => {
  //     err = error;
  //   });
  //
  //   try {
  //     await axiosInstance.get(`/${video.id}`, {
  //       timeout: 100,
  //       responseType: "stream",
  //     });
  //     // eslint-disable-next-line no-empty
  //   } catch {}
  //
  //   await setTimeout(200);
  //   t.ok(err);
  // });

  t.test("e2e - video- partial", async (t) => {
    const response = await axiosInstance.get(`/${video.id}`, {
      responseType: "stream",
      headers: {
        range: `bytes=0-1023`,
      },
    });

    const buffer = await streamToBuffer(response.data);

    t.equal(buffer.length, 1024);

    t.equal(Number(response.headers["content-length"]), 1024);
    t.equal(
      response.headers["content-range"],
      `bytes 0-1023/${video.contentLength}`,
    );
    t.equal(response.status, 206);
  });

  t.test("teardown", async (t) => {
    await closeTestApp(app);
    await cleanupTestPostgresDatabase(sql);
    await removeBucketAndObjectsInBucket(minio, bucketName);

    t.pass();
  });
});
