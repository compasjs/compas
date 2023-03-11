# Building your own structure

Building your own structure starts with types and validators.

## Getting started

The entrypoint for building your own structure is the `TypeCreator`. It defines
the group or flow that the type belongs to and all the methods for building your
own structure which we will explore later.

```js
import { TypeCreator } from "@compas/code-gen";
import { Generator } from "@compas/code-gen/experimental";

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
import { TypeCreator } from "@compas/code-gen";
import { Generator } from "@compas/code-gen/experimental";

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
