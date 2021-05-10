import { existsSync, lstatSync, mkdirSync, writeFileSync } from "fs";
import { pipeline as pipelineCallback } from "stream";
import { promisify } from "util";
import { mainTestFn, test } from "@compas/cli";
import { printProcessMemoryUsage, gc, pathJoin, uuid } from "@compas/stdlib";
import { FileCache } from "./file-cache.js";
import { createOrUpdateFile } from "./files.js";
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
  const basePath = pathJoin("/tmp", uuid());
  const bucketName = uuid();
  const minio = newMinioClient({});
  await ensureBucket(minio, bucketName, "us-east-1");

  let sql = undefined;
  let cache = undefined;
  const files = {
    small: Buffer.alloc(2, 0),
    medium: Buffer.alloc(4, 0),
    large: Buffer.alloc(10, 0),
  };

  t.test("create a test db", async (t) => {
    sql = await createTestPostgresDatabase();
    t.ok(!!sql);

    const result = await sql`
      SELECT 1 + 2 AS sum
    `;
    t.equal(result[0].sum, 3);
  });

  t.test("create FileCache", () => {
    cache = new FileCache(sql, minio, bucketName, {
      cacheControlHeader: "test",
      inMemoryThreshold: 5,
    });
  });

  // noinspection DuplicatedCode
  t.test("write fixtures to disk", () => {
    mkdirSync(basePath, { recursive: true });
    writeFileSync(pathJoin(basePath, "small"), files.small);
    writeFileSync(pathJoin(basePath, "medium"), files.medium);
    writeFileSync(pathJoin(basePath, "large"), files.large);
  });

  t.test("populate file table", async (t) => {
    try {
      files.small = await createOrUpdateFile(
        sql,
        minio,
        bucketName,
        { name: "small" },
        pathJoin(basePath, "small"),
      );

      files.medium = await createOrUpdateFile(
        sql,
        minio,
        bucketName,
        { name: "medium" },
        pathJoin(basePath, "medium"),
      );

      files.large = await createOrUpdateFile(
        sql,
        minio,
        bucketName,
        { name: "large" },
        pathJoin(basePath, "large"),
      );
    } catch (e) {
      t.fail(e);
    }
  });

  t.test("get a small file", async (t) => {
    const buffer = await streamToBuffer(
      (
        await cache.getFileStream(files.small)
      ).stream,
    );
    t.equal(buffer.length, 2);
  });

  t.test("get a small file again", async (t) => {
    const buffer = await streamToBuffer(
      (
        await cache.getFileStream(files.small)
      ).stream,
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
      (
        await cache.getFileStream(files.large)
      ).stream,
    );
    t.equal(buffer.length, 10);
    t.ok(existsSync(path));
    t.ok(
      lstatSync(path).mtimeMs < new Date().getTime(),
      "file created before current time",
    );
  });

  t.test("clear file removes from cache", () => {
    cache.clear(files.large.id);
  });

  t.test("create file again after clear", async (t) => {
    const now = new Date().getTime();
    await new Promise((r) => {
      setTimeout(r, 5);
    });
    const path = `${FileCache.fileCachePath}/${files.large.id}`;

    const buffer = await streamToBuffer(
      (
        await cache.getFileStream(files.large)
      ).stream,
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
  const basePath = pathJoin("/tmp", uuid());
  const files = {
    small: Buffer.alloc(2000, 0),
    medium: Buffer.alloc(4000, 0),
    large: Buffer.alloc(10000, 0),
  };
  const bucketName = uuid();
  const minio = newMinioClient({});
  await ensureBucket(minio, bucketName, "us-east-1");

  let sql = undefined;
  let cache = undefined;

  const logMemory = (t) => {
    t.test("print memory usage", (t) => {
      printProcessMemoryUsage(t.log);
    });
  };

  const runFileStreamRounds = (t) => {
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
  };

  logMemory(t);

  t.test("create a test db", async (t) => {
    sql = await createTestPostgresDatabase();
    t.ok(!!sql);

    const result = await sql`
      SELECT 1 + 2 AS sum
    `;
    t.equal(result[0].sum, 3);
  });

  logMemory(t);

  t.test("create FileCache", () => {
    cache = new FileCache(sql, minio, bucketName, {
      cacheControlHeader: "test",
      inMemoryThreshold: 3500,
    });
  });

  logMemory(t);

  // noinspection DuplicatedCode
  t.test("write fixtures to disk", () => {
    mkdirSync(basePath, { recursive: true });
    writeFileSync(pathJoin(basePath, "small"), files.small);
    writeFileSync(pathJoin(basePath, "medium"), files.medium);
    writeFileSync(pathJoin(basePath, "large"), files.large);
  });

  t.test("populate file table", async (t) => {
    try {
      files.small = await createOrUpdateFile(
        sql,
        minio,
        bucketName,
        { name: "small" },
        pathJoin(basePath, "small"),
      );

      files.medium = await createOrUpdateFile(
        sql,
        minio,
        bucketName,
        { name: "medium" },
        pathJoin(basePath, "medium"),
      );

      files.large = await createOrUpdateFile(
        sql,
        minio,
        bucketName,
        { name: "large" },
        pathJoin(basePath, "large"),
      );
    } catch (e) {
      t.fail(e);
    }
  });

  logMemory(t);
  runFileStreamRounds(t);
  logMemory(t);
  runFileStreamRounds(t);

  t.test("run gc", async () => {
    gc();
    await new Promise((r) => {
      setTimeout(r, 10);
    });
  });

  logMemory(t);

  t.test("remove minio bucket", async (t) => {
    await removeBucketAndObjectsInBucket(minio, bucketName);
    t.ok(true, "removed minio bucket");
  });

  t.test("destroy test db", async (t) => {
    await cleanupTestPostgresDatabase(sql);
    t.ok(true, "closed postgres connection");
  });
});
