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

test("code-gen/crud/e2e/nested", async (t) => {
  const Tdatabase = new TypeCreator("database");
  const T = new TypeCreator("role");

  const { exitCode, stdout, generatedDirectory, cleanupGeneratedDirectory } =
    await codeGenToTemporaryDirectory(
      [
        Tdatabase.object("role")
          .keys({
            identifier: T.string(),
          })
          .enableQueries({
            withDates: true,
          })
          .relations(
            T.oneToMany("permissions", T.reference("database", "permission")),
          ),

        Tdatabase.object("roleInfo")
          .keys({
            description: T.string(),
          })
          .enableQueries({})
          .relations(
            T.oneToOne("role", T.reference("database", "role"), "info"),
          ),

        Tdatabase.object("permission")
          .keys({
            identifier: T.string(),
          })
          .enableQueries()
          .relations(
            T.manyToOne("role", T.reference("database", "role"), "permissions"),
          ),

        T.crud("/role")
          .entity(T.reference("database", "role"))
          .routes({
            createRoute: true,
          })
          .nestedRelations(
            T.crud("/permission")
              .fromParent("permissions", {
                name: "permission",
              })
              .routes({
                listRoute: true,
                singleRoute: true,
                createRoute: true,
                updateRoute: true,
                deleteRoute: true,
              }),
            T.crud("/info").fromParent("info", { name: "info" }).routes({
              singleRoute: true,
              createRoute: true,
              updateRoute: true,
              deleteRoute: true,
            }),
          ),
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
  const { roleRegisterCrud } = await import(
    pathJoin(generatedDirectory, "./role/crud.js")
  );

  const {
    apiRoleCreate,
    apiRolePermissionList,
    apiRolePermissionSingle,
    apiRolePermissionCreate,
    apiRoleInfoSingle,
    apiRoleInfoCreate,
  } = await import(pathJoin(generatedDirectory, "./role/apiClient.js"));

  const { apiCompasStructure } = await import(
    pathJoin(generatedDirectory, "./compas/apiClient.js")
  );

  const api = getApp();
  setBodyParsers(createBodyParsers({}, {}));
  api.use(router);
  roleRegisterCrud({ sql });

  const axiosInstance = await axios.create({});
  await createTestAppAndClient(api, axiosInstance);

  await sql.unsafe(`
    CREATE TABLE IF NOT EXISTS "role"
    (
      "id"         uuid PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
      "identifier" varchar          NOT NULL,
      "createdAt"  timestamptz      NOT NULL DEFAULT now(),
      "updatedAt"  timestamptz      NOT NULL DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS "roleInfo"
    (
      "id"          uuid PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
      "role"        uuid             NOT NULL,
      "description" varchar          NOT NULL,
      CONSTRAINT "roleInfoRoleFk" FOREIGN KEY ("role") REFERENCES "role" ("id") ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS "permission"
    (
      "id"         uuid PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
      "role"       uuid             NOT NULL,
      "identifier" varchar          NOT NULL,
      CONSTRAINT "permissionRoleFk" FOREIGN KEY ("role") REFERENCES "role" ("id") ON DELETE CASCADE
    );
  `);

  const { item: role } = await apiRoleCreate(axiosInstance, {
    identifier: "Role 1",
  });

  t.test("generate frontend", async (t) => {
    const structure = await apiCompasStructure(axiosInstance);
    const { exitCode, cleanupGeneratedDirectory } =
      await codeGenToTemporaryDirectory(
        {
          extend: [[structure]],
        },
        {
          isBrowser: true,
        },
      );

    await cleanupGeneratedDirectory();

    t.equal(exitCode, 0);
  });

  t.test("apiRoleInfo", (t) => {
    t.test("apiRoleInfoSingle - notFound", async (t) => {
      try {
        await apiRoleInfoSingle(axiosInstance, {
          roleId: role.id,
        });
      } catch (e) {
        t.equal(e.key, "roleInfo.single.notFound");
      }
    });

    t.test("apiRoleInfoCreate", (t) => {
      t.test("success", async (t) => {
        const { item } = await apiRoleInfoCreate(
          axiosInstance,
          {
            roleId: role.id,
          },
          {
            description: "Foo bar baz",
          },
        );

        t.equal(item.role, role.id);
      });

      t.test("fails - second time", async (t) => {
        try {
          await apiRoleInfoCreate(
            axiosInstance,
            {
              roleId: role.id,
            },
            {
              description: "Foo bar baz",
            },
          );
        } catch (e) {
          t.equal(e.key, "roleInfo.create.alreadyExists");
        }
      });
    });

    t.test("apiRoleInfoSingle", async (t) => {
      const { item } = await apiRoleInfoSingle(axiosInstance, {
        roleId: role.id,
      });

      t.ok(item);
    });
  });

  t.test("apiRolePermission", (t) => {
    t.test("apiRolePermissionSingle - notFound", async (t) => {
      try {
        await apiRolePermissionSingle(axiosInstance, {
          roleId: role.id,
          permissionId: uuid(),
        });
      } catch (e) {
        t.equal(e.key, "rolePermission.single.notFound");
      }
    });

    t.test("apiRolePermissionCreate", async (t) => {
      const { item } = await apiRolePermissionCreate(
        axiosInstance,
        {
          roleId: role.id,
        },
        {
          identifier: "Permission",
        },
      );

      t.equal(item.role, role.id);
    });

    t.test("apiRolePermissionList", async (t) => {
      const { list, total } = await apiRolePermissionList(
        axiosInstance,
        {
          roleId: role.id,
        },
        {},
        {},
      );

      t.equal(total, 1);
      t.equal(list.length, 1);
    });
  });

  t.test("teardown", async (t) => {
    await closeTestApp(api);
    await cleanupGeneratedDirectory();

    t.pass();
  });
});
