# Custom types

In this document we will try to implement our own `uuid` type. Although `uuid`
is already provided in the core types, it is a minimal type and perfect for a
tutorial like document.

Lets start with a simple scaffold. Create a file called something like
`my-uuid-type.js` with the following contents:

```ecmascript 6
import { TypeBuilder, TypeCreator } from "@lbu/code-gen";

class UuidType extends TypeBuilder {}

export const uuidType = {
  name: "my-uuid",
  class: UuidType
}

TypeCreator.types.set(uuidType.name, uuidType);
```

By extending TypeBuilder we get some defaults for e.g. name, group, optional and
docString properties. Most generators expect that your type extends TypeBuilder.
We also add the type to `TypeCreator.types`. This is a map with all loaded
types. When generators want to create a dynamic function based on available
types, they can use this.

Since the constructor on `TypeBuilder` expects a type identifier, we can always
pass that in statically. Lets add a constructor:

```ecmascript 6
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
```

To use our new type we have to provide a way to create it via the TypeCreator.
The TypeCreator manages groups and the creation of all custom types.

Add the following to `my-uuid-type.js`:

```ecmascript 6
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
app.add(T.uuid());
```

At the moment this does exactly nothing to the generators. At least all core
generators will check if you provided the specific functions needed to
facilitate for example type generation.

Let's start by adding support for type generation. This is a simple one, because
uuid is in both jsdoc and Typescript represented as a plain string.

```ecmascript 6
const uuidType = {
  name: "my-uuid",
  class: UuidType,
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

That's it! We have created a fully functional uuid type.
