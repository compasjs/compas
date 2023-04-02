import { mainTestFn, test } from "@compas/cli";
import {
  closeTestApp,
  createBodyParsers,
  createTestAppAndClient,
  getApp,
} from "@compas/server";
import { isNil, pathJoin } from "@compas/stdlib";
import axios from "axios";
import { sql } from "../../../../../src/testing.js";
import { codeGenToTemporaryDirectory } from "../../../test/legacy/utils.test.js";
import { TypeCreator } from "../../builders/index.js";

mainTestFn(import.meta);

test("code-gen/crud/e2e/inline", async (t) => {
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
            singleRoute: true,
            createRoute: true,
            updateRoute: true,
          })
          .inlineRelations(
            T.crud().fromParent("permissions", {
              name: "permission",
            }),
            T.crud().fromParent("info", { name: "info" }).optional(),
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
  const { apiRoleSingle, apiRoleCreate, apiRoleUpdate } = await import(
    pathJoin(generatedDirectory, "./role/apiClient.js")
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

  t.test("apiRoleCreate", (t) => {
    t.test("success - without info", async (t) => {
      const { item } = await apiRoleCreate(axiosInstance, {
        identifier: "role 1",
        permissions: [
          {
            identifier: "permission 1",
          },
        ],
      });

      t.ok(item.id);
      t.equal(item.permissions.length, 1);
      t.equal(item.permissions[0].identifier, "permission 1");
      t.ok(isNil(item.info));
    });

    t.test("success - without info", async (t) => {
      const { item } = await apiRoleCreate(axiosInstance, {
        identifier: "role 2",
        permissions: [],
        info: {
          description: "Role 2 description",
        },
      });

      t.ok(item.id);
      t.equal(item.permissions.length, 0);
      t.equal(item.info.description, "Role 2 description");
    });
  });

  t.test("apiRoleUpdate", async (t) => {
    const { item } = await apiRoleCreate(axiosInstance, {
      identifier: "role 3",
      permissions: [
        {
          identifier: "permission 3",
        },
      ],
      info: {
        description: "role 3 description",
      },
    });

    t.test("success - remove inline", async (t) => {
      await apiRoleUpdate(
        axiosInstance,
        {
          roleId: item.id,
        },
        {
          identifier: item.identifier,
          permissions: [],
        },
      );

      const result = await apiRoleSingle(axiosInstance, {
        roleId: item.id,
      });

      t.equal(result.item.id, item.id);
      t.equal(result.item.permissions.length, 0);
      t.ok(isNil(result.item.info));
    });

    t.test("success - add inline", async (t) => {
      await apiRoleUpdate(
        axiosInstance,
        {
          roleId: item.id,
        },
        {
          identifier: item.identifier,
          permissions: [
            {
              identifier: "permission 5",
            },
          ],
          info: {
            description: "description",
          },
        },
      );

      const result = await apiRoleSingle(axiosInstance, {
        roleId: item.id,
      });

      t.equal(result.item.id, item.id);
      t.equal(result.item.permissions.length, 1);
      t.equal(result.item.permissions[0].identifier, "permission 5");
      t.equal(result.item.info.description, "description");
    });
  });

  t.test("teardown", async (t) => {
    await closeTestApp(api);
    await cleanupGeneratedDirectory();

    t.pass();
  });
});
