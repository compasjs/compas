# Custom types

In this document we will try to implement our own `uuid` type. Although `uuid`
is already provided in the core types, it is a minimal type and perfect for a
tutorial like document.

Lets start with a simple scaffold. Create a file called something like
`my-uuid-type.js`

```ecmascript 6
export const uuidType = {
  name: "my-uuid",
}
```

And the magic to add it to our generate.js file

```ecmascript 6
import { uuidType } from "./my-uuid-type.js";

const types = coreTypes.filter(it => it.name !== "uuid");
types.push(uuidType)

const app = new App({
 types,
 /* ... other props */
})
```

To use our new type we have to provide a way to create it via the TypeCreator.
The TypeCreator manages groups and the creation of all custom types. We also
leverage the TypeBuilder class for default properties like `isOptional` and
`docString`.

Add the following to `my-uuid-type.js`:

```ecmascript 6
export const uuidType = {/* ... */};

class UuidType extends TypeBuilder {
  constructor(group, name){
    // The TypeBuilder and core plugins handle names pretty okay.
    // So it is perfectly fine to pass undefined to group and name if your type can't be top level declared
    super(uuidType.name, group, name);

    // Adding a custom property with a sensible default value
    // this.data.myProperty = undefined;
  }

  // since we don't have custom properties, nothing is here
  // setMyProp() {
  //  this.data.myProperty = "foo";
  //
  //  // always return this, so methods can be chained
  //  return this;
  // }
}

/**
 * @name TypeCreator#uuid
 * @param {string} [name]
 * @return {UuidType}
 */
TypeCreator.prototype.uuid = function (name){
// note that we use a 'function' instead of a arrow function here,
// so we can use the this.group that TypeCreator provides

  return new UuidType(this.group, name);
};
```

Now we have a way of creating our custom type like so:

```ecmascript 6
// generate.js
// make sure that my-uuid-type is imported
const T = new TypeCreator();
app.model(T.uuid());
```

At the moment this does exactly nothing to the generators. At least all core
generators will check if you provided the specific functions needed to
facilitate for example mock generation.

Let's start by adding support for type generation. This is a simple one, because
uuid is in both jsdoc and Typescript represented as a plain string.

```ecmascript 6
export const uuidType = {
  name: "my-uuid",
  jsType: () => `string`,
  tsType: () => `string`,
};
```

To add validator support we utilize the existing string type. It has all the
necessary checks available for us.

This may look a bit dense, but to utilize the string generator we have to create
a custom string validator function. For cleaner outputs we append the generated
function string with `ctx.addFunc` which is outputted at the end of a file.

```ecmascript 6

const stringType = JSON.stringify(
  {
    type: "string",
    validator: {
      min: 36,
      max: 36,
      lowerCase: true,
      trim: true,
      pattern:
        "/^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[a-f0-9]{4}-[a-f0-9]{12}$/gi",
    },
  },
  undefined,
  1,
).replace(/\n/g, " ");
// Since the template syntax is pretty crude, we need to make sure no 2 curly braces (}}) follow  in the JSON string

uuidType.validator = () => `
{{ const num = ctx.counter; }}
{{ ctx.addFunc(validatorsAnonFn({ model: ${stringType}, ctx })); }}

return stringValidator{{= num }}(value, propertyPath);
`;
```

The next step is adding support for mocks. This ensure that when the api client
returns a mock, we have something nice to look at. The mock generator contains
an instance of [Chance](https://chancejs.com/) at `_mocker` so we can utilize
that.

```ecmascript 6
uuidType.mock = () => `_mocker.guid({version: 4})`
```

That's it! We have created a fully functional uuid type. To be good type plugin
creators we do the final step of exposing our UuidType on TypeCreator. This
ensures that other plugins can extend our type with other generators without us
have to provide an implementation.

```ecmascript 6
// my-uuid-types.js at the end of the file
TypeCreator.types[uuidType.name] = UuidType;
```

Say someone wants to create a plugin that creates a plugin that facilitates
testing, they can extend our type to provide correct and incorrect examples.
They can do something like this:

```ecmascript 6
if (TypeCreator.types["my-uuid"]) {
 TypeCreator.types["my-uuid"].testGood = () => uuid();
 TypeCreator.types["my-uuid"].testBad = () => String(Math.random() * 1000);
}
```
