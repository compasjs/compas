# Defining entities

Database entities can be managed in the same structure as well. With support to
generated the query basics and query traversal helpers.

## Getting started

```ts
import { TypeCreator } from "@compas/code-gen";

const T = new TypeCreator("database");

T.object("user")
  .keys({
    name: T.string(),
  })
  .enableQueries({});

// Results in
type DatabaseUser = {
  id: string; // UUID primary key
  name: string;
};

// All kinds of types can be used as fields.
T.object("post")
  .keys({
    title: T.string(),
    createdBy: T.uuid(),
    lastLikedAt: T.date(),
    published: T.bool(),
    metadata: T.object().keys({
      hasCoverImage: T.bool(),
    }),
  })
  .enableQueries({});
```

::: info

The generated output for entities will always end up in the `$output/database/`
directory. You can still use any other group name you like, but it is advised to
use `new TypeCreator("database")` for small to medium sized projects, grouping
all entities declarations in a single file.

:::

## `.enableQueries` options

```ts
import { TypeCreator } from "@compas/code-gen";

const T = new TypeCreator("database");

T.object("user")
  .keys({
    name: T.string(),
  })
  .enableQueries({
    schema: "private",
  }); // Use a schema name in the generated queries.

T.object("user")
  .keys({
    // Supply your own primary key
    id: T.number().primary(),
    name: T.string(),
  })
  .enableQueries({});

// Results in
type DatabaseUser = {
  id: number;
  name: string;
};

T.object("user")
  .keys({
    name: T.string(),
  })
  .enableQueries({
    // Automatically managed `createdAt` and `updatedAt` fields
    withDates: true,
  });

// Results in
type DatabaseUser = {
  id: string; // uuid primary key
  name: string;
  createdAt: Date;
  updatedAt: Date;
};
```

## Searchable

Fields need to be set `.searchable()` explicitly, so they can be used in the
generated filter and order options.

## Relations

Compas supports one-to-one and many-to-one relations between entities.
Many-to-many relations are not supported but can be achieved with multiple
many-to-one relations and an explicit join entity.

```ts
T.object("user")
  .keys({
    // ...
  })
  .enableQueries({})
  .relations(
    // The virtual 1-M side of the relation ship
    T.oneToMany("authoredPosts", T.reference("database", "post")),
  );

T.object("userSettings")
  .keys({
    // ...
  })
  .enableQueries({})
  .relations(
    // Owning side of the 1-1 relation, the virtual side is automatically created
    T.oneToOne("user", T.reference("database", "user"), "settings"),
  );

T.object("post")
  .keys({
    // Explicit primary key
    id: T.number().primary(), // ...
  })
  .enableQueries({})
  .relations(
    // Owning side of the M-1 relation
    T.manyToOne("author", T.reference("database", "user"), "authoredPosts"),
  );

T.object("postSettings")
  .keys({
    // ...
  })
  .enableQueries({})
  .relations(
    // Relations can be optional as well
    T.oneToOne("post", T.reference("database", "post"), "settings").optional(),
  );

// Results in the following types
type DatabaseUser = {
  id: string; // ...
};

type DatabaseUserSettings = {
  id: string;
  user: string; // Primary key of the 'user' entity
  // ...
};

type DatabasePost = {
  id: number;
  author: string; // Primary key of the 'user' entity
};

type DatabasePostSettings = {
  id: string;
  post: number; // Primary key of the 'post' entity
};

// If the target supports query traversal and select entity inclusion you get the most out of
// it; Note that each entity could reference it's relations. So with a single query you can
// get the user, with their settings, all their posts and for each post the post settings.
type QueryResultDatabaseUser = {
  id: string;

  // The optionally included 'userSettings'
  settings?: QueryResultDatabaseUserSettings;

  // The optionally included 'posts'
  authoredPosts?: QueryResultDatabasePost[];
};

type QueryResultDatabaseUserSettings = {
  id: string;

  // If the user is not joined, the primary string is still returned
  user: string | QueryResultDatabaseUser;
};

type QueryResultDatabasePost = {
  id: number;

  settings?: QueryResultDatabasePostSettings;
  author: string | QueryResultDatabaseUser;
};

type QueryResultDatabasePostSettings = {
  id: string;
  post: number | QueryResultDatabasePost;
};
```

## Soft deletes

Entity support also includes a basic soft-delete support

```ts
T.object("user")
  .keys({
    name: T.string(),
  })
  .enableQueries({
    withDates: true,

    // Adds `deletedAt?: Date`
    withSoftDeletes: true,
  });
```

All generated queries will ignore soft deletes by default, except when
specifically included. The exception is for generated delete queries. These will
not ignore already soft deleted records, and always hard delete them.
