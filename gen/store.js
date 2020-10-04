import { TypeCreator } from "@lbu/code-gen";

/**
 * @param app
 */
export function applyStoreStructure(app) {
  const T = new TypeCreator("store");

  app.add(
    T.object("file")
      .keys({
        id: T.uuid().primary(),
        bucketName: T.string().searchable(),
        contentLength: T.number(),
        contentType: T.string(),
        name: T.string(),
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
