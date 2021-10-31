import { TypeCreator } from "@compas/code-gen";

/**
 * @param app
 */
export function applyStoreStructure(app) {
  const T = new TypeCreator("store");

  app.add(
    T.object("imageTransformOptions").keys({
      q: T.number().min(0).max(100).convert().default(75),
      w: T.number().convert(),
    }),

    T.object("jobInterval").keys({
      years: T.number().optional(),
      months: T.number().optional(),
      days: T.number().optional(),
      hours: T.number().optional(),
      minutes: T.number().optional(),
      seconds: T.number().optional(),
    }),

    T.object("sessionStoreSettings").keys({
      accessTokenMaxAgeInSeconds: T.number(),
      refreshTokenMaxAgeInSeconds: T.number(),
      signingKey: T.string().min(20),
    }),

    T.object("file")
      .keys({
        bucketName: T.string().searchable(),
        contentLength: T.number(),
        contentType: T.string(),
        name: T.string(),
        meta: T.object("fileMeta")
          .keys({
            transforms: T.any().optional(),
            transformedFromOriginal: T.string().optional(),
          })
          .default("{}")
          .docs("User definable, optional object to store whatever you want"),
      })
      .enableQueries({ withSoftDeletes: true })
      .relations(),

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

    T.object("session")
      .keys({
        expires: T.date().searchable(),
        data: T.any().default("{}"),
      })
      .enableQueries({ withDates: true }),

    T.object("sessionStore")
      .keys({
        data: T.any().default("{}"),
        revokedAt: T.date().optional(),
      })
      .relations(
        T.oneToMany("accessTokens", T.reference("store", "sessionStoreToken")),
      )
      .enableQueries({
        withDates: true,
      }),

    T.object("sessionStoreToken")
      .keys({
        expiresAt: T.date().searchable(),
        revokedAt: T.date().optional().searchable(),
        createdAt: T.date(),
      })
      .relations(
        T.manyToOne(
          "session",
          T.reference("store", "sessionStore"),
          "accessTokens",
        ),
        T.oneToOne(
          "refreshToken",
          T.reference("store", "sessionStoreToken"),
          "accessToken",
        ).optional(),
      )
      .enableQueries({}),

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
