# Code generator SQL

Compas code-gen also supports defining a relational schema. And is able to
generate all necessary queries for all common use cases.

::: tip

Requires `@compas/cli`, `@compas/stdlib`, `@compas/store` and `@compas/code-gen`
to be installed.

:::

## Getting started

In the [validator & type generator](/features/code-gen-validators.html) we have
seen how to utilize the Compas type system to generate types and validators.
Here we are building a separate system. Most of the time your relational model
does not reflect the needs of your API consumers. To reflect that Compas advises
to keep the types defining a database schema separate from the rest. Compas also
does this by forcing the sql generator to output all it's files in a
`$outputDirectory/database` directory.

## Defining the schema

At the root, a database schema in Compas is a `T.object()` that defines some
keys, and calls `.enableQueries()` so it is picked up by the generator.

Let's start with writing a database schema to represent a blog post.

```js
const T = new TypeCreator("database");

app.add(
  T.object("post")
    .keys({
      title: T.string().searchable(),
      body: T.string(),
      isPublished: T.bool().searchable().default(false),
    })
    .enableQueries({
      withPrimaryKey: true, // This is a default, and adds a `id: T.uuid()` to our keys.
      withDates: true, // Add's a `createdAt` and `updatedAt` field for us
    }),
);
```

Make sure to add `sql` to your generators and generate again. Take a look in
your generated directory and see what's generated. Some things include:

- The `DatabasePost` type
- A new `database` directory containing a `post.js` that contains our queries
- An `queries` export in `database/index.js` that collects all our CRUD queries
- An example for the necessary Postgres DDL (ie `CREATE TABLE` queries) in
  `common/structure.sql`.

## CRUD

The `queries` export from `database/index.js` contains typed CRUD related
queries. All values are automatically escaped to prevent injection attacks.
Let's take a look at them by example;

**Inserts**:

```js
// A single insert
const [post] = await queries.postInsert(sql, {
  title: "My first post",
  body: "...",
});
// post => { id: "some uuid", title: "My first post", body: "...", isPublished: false, createdAt: ..., updatedAt: ... }

// Multiple inserts
const posts = await queries.postInsert(sql, [
  { title: "Post1", body: "..." },
  { title: "Post2", body: "..." },
]);
// posts => [{ id: "some uuid", title: "Post1", ... }, { id: "other uuid", title: "Post2", ... }]

// With relation
const [category] = await queries.categoryInsert(sql, { name: "Category 1" });
const [post] = await queries.postInsert(sql, {
  title: "My post",
  body: "...",
  category: category.id,
});
// post => { id: "some-uuid", title: "My post", category: "category.id uuid", ... }
```

**Updates**:

```js
// Update single field, without returning the new row
await queries.postUpdate(sql, {
  update: { isPublished: true },
  where: { id: post.id },
});

// Update single field, return all fields
const [updatedPost] = await queries.postUpdate(sql, {
  update: { isPublished: true },
  where: { id: post.id },
  returning: "*",
});
// updatedPost => { id: post.id, title: post.title, isPublished: true }

// Update fields, return some fields
const [updatedPost] = await queries.postUpdate(sql, {
  update: { isPublished: true, title: "New post title" },
  where: { id: post.id },
  returning: ["id", "title"],
});
// updatedPost => { id: post.id, title: "New post title" }
```

**Deletes**:

```js
// Delete with the provided where clause
await quries.postDelete(sql, {
  id: post.id,
});
```

**Selects**:

The missing part here are 'selects'. These are handled by `queryEntity`
functions exported from the `database/entity.js` files, in our case `queryPost`
in `database/post.js`. These are fully typed as well, and the input is validated
or escaped before it is transformed in to a query. The result of the query is
then transformed to conform to the types. The most important transformers being
converting `T.date()` columns to JS Date objects and `null` values to
`undefined`.

```js
// Plain select
const posts = await queryPost().exec(sql);
// posts => [{ ... }, { ... }]

// Select with where clause
const publishedPosts = await queryPost({
  where: {
    isPublished: true,
  },
}).exec(sql);

// Or with a limit and offset
const paginatedPosts = await queryPost({
  limit: 5,
  offset: 10,
}).exec(sql);

// Applying custom ordering
// `orderBy` is used to apply ordering in that order,
// and `orderBySpec` can be used to provide the sort specification.
const orderedResults = await queryPost({
  orderBy: ["title"],
  orderBySpec: { title: "DESC" },
}).exec(sql);
```

All above things can of course freely be combined. Another note here is that
`orderBy` and `where` are based on fields defined with `.searchable()` in the
Compas structure. This is done to make it more explicit what the main search
fields are of an entity and thus may be good candidates for PostgreSQL indices.

## Relations and traversal

A relational database is not useful if you can not have relations between
entities. Compas also supports the most common ways of modelling them and
provides a query builder to query an entity with its relations mapped in a
single Postgres query.

Let's take a look at how that works, by creating a model with the following
entities and their relations;

- Category entity
  - Can be linked to Posts
- User entity
  - Has optional settings
  - Has written Posts
- UserSetting entity
  - Belongs to User
- Post entity
  - Written by User
  - Can have linked Categories

```js
const T = new TypeCreator("database");

app.add(
  T.object("category")
    .keys({
      /* ... */
    })
    .relations(
      T.oneToMany("linkedPosts", T.reference("database", "postCategory")),
    )
    .enableQueries({}),

  T.object("user")
    .keys({
      /* ... */
    })
    .relations(
      // 'Virtual' side of the relation
      // 'posts' should be the same name as the last argument to the 'manyToOne'
      T.oneToMany("posts", T.reference("database", "post")),
    )
    .enableQueries({
      /* ... */
    }),

  T.object("userSettings")
    .keys({
      /* ... */
    })
    .relations(
      // Owning side of a one-to-one relation
      // The 'virtual' side is automatically added
      T.oneToOne("user", T.reference("database", "user"), "settings"),
    )
    .enableQueries({}),

  T.object("post")
    .keys({
      /* ... */
    })
    .relations(
      // Owning side of the relation, a field is added named 'writer'
      //  which has the same type as the primary key of 'user'.
      T.manyToOne("writer", T.reference("database", "user"), "posts"),

      T.oneToMany("linkedCategories", T.reference("database", "postCategory")),
    )
    .enableQueries({
      /* ... */
    }),

  // Many-to-many relations need a join table, this is not automatically done by Compas
  // The join table consists of two manyToOne relations
  T.object("postCategory")
    .keys({
      /* ... */
    })
    .relations(
      T.manyToOne("post", T.reference("database", "user"), "linkedCategories"),
      T.manyToOne(
        "category",
        T.reference("database", "category"),
        "linkedPosts",
      ),
    )
    .enableQueries({}),
);
```

After regeneration, quite a bunch of code is added. See `common/structure.sql`
for how Compas suggests you to create the necessary entities and foreign keys.

With all the information that you have added in the `.relations` calls, Compas
can create queries that join relations and nest the result set automatically. In
most of these example we use `[varName]`, this is for illustrative purposes
only, all calls will return an array with the results. Let's look at some
examples;

**One-to-one**:

```js
// Get user, but don't add join
const [user] = await queryUser({}).exec(sql);
// user => user.settings (undefined)

// Get user settings with the user.
// 'settings' has an 'undefined' type, cause you can insert a user
// without inserting settings for them.
const [user] = await queryUser({
  settings: {},
}).exec(sql);
// user => user.settings (undefined|DatabaseUserSettings)

// Get settings, but don't join user.
// Since UserSettings is the owning side of the relation,
// the returned entity will have the 'id' from User.
const [userSettings] = await queryUserSettings({}).exec(sql);
// userSettings => userSettings.user (string, user.id)

// Get the settings and the user
const [userSettings] = await queryUserSettings({
  user: {},
}).exec(sql);
// userSettings => userSetting.user (DatabaseUser)
```

**Many-to-one**:

From the owning side, this behaves the same as the 'One-to-one' owning side.

```js
// Get post, but don't join writer
const [post] = await queryPost({}).exec(sql);
// post => post.writer (string, user.id);

// Get post with the writer
const [post] = await queryPost({
  writer: {},
}).exec(sql);
// post => post.writer (DatabaseUser)
```

**One-to-many**:

```js
// Get user with posts
const [user] = await queryUser({
  posts: {},
}).exec(sql);
// user => user.posts (DatabasePost[])

// Get post with categories.
// Need to traverse to many-to-one relations
const [post] = await queryPost({
  linkedCategories: {
    category: {},
  },
}).exec(sql);
// post => post.linkedCategories (DatabasePostCategory[])
// post => post.linkedCategories[0].category (DatabaseCategory[])
// post => post.linkedCategories[0].post (string, join is not added)
```

**Combined**:

All relations can freely be combined. So you can query categories named 'sql' or
'code-gen' with all posts in the category and their writer like so:

```js
const categories = await queryCategories({
  // Joins
  linkedPosts: {
    post: {
      writer: {},
    },
  },

  // Only query sql and code-gen categories
  where: {
    nameIn: ["sql", "code-gen"],
  },

  // Order by category.name ASC
  orderBy: ["name"],
  orderBySpec: {
    name: "ASC",
  },
});
```

## Where options

All searchable fields and fields used in relations can be used in where clauses.
The values used in where-clauses are validated and escaped, so user input can be
used.

```js
const users = await queryUser({
  where: {
    name: "Jan",
  },
}).exec(sql);
// select * from "user" u WHERE u.name = 'Jan';

const users = await queryUser({
  where: {
    ageGreaterThan: 18,
  },
}).exec(sql);
// select * from "user" u WHERE u.age > 18;

const users = await queryUser({
  where: {
    nameILike: "de Vries",
    roleIn: ["moderator", "admin"],
  },
}).exec(sql);
// select * from "user" u WHERE u.name ILIKE '%de Vries%' AND role = ANY(ARRAY['moderator', 'admin'])

const users = await queryUser({
  where: {
    $or: [
      {
        nameILike: "de Vries",
        roleIn: ["moderator", "admin"],
      },
      {
        id: uuid(),
      },
    ],
  },
}).exec(sql);
// select * from "user" u WHERE (u.name ILIKE '%de Vries%' AND role = ANY(ARRAY['moderator', 'admin'])) OR (u.id = 'uuid-value')

const users = await queryUser({
  where: {
    settingsNotExists: {
      // nested where clause
    },
  },
}).exec(sql);
// select * from "user" u WHERE NOT EXISTS (select from "userSettings" us WHERE us.user = u.id);

const users = await queryUser({
  where: {
    // Useful for jsonb fields, or if field is not searchable
    $raw: query`u."emailPreferences"->>'receiveNewsletter' = true`,
  },
}).exec(sql);
// select * from "user" u WHERE (u."emailPreferences"->>'receiveNewsletter' = true);
```

Another useful option provided by the where clause are the `viaXxx` options.
This allows you to query results from table `X` via their relation to table `Y`.
It results in queries that can span across over multiple tables to fetch results
with only a single piece of information that may not be immediately related to
what you need. For example:

```js
const postsForUser = await queryPost({
  where: {
    viaWriter: {
      where: {
        name: "Docs author",
      },
    },
  },
}).exec(sql);

const categoriesThatUserHasPostIn = await queryCategory({
  where: {
    viaLinkedPosts: {
      where: {
        viaPost: {
          where: {
            viaWriter: {
              where: {
                name: "Docs author",
              },
            },
          },
        },
      },
    },
  },
});

const dashboardsForAllGroupsThatAUserIsIn = await queryDashboard({
  where: {
    // Owner is in this case a group
    viaOwner: {
      where: {
        viaUsers: {
          where: {
            id: user.id,
          },
        },
      },
    },
  },
}).exec(sql);
```

## Atomic updates

The generated update queries, can do a bit more than partial updates. Atomic
updates are supported as well. This way you can safely execute some operators on
the existing value, utilizing Postgres. This prevents race-conditions in your
code between the select of some value and the update of that value.

Multiple atomic updates can be combined in the same update query, however, only
a single atomic update can be done per column. This is also enforced in the
types and validators. Let's look at some examples, based on the column type.

**Booleans**:

```js
// Flip the boolean value
await queries.jobUpdate(sql, {
  update: {
    isComplete: {
      $negate: true,
    },
  } /* ... */,
});
```

**Numbers**:

```js
// Add to the balance field
await queries.userUpdate(sql, {
  update: {
    balance: {
      $add: 5,
    },
  } /* ... */,
});

// Subtract from the balance field
await queries.userUpdate(sql, {
  update: {
    balance: {
      $subtract: 5,
    },
  } /* ... */,
});

// $multiply and $divide are supported as well
```

**Strings**:

```js
// Flip the boolean value
await queries.userUpdate(sql, {
  update: {
    personalNotes: {
      $append: "\nSome important addition.",
    },
  } /* ... */,
});
```

**Dates**

This uses Postgres intervals, see the
[Postgres docs](https://www.postgresql.org/docs/current/functions-datetime.html)
for supported intervals

```js
await queries.userUpdate(sql, {
  update: {
    licenseValidTill: {
      $add: "1 year 2 months 3 hours",
    },
  } /* ... */,
});

// Oops, conditions of our virtual buddy are not great
await queries.virtualBuddyUpdate(sql, {
  update: {
    virtualLifeExpectancy: {
      $subtract: "2 hours 3 seconds",
    },
  } /* ... */,
});
```

**Jsonb**:

These values are not thoroughly validated, so use with caution. `$set` uses
[jsonb_set](https://www.postgresql.org/docs/current/functions-json.html)
behavior.

```js
// Disable email notifications of watched issues
await queries.userUpdate(sql, {
  update: {
    emailPreferences: {
      $set: {
        path: ["subscriptions", "watchedIssues"],
        value: false,
      },
    },
  },
  /* ... */
});

// Remove all subscriptions
await queries.userUpdate(sql, {
  update: {
    emailPreferences: {
      $remove: {
        path: ["subscriptions"],
      },
    },
  },
  /* ... */
});
```

## Date and time handling

Compas uses `timestampt` for `T.date()` types. This ensures that you can insert
any date with timezone, and instruct Postgres to return them in whatever
timezone you want. Any query, except `queryBuilder.execRaw()`, will return
JavaScript Date objects.

There is also `T.date().dateOnly()` which uses a Postgres `date` column. Compas
makes sure that the Postgres client doesn't convert these to dates, but instead
always handles them in the form of `YYYY-MM-DD` in selects, inserts and
where-clauses. `T.date().timeOnly()` works almost the same and uses a
`time without timezone` column. Inserts and where clauses can use
`HH:MM(:SS(.mmm))` strings, but selects are always returned as `HH:MM:SS(.mmm)`.

To get this behaviour, Compas ensures that connections created via
`newPostgresConnection` from @compas/store, disable any conversion to JavaScript
Date objects for any `date` & `time` columns.

## Other constraints

The sql generator has quite a few constraints and checks that it checks before
generating any code.

// TODO: reference them and their solutions
