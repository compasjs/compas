import { TypeCreator } from "@lbu/code-gen";

export function applyStructure(app) {
  const T = new TypeCreator("store");

  app.add(
    T.object("fileStore", {
      id: T.uuid().primary(),
      bucket_name: T.string().searchable(),
      content_length: T.number(),
      content_type: T.string(),
      filename: T.string(),
      created_at: T.date().defaultToNow(),
      updated_at: T.date().defaultToNow(),
    }).enableQueries(),
  );

  app.add(
    T.object("sessionStore", {
      id: T.uuid().searchable(),
      expires: T.date(),
      data: T.any().default("{}"),
    }).enableQueries(),
  );

  app.add(
    T.object("jobQueue", {
      id: T.number().primary(),
      is_complete: T.bool().default("false").searchable(),
      priority: T.number().default("0"),
      scheduled_at: T.date().defaultToNow().searchable(),
      created_at: T.date().defaultToNow(),
      updated_at: T.date().optional().searchable(),
      name: T.string().searchable(),
      data: T.any().default("{}"),
    }).enableQueries(),
  );
}
