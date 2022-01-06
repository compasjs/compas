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

## Insert, select, update and delete

// TOOD: Add more body

```js
const [post] = await queries.postInsert(sql, {
  title: "My first post",
  body: "...",
});
// => { id: "some uuid", title: "My first post", body: "...", isPublished: false, createdAt: ..., updatedAt: ... }

const [updatedPost] = await queries.postUpdate(
  sql,
  { isPublished: true },
  { id: post.id },
);

const foundPosts = await queryPost({
  where: {
    isPublished: true,
  },
}).exec(sql);

await queries.postDelete(sql, {
  id: post.id,
});
```

**Dates and times**:

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

## Relations

// TODO: Add relations

## A closer look at the supported where clause

// TODO: breakdown of all options

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

const categoriesThatUserWroteFor = await queryCategory({
  where: {
    viaPosts: {
      where: {
        viaWriter: {
          where: {
            name: "Docs author",
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
