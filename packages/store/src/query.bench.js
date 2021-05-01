import { bench, mainBenchFn } from "@compas/cli";
import { uuid } from "@compas/stdlib";
import { query } from "./query.js";

mainBenchFn(import.meta);

bench("query - append simple and exec", (b) => {
  for (let i = 0; i < b.N; ++i) {
    const q = query``.append(query`foo`);
    q.exec({
      // eslint-disable-next-line no-unused-vars
      unsafe(query, parameters) {
        // Don't do any work here
      },
    });
  }
});

bench("query - append with parameter and exec", (b) => {
  for (let i = 0; i < b.N; ++i) {
    const q = query``.append(query`foo ${true}`);

    q.exec({
      // eslint-disable-next-line no-unused-vars
      unsafe(query, parameters) {
        // Don't do any work here
      },
    });
  }
});

bench("query - append empty where clause and exec", async (b) => {
  await import("./generated/database/index.js");
  const { fileWhere } = await import("./generated/database/file.js");
  b.resetTime();

  for (let i = 0; i < b.N; ++i) {
    const q = query``.append(
      query`foo ${fileWhere({}, "f.", { skipValidator: true })}`,
    );

    q.exec({
      // eslint-disable-next-line no-unused-vars
      unsafe(query, parameters) {
        // Don't do any work here
      },
    });
  }
});

bench("query - append where clause and exec", async (b) => {
  await import("./generated/database/index.js");
  const { fileWhere } = await import("./generated/database/file.js");

  const uuid1 = uuid();
  const uuid2 = uuid();
  b.resetTime();

  for (let i = 0; i < b.N; ++i) {
    const q = query``.append(
      query`foo ${fileWhere(
        {
          idIn: [uuid1, uuid2],
        },
        "f.",
        { skipValidator: true },
      )}`,
    );

    q.exec({
      // eslint-disable-next-line no-unused-vars
      unsafe(query, parameters) {
        // Don't do any work here
      },
    });
  }
});

bench("query - queryFile ", async (b) => {
  await import("./generated/database/index.js");
  const { queryFile } = await import("./generated/database/file.js");
  b.resetTime();

  for (let i = 0; i < b.N; ++i) {
    const q = queryFile({});

    q.queryPart.exec({
      // eslint-disable-next-line no-unused-vars
      unsafe(query, parameters) {
        // Don't do any work here
      },
    });
  }
});

bench("query - queryFile with where ", async (b) => {
  await import("./generated/database/index.js");
  const { queryFile } = await import("./generated/database/file.js");
  b.resetTime();

  for (let i = 0; i < b.N; ++i) {
    const q = queryFile({
      where: {
        deletedAtIncludeNotNull: true,
      },
    });

    q.queryPart.exec({
      // eslint-disable-next-line no-unused-vars
      unsafe(query, parameters) {
        // Don't do any work here
      },
    });
  }
});

bench("query - queryFile nested ", async (b) => {
  await import("./generated/database/index.js");
  const { queryFile } = await import("./generated/database/file.js");
  b.resetTime();

  for (let i = 0; i < b.N; ++i) {
    const q = queryFile({
      where: {
        deletedAtIncludeNotNull: true,
      },
      group: {},
    });

    q.queryPart.exec({
      // eslint-disable-next-line no-unused-vars
      unsafe(query, parameters) {
        // Don't do any work here
      },
    });
  }
});
