import { TypeCreator } from "@compas/code-gen";

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
        bucketName: T.string().searchable(),
        contentLength: T.number(),
        contentType: T.string(),
        name: T.string(),
        meta: T.object("fileMeta")
          .keys({})
          .default("{}")
          .docs("User definable, optional object to store whatever you want"),
      })
      .enableQueries({ withSoftDeletes: true })
      .relations(),
  );

  app.add(
    T.object("fileGroup")
      .keys({
        name: T.string().optional(),
        order: T.number()
          .searchable()
          .default("Math.floor(Date.now() / 1000000)")
          .docs("Hack to get an increasing integer by default"),
        meta: T.object("fileGroupMeta")
          .keys({})
          .default("{}")
          .docs("User definable, optional object to store whatever you want"),
      })
      .enableQueries({ withSoftDeletes: true })
      .relations(
        T.oneToOne("file", T.reference("store", "file"), "group").optional(),
        T.manyToOne(
          "parent",
          T.reference("store", "fileGroup"),
          "children",
        ).optional(),
        T.oneToMany("children", T.reference("store", "fileGroup")),
      ),
  );

  app.add(
    T.object("fileGroupView")
      .keys({
        name: T.string().optional(),
        order: T.number(),
        meta: T.object("fileGroupMeta")
          .keys({})
          .default("{}")
          .docs("User definable, optional object to store whatever you want"),
        isDirectory: T.bool().searchable(),
      })
      .enableQueries({ withSoftDeletes: true, isView: true })
      .relations(
        T.oneToOne(
          "file",
          T.reference("store", "file"),
          "groupView",
        ).optional(),
        T.manyToOne(
          "parent",
          T.reference("store", "fileGroupView"),
          "children",
        ).optional(),
        T.oneToMany("children", T.reference("store", "fileGroupView")),
      ),
  );

  app.add(
    T.object("session")
      .keys({
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
        priority: T.number().default("0").min(0),
        scheduledAt: T.date().defaultToNow().searchable(),
        name: T.string().searchable(),
        data: T.any().default("{}"),
        retryCount: T.number().default(0),
        handlerTimeout: T.number().min(1000).optional(),
      })
      .enableQueries({ withDates: true }),
  );
}
