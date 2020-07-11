import { TypeCreator } from "@lbu/code-gen";

/**
 * @param app
 */
export function applyStructure(app) {
  const T = new TypeCreator("store");

  app.add(
    T.object("fileStore")
      .keys({
        id: T.uuid().primary(),
        bucketName: T.string().searchable(),
        contentLength: T.number().integer(),
        contentType: T.string(),
        filename: T.string(),
      })
      .enableQueries({ withHistory: true }),
  );

  app.add(
    T.object("sessionStore")
      .keys({
        id: T.uuid().primary(),
        expires: T.date().searchable(),
        data: T.any().default("{}"),
      })
      .enableQueries({ withDates: true }),
  );

  app.add(
    T.object("jobQueue")
      .keys({
        id: T.number().primary().integer(),
        isComplete: T.bool().default("false").searchable(),
        priority: T.number().default("0").integer(),
        scheduledAt: T.date().defaultToNow().searchable(),
        name: T.string().searchable(),
        data: T.any().default("{}"),
      })
      .enableQueries({ withDates: true }),
  );
}
