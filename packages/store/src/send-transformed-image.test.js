import { mainTestFn, test } from "@compas/cli";
import {
  closeTestApp,
  createTestAppAndClient,
  getApp,
  sendFile,
} from "@compas/server";
import { AppError, isNil, pathJoin, uuid } from "@compas/stdlib";
import {
  cleanupTestPostgresDatabase,
  createOrUpdateFile,
  createTestPostgresDatabase,
  ensureBucket,
  FileCache,
  newMinioClient,
  removeBucketAndObjectsInBucket,
  sendTransformedImage,
} from "@compas/store";
import Axios from "axios";
import { validateStoreImageTransformOptions } from "./generated/store/validators.js";

mainTestFn(import.meta);

test("store/send-transformed-image", async (t) => {
  const sql = await createTestPostgresDatabase();
  const minio = newMinioClient({});
  const bucketName = uuid();
  await ensureBucket(minio, bucketName, "us-east-1");
  const cache = new FileCache(sql, minio, bucketName);
  const app = getApp({});

  const five = await createOrUpdateFile(
    sql,
    minio,
    bucketName,
    {
      name: "5.jpg",
    },
    pathJoin(process.cwd(), "__fixtures__/store/5.jpg"),
  );

  const ten = await createOrUpdateFile(
    sql,
    minio,
    bucketName,
    {
      name: "10.jpg",
    },
    pathJoin(process.cwd(), "__fixtures__/store/10.jpg"),
  );

  app.use(async (ctx, next) => {
    const validatedQuery = validateStoreImageTransformOptions(
      ctx.request.query,
    );
    if (validatedQuery.error) {
      throw validatedQuery.error;
    }
    ctx.validatedQuery = validatedQuery.value;

    if (ctx.path.includes("/5")) {
      await sendTransformedImage(
        sendFile,
        ctx,
        sql,
        minio,
        five,
        cache.getStreamFn,
      );

      return next();
    }

    await sendTransformedImage(
      sendFile,
      ctx,
      sql,
      minio,
      ten,
      cache.getStreamFn,
    );

    return next();
  });

  const apiClient = Axios.create();
  await createTestAppAndClient(app, apiClient);

  t.test("validation", async (t) => {
    try {
      await apiClient.request({
        method: "GET",
        url: "/5?",
      });
    } catch (e) {
      t.log.info(AppError.format(e));
      t.equal(e.response.status, 400);
      t.ok(e.response.data.key.startsWith("validator."));
    }
  });

  t.test("original has transform saved", async (t) => {
    await apiClient.request({
      method: "GET",
      url: "/5?w=5",
      headers: {
        Accept: "text/plain",
      },
      responseType: "stream",
    });

    t.ok(!isNil(five.meta.transforms[`compas-image-transform-webp0-w5-q75`]));
  });

  t.test("reuse earlier transform", async (t) => {
    await apiClient.request({
      method: "GET",
      url: "/5?w=5",
      headers: {
        Accept: "text/plain",
      },
      responseType: "stream",
    });

    t.ok(!isNil(five.meta.transforms[`compas-image-transform-webp0-w5-q75`]));
    t.equal(Object.keys(five.meta.transforms).length, 1);
  });

  t.test("return webp if allowed", async (t) => {
    const response = await apiClient.request({
      method: "GET",
      url: "/5?w=5&q=60",
      headers: {
        Accept: "image/webp",
      },
      responseType: "stream",
    });

    t.equal(response.headers["content-type"], "image/webp");

    t.ok(!isNil(five.meta.transforms[`compas-image-transform-webp1-w5-q60`]));
  });

  t.test("teardown", async (t) => {
    await closeTestApp(app);
    await removeBucketAndObjectsInBucket(minio, bucketName);
    await cleanupTestPostgresDatabase(sql);

    t.pass();
  });
});
