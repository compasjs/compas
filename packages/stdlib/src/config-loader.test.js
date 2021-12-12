import { mainTestFn, test } from "@compas/cli";
import {
  configLoaderCache,
  configLoaderDeleteCache,
  configLoaderGet,
} from "./config-loader.js";
import { uuid } from "./datatypes.js";
import { AppError } from "./error.js";
import { isNil } from "./lodash.js";

mainTestFn(import.meta);

test("stdlib/config-loader", (t) => {
  // Clear, so we all ways have a clean cache before starting
  // If the config-loader works properly, this shouldn't affect tests at all.
  configLoaderCache.clear();

  t.test("configLoaderGet", (t) => {
    t.test("validation - missing name", async (t) => {
      try {
        await configLoaderGet({
          location: "user",
        });
      } catch (e) {
        t.ok(AppError.instanceOf(e));
      }
    });

    t.test("validation - name should be string", async (t) => {
      try {
        await configLoaderGet({
          name: 55,
          location: "project",
        });
      } catch (e) {
        t.ok(AppError.instanceOf(e));
      }
    });

    t.test("validation - missing location", async (t) => {
      try {
        await configLoaderGet({
          name: "compas",
        });
      } catch (e) {
        t.ok(AppError.instanceOf(e));
      }
    });

    t.test("unknown config", async (t) => {
      const config = await configLoaderGet({
        name: uuid(),
        location: "project",
      });

      t.ok(isNil(config.resolvedLocation));
      t.deepEqual(config.data, {});

      // New config type loaded
      t.equal(configLoaderCache.size, 1);
    });

    t.test("config data & metadata", async (t) => {
      const config = await configLoaderGet({
        name: "test-config",
        location: "project",
      });

      // Metadata
      t.equal(config.name, "test-config");
      t.equal(config.location, "project");
      t.equal(config.resolvedLocation.filename, "test-config.json");
      t.ok(config.resolvedLocation.directory.endsWith("compas/config"));

      // Data
      t.equal(config.data.test, "Whoo!");

      // new config type loaded
      t.equal(configLoaderCache.size, 2);
    });

    t.test("load again and  contains data", async (t) => {
      const config = await configLoaderGet({
        name: "test-config",
        location: "project",
      });

      t.equal(config.data.test, "Whoo!");

      // Config was already loaded
      t.equal(configLoaderCache.size, 2);
    });

    t.test("load js", async (t) => {
      const config = await configLoaderGet({
        name: "test-config-2",
        location: "project",
      });

      t.equal(config.data.test, "What?!");

      // New config type loaded
      t.equal(configLoaderCache.size, 3);
    });

    t.test("invalid location results in empty data", async (t) => {
      const config = await configLoaderGet({
        name: "test-config",
        location: "user",
      });

      t.deepEqual(config.data, {});

      // New config type loaded
      t.equal(configLoaderCache.size, 4);
    });
  });

  t.test("configLoaderDeleteCache", (t) => {
    t.test("validation - both options defined", (t) => {
      try {
        configLoaderDeleteCache({ name: "foo", location: "project" });
      } catch (e) {
        t.ok(AppError.instanceOf(e));
      }
    });

    t.test("delete by name", (t) => {
      const configLoaderCacheSize = configLoaderCache.size;
      configLoaderDeleteCache({ name: "test-config-2" });

      t.equal(configLoaderCache.size, configLoaderCacheSize - 1);
    });

    t.test("delete by location", (t) => {
      configLoaderDeleteCache({ location: "user" });

      for (const entry of configLoaderCache.values()) {
        if (entry.location === "user") {
          t.fail(`Should have purged 'user' from the cache.`);
        }
      }

      t.pass();
    });

    t.test("delete it", (t) => {
      configLoaderDeleteCache();

      t.equal(configLoaderCache.size, 0);
    });
  });
});
