import { Blob } from "buffer";
import { createReadStream } from "fs";
import { mainTestFn, test } from "@compas/cli";
import { dirnameForModule, pathJoin, streamToBuffer } from "@compas/stdlib";
import {
  cleanupTestPostgresDatabase,
  objectStorageRemoveBucket,
} from "@compas/store";
import {
  fetchCatchErrorAndWrapWithAppError,
  fetchWithBaseUrl,
} from "../src/generated/common/api-client.js";
import {
  apiPostCreate,
  apiPostHeaderImage,
  apiPostList,
} from "../src/generated/post/apiClient.js";
import {
  app,
  bucketName,
  injectTestServices,
  s3Client,
  sql,
} from "../src/services.js";

mainTestFn(import.meta);

test("e2e", async (t) => {
  const apiPort = 5504;

  await injectTestServices();

  const server = await new Promise((r) => {
    const server = app.listen(apiPort, () => {
      r(server);
    });
  });

  const fetchFn = fetchCatchErrorAndWrapWithAppError(
    fetchWithBaseUrl(fetch, `http://localhost:${apiPort}/`),
  );

  t.test("create post without image", async (t) => {
    await apiPostCreate(fetchFn, {
      title: "foo",
      contents: "bar",
    });

    t.pass();
  });

  t.test("create post with image", async (t) => {
    const headerBlob = new Blob(
      await streamToBuffer(
        createReadStream(
          pathJoin(
            dirnameForModule(import.meta),
            "..",
            "__fixtures__",
            "5.jpg",
          ),
        ),
      ),
    );

    await apiPostCreate(fetchFn, {
      title: "foo",
      contents: "bar",
      headerImage: {
        name: "header-image.jpg",
        data: headerBlob,
      },
    });

    t.pass();
  });

  t.test("retrieve image", async (t) => {
    const { posts } = await apiPostList(fetchFn);

    const postWithImage = posts.find((it) => it.headerImage);

    t.equal(postWithImage.headerImage.contentType, "image/jpeg");

    const blob = await apiPostHeaderImage(
      fetchFn,
      {
        id: postWithImage.id,
      },
      {
        w: 5,
      },
    );

    t.ok(blob.size > 5);
  });

  t.test("retrieve original image", async (t) => {
    const { posts } = await apiPostList(fetchFn);

    const postWithImage = posts.find((it) => it.headerImage);

    t.equal(postWithImage.headerImage.contentType, "image/jpeg");

    const blob = await apiPostHeaderImage(
      fetchFn,
      {
        id: postWithImage.id,
      },
      {
        w: "original",
      },
    );

    t.ok(blob.size > 5);
  });

  t.test("teardown", async (t) => {
    server.close();
    await cleanupTestPostgresDatabase(sql);
    await objectStorageRemoveBucket(s3Client, {
      bucketName,
      includeAllObjects: true,
    });

    t.pass();
  });
});
