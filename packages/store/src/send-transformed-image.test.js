import { mainTestFn, test } from "@compas/cli";
import {
  closeTestApp,
  createTestAppAndClient,
  getApp,
  sendFile,
} from "@compas/server";
import { isNil, pathJoin, uuid } from "@compas/stdlib";
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
import { queries } from "./generated.js";
import { queryFile } from "./generated/database/file.js";
import { validateStoreImageTransformOptions } from "./generated/store/validators.js";

mainTestFn(import.meta);

test("store/send-transformed-image", async (t) => {
  const sql = await createTestPostgresDatabase();
  const minio = newMinioClient({});
  const bucketName = uuid();
  await ensureBucket(minio, bucketName, "us-east-1");
  const cache = new FileCache(sql, minio, bucketName);
  const app = getApp({});

  let five = await createOrUpdateFile(
    sql,
    minio,
    bucketName,
    {
      name: "5.jpg",
    },
    pathJoin(process.cwd(), "__fixtures__/store/5.jpg"),
  );

  let ten = await createOrUpdateFile(
    sql,
    minio,
    bucketName,
    {
      name: "10.jpg",
    },
    pathJoin(process.cwd(), "__fixtures__/store/10.jpg"),
  );

  const reloadFileRecords = async () => {
    const [newFive] = await queryFile({
      where: {
        id: five.id,
      },
    }).exec(sql);
    const [newTen] = await queryFile({
      where: {
        id: ten.id,
      },
    }).exec(sql);

    five = newFive;
    ten = newTen;
  };

  app.use(async (ctx, next) => {
    const validatedQuery = validateStoreImageTransformOptions(
      ctx.request.query,
    );
    if (validatedQuery.error) {
      throw validatedQuery.error;
    }
    ctx.validatedQuery = validatedQuery.value;

    if (ctx.path.includes("/5")) {
      const [file] = await queryFile({
        where: {
          id: five.id,
        },
      }).exec(sql);
      await sendTransformedImage(
        sendFile,
        ctx,
        sql,
        minio,
        file,
        cache.getStreamFn,
      );

      return next();
    }

    const [file] = await queryFile({
      where: {
        id: ten.id,
      },
    }).exec(sql);
    await sendTransformedImage(
      sendFile,
      ctx,
      sql,
      minio,
      file,
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

    await reloadFileRecords();

    t.ok(!isNil(five.meta.transforms[`compas-image-transform-none-w5-q75`]));
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

    await reloadFileRecords();

    t.ok(!isNil(five.meta.transforms[`compas-image-transform-none-w5-q75`]));
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

    await reloadFileRecords();

    t.equal(response.headers["content-type"], "image/webp");
    t.ok(!isNil(five.meta.transforms[`compas-image-transform-webp-w5-q60`]));
  });

  t.test("return webp if allowed - reuse", async (t) => {
    const response = await apiClient.request({
      method: "GET",
      url: "/5?w=5&q=60",
      headers: {
        Accept: "image/webp",
      },
      responseType: "stream",
    });

    const existingTransformForKey =
      five.meta.transforms[`compas-image-transform-webp-w5-q60`];
    await reloadFileRecords();

    t.equal(response.headers["content-type"], "image/webp");
    t.equal(
      five.meta.transforms[`compas-image-transform-webp-w5-q60`],
      existingTransformForKey,
    );
  });

  t.test("return webp if allowed - but remove original", async (t) => {
    const existingTransformForKey =
      five.meta.transforms[`compas-image-transform-webp-w5-q60`];
    await queries.fileDelete(sql, { id: existingTransformForKey });

    const response = await apiClient.request({
      method: "GET",
      url: "/5?w=5&q=60",
      headers: {
        Accept: "image/webp",
      },
      responseType: "stream",
    });

    await reloadFileRecords();

    t.equal(response.headers["content-type"], "image/webp");
    t.notEqual(
      five.meta.transforms[`compas-image-transform-webp-w5-q60`],
      existingTransformForKey,
    );
  });

  t.test("teardown", async (t) => {
    await closeTestApp(app);
    await removeBucketAndObjectsInBucket(minio, bucketName);
    await cleanupTestPostgresDatabase(sql);

    t.pass();
  });
});
