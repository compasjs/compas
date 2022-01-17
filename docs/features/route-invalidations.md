# Route invalidations

::: tip

Requires an understanding of the code generated api and api clients. See
[Code generator HTTP api](/features/code-gen-api.html) for more information.

:::

The Compas structure also allows for defining route invalidations. Route
invalidations are a typed and validated way for specifyig which routes data is
altered on a successful call of a POST, PUT, PATCH or DELETE route. For most
generators, like the `router`, `validator` and `apiClient` this is a noop. But
for caching api clients, like react-query (via the `reactQuery` generator), this
achieves a way to invalidate the cache for all routes, which data has changed as
a result of a successful mutation, with the toggle of an option.

## Structure

The structure is defined via a `.invalidations` function on routes. Lets take a
look at some examples;

```js
const T = new TypeCreator("app");
const R = T.router("/app");

app.add(
  // Example get routes
  R.get("/list", "list").response({}),
  R.get("/:id", "get").params({ id: T.uuid() }).response({}),

  // For operations that mutate all responses in this group, just invalidate the whole group.
  R.post("/shuffle", "shuffle")
    .response({})
    .invalidations(R.invalidates("app")),

  // For operations invalidating a specific route.
  R.post("/", "create")
    .body({})
    .response({})
    .invalidations(R.invalidates("app", "list")),

  // Invalidate multiple routes,
  // Both this update route and `AppGet` define a `id` param, so we can use `useSharedParams` to only invalidate the get route of this specific entity.
  R.put("/:id", "update")
    .params({ id: T.uuid() })
    .response({})
    .invalidations(
      R.invalidates("app", "list"),
      R.invalidates("app", "get", { useSharedParams: true }),
    ),

  // Provide a specification to map properties.
  R.post("/toggle", "toggle")
    .body({
      id: T.uuid(),
    })
    .response({})
    .invalidations(
      R.invalidates("app", "get", {
        specification: {
          params: {
            id: ["body", "id"],
          },
        },
      }),
    ),
);
```

All above examples can be miexed and matched, and the generator will guide you
in the right direction if some invalidation is invalid.

- `useSharedParams` and `useQueryParams` are shorthand properties for populating
  the `specification`. They extract the shared properties of the source and
  target route and build up the specification. Existing `specification`
  properties take precedence over properties that would be defined because of
  `useSharedParams` or `useSharedQuery`.
- The `specification` object is a way of specifying how the target `params` and
  `query` object look like. The arrays of strings define an 'object path' for
  which values of the current route to use.

## Usage

When this definition is used with the `reactQuery` generator, Compas generates
something like the below snippet with based on the above defined R.put("/:id",
"update")`:

```tsx
export function useAppUpdate(
  options: UseMutationOptions = {},
  hookOptions: { invalidateQueries?: boolean } = {},
): UseMutationResult {
  // ... setup

  if (hookOptions?.invalidateQueries) {
    const originalOnSuccess = options.onSuccess;

    options.onSuccess = async (data, variables, context) => {
      await queryClient.invalidateQueries(["app", "list"]);
      await queryClient.invalidateQueries([
        "app",
        "get",
        { id: variables.params.id },
      ]);

      if (typeof originalOnSuccess === "function") {
        return await originalOnSuccess(data, variables, context);
      }
    };
  }

  // ... call useMutation
}
```

As you can see, Compas does not call the invalidations by default,
`hookOptions.invalidateQueries` has to be truthy for that to happen. It will
also handle and call the `onSuccess` option if defined. Read the
[react-query docs](https://react-query.tanstack.com/guides/query-invalidation#_top)
about Query invalidation for more information.
