import { mainTestFn, test } from "@compas/cli";
import { isNil, uuid } from "@compas/stdlib";
import { hoistChildrenToParent, updateFileGroupOrder } from "./file-group.js";
import { createOrUpdateFile } from "./files.js";
import { queries } from "./generated.js";
import { queryFileGroup } from "./generated/database/fileGroup.js";
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

test("store/file-group", async (t) => {
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

  const files = [];

  t.test("insert files", async () => {
    files.push(
      ...(await Promise.all([
        createOrUpdateFile(sql, minio, bucketName, { name }, filePath),
        createOrUpdateFile(sql, minio, bucketName, { name }, filePath),
        createOrUpdateFile(sql, minio, bucketName, { name }, filePath),
      ])),
    );
  });

  const groups = {};

  t.test("create groups and insert files", async () => {
    const [top1] = await queries.fileGroupInsert(sql, {
      name: "Test1",
    });

    const [sub1] = await queries.fileGroupInsert(sql, {
      name: "Test2",
      parent: top1.id,
    });

    const [top2] = await queries.fileGroupInsert(sql, {
      name: "Test3",
    });

    for (const file of files) {
      await queries.fileGroupInsert(sql, [
        {
          parent: sub1.id,
          file: file.id,
        },
        {
          parent: top2.id,
          file: file.id,
        },
      ]);
    }

    groups.top1 = top1.id;
    groups.top2 = top2.id;
    groups.sub1 = sub1.id;
  });

  t.test("set order of files of top2 group", async (t) => {
    const files = await queries.fileGroupSelect(sql, {
      parent: groups.top2,
    });
    const ordered = [files[1].id, files[2].id, files[0].id];
    await updateFileGroupOrder(sql, ordered);

    const refetched = await queries.fileGroupSelect(sql, {
      parent: groups.top2,
    });

    let i = 0;
    for (const id of ordered) {
      const refetchedForId = refetched.find((it) => it.id === id);
      t.equal(refetchedForId.order, ++i, "order id is updated");
    }
  });

  t.test("set order of top level groups", async () => {
    await updateFileGroupOrder(sql, [groups.top1, groups.top2]);
  });

  t.test("getNestedFiles without files, but preserve order", async (t) => {
    const result = await queryFileGroup({
      orderBy: ["order"],
      children: {
        orderBy: ["order"],
        children: {
          orderBy: ["order"],
        },
      },
      where: {
        parentIsNull: true,
      },
    }).exec(sql);

    t.equal(result[0].id, groups.top1, "correct order");
    t.equal(result[1].id, groups.top2, "correct order");

    t.equal(result[0].children.length, 1);
    t.equal(result[0].children[0].id, groups.sub1);
    t.equal(result[0].children[0].children.length, 3);
    t.equal(result[1].children.length, 3);
  });

  t.test("getNestedFiles with files", async (t) => {
    const result = await queryFileGroup({
      orderBy: ["order"],
      children: {
        orderBy: ["order"],
        file: {},
      },
      where: {
        id: groups.top2,
      },
    }).exec(sql);

    t.equal(result.length, 1);
    t.equal(result[0].children.length, 3);
    t.ok(!isNil(result[0].children[0].file.id));
  });

  t.test("query builder self referencing tables work", async (t) => {
    const result = await queryFileGroup({
      children: {
        parent: {
          children: {},
        },
      },
      where: {
        id: groups.top2,
      },
    }).exec(sql);

    t.equal(result.length, 1);
    t.equal(result[0].children.length, 3);
    t.equal(result[0].children[0].parent.id, groups.top2);
    t.equal(result[0].children[0].parent.children.length, 3);
  });

  t.test("delete file should also delete fileGroup reference", async (t) => {
    const files = await queries.fileGroupSelect(sql, {
      parent: groups.top2,
    });

    t.equal(files.length, 3);

    await queries.fileDelete(sql, { id: files[0].file });

    const refetchedFiles = await queries.fileGroupSelect(sql, {
      parent: groups.top2,
    });

    t.equal(refetchedFiles.length, 2);
  });

  t.test("delete file group but preserve children", async (t) => {
    const files = await queries.fileGroupSelect(sql, {
      parent: groups.top1,
    });

    t.equal(files.length, 1);

    await hoistChildrenToParent(sql, files[0]);
    await queries.fileGroupDelete(sql, { id: files[0].id });

    const result = await queryFileGroup({
      children: {},
      where: {
        id: groups.top1,
      },
    }).exec(sql);

    t.equal(result.length, 1);
    t.equal(result[0].children.length, 2);
  });

  t.test("get parents of all files", async (t) => {
    const result = await queryFileGroup({
      viaChildren: {
        viaFile: {},
      },
    }).exec(sql);

    t.equal(result.length, 2);
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
