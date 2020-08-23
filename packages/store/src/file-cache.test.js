import { existsSync, lstatSync, writeFileSync } from "fs";
import { pipeline as pipelineCallback } from "stream";
import { promisify } from "util";
import { mainTestFn, test } from "@lbu/cli";
import { log, printProcessMemoryUsage } from "@lbu/insight";
import { gc, pathJoin, uuid } from "@lbu/stdlib";
import { FileCache } from "./file-cache.js";
import { createOrUpdateFile, newFileStoreContext } from "./files.js";
import {
  ensureBucket,
  newMinioClient,
  removeBucketAndObjectsInBucket,
} from "./minio.js";
import {
  cleanupTestPostgresDatabase,
  createTestPostgresDatabase,
} from "./testing.js";

mainTestFn(import.meta);

const pipeline = promisify(pipelineCallback);

const streamToBuffer = async (str) => {
  const parts = [];
  await pipeline(str, async function* (stream) {
    for await (const chunk of stream) {
      parts.push(chunk);
      yield chunk;
    }
  });

  return Buffer.concat(parts);
};

test("store/file-cache", async (t) => {
  const bucketName = uuid();
  const minio = newMinioClient({});
  await ensureBucket(minio, bucketName, "us-east-1");

  let sql = undefined;
  let store = undefined;
  let cache = undefined;
  const files = {
    small: Buffer.alloc(2, 0),
    medium: Buffer.alloc(4, 0),
    large: Buffer.alloc(10, 0),
  };

  t.test("create a test db", async (t) => {
    sql = await createTestPostgresDatabase();
    t.ok(!!sql);

    const result = await sql`SELECT 1 + 2 AS sum`;
    t.equal(result[0].sum, 3);
  });

  t.test("create FileCache", async (t) => {
    store = newFileStoreContext(sql, minio, bucketName);
    cache = new FileCache(store, {
      cacheControlHeader: "test",
      inMemoryThreshold: 5,
    });

    t.ok(store);
  });

  t.test("write fixtures to disk", async (t) => {
    writeFileSync(pathJoin("/tmp", "small"), files.small);
    writeFileSync(pathJoin("/tmp", "medium"), files.medium);
    writeFileSync(pathJoin("/tmp", "large"), files.large);

    t.ok(true);
  });

  t.test("populate fileStore", async (t) => {
    try {
      files.small = await createOrUpdateFile(
        store,
        { filename: "small" },
        pathJoin("/tmp", "small"),
      );

      files.medium = await createOrUpdateFile(
        store,
        { filename: "medium" },
        pathJoin("/tmp", "medium"),
      );

      files.large = await createOrUpdateFile(
        store,
        { filename: "large" },
        pathJoin("/tmp", "large"),
      );
    } catch (e) {
      t.fail(e);
    }
  });

  t.test("get a small file", async (t) => {
    const buffer = await streamToBuffer(
      (await cache.getFileStream(files.small)).stream,
    );
    t.equal(buffer.length, 2);
  });

  t.test("get a small file again", async (t) => {
    const buffer = await streamToBuffer(
      (await cache.getFileStream(files.small)).stream,
    );
    t.equal(buffer.length, 2);
  });

  t.test("get cache control header as well", async (t) => {
    const { stream, cacheControl } = await cache.getFileStream(files.medium);
    const buffer = await streamToBuffer(stream);

    t.equal(cacheControl, "test");
    t.equal(buffer.length, 4);
  });

  t.test("find file on disk", async (t) => {
    const path = `${FileCache.fileCachePath}/${files.large.id}`;

    const buffer = await streamToBuffer(
      (await cache.getFileStream(files.large)).stream,
    );
    t.equal(buffer.length, 10);
    t.ok(existsSync(path));
    t.ok(
      lstatSync(path).mtimeMs < new Date().getTime(),
      "file created before current time",
    );
  });

  t.test("clear file removes from cache", async () => {
    cache.clear(files.large.id);
  });

  t.test("create file again after clear", async (t) => {
    const now = new Date().getTime();
    await new Promise((r) => {
      setTimeout(r, 5);
    });
    const path = `${FileCache.fileCachePath}/${files.large.id}`;

    const buffer = await streamToBuffer(
      (await cache.getFileStream(files.large)).stream,
    );
    t.equal(buffer.length, 10);
    t.ok(existsSync(path));
    t.ok(
      lstatSync(path).mtimeMs > now,
      "file created after start of this test block",
    );
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

test("store/file-cache check memory usage", async (t) => {
  const bucketName = uuid();
  const minio = newMinioClient({});
  await ensureBucket(minio, bucketName, "us-east-1");

  let sql = undefined;
  let store = undefined;
  let cache = undefined;
  const files = {
    small: Buffer.alloc(2000, 0),
    medium: Buffer.alloc(4000, 0),
    large: Buffer.alloc(10000, 0),
  };

  const logMemory = (t) => {
    t.test("print memory usage", () => {
      printProcessMemoryUsage(log);
    });
  };

  logMemory(t);

  t.test("create a test db", async (t) => {
    sql = await createTestPostgresDatabase();
    t.ok(!!sql);

    const result = await sql`SELECT 1 + 2 AS sum`;
    t.equal(result[0].sum, 3);
  });

  logMemory(t);

  t.test("create FileCache", async (t) => {
    store = newFileStoreContext(sql, minio, bucketName);
    cache = new FileCache(store, {
      cacheControlHeader: "test",
      inMemoryThreshold: 3500,
    });

    t.ok(store);
  });

  logMemory(t);

  t.test("write fixtures to disk", (t) => {
    writeFileSync(pathJoin("/tmp", "small"), files.small);
    writeFileSync(pathJoin("/tmp", "medium"), files.medium);
    writeFileSync(pathJoin("/tmp", "large"), files.large);

    t.ok(true);
  });

  t.test("populate fileStore", async (t) => {
    try {
      files.small = await createOrUpdateFile(
        store,
        { filename: "small" },
        pathJoin("/tmp", "small"),
      );

      files.medium = await createOrUpdateFile(
        store,
        { filename: "medium" },
        pathJoin("/tmp", "medium"),
      );

      files.large = await createOrUpdateFile(
        store,
        { filename: "large" },
        pathJoin("/tmp", "large"),
      );
    } catch (e) {
      t.fail(e);
    }
  });

  logMemory(t);

  t.test("run a decent number of rounds", async () => {
    for (let i = 0; i < 1000; ++i) {
      const pArr = [];
      pArr.push(
        cache.getFileStream(files.small, Math.round(Math.random() * i)),
        cache.getFileStream(files.medium, Math.round(Math.random() * i)),
        cache.getFileStream(files.large, Math.round(Math.random() * i)),
      );

      const result = await Promise.all(pArr);
      for (const it of result) {
        it?.stream?.destroy();
      }
    }
  });

  logMemory(t);

  t.test("run a decent number of rounds", async () => {
    console.time("file-cache");
    for (let i = 0; i < 1000; ++i) {
      const pArr = [];
      pArr.push(
        cache.getFileStream(files.small, Math.round(Math.random() * i)),
        cache.getFileStream(files.medium, Math.round(Math.random() * i)),
        cache.getFileStream(files.large, Math.round(Math.random() * i)),
      );

      const result = await Promise.all(pArr);
      for (const it of result) {
        it?.stream?.destroy();
      }
    }
    console.timeEnd("file-cache");
  });

  t.test("run gc", async () => {
    gc();
    await new Promise((r) => {
      setTimeout(r, 10);
    });
  });

  logMemory(t);

  t.test("destroy test db", async (t) => {
    await cleanupTestPostgresDatabase(sql);
    t.ok(true, "closed postgres connection");
  });

  t.test("remove minio bucket", async (t) => {
    await removeBucketAndObjectsInBucket(minio, bucketName);
    t.ok(true, "removed minio bucket");
  });
});
