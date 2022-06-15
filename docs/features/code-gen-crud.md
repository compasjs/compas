# Code generator CRUD

Compas code-gen also supports generating CRUD routes. It combines the features
of the [api generator](/features/code-gen-api-client.html),
[sql generator](/features/code-gen-sql.html) and a generated implementation of
the necessary events.

::: tip

Requires `@compas/cli`, `@compas/stdlib`, `@compas/store` and `@compas/code-gen`
to be installed.

:::

## The features

CRUD generation supports quiet a variety of features and combinations there of.
Let's break them all down;

### Route selection:

Any CRUD declaration fully controls which routes are generated, by explicitly
enabling them.

```js
const T = new TypeCreator("tag");
const Tdatabase = new TypeCreator("database");

Tdatabase.object("tag")
  .keys({
    key: T.string().searchable().trim().min(3),
    value: T.string(),
  })
  .enableQueries({
    withDates: true,
  });

T.crud("/tag").entity(T.reference("database", "tag")).routes({
  listRoute: true,
  singleRoute: true,
  createRoute: true,
  updateRoute: true,
  deleteRoute: true,
});
```

Combining all options, it generates the following routes;

- `apiTagList` / `/tag/list`
- `apiTagSingle` / `/tag/:tagId/single`
- `apiTagCreate` / `/tag/create`
- `apiTagUpdate` / `/tag/:tagId/update`
- `apiTagDelete` / `/tag/:tagId/delete`

### Filters, sorting and pagination:

The generated `list` route comes fully equipped with filters, sorting and
pagination. The filters are a subset of the filters as supported by the query
builder, ie ignoring `$raw` and `$or` to prevent SQL injection and too complex
filters respectively. Sorting is also based on the current query builder
behaviour where you specify the columns to be sorted on in `orderBy` and a
seperated `orderBySpec` to determine the sort order for that column. And finally
pagination is supported via the `offset` and `limit` params.

### Inline relations

The CRUD generator can also include inline relations in the response, but also
allow creating and updating them via their respective routes. This works for
both `oneToMany` relations as for the referenced side of an `oneToOne` relation.
These inline relations can be added via `.inlineRelations()` like the following;

```js
const T = new TypeCreator("post");
const Tdatabase = new TypeCreator("database");

Tdatabase.object("post")
  .keys({
    title: T.string().searchable(),
  })
  .enableQueries({
    withDates: true,
  })
  .relations(T.oneToMany("tags", T.reference("database", "tag")));

Tdatabase.object("tag")
  .keys({
    key: T.string().searchable().trim().min(3),
    value: T.string(),
  })
  .enableQueries({
    withDates: true,
  })
  .relations(T.manyToOne("post", T.reference("database", "post"), "tags"));

T.crud("/post")
  .entity(T.reference("database", "post"))
  .routes({
    listRoute: true,
    createRoute: true,
    updateRoute: true,
  })
  .inlineRelations(T.crud().fromParent("tags", { name: "tag" }));
```

The above generates approximately the following type for both the read routes,
like `apiPostList`, as well as for the write routes like `apiPostCrete` and
`apiPostUpdate`.

```
type PostItem = {
  id: string;
  title: string,
  tags: { id: string, key: string, value: string }[]
}
```

When updating an inline relation, all existing values are first removed, before
the new values are added. `oneToOne` relations are mandatory by default, but can
be made optional via `T.crud().fromParent(...).optional()`. Inline relations can
be nested as many times as required.

### Nested relations

The same thing as above can be done but now with `.nestedRelations`. This
creates a nested route structure.

```js
// Using the same Post -> tags[] relation like above

T.crud("/post")
  .entity(T.reference("database", "post"))
  .routes({
    listRoute: true,
    singleRoute: true,
    createRoute: true,
    updateRoute: true,
    deleteRoute: true,
  })
  .nestedRelations(
    T.crud("/tag").fromParent("tags", { name: "tag" }).routes({
      // Routes need to be enabled
      listRoute: true,
      singleRoute: true,
      createRoute: true,
      updateRoute: true,
      deleteRoute: true,
    }),
  );
```

This generates the following routes:

- `apiPostList` / `/post/list`
- `apiPostSingle` / `/post/:postId/single`
- `apiPostCreate` / `/post/create`
- `apiPostUpdate` / `/post/:postId/update`
- `apiPostDelete` / `/post/:postId/delete`
- `apiPostTagList` / `/post/:postId/taglist`
- `apiPostTagSingle` / `/post/:postId/tag/:tagId/single`
- `apiPostTagCreate` / `/post/:postId/tag/create`
- `apiPostTagUpdate` / `/post/:postId/tag/:tagId/update`
- `apiPostTagDelete` / `/post/:postId/tag/:tagId/delete`

Appropriate route invalidations for react-query generator are automatically
added in all cases. In case a nested relation is used with a `oneToOne`
relation, the `list` route is automatically disabled, and the extra route params
are removed.

## TODO

- hooks
- fields readable, writable
