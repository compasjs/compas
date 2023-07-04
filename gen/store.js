import { TypeCreator } from "@compas/code-gen";

/**
 * @param {import("@compas/code-gen").Generator} generator
 */
export function applyStoreStructure(generator) {
  const T = new TypeCreator("store");

  generator.add(
    T.object("imageTransformOptions")
      .docs(
        `Set as '.query(T.reference("store", "imageTransformOptions"))' of routes that use 'sendTransformedImage'.`,
      )
      .keys({
        q: T.number().min(1).max(100).default(75),
        w: T.anyOf().values(T.number().min(1).max(99999), "original"),
      })
      .loose(),

    T.object("secureImageTransformOptions")
      .docs(
        `Set as '.query(T.reference("store", "secureImageTransformOptions"))' of routes that use 'sendTransformedImage' and 'fileVerifyAccessToken'.`,
      )
      .keys({
        accessToken: T.string(),
        q: T.number().min(1).max(100).default(75),
        w: T.anyOf().values(T.number().min(1).max(99999), "original"),
      })
      .loose(),

    T.object("fileResponse").keys({
      id: T.uuid(),
      name: T.string(),
      contentType: T.string(),
      originalWidth: T.number().optional(),
      originalHeight: T.number().optional(),
      url: T.string(),
      placeholderImage: T.string().optional(),
      altText: T.string().optional(),
    }),

    T.object("file")
      .docs(`Postgres based file storage.`)
      .keys({
        bucketName: T.string().searchable(),
        contentLength: T.number(),
        contentType: T.string(),
        name: T.string(),
        meta: T.object("fileMeta")
          .keys({
            transforms: T.any().optional(),
            transformedFromOriginal: T.string().optional(),
            originalWidth: T.number().optional(),
            originalHeight: T.number().optional(),
            placeholderImage: T.string().optional(),
            altText: T.string().optional(),
          })
          .default("{}")
          .docs("User definable, optional object to store whatever you want"),
      })
      .enableQueries({ withDates: true })
      .relations(),

    T.object("sessionStore")
      .docs(`Session data store, used by 'sessionStore*' functions.`)
      .keys({
        data: T.any().default("{}"),
        checksum: T.string(),
        revokedAt: T.date().optional(),
      })
      .relations(
        T.oneToMany("accessTokens", T.reference("store", "sessionStoreToken")),
      )
      .enableQueries({
        withDates: true,
      }),

    T.object("sessionStoreToken")
      .docs(`Store all tokens that belong to a session.`)
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
      .docs(
        `
      Postgres based job queue.
      Use {@link queueWorkerAddJob} to insert new jobs in to the queue and {@link queueWorkerRegisterCronJobs} for all your recurring jobs.
      Use {@link queueWorkerCreate} as a way to pick up jobs.
      `,
      )
      .keys({
        id: T.number().primary(),
        isComplete: T.bool().default("false").searchable(),
        priority: T.number().default("0").min(0),
        scheduledAt: T.date().defaultToNow().searchable(),
        name: T.string().searchable(),
        data: T.any().default("{}"),
        retryCount: T.number().default(0),
        handlerTimeout: T.number().min(0).optional(),
      })
      .enableQueries({ withDates: true }),
  );
}
