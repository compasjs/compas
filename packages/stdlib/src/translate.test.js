import { syncData } from "./translate.js";

export const test = t => {
  t.test("syncData", t => {
    const data = { en: { foo: "bar" }, nl: { baz: "quix" } };

    t.ok(syncData(data));
    t.deepEqual(data, {
      en: { foo: "bar", baz: "baz" },
      nl: { baz: "quix", foo: "foo" },
    });

    t.end();
  });
};
