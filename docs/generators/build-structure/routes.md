# Defining routes

Compas code-gen also supports defining routes in your structure. The main use case for
this is when you are building an API. It is also an option if an API you are using does
not provide a Compas structure or OpenAPI specification.

## Getting started

Route definitions built on top of the `TypeCreator` that we use for defining types.

```ts
import { Generator, TypeCreator } from "@compas/code-gen";
import { generate } from "@vue/compiler-core";

const generator = new Generator();
const T = new TypeCreator("user");

// Provide a base path for this flow or group of routes.
const R = T.router("/user");

generator.add(
	// Adds to the base path, forming `GET /user/list`.
	// The group name `user` and route name `list` are used in the api client name (`apiUserList()`) and in the controllers of the generated router (`userHandlers.list`).
	R.get("/list", "list").docs(`
  This doc block is added to the api client functions and route controllers. Use this to convey things like errors.
  `),
);
```

## GET, POST, PUT, DELETE

The router supports a selection of HTTP methods.

```ts
const T = new TypeCreator("user");
const R = T.router("/user");

generator.add(
	R.get("/list", "list"), // `GET /user/list`

	R.post("/", "create"), // `POST /user/`
	// Trailing slashes are ignored by Compas, so this matches both `POST /user/` and `POST
	// /user`

	R.put("/update", "update"), // `PUT /user/update`

	R.delete("/", "delete"), // `DELETE /user/`
	// Note that this uses the same path as `R.post("/", "create")`. The combination of HTTP
	// method and full path should be unique across all routes.
);
```

## Path parameters

Compas supports parameterizing path segments. This requires also providing the types of
those path segments so they can be validated.

```ts
const T = new TypeCreator("user");
const R = T.router("/user");

R.get("/:userId", "single").params({
	userId: T.uuid(),
});
// This matches `/user/d5bfd06e-8a4f-483d-9038-88c63c98916e`
// And matches `/user/foo`, but the validators will error, since `foo` is not a valid uuid.
// `.params()` accepts a `T.object()` which we used the inferred notation for above.

// Multiple parameters are allowed as well.
R.get("/:userId/favorites/:favoriteId", "favoriteSingle").params({
	userId: T.uuid(),
	favoriteId: T.number(),
});
// This matches `/user/02e1f672-7443-42d1-806b-df2028c4b48e/favorites/5`
// The `favoriteId` (`5`) is automatically converted to a number.
```

Note that Compas enforces all path parameters to also be typed via `.params()`. Compas
also supports [`catch all routes`](#catch-all-routes) for optional parameters.

## Catch all routes

Catch all routes can be used to match on optional path parameters and match on any number
of path segments.

```ts
const T = new TypeCreator("user");
const R = T.router("/user");

R.get("/content/*", "content");
// Matches `/content`, `/content/123`, `/content/123/abc` etc

R.get("/content/list", "contentList");
// Now `/content/list` will be matched by this route, but `/content/list/foo` will still match
// the above catch all.
```

## Query parameters

Keeping the trend of typing the route inputs, query parameters can be typed and validated
as well.

```ts
const T = new TypeCreator("user");
const R = T.router("/user");

R.get("/list", "list").query({
	offset: T.number().default(0),
});
// When `/user/list` is called the validated query parameters will be set to `{ offset: 0 }`
// `/user/list?offset=50` will correctly match and validate as well.

R.get("/:userId/favorites", "favoriteList").query({
	offset: T.number().default(0),
	limit: T.number().max(50),
});
```

## Body

Defining a validated request body can be done as well.

```ts
R.post("/", "create").body({
	name: T.string(),
	email: T.string()
		.pattern(/^\S+@\S+\.\S+$/)
		.lowerCase(),
	emailPreferences: {
		marketing: T.bool(),
		releases: T.bool(),
	},
});
```

## Response

Most generated routers will apply response validation before sending the response.

```ts
R.get("/list", "list").response({
	total: T.number(),
	users: [
		{
			id: T.uuid(),
			name: T.string(),
		},
	],
});
```

## File handling

File handling is dependent on the used router target and api client. The browser api
client generators will for example use `Blob`, while the Node.js target will use streams.

```ts
// Sending a single file
R.get("/avater", "avater").response(T.file());

// Receiving a file.
R.post("/:userId/avatar").params({ userId: T.uuid() }).files({
	avatar: T.file(),
});
```

## Idempotent

Compas supports marking `R.post()` calls with `.idempotent()`. This conveys to the api
client generators that the call is without side effects and thus repeatable like `GET`
requests. This allows you to add a request body, which can use the full suite of nested
Compas types.

```ts
R.post("/list", "list")
	.idempotent()
	.body({
		filters: {
			isActive: T.boolean(),
			tagsIn: [T.string()],
		},
	});
```

## Invalidations

Some api clients will automatically cache and dedupe `GET` requests based on the group
name, route name and inputs (params, query and body). As the API developer you know which
routes will be affected by calls `R.post()`, `R.put()` and `R.delete()` routes. By adding
this information to the structure, those api clients can automatically invalidate the
caches and execute the necessary requests.

```ts
import { TypeCreator } from "@compas/code-gen";

const T = new TypeCreator("user");
const R = T.router("/user");

// Cached calls by our api client
R.get("/list", "list");
R.get("/:userId", "single");

// Create calls could affect the result of our `apiUserList` route, so add the invalidation definition.
R.post("/create", "create")
	.body({
		/* ... */
	})
	.invalidations(R.invalidates("user", "list"));

R.put("/:userId", "update")
	.params({ userId: T.uuid() })
	.body({})
	.invalidations(
		// Use the group name from `new TypeCreator()` simplifying invalidations in the same group.
		R.invalidates(T.group, "list"),

		// Automatically maps the `userId` from this call to the `userId` in the cache key of the `apiUserSingle` call.
		R.invalidates(T.group, "single", {
			useSharedParams: true,
		}),
	);

// Here our parameter names don't overlap (`:id` vs `:userId`), so we have to manually map this.
R.delete("/:id", "update")
	.body({})
	.invalidations(
		R.invalidates(T.group, "list"),

		// Map the cache key ["user", "single", { userId }] by selecting `["params", "id"]` (`params.id`) from the request.
		R.invalidates(T.group, "single", {
			specification: {
				params: {
					userId: ["params", "id"],
				},
			},
		}),
	);
```
