import { TypeCreator } from "@lbu/code-gen";

/**
 * @param app
 */
export function applyStoreStructure(app) {
  const T = new TypeCreator("store");

  app.add(
    T.object("jobInterval").keys({
      years: T.number().optional(),
      months: T.number().optional(),
      days: T.number().optional(),
      hours: T.number().optional(),
      minutes: T.number().optional(),
      seconds: T.number().optional(),
    }),
  );

  app.add(
    T.object("file")
      .keys({
        id: T.uuid().primary(),
        bucketName: T.string().searchable(),
        contentLength: T.number(),
        contentType: T.string(),
        name: T.string(),
        meta: T.object("fileMeta")
          .keys({})
          .default("{}")
          .docs("User definable, optional object to store whatever you want"),
      })
      .enableQueries({ withSoftDeletes: true }),
  );

  app.add(
    T.object("session")
      .keys({
        id: T.uuid().primary(),
        expires: T.date().searchable(),
        data: T.any().default("{}"),
      })
      .enableQueries({ withDates: true }),
  );

  app.add(
    T.object("job")
      .keys({
        id: T.number().primary(),
        isComplete: T.bool().default("false").searchable(),
        priority: T.number().default("0"),
        scheduledAt: T.date().defaultToNow().searchable(),
        name: T.string().searchable(),
        data: T.any().default("{}"),
      })
      .enableQueries({ withDates: true }),
  );
}
