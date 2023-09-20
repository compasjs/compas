# Building your own structure

Building your own structure starts with types and validators.

## Getting started

The entrypoint for building your own structure is the `TypeCreator`. It defines
the group or flow that the type belongs to and all the methods for building your
own structure which we will explore later.

```js
import { Generator, TypeCreator } from "@compas/code-gen";

const generator = new Generator();
const T = new TypeCreator("myFlowName"); // like 'user' or 'userOnboarding'

generator.add(
  T.bool("myType"),

  T.bool("otherType"),
);

generator.generate({
  targetLanguage: "ts",
  outputDirectory: "./src/generated",
  generators: {
    validators: { includeBaseTypes: true },
  },
});
```

Calling this script should give you `src/generated/common/types.d.ts` with two
types defined;

```ts
// Concatenation of 'MyFlowName' and 'MyType'
export type MyFlowNameMyType = boolean;

export type MyFlowNameOtherType = boolean;
```

## Primitives

The following primitives are available

```js
import { TypeCreator } from "@compas/code-gen";

const T = new TypeCreator();

T.any();
T.bool();
T.number();
T.string();
T.uuid();
T.date();
```

Top level types provided to `generator.add` need to have a name:

```js
import { Generator, TypeCreator } from "@compas/code-gen";

const generator = new Generator();
const T = new TypeCreator(); // defaults to `App`

generator.add(T.number("integer"));

// generator.generate
```

After executing the generators the following is be runnable:

```ts
import type { AppInteger } from "generated/common/types";
import { validateAppInteger } from "generated/app/validators";
import { AppItem } from ".cache/debug/common/types";

// group 'App', name 'integer' becomes 'AppInteger'
// It's definition is something like `type AppInteger = number;`
const x: AppInteger = 5;

validateAppInteger(5); // => { value: 5 }
validateAppInteger({}); // => { error: { "$": { key: "validator.type" } }
```

## Optionality

Values are by default required and `null` is coerced to `undefined` for
JavaScript and TypeScript targets.

```ts
const T = new TypeCreator();

generator.add(
  T.bool("requiredBoolean"),
  T.bool("optionalBoolean").optional(),
  T.bool("nullableBoolean").allowNull(),
);

// And usage
import {
  validateAppRequiredBoolean,
  validateAppOptionalBoolean,
  validateAppNullableBoolean,
} from "generated/app/validators";

// Input type: boolean
// Output type: boolean
validateAppRequiredBoolean(true); // => { value: true }
validateAppRequiredBoolean(undefined); // => { error: { "$": { key: "validator.undefined" } }

// Input type: boolean|undefined|null
// Output type: boolean|undefined
validateAppOptionalBoolean(undefined); // => { value: undefined }
validateAppOptionalBoolean(null); // => { value: undefined }

// Input type: boolean|undefined|null
// Output type: boolean|undefined|null
validateAppNullableBoolean(undefined); // => { value: undefined }
validateAppNullableBoolean(null); // => { value: null }
```

## Objects and arrays

Less primitive, but as important are objects and arrays. We will quickly glance
over the basics

```ts
const T = new TypeCreator();

generator.add(
  T.object("user").keys({
    id: T.uuid(), // using primitive types without names
    name: T.string(),
  }),

  T.array("objectList").values(
    T.object().keys({
      // Object without a name. You can still define a name here, which will
      // result in a named type for your target language.
      velocity: T.number(),
    }),
  ),
);

// Generated types
export type AppUser = { id: string; name: string };
export type AppObjectList = { velocity: number }[];

// Usage
validateAppUser({ id: generateUuid(), name: "Compas admin" }); // => { value: { id: "..", name: "Compas admin" } }
validateAppObjectList([]); // => { value: [] }
validateAppObjectList([{ velocity: 5 }]); // => { value: [{ velocity: 5 }] }
```

## Inferred builders

Compas supports inferring unnamed builders for objects, arrays and literals

```ts
T.object("named").keys({
  // inline objects are the same as `T.object().keys({ ... })`
  inferredObject: {
    key: T.string(),
  },

  // Arrays are inferred by providing a single length array instead of `T.array().values(...)`
  inferredArray: [T.string()],

  // boolean, number and string literals are supported as well. This uses `.oneOf()`, which
  // is further detailed below.
  inferredBoolean: true,
  inferredNumber: 5,
  inferredString: "north",
});
```

## Boolean

Boolean types and validators can be customized

```ts
import { TypeCreator } from "@compas/code-gen";

const T = new TypeCreator();

T.bool();
// -> Typescript type: boolean
// -> Valid validator inputs: 0, 1, true, false
// -> Validator outputs: true, false

// Only allows `true`. Since the validators will auto coerce booleans, `1` is a valid input as well.
T.bool().oneOf(true);
```

## Number

Integers and floats are represented by `T.number()`

```ts
T.number();
// -> Typescript type: number
// -> Valid validator inputs: 1, 15, 3, "5"
// -> Validator outputs: 1, 15, 3, 5

// Number validation defaults to integers only.
T.number().float();

// Only allow specific values
T.number().oneOf(1, 2, 3);
T.number().float().oneOf(1.1, 2.2, 3.3);

T.number().min(4); // >= 4
T.number().max(4); // <= 4
```

## String

```ts
import { TypeCreator } from "@compas/code-gen";

const T = new TypeCreator();

T.string();
// -> Typescript type: number
// -> Valid validator inputs: "f", "foo"
// -> Validator outputs: "f", "foo"

// Allow empty strings.
T.string().min(0);

// Specific string values
T.string().oneOf("NORTH", "SOUTH");

T.string().min(3); // str.length >= 3
T.string().max(3); // str.length <= 3

T.string().trim(); // Remove leading and trailing whitepsace
T.string().lowerCase(); // Convert the input to lower case
T.string().upperCase(); // Convert the input to upper case

T.string().disallowCharacters(["\n"]); // Error when specific characters are in the input

T.string().pattern(/^\d{4}$/g); // Enforce a specific regex
```

## Uuid

The uuid type does not have any options. It accepts any string in an uuid v4
like format.

```ts
T.uuid();
// -> Typescript type: number
// -> Valid validator inputs: "70f20a8b-0372-44aa-8135-137981083d9b"
// -> Validator outputs: "70f20a8b-0372-44aa-8135-137981083d9b"
```

## Any

Accept any value. Can be used as an escape hatch to validate values that are not
natively supported by Compas.

```ts
T.any();
// -> Typescript type: any
// -> Valid validator inputs: Buffer.from("Hello world");
// -> Validator outputs: <Buffer ...>
```

## Date

The Date input accepts full datetime strings with timezone offsets or a number
representing milliseconds since Unix epoch.

```ts
T.date();

T.date().dateOnly(); // Accepts yyyy-MM-dd only
T.date().timeOnly(); // Accepts HH:mm(:ss(.SSS))

T.date().min(new Date(2023, 0, 1)); // Only accept dates after 2023-01-01
T.date().max(new Date(2023, 0, 1)); // Only accept dates before 2023-01-01

T.date().inTheFuture(); // Accept dates that are in the future
T.date().inThePast(); // Accept dates that represent a datetime in the past.
```

## Array

```ts
T.array().values(T.bool());
// -> Typescript type: boolean[]
// -> Valid validator inputs: [true], [false]
// -> Validator outputs: [true], [false]

T.array().min(1); // Enforce a minimum number of items
T.array().max(5); // Enforce a maximum number of items

T.array().values(T.bool()).convert(); // Convert non-array values to an array
// -> Typescript input type: boolean|boolean[]
// -> Typescript output type: boolean[]
// -> Valid validator inputs: true, [false]
// -> Validator outputs: [true], [false]
// Note the auto conversion to array for the first input.
```

## Object

```ts
T.object().keys({
  foo: T.bool(),
});
// -> Typescript type: { foo: boolean };
// -> Valid validator inputs: { foo: true }
// -> Validator outputs: { foo: true }

// By default objects don't allow extra keys to be provided. Applying `.loose()`
// will ignore the extra keys.
T.object().loose();
```

## Generic

Represent an object with dynamic validated keys and values

```ts
T.generic().keys(T.string()).values(T.bool());
// -> Typescript type: { [k: string]: boolean };
// -> Valid validator inputs: { foo: true }, { bar: true },
// -> Validator outputs: { foo: true }, { bar: true}
```

## Any of

Represent a type that could be any of the defined types

```ts
T.anyOf().values(T.bool(), T.string());
// -> Typescript type: boolean|string;
// -> Valid validator inputs: true, "foo"
// -> Validator outputs: true, "foo"

// A discriminated union with named types is the most common usage
T.anyOf("state")
  .values(
    T.object("startState").keys({
      type: "start",
      // ... extra keys
    }),
    T.object("inProgressState").keys({
      type: "inProgress",
      // ... extra keys
    }),
  )
  // Adding a discriminant ensures faster validators and cleaner validation errors
  // This can only be used when all possible values are objects and have a literal string value on the 'discriminant' property.
  .discriminant("type");
```

## File

Only usable in route / api client definitions. This is typed specifically to the
router or api client target that is used.

```ts
T.file();

// Static mime type validator if the router supports that.
T.file().mimeTypes("image/png", "image/jpeg");
```

## Reference

Named types can be reused as well.

```ts
generator.add(
  T.object("item").keys({
    id: T.uuid(),
    name: T.string(),
  }),
  T.object("itemList").keys({
    total: T.number(),
    items: [T.reference("app", "item")],
  }),
);

// Generates the following;
// Note; `App` is the default group if no value is explicitly provided to `new TypeCreator()`;
type AppItem = { id: string; name: string };
type AppItemList = { total: number; items: AppItem[] };
```

## Object extensions

### Omit

Copy all keys from a named object type and omit some of them

```ts
T.object("bigObject").keys({
  key1: T.string(),
  key2: T.string(),
  key3: T.string(),
});
// { key1: string, key2: string, key3: string }

T.omit("ommitBigObject").object(T.reference("app", "bigObject")).keys("key3");
// { key1: string, key2: string }
```

### Pick

Copy some fields from a named object type

```ts
T.object("bigObject").keys({
  key1: T.string(),
  key2: T.string(),
  key3: T.string(),
});
// { key1: string, key2: string, key3: string }

T.pick("pickBigObject")
  .object(T.reference("app", "bigObject"))
  .keys("key1", "key2");
// { key1: string, key2: string }
```

### Extend

It could happen that you want to add extra properties on an `T.object()` that is
provided by a library. A use case is when using Compas' store package to save
files. It provides a typed `fileMeta` type which you can extend to add extra
properties.

```ts
T.extendNamedObject(T.reference("store", "fileMeta")).keys({
  hashCode: T.string(),
});
// type StoreFileMeta = { ...existingKeys; hashCode: string, };
```
