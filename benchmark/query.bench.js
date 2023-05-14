import { bench, mainBenchFn } from "@compas/cli";
import { uuid } from "@compas/stdlib";
import { query } from "@compas/store";

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
  await import("../packages/store/src/generated/common/database.js");
  const { sessionStoreWhere } = await import(
    "../packages/store/src/generated/database/sessionStore.js"
  );
  b.resetTime();

  for (let i = 0; i < b.N; ++i) {
    const q = query``.append(query`foo
    ${sessionStoreWhere({}, { shortName: "ss.", skipValidator: true })}`);

    q.exec({
      // eslint-disable-next-line no-unused-vars
      unsafe(query, parameters) {
        // Don't do any work here
      },
    });
  }
});

bench("query - append where clause and exec", async (b) => {
  await import("../packages/store/src/generated/common/database.js");
  const { sessionStoreWhere } = await import(
    "../packages/store/src/generated/database/sessionStore.js"
  );

  const uuid1 = uuid();
  const uuid2 = uuid();
  b.resetTime();

  for (let i = 0; i < b.N; ++i) {
    const q = query``.append(query`foo
    ${sessionStoreWhere(
      {
        idIn: [uuid1, uuid2],
      },

      { shortName: "ss.", skipValidator: true },
    )}`);

    q.exec({
      // eslint-disable-next-line no-unused-vars
      unsafe(query, parameters) {
        // Don't do any work here
      },
    });
  }
});

bench("query - querySessionStore ", async (b) => {
  await import("../packages/store/src/generated/common/database.js");
  const { querySessionStore } = await import(
    "../packages/store/src/generated/database/sessionStore.js"
  );
  b.resetTime();

  for (let i = 0; i < b.N; ++i) {
    const q = querySessionStore({});

    q.queryPart.exec({
      // eslint-disable-next-line no-unused-vars
      unsafe(query, parameters) {
        // Don't do any work here
      },
    });
  }
});

bench("query - querySessionStore with where ", async (b) => {
  await import("../packages/store/src/generated/common/database.js");
  const { querySessionStore } = await import(
    "../packages/store/src/generated/database/sessionStore.js"
  );
  b.resetTime();

  for (let i = 0; i < b.N; ++i) {
    const q = querySessionStore({
      where: {},
    });

    q.queryPart.exec({
      // eslint-disable-next-line no-unused-vars
      unsafe(query, parameters) {
        // Don't do any work here
      },
    });
  }
});

bench("query - querySessionStore nested ", async (b) => {
  await import("../packages/store/src/generated/common/database.js");
  const { querySessionStore } = await import(
    "../packages/store/src/generated/database/sessionStore.js"
  );
  b.resetTime();

  for (let i = 0; i < b.N; ++i) {
    const q = querySessionStore({
      where: {},
      accessTokens: {},
    });

    q.queryPart.exec({
      // eslint-disable-next-line no-unused-vars
      unsafe(query, parameters) {
        // Don't do any work here
      },
    });
  }
});
