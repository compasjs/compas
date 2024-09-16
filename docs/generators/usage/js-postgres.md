# Node.js Postgres

The database generator supports generating the basic CRUD queries based on the provided
entities, using [the Node.js postgres client](https://github.com/porsager/postgres) and
the Compas `@compas/store` provided `query` helper.

```js
import { Generator } from "@compas/code-gen";

const generator = new Generator();

// Build your own structure or import an existing one

generator.generate({
	targetLanguage: "js",
	outputDirectory: "./src/generated",
	generators: {
		database: {
			target: {
				dialect: "postgres",
				includeDDL: true,
			},
			includeEntityDiagram: true,
		},
	},
});
```

## Setup

Start with initializing the Postgres client

::: code-group

```js [With @compas/store]
import { newPostgresConnection } from "@compas/store";

// Applies various defaults, works with 'compas docker up' and has a counterpart for
// testing, 'createTestPostgresDatabase'.
const sql = await newPostgresConnection();
```

```js [Plain Postgres client]
import postgres from "postgres";

const sql = postgres();
```

:::

Note that the Postgres table and column names keep the same case as provided in your
structure. In the examples we will use `camelCase` names. This requires double-quoting
identifiers when you use custom queries like

```postgresql
SELECT "id", "isPremiumMember"
FROM "userSettings" us
WHERE
  us."isPremiumMember" = TRUE;
```

## Inserts

```js
// All inserts, updates and deletes are exported via `queries`
import { queries } from "./generated/common/database.js";

await queries.userInsert(sql, {
	// provide a custom primary key, this is optional.
	id: uuid(),
	email: "foo@bar.com",
});

// The inserted rows are returned as well.
const [myUser] = await queries.userInsert(sql, {
	email: "returned@bar.com",
});

// Multiple inserts can be done in a single call.
await queries.postInsert(sql, [
	{
		user: myUser.id,
		title: "Hello",
	},
	{
		user: myUser.id,
		title: "Post 2",
	},
]);

// Note that all database inputs and outputs are validated according to your structure
// So the following will fail, when the user does not have an `age` column.
await queries.userInsert(sql, {
	email: "returned@bar.com",
	age: 15,
});
```

## Selects

Compas generated select queries are able to join the relations and return a nested object
while doing a single query to the database (with help from inline selects).

```js
import { queryUser } from "./generated/database/user.js";

// Only select all users
const users = await queryUser({}).exec(sql);

// Select all users with posts, the generated types should hint you with the available
// relations.
const usersWithPosts = await queryUser({
	posts: {},
}).exec(sql);
// usersWithPosts[0].posts -> DatabasePost[]

// Ofcourse, any number of relations is allowed
await queryUser({
	posts: {
		author: {}, // rejoins the user again
	},
}).exec(sql);

// A subset of fields can be selected, not the use of `.execRaw`, this opts out of
// validated and transformed database results.
await queryUser({
	select: ["id", "email"],
}).execRaw(sql);

// Ordering and pagination can be done as well
// Ordering defaults on `createdAt ASC, updatedAt ASC` when `withDates` is provided in
// the structure, or else using `id ASC`.
await querUser({
	offset: 0,
	limit: 10,

	// order by determines which columns is sorted on first
	orderBy: ["email"],

	// The spec provides which way a column is sorted
	// on.
	orderBySpec: {
		email: "DESC",
	},
}).exec(sql);
```

## Where

Extensive where clauses are supported as well. Note that only columns with `.searchable()`
in the structure will be allowed in the where clause.

```js
import { query } from "@compas/store";

// Exact match
await queryUser({
	where: {
		id: session.userId,
	},
}).exec(sql);
// WHERE id = $1

// Exact match on multiple columns
await queryUser({
	where: {
		email: "foo@bar.com",
		age: 15,
	},
}).exec(sql);
// WHERE email = $1 AND age = $2

// Escape hatch for custom where-clauses, for example when filtering on a JSONB property
await queryUser({
	where: {
		$raw: query`data->>'receiveChangelogViaEmail' = ${true}`,
	},
}).exec(sql);
// WHERE (data->>'receiveChangelogViaEmail' = $1)

await queryUser({
	where: {
		isPremiumMember: true,
		$or: [
			{
				email: "foo@bar.com",
			},
			{
				age: 15,
			},
		],
	},
}).exec(sql);
// WHERE "isPremiumMember" = true AND (email = $1 OR age = $2)

// Various logical operators are supported as well, depending on the column type.
await queryUser({
	ageGreaterThan: 18,
	emailNotEqual: "admin@saas.com",
	roleIn: ["admin", "moderator"],
}).exec(sql);

// Include soft deleted records
await queryUser({
	where: {
		deletedAtIncludeNotNull: true,
	},
}).exec(sql);
```

Another feature supported by the generated where-clauses is relation traversal. This
allows you to query an entity while filtering the results via relations.

```js
import { queryPost } from "./generated/database/post.js";

// Get all posts for a specific author
await queryPost({
	where: {
		viaAuthor: {
			where: {
				id: user.id,
			},
		},
	},
});

// Is the same as
await queryPost({
	where: {
		author: user.id,
	},
}).exec(sql);

// Get all posts with a specific tag
await queryPost({
	where: {
		viaTags: {
			where: {
				name: "Node.js",
			},
		},
	},
}).exec(sql);

// Resolve all posts liked by users over 18 years
await queryPost({
	where: {
		viaLikes: {
			where: {
				viaUser: {
					where: {
						ageGreaterThan: 18,
					},
				},
			},
		},
	},
}).exec(sql);
```

## Updates

```js
import { queries } from "./generated/common/database.js";

// Basic update
await queries.userUpdate(sql, {
	where: {
		id: user.id,
	},
	update: {
		age: 19,
	},
});

// Set an optional column to 'null'. This is one of the only places where `null` is explicitly accepted by Compas
await queries.userUpdate(sql, {
	where: {
		id: user.id,
	},
	update: {
		verifyToken: null,
	},
});

// Return all columns
await queries.userUpdate(sql, {
	where: {
		id: user.id,
	},
	update: {
		age: 19,
	},
	returning: "*",
});

// Return a selection of columns
await queries.userUpdate(sql, {
	where: {
		id: user.id,
	},
	update: {
		age: 19,
	},
	returning: ["id", "age"],
});

// Soft delete a record
await queries.userUdpate(sql, {
	where: {
		id: user.id,
	},
	update: {
		deletedAt: new Date(),
	},
});
```

Atomic updates are also supported on various column types

```js
import { queries } from "./generated/common/database.js";

// Basic update
await queries.userUpdate(sql, {
	where: {
		id: user.id,
	},
	update: {
		// "isPremiumMember" = NOT "isPremiumMember"
		isPremiumMeber: {
			$negate: true,
		},

		// "age" = "age" + 1
		age: {
			$add: 1,
		},

		// "data" = jsonb_set("data", {receiveEmails}, false)
		data: {
			$set: {
				path: ["receivEmails"],
				value: false,
			},
		},
	},
});
```

## Deletes

```js
import { queries } from "./generated/common/database.js";

// Accept any where-cluase.
await queries.userDelete(sql, {
	id: user.id,
});

// Note that soft deleted records are always included, unlike the other where-clauses.
```
