import { mainTestFn, test } from "@compas/cli";
import {
  closeTestApp,
  createBodyParser,
  createTestAppAndClient,
  getApp,
} from "@compas/server";
import {
  AppError,
  eventStart,
  eventStop,
  pathJoin,
  uuid,
} from "@compas/stdlib";
import axios from "axios";
import { sql } from "../../../../../src/testing.js";
import { codeGenToTemporaryDirectory } from "../../../test/legacy/utils.test.js";
import { TypeCreator } from "../../builders/index.js";

mainTestFn(import.meta);

test("code-gen/crud/e2e/modifiers", async (t) => {
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
          .relations(),

        Tdatabase.object("roleInfo")
          .keys({
            description: T.string(),
          })
          .enableQueries({})
          .relations(
            T.oneToOne("role", T.reference("database", "role"), "info"),
          ),

        T.crud("/role")
          .entity(T.reference("database", "role"))
          .routes({
            listRoute: true,
            singleRoute: true,
            createRoute: true,
            updateRoute: true,
            deleteRoute: true,
          })
          .nestedRelations(
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
    apiRoleList,
    apiRoleSingle,
    apiRoleCreate,
    apiRoleUpdate,
    apiRoleDelete,
    apiRoleInfoSingle,
    apiRoleInfoCreate,
    apiRoleInfoUpdate,
    apiRoleInfoDelete,
  } = await import(pathJoin(generatedDirectory, "./role/apiClient.js"));

  const api = getApp();
  const bodyParser = createBodyParser({});
  setBodyParsers({ bodyParser, multipartBodyParser: bodyParser });
  api.use(router);

  const modifierCallResults = [];

  function modifier(event, ctx, ...args) {
    eventStart(event, "event");

    modifierCallResults.push(args);

    eventStop(event);
  }

  roleRegisterCrud({
    sql,
    roleListPreModifier: modifier,
    roleSinglePreModifier: modifier,
    roleCreatePreModifier: modifier,
    roleUpdatePreModifier: modifier,
    roleDeletePreModifier: modifier,
    roleInfoSinglePreModifier: modifier,
    roleInfoCreatePreModifier: modifier,
    roleInfoUpdatePreModifier: modifier,
    roleInfoDeletePreModifier: modifier,
  });

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

  t.test("roleListPreModifier", async (t) => {
    try {
      await apiRoleList(axiosInstance, {}, {});
      throw AppError.serverError({
        message: "Unreachable",
      });
    } catch {
      // ignore error;
      const modifierArgs = modifierCallResults.at(-1);

      t.equal(modifierArgs.length, 2);
    }
  });

  t.test("roleSinglePreModifier", async (t) => {
    try {
      await apiRoleSingle(axiosInstance, { roleId: uuid() });
      throw AppError.serverError({
        message: "Unreachable",
      });
    } catch {
      // ignore error;
      const modifierArgs = modifierCallResults.at(-1);

      t.equal(modifierArgs.length, 1);
    }
  });

  t.test("roleCreatePreModifier", async (t) => {
    try {
      await apiRoleCreate(axiosInstance, { identifier: "Identifier" });
      throw AppError.serverError({
        message: "Unreachable",
      });
    } catch {
      // ignore error;
      const modifierArgs = modifierCallResults.at(-1);

      t.equal(modifierArgs.length, 0);
    }
  });

  t.test("roleUpdatePreModifier", async (t) => {
    try {
      await apiRoleUpdate(
        axiosInstance,
        { roleId: uuid() },
        { identifier: "Identifier" },
      );

      throw AppError.serverError({
        message: "Unreachable",
      });
    } catch {
      // ignore error;
      const modifierArgs = modifierCallResults.at(-1);

      t.equal(modifierArgs.length, 1);
    }
  });

  t.test("roleDeletePreModifier", async (t) => {
    try {
      await apiRoleDelete(axiosInstance, { roleId: uuid() });
      throw AppError.serverError({
        message: "Unreachable",
      });
    } catch {
      // ignore error;
      const modifierArgs = modifierCallResults.at(-1);

      t.equal(modifierArgs.length, 1);
    }
  });

  t.test("roleInfoSinglePreModifier", async (t) => {
    try {
      await apiRoleInfoSingle(axiosInstance, { roleId: uuid() });
      throw AppError.serverError({
        message: "Unreachable",
      });
    } catch {
      // ignore error;
      const modifierArgs = modifierCallResults.at(-1);

      t.equal(modifierArgs.length, 1);
    }
  });

  t.test("roleInfoCreatePreModifier", async (t) => {
    try {
      await apiRoleInfoCreate(
        axiosInstance,
        { roleId: uuid() },
        { description: "Description" },
      );
      throw AppError.serverError({
        message: "Unreachable",
      });
    } catch {
      // ignore error;
      const modifierArgs = modifierCallResults.at(-1);

      t.equal(modifierArgs.length, 1);
    }
  });

  t.test("roleInfoUpdatePreModifier", async (t) => {
    try {
      await apiRoleInfoUpdate(
        axiosInstance,
        { roleId: uuid() },
        { description: "Description" },
      );
      throw AppError.serverError({
        message: "Unreachable",
      });
    } catch {
      // ignore error;
      const modifierArgs = modifierCallResults.at(-1);

      t.equal(modifierArgs.length, 1);
    }
  });

  t.test("roleInfoDeletePreModifier", async (t) => {
    try {
      await apiRoleInfoDelete(axiosInstance, { roleId: uuid() });
      throw AppError.serverError({
        message: "Unreachable",
      });
    } catch {
      // ignore error;
      const modifierArgs = modifierCallResults.at(-1);

      t.equal(modifierArgs.length, 1);
    }
  });

  t.test("teardown", async (t) => {
    await closeTestApp(api);
    await cleanupGeneratedDirectory();

    t.pass();
  });
});
