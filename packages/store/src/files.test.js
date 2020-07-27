import { createReadStream, createWriteStream, readFileSync } from "fs";
import { dirnameForModule, isNil, uuid } from "@lbu/stdlib";
import test from "tape";
import {
  copyFile,
  createOrUpdateFile,
  deleteFile,
  getFileById,
  getFileStream,
  newFileStoreContext,
  syncDeletedFiles,
} from "./files.js";
import { storeQueries } from "./generated/queries.js";
import {
  ensureBucket,
  newMinioClient,
  removeBucketAndObjectsInBucket,
} from "./minio.js";
import {
  cleanupTestPostgresDatabase,
  createTestPostgresDatabase,
} from "./testing.js";

test("store/files", async (t) => {
  const bucketName = uuid();
  const minio = newMinioClient({});
  await ensureBucket(minio, bucketName, "us-east-1");
  const filePath = `${dirnameForModule(
    import.meta,
  )}/../__fixtures__/997-test.sql`;
  const filename = "997-test.sql";

  let sql = undefined;

  t.test("create a test db", async (t) => {
    sql = await createTestPostgresDatabase();
    t.ok(!!sql);

    const result = await sql`SELECT 1 + 2 AS sum`;
    t.equal(result[0].sum, 3);
  });

  t.test("createOrUpdateFile no filename specified", async (t) => {
    const ctx = newFileStoreContext(sql, minio, bucketName);
    try {
      await createOrUpdateFile(ctx, {}, "");
      t.fail("Should throw for unknown filename");
    } catch (e) {
      t.ok(e);
    }
  });

  t.test("createOrUpdateFile only filename provided", async (t) => {
    const ctx = newFileStoreContext(sql, minio, bucketName);
    const file = await createOrUpdateFile(ctx, { filename }, filePath);
    t.ok(!!file.id);
    t.equal(file.contentType, "application/x-sql");
    t.ok(!!file.contentLength);
    t.ok(!!file.createdAt);
    t.ok(!!file.updatedAt);
  });

  t.test(
    "createOrUpdateFile overwrite updatedAt and use a stream",
    async (t) => {
      const updatedAt = new Date(2019, 1, 1, 1);

      const ctx = newFileStoreContext(sql, minio, bucketName);
      const file = await createOrUpdateFile(
        ctx,
        { filename, updatedAt },
        createReadStream(filePath),
      );

      t.equal(file.contentType, "application/x-sql");
      t.ok(!!file.contentLength);
      t.ok(!!file.createdAt);
      t.notEqual(file.updatedAt.getTime(), updatedAt.getTime());
    },
  );

  let storedFiles = [];

  t.test("list available files", async (t) => {
    storedFiles = await storeQueries.fileStoreSelect(sql, {});
    t.equal(storedFiles.length, 2);
    t.equal(storedFiles[0].content_length, storedFiles[1].content_length);
  });

  t.test("get file by id", async (t) => {
    const ctx = newFileStoreContext(sql, minio, bucketName);
    const file1 = await getFileById(ctx, uuid());
    t.ok(isNil(file1));

    const file2 = await getFileById(ctx, storedFiles[0].id);
    t.deepEqual(file2, storedFiles[0]);
  });

  t.test("get file stream by id", async (t) => {
    const testPath = "/tmp/lbu_store_stream_test";
    const ws = createWriteStream(testPath);
    const ctx = newFileStoreContext(sql, minio, bucketName);

    const stream = await getFileStream(ctx, storedFiles[1].id);

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
    const testPath = "/tmp/lbu_store_stream_test";
    const ctx = newFileStoreContext(sql, minio, bucketName);

    for (const input of inputs) {
      const ws = createWriteStream(testPath);
      const stream = await getFileStream(ctx, storedFiles[1].id, input);

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
    const ctx = newFileStoreContext(sql, minio, bucketName);
    const copy = await copyFile(ctx, storedFiles[1].id);

    t.notEqual(storedFiles[1].id, copy.id);
  });

  t.test("update files by idIn", async (t) => {
    const result = await storeQueries.fileStoreUpdate(
      sql,
      { updatedAt: new Date() },
      {
        idIn: storedFiles.map((it) => it.id),
      },
    );

    t.equal(result.length, 2);
  });

  t.test("deleteFile", async (t) => {
    const ctx = newFileStoreContext(sql, minio, bucketName);
    await deleteFile(ctx, storedFiles[0].id);
    const file = await getFileById(ctx, storedFiles[0].id);
    t.ok(isNil(file));
  });

  t.test("sync deleted files", async (t) => {
    let length = await syncDeletedFiles(
      newFileStoreContext(sql, minio, bucketName),
    );
    t.ok(length > 0);
    length = await syncDeletedFiles(
      newFileStoreContext(sql, minio, bucketName),
    );
    t.equal(length, 0);
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
