import { createReadStream, createWriteStream, readFileSync } from "fs";
import { mainTestFn, test } from "@compas/cli";
import { AppError, isNil, uuid } from "@compas/stdlib";
import {
  copyFile,
  createOrUpdateFile,
  getFileStream,
  syncDeletedFiles,
} from "./files.js";
import { queries } from "./generated.js";
import { queryFile } from "./generated/database/file.js";
import {
  ensureBucket,
  newMinioClient,
  removeBucketAndObjectsInBucket,
} from "./minio.js";
import { query } from "./query.js";
import {
  cleanupTestPostgresDatabase,
  createTestPostgresDatabase,
} from "./testing.js";

mainTestFn(import.meta);

test("store/files", async (t) => {
  const bucketName = uuid();
  const minio = newMinioClient({});
  await ensureBucket(minio, bucketName, "us-east-1");
  const filePath = `./__fixtures__/store/997-test.sql`;
  const name = "997-test.sql";

  let sql = undefined;

  t.test("create a test db", async (t) => {
    sql = await createTestPostgresDatabase();
    t.ok(!!sql);

    const result = await sql`
      SELECT 1 + 2 AS sum
    `;
    t.equal(result[0].sum, 3);
  });

  t.test("createOrUpdateFile no name specified", async (t) => {
    try {
      await createOrUpdateFile(sql, minio, bucketName, {}, "");
    } catch (e) {
      t.ok(e);
    }
  });

  t.test("createOrUpdateFile - invalid mime type", async (t) => {
    try {
      await createOrUpdateFile(
        sql,
        minio,
        bucketName,
        {
          name: "foo.js",
        },
        Buffer.from("const foo = 5;"),
        {
          allowedContentTypes: ["image/png"],
        },
      );
    } catch (e) {
      t.ok(AppError.instanceOf(e));
      t.equal(e.key, "store.createOrUpdateFile.invalidContentType");
      t.equal(e.info.found, "application/javascript");
    }
  });

  t.test("createOrUpdateFile only name provided", async (t) => {
    const file = await createOrUpdateFile(
      sql,
      minio,
      bucketName,
      { name },
      filePath,
    );

    t.ok(!!file.id);
    t.equal(file.contentType, "application/x-sql");
    t.ok(!!file.contentLength);
    t.ok(!!file.createdAt);
    t.ok(!!file.updatedAt);
    t.deepEqual(file.meta, {});
  });

  t.test("createOrUpdateFile accepts updatedAt and use a stream", async (t) => {
    const updatedAt = new Date(2019, 1, 1, 1);

    const file = await createOrUpdateFile(
      sql,
      minio,
      bucketName,
      { name, updatedAt },
      createReadStream(filePath),
      {
        allowedContentTypes: ["application/x-sql"],
      },
    );

    t.equal(file.contentType, "application/x-sql");
    t.ok(!!file.contentLength);
    t.ok(!!file.createdAt);
    t.equal(file.updatedAt.getTime(), updatedAt.getTime());
  });

  let storedFiles = [];

  t.test("list available files", async (t) => {
    storedFiles = await queryFile().exec(sql);
    t.equal(storedFiles.length, 2);
    t.equal(storedFiles[0].contentLength, storedFiles[1].contentLength);
  });

  t.test("get file stream by id", async (t) => {
    const testPath = "/tmp/compas_store_stream_test";
    const ws = createWriteStream(testPath);

    const stream = await getFileStream(minio, bucketName, storedFiles[1].id);

    await new Promise((resolve, reject) => {
      ws.on("close", resolve);
      ws.on("error", reject);
      stream.pipe(ws);
    });

    const original = readFileSync(filePath, "utf-8");
    const download = readFileSync(testPath, "utf-8");
    t.equal(original, download);
  });

  t.test("stream ranges", async (t) => {
    const inputs = [{ end: 14 }, { start: 2 }, { start: 2, end: 14 }];
    const original = readFileSync(filePath, "utf-8");
    const testPath = "/tmp/compas_store_stream_test";

    for (const input of inputs) {
      const ws = createWriteStream(testPath);
      const stream = await getFileStream(
        minio,
        bucketName,
        storedFiles[1].id,
        input,
      );

      await new Promise((resolve, reject) => {
        ws.on("close", resolve);
        ws.on("error", reject);
        stream.pipe(ws);
      });

      const download = readFileSync(testPath, "utf-8");
      t.equal(
        original.substring(input.start ?? 0, input.end),
        download,
        "stream range equivalents",
      );
    }
  });

  t.test("copyFile", async (t) => {
    const copy = await copyFile(sql, minio, bucketName, storedFiles[1].id);

    t.notEqual(storedFiles[1].id, copy.id);
  });

  t.test("update files by idIn", async (t) => {
    const result = await queries.fileUpdate(
      sql,
      { updatedAt: new Date() },
      {
        idIn: storedFiles.map((it) => it.id),
      },
    );

    t.equal(result.length, 2);
  });

  t.test("deleteFile", async (t) => {
    await queries.fileDeletePermanent(sql, { id: storedFiles[0].id });
    t.pass();
  });

  t.test(
    "seed transformedFromOriginal file for 'sendTransformedImage'",
    async (t) => {
      await queries.fileInsert(sql, {
        name: "transformedFromOriginal",
        bucketName,
        meta: {
          transformedFromOriginal: storedFiles[0].id,
        },
        contentType: "text/plain",
        contentLength: 1,
      });

      t.pass();
    },
  );

  t.test("sync deleted files", async (t) => {
    let length = await syncDeletedFiles(sql, minio, bucketName);
    t.ok(length > 0);
    length = await syncDeletedFiles(sql, minio, bucketName);
    t.equal(length, 0);
  });

  t.test("unused 'transformFromOriginal' is removed", async (t) => {
    const [file] = await queryFile({
      where: {
        $raw: query`name = ${"transformedFromOriginal"}`,
      },
    }).exec(sql);

    t.ok(isNil(file));
  });

  t.test("destroy test db", async (t) => {
    await cleanupTestPostgresDatabase(sql);
    t.ok(true, "closed postgres connection");
  });

  t.test("remove minio bucket", async (t) => {
    await removeBucketAndObjectsInBucket(minio, bucketName);
    t.ok(true, "removed minio bucket");
  });
});
