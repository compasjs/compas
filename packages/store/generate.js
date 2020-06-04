import { TypeCreator } from "@lbu/code-gen";

export function applyStructure(app) {
  const T = new TypeCreator("store");

  app.add(
    T.object("fileStore", {
      id: T.uuid().primary(),
      bucketName: T.string().searchable(),
      contentLength: T.number(),
      contentType: T.string(),
      filename: T.string(),
    }).enableQueries({ withHistory: true }),
  );

  app.add(
    T.object("sessionStore", {
      id: T.uuid().searchable(),
      expires: T.date(),
      data: T.any().default("{}"),
    }).enableQueries({ withDates: true }),
  );

  app.add(
    T.object("jobQueue", {
      id: T.number().primary(),
      isComplete: T.bool().default("false").searchable(),
      priority: T.number().default("0"),
      scheduledAt: T.date().defaultToNow().searchable(),
      name: T.string().searchable(),
      data: T.any().default("{}"),
    }).enableQueries({ withDates: true }),
  );
}
