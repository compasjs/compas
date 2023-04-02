import { mainTestFn, test } from "@compas/cli";
import {
  closeTestApp,
  createBodyParsers,
  createTestAppAndClient,
  getApp,
} from "@compas/server";
import { pathJoin, uuid } from "@compas/stdlib";
import axios from "axios";
import { sql } from "../../../../../src/testing.js";
import { codeGenToTemporaryDirectory } from "../../../test/legacy/utils.test.js";
import { TypeCreator } from "../../builders/index.js";

mainTestFn(import.meta);

test("code-gen/crud/e2e/basics", async (t) => {
  const Tdatabase = new TypeCreator("database");
  const T = new TypeCreator("tag");

  const { exitCode, stdout, generatedDirectory, cleanupGeneratedDirectory } =
    await codeGenToTemporaryDirectory(
      [
        Tdatabase.object("tag")
          .keys({
            key: T.string().searchable(),
            value: T.string(),
          })
          .enableQueries({
            withDates: true,
          }),

        T.crud("/tag").entity(T.reference("database", "tag")).routes({
          listRoute: true,
          singleRoute: true,
          createRoute: true,
          updateRoute: true,
          deleteRoute: true,
        }),
      ],
      {
        enabledGenerators: ["validator", "sql", "apiClient", "router", "type"],
        isNodeServer: true,
      },
    );

  t.equal(exitCode, 0);
  if (exitCode !== 0) {
    t.log.error({
      stdout,
    });
  }

  const { router, setBodyParsers } = await import(
    pathJoin(generatedDirectory, "./common/router.js")
  );
  const { tagRegisterCrud } = await import(
    pathJoin(generatedDirectory, "./tag/crud.js")
  );
  const { queries } = await import(
    pathJoin(generatedDirectory, "./database/index.js")
  );
  const { queryTag } = await import(
    pathJoin(generatedDirectory, "./database/tag.js")
  );
  const { apiTagList, apiTagSingle, apiTagCreate, apiTagUpdate, apiTagDelete } =
    await import(pathJoin(generatedDirectory, "./tag/apiClient.js"));

  const api = getApp();
  setBodyParsers(createBodyParsers({}, {}));
  api.use(router);
  tagRegisterCrud({ sql });

  const axiosInstance = await axios.create({});
  await createTestAppAndClient(api, axiosInstance);

  await sql.unsafe(`
    CREATE TABLE "tag"
    (
      "id"        uuid PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
      "key"       varchar          NOT NULL,
      "value"     varchar          NOT NULL,
      "createdAt" timestamptz      NOT NULL DEFAULT now(),
      "updatedAt" timestamptz      NOT NULL DEFAULT now()
    );
  `);
  await queries.tagInsert(
    sql,
    Array.from({ length: 10 })
      .map((_, idx) => [
        {
          key: `Key${idx}`,
          value: `Tag value ${idx}`,
          createdAt: new Date(Date.now() + idx),
        },
      ])
      .flat(),
  );

  t.test("apiTagList", (t) => {
    t.test("success", async (t) => {
      const result = await apiTagList(axiosInstance, {}, {});

      t.ok(result.total > 0);
    });

    t.test("offset + limit", async (t) => {
      const result = await apiTagList(
        axiosInstance,
        {
          offset: 1,
          limit: 1,
        },
        {},
      );

      t.ok(result.total > result.list.length);
      t.equal(result.list.length, 1);
    });

    t.test("orderBy", async (t) => {
      const { list: normalSorted } = await apiTagList(axiosInstance, {}, {});

      const { list: inverseSorted } = await apiTagList(
        axiosInstance,
        {},
        {
          orderBy: ["createdAt"],
          orderBySpec: {
            createdAt: "DESC",
          },
        },
      );

      t.equal(normalSorted[0].id, inverseSorted.at(-1).id);
      t.equal(normalSorted[4].id, inverseSorted.at(-5).id);
    });

    t.test("where", (t) => {
      t.test("can't search on value", async (t) => {
        try {
          await apiTagList(
            axiosInstance,
            {},
            {
              where: {
                value: "foo",
              },
            },
          );
        } catch (e) {
          t.equal(e.info["$.where"].key, "validator.object.strict");
        }
      });

      t.test("search on the key field", async (t) => {
        const { list, total } = await apiTagList(
          axiosInstance,
          {},
          {
            where: {
              key: "Key1",
            },
          },
        );

        t.equal(total, 1);
        t.equal(list[0].key, "Key1");
      });
    });
  });

  t.test("apiTagSingle", (t) => {
    t.test(`tag.single.notFound`, async (t) => {
      try {
        await apiTagSingle(axiosInstance, {
          tagId: uuid(),
        });
      } catch (e) {
        t.equal(e.key, "tag.single.notFound");
      }
    });

    t.test("success", async (t) => {
      const [tag] = await queryTag({ limit: 1 }).exec(sql);
      const result = await apiTagSingle(axiosInstance, {
        tagId: tag.id,
      });

      t.equal(result.item.id, tag.id);
    });
  });

  t.test("apiTagCreate", (t) => {
    t.test("success", async (t) => {
      const result = await apiTagCreate(axiosInstance, {
        key: "Key",
        value: "Value",
      });

      const { item } = await apiTagSingle(axiosInstance, {
        tagId: result.item.id,
      });

      t.deepEqual(result.item, item);
      t.equal(result.item.key, "Key");
      t.equal(result.item.value, "Value");
    });
  });

  t.test("apiTagUpdate", (t) => {
    t.test("tag.single.notFound", async (t) => {
      try {
        await apiTagUpdate(
          axiosInstance,
          {
            tagId: uuid(),
          },
          {
            key: "Key",
            value: "Value",
          },
        );
      } catch (e) {
        t.equal(e.key, "tag.single.notFound");
      }
    });

    t.test("success", async (t) => {
      const [tag] = await queryTag({
        limit: 1,
      }).exec(sql);

      await apiTagUpdate(
        axiosInstance,
        {
          tagId: tag.id,
        },
        {
          key: `${tag.key}Updated`,
          value: `${tag.value}Updated`,
        },
      );

      const { item } = await apiTagSingle(axiosInstance, {
        tagId: tag.id,
      });

      t.notEqual(item.createdAt, item.updatedAt);
      t.equal(item.key, `${tag.key}Updated`);
      t.equal(item.value, `${tag.value}Updated`);
    });
  });

  t.test("apiTagDelete", (t) => {
    t.test("tag.single.notFound", async (t) => {
      try {
        await apiTagDelete(axiosInstance, {
          tagId: uuid(),
        });
      } catch (e) {
        t.equal(e.key, "tag.single.notFound");
      }
    });

    t.test("success", async (t) => {
      const [tag] = await queryTag({ limit: 1 }).exec(sql);

      await apiTagDelete(axiosInstance, {
        tagId: tag.id,
      });

      try {
        await apiTagSingle(axiosInstance, {
          tagId: tag.id,
        });
      } catch (e) {
        t.equal(e.key, "tag.single.notFound");
      }
    });
  });

  t.test("teardown", async (t) => {
    await closeTestApp(api);
    await cleanupGeneratedDirectory();

    t.pass();
  });
});
