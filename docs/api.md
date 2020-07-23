<a name="readmemd"></a>

# API

Per module documentation, generated from the Typescript declaration files.

# Cli

<a name="clireadmemd"></a>

[@lbu/cli - v0.0.45](#clireadmemd)

## @lbu/cli - v0.0.45

### Index

#### Interfaces

- [CollectedScript](#cliinterfacescollectedscriptmd)
- [ScriptCollection](#cliinterfacesscriptcollectionmd)

#### Functions

- [collectScripts](#collectscripts)

### Functions

#### collectScripts

▸ **collectScripts**(): _[ScriptCollection](#cliinterfacesscriptcollectionmd)_

Return collection of available named scripts

- type user: User defined scripts from process.cwd/scripts/\*.js
- type package: User defined scripts in package.json. These override 'user'
  scripts

**Returns:** _[ScriptCollection](#cliinterfacesscriptcollectionmd)_

## Interfaces

<a name="cliinterfacescollectedscriptmd"></a>

[@lbu/cli - v0.0.45](#clireadmemd) ›
[CollectedScript](#cliinterfacescollectedscriptmd)

### Interface: CollectedScript

Represents either a file in the `scripts` directory or a script from the
package.json Depending on the type contains either script or path

#### Hierarchy

- **CollectedScript**

#### Index

##### Properties

- [name](#name)
- [path](#optional-path)
- [script](#optional-script)
- [type](#type)

#### Properties

##### name

• **name**: _string_

---

##### `Optional` path

• **path**? : _string_

---

##### `Optional` script

• **script**? : _string_

---

##### type

• **type**: _"user" | "package"_

<a name="cliinterfacesscriptcollectionmd"></a>

[@lbu/cli - v0.0.45](#clireadmemd) ›
[ScriptCollection](#cliinterfacesscriptcollectionmd)

### Interface: ScriptCollection

#### Hierarchy

- **ScriptCollection**

#### Indexable

- \[ **k**: _string_\]: [CollectedScript](#cliinterfacescollectedscriptmd)

# Code Gen

<a name="code-genreadmemd"></a>

[@lbu/code-gen - v0.0.45](#code-genreadmemd)

## @lbu/code-gen - v0.0.45

### Index

#### Classes

- [AnyOfType](#code-genclassesanyoftypemd)
- [AnyType](#code-genclassesanytypemd)
- [App](#code-genclassesappmd)
- [ArrayType](#code-genclassesarraytypemd)
- [BooleanType](#code-genclassesbooleantypemd)
- [DateType](#code-genclassesdatetypemd)
- [GenericType](#code-genclassesgenerictypemd)
- [NumberType](#code-genclassesnumbertypemd)
- [ObjectType](#code-genclassesobjecttypemd)
- [ReferenceType](#code-genclassesreferencetypemd)
- [RelationType](#code-genclassesrelationtypemd)
- [RouteBuilder](#code-genclassesroutebuildermd)
- [RouteCreator](#code-genclassesroutecreatormd)
- [StringType](#code-genclassesstringtypemd)
- [TypeBuilder](#code-genclassestypebuildermd)
- [TypeCreator](#code-genclassestypecreatormd)
- [UuidType](#code-genclassesuuidtypemd)

#### Interfaces

- [AppOpts](#code-geninterfacesappoptsmd)
- [GenerateOpts](#code-geninterfacesgenerateoptsmd)
- [GeneratedFile](#code-geninterfacesgeneratedfilemd)
- [GeneratorPlugin](#code-geninterfacesgeneratorpluginmd)
- [TypeBuilderLikeArray](#code-geninterfacestypebuilderlikearraymd)
- [TypeBuilderLikeObject](#code-geninterfacestypebuilderlikeobjectmd)
- [TypePlugin](#code-geninterfacestypepluginmd)

#### Type aliases

- [TypeBuilderLike](#typebuilderlike)

#### Variables

- [generatorTemplates](#const-generatortemplates)
- [generators](#const-generators)

#### Functions

- [isNamedTypeBuilderLike](#isnamedtypebuilderlike)
- [loadFromOpenAPISpec](#loadfromopenapispec)
- [loadFromRemote](#loadfromremote)

### Type aliases

#### TypeBuilderLike

Ƭ **TypeBuilderLike**: _boolean | number | string |
[TypeBuilderLikeArray](#code-geninterfacestypebuilderlikearraymd) |
[TypeBuilderLikeObject](#code-geninterfacestypebuilderlikeobjectmd) |
[TypeBuilder](#code-genclassestypebuildermd)_

### Variables

#### `Const` generatorTemplates

• **generatorTemplates**: _TemplateContext_

Shared templateContext for all generators

---

#### `Const` generators

• **generators**: _Map‹string,
[GeneratorPlugin](#code-geninterfacesgeneratorpluginmd)›_

Generator registry, with all core provided generators already added

### Functions

#### isNamedTypeBuilderLike

▸ **isNamedTypeBuilderLike**(`value`: any): _boolean_

Check if value may be output object from a TypeBuilder

**Parameters:**

| Name    | Type |
| ------- | ---- |
| `value` | any  |

**Returns:** _boolean_

---

#### loadFromOpenAPISpec

▸ **loadFromOpenAPISpec**(`defaultGroup`: string, `data`: any): _any_

Try to convert a OpenAPI spec object to LBU structure

**Parameters:**

| Name           | Type   | Description                                              |
| -------------- | ------ | -------------------------------------------------------- |
| `defaultGroup` | string | Default to group to use for non tagged items in the spec |
| `data`         | any    | Raw OpenAPI 3 json object                                |

**Returns:** _any_

---

#### loadFromRemote

▸ **loadFromRemote**(`axios`: AxiosInstance, `baseUrl`: string): _any_

Load a LBU structure from an LBU enabled API

**Parameters:**

| Name      | Type          |
| --------- | ------------- |
| `axios`   | AxiosInstance |
| `baseUrl` | string        |

**Returns:** _any_

## Classes

<a name="code-genclassesanyoftypemd"></a>

[@lbu/code-gen - v0.0.45](#code-genreadmemd) ›
[AnyOfType](#code-genclassesanyoftypemd)

### Class: AnyOfType

#### Hierarchy

- [TypeBuilder](#code-genclassestypebuildermd)

  ↳ **AnyOfType**

#### Index

##### Constructors

- [constructor](#constructor)

##### Properties

- [data](#data)
- [baseData](#static-basedata)

##### Methods

- [build](#build)
- [default](#default)
- [docs](#docs)
- [optional](#optional)
- [primary](#primary)
- [searchable](#searchable)
- [values](#values)
- [getBaseData](#static-getbasedata)

#### Constructors

##### constructor

\+ **new AnyOfType**(`type`: string, `group?`: string, `name?`: string):
_[AnyOfType](#code-genclassesanyoftypemd)_

_Inherited from
[TypeBuilder](#code-genclassestypebuildermd).[constructor](#constructor)_

Create a new TypeBuilder for the provided group

**Parameters:**

| Name     | Type   |
| -------- | ------ |
| `type`   | string |
| `group?` | string |
| `name?`  | string |

**Returns:** _[AnyOfType](#code-genclassesanyoftypemd)_

#### Properties

##### data

• **data**: _typeof baseData_

_Inherited from [TypeBuilder](#code-genclassestypebuildermd).[data](#data)_

---

##### `Static` baseData

▪ **baseData**: _object_

_Inherited from
[TypeBuilder](#code-genclassestypebuildermd).[baseData](#static-basedata)_

###### Type declaration:

- **defaultValue**? : _string_

- **docString**: _string_

- **group**? : _string_

- **isOptional**: _boolean_

- **name**? : _string_

- **type**? : _string_

#### Methods

##### build

▸ **build**(): _Record‹string, any›_

_Inherited from [TypeBuilder](#code-genclassestypebuildermd).[build](#build)_

Returns a shallow copy of the data object

**Returns:** _Record‹string, any›_

---

##### default

▸ **default**(`rawString?`: string): _this_

_Inherited from
[TypeBuilder](#code-genclassestypebuildermd).[default](#default)_

Set a raw default value, also makes the type optional Can be reverted by calling
this function with undefined or null

**Parameters:**

| Name         | Type   |
| ------------ | ------ |
| `rawString?` | string |

**Returns:** _this_

---

##### docs

▸ **docs**(`docValue`: string): _this_

_Inherited from [TypeBuilder](#code-genclassestypebuildermd).[docs](#docs)_

Add a doc comment, some generators / types may support rendering this

**Parameters:**

| Name       | Type   |
| ---------- | ------ |
| `docValue` | string |

**Returns:** _this_

---

##### optional

▸ **optional**(): _this_

_Inherited from
[TypeBuilder](#code-genclassestypebuildermd).[optional](#optional)_

Value can be undefined

**Returns:** _this_

---

##### primary

▸ **primary**(): _this_

_Inherited from
[TypeBuilder](#code-genclassestypebuildermd).[primary](#primary)_

Set this field as primary for the 'sql' plugin

**Returns:** _this_

---

##### searchable

▸ **searchable**(): _this_

_Inherited from
[TypeBuilder](#code-genclassestypebuildermd).[searchable](#searchable)_

Set this field as searchable for the 'sql' plugin

**Returns:** _this_

---

##### values

▸ **values**(...`items`: [TypeBuilderLike](#typebuilderlike)[]): _this_

**Parameters:**

| Name       | Type                                  |
| ---------- | ------------------------------------- |
| `...items` | [TypeBuilderLike](#typebuilderlike)[] |

**Returns:** _this_

---

##### `Static` getBaseData

▸ **getBaseData**(): _typeof baseData_

_Inherited from
[TypeBuilder](#code-genclassestypebuildermd).[getBaseData](#static-getbasedata)_

**Returns:** _typeof baseData_

<a name="code-genclassesanytypemd"></a>

[@lbu/code-gen - v0.0.45](#code-genreadmemd) ›
[AnyType](#code-genclassesanytypemd)

### Class: AnyType

#### Hierarchy

- [TypeBuilder](#code-genclassestypebuildermd)

  ↳ **AnyType**

#### Index

##### Constructors

- [constructor](#constructor)

##### Properties

- [data](#data)
- [baseData](#static-basedata)

##### Methods

- [build](#build)
- [default](#default)
- [docs](#docs)
- [instanceOf](#instanceof)
- [optional](#optional)
- [primary](#primary)
- [searchable](#searchable)
- [typeOf](#typeof)
- [getBaseData](#static-getbasedata)

#### Constructors

##### constructor

\+ **new AnyType**(`type`: string, `group?`: string, `name?`: string):
_[AnyType](#code-genclassesanytypemd)_

_Inherited from
[TypeBuilder](#code-genclassestypebuildermd).[constructor](#constructor)_

Create a new TypeBuilder for the provided group

**Parameters:**

| Name     | Type   |
| -------- | ------ |
| `type`   | string |
| `group?` | string |
| `name?`  | string |

**Returns:** _[AnyType](#code-genclassesanytypemd)_

#### Properties

##### data

• **data**: _typeof baseData_

_Inherited from [TypeBuilder](#code-genclassestypebuildermd).[data](#data)_

---

##### `Static` baseData

▪ **baseData**: _object_

_Inherited from
[TypeBuilder](#code-genclassestypebuildermd).[baseData](#static-basedata)_

###### Type declaration:

- **defaultValue**? : _string_

- **docString**: _string_

- **group**? : _string_

- **isOptional**: _boolean_

- **name**? : _string_

- **type**? : _string_

#### Methods

##### build

▸ **build**(): _Record‹string, any›_

_Inherited from [TypeBuilder](#code-genclassestypebuildermd).[build](#build)_

Returns a shallow copy of the data object

**Returns:** _Record‹string, any›_

---

##### default

▸ **default**(`rawString?`: string): _this_

_Inherited from
[TypeBuilder](#code-genclassestypebuildermd).[default](#default)_

Set a raw default value, also makes the type optional Can be reverted by calling
this function with undefined or null

**Parameters:**

| Name         | Type   |
| ------------ | ------ |
| `rawString?` | string |

**Returns:** _this_

---

##### docs

▸ **docs**(`docValue`: string): _this_

_Inherited from [TypeBuilder](#code-genclassestypebuildermd).[docs](#docs)_

Add a doc comment, some generators / types may support rendering this

**Parameters:**

| Name       | Type   |
| ---------- | ------ |
| `docValue` | string |

**Returns:** _this_

---

##### instanceOf

▸ **instanceOf**(`value`: string): _this_

**Parameters:**

| Name    | Type   |
| ------- | ------ |
| `value` | string |

**Returns:** _this_

---

##### optional

▸ **optional**(): _this_

_Inherited from
[TypeBuilder](#code-genclassestypebuildermd).[optional](#optional)_

Value can be undefined

**Returns:** _this_

---

##### primary

▸ **primary**(): _this_

_Inherited from
[TypeBuilder](#code-genclassestypebuildermd).[primary](#primary)_

Set this field as primary for the 'sql' plugin

**Returns:** _this_

---

##### searchable

▸ **searchable**(): _this_

_Inherited from
[TypeBuilder](#code-genclassestypebuildermd).[searchable](#searchable)_

Set this field as searchable for the 'sql' plugin

**Returns:** _this_

---

##### typeOf

▸ **typeOf**(`value`: string): _this_

**Parameters:**

| Name    | Type   |
| ------- | ------ |
| `value` | string |

**Returns:** _this_

---

##### `Static` getBaseData

▸ **getBaseData**(): _typeof baseData_

_Inherited from
[TypeBuilder](#code-genclassestypebuildermd).[getBaseData](#static-getbasedata)_

**Returns:** _typeof baseData_

<a name="code-genclassesappmd"></a>

[@lbu/code-gen - v0.0.45](#code-genreadmemd) › [App](#code-genclassesappmd)

### Class: App

The entry-point to code generation Provides the structure for creating types,
and extending with external sources. Also maintains the generators

#### Hierarchy

- **App**

#### Index

##### Properties

- [logger](#logger)
- [verbose](#verbose)
- [defaultEslintIgnore](#static-defaulteslintignore)

##### Methods

- [add](#add)
- [addRaw](#addraw)
- [extend](#extend)
- [generate](#generate)
- [new](#static-new)

#### Properties

##### logger

• **logger**: _Logger_

Internally used logger

---

##### verbose

• **verbose**: _boolean_

Enable more logging while generating

---

##### `Static` defaultEslintIgnore

▪ **defaultEslintIgnore**: _string[]_

List used in the file header to ignore some eslint rules

#### Methods

##### add

▸ **add**(...`builders`: [TypeBuilder](#code-genclassestypebuildermd)[]):
_[App](#code-genclassesappmd)_

Add new TypeBuilders to this app

**Parameters:**

| Name          | Type                                           |
| ------------- | ---------------------------------------------- |
| `...builders` | [TypeBuilder](#code-genclassestypebuildermd)[] |

**Returns:** _[App](#code-genclassesappmd)_

---

##### addRaw

▸ **addRaw**(`obj`: any): _[App](#code-genclassesappmd)_

Add a raw object to this app. Note that it throws when you are not conforming to
at least the structure from the TypeBuilder

**Parameters:**

| Name  | Type |
| ----- | ---- |
| `obj` | any  |

**Returns:** _[App](#code-genclassesappmd)_

---

##### extend

▸ **extend**(`data`: any): _void_

Add all groups and items to this App instance

**Parameters:**

| Name   | Type |
| ------ | ---- |
| `data` | any  |

**Returns:** _void_

---

##### generate

▸ **generate**(`options`: [GenerateOpts](#code-geninterfacesgenerateoptsmd)):
_Promise‹void›_

Call the generators with the provided options and writes the output

**Parameters:**

| Name      | Type                                              |
| --------- | ------------------------------------------------- |
| `options` | [GenerateOpts](#code-geninterfacesgenerateoptsmd) |

**Returns:** _Promise‹void›_

---

##### `Static` new

▸ **new**(`options`: [AppOpts](#code-geninterfacesappoptsmd)):
_Promise‹[App](#code-genclassesappmd)›_

Create a new App instance and inits generators

**Parameters:**

| Name      | Type                                    |
| --------- | --------------------------------------- |
| `options` | [AppOpts](#code-geninterfacesappoptsmd) |

**Returns:** _Promise‹[App](#code-genclassesappmd)›_

<a name="code-genclassesarraytypemd"></a>

[@lbu/code-gen - v0.0.45](#code-genreadmemd) ›
[ArrayType](#code-genclassesarraytypemd)

### Class: ArrayType

#### Hierarchy

- [TypeBuilder](#code-genclassestypebuildermd)

  ↳ **ArrayType**

#### Index

##### Constructors

- [constructor](#constructor)

##### Properties

- [data](#data)
- [baseData](#static-basedata)

##### Methods

- [build](#build)
- [convert](#convert)
- [default](#default)
- [docs](#docs)
- [max](#max)
- [min](#min)
- [optional](#optional)
- [primary](#primary)
- [searchable](#searchable)
- [values](#values)
- [getBaseData](#static-getbasedata)

#### Constructors

##### constructor

\+ **new ArrayType**(`type`: string, `group?`: string, `name?`: string):
_[ArrayType](#code-genclassesarraytypemd)_

_Inherited from
[TypeBuilder](#code-genclassestypebuildermd).[constructor](#constructor)_

Create a new TypeBuilder for the provided group

**Parameters:**

| Name     | Type   |
| -------- | ------ |
| `type`   | string |
| `group?` | string |
| `name?`  | string |

**Returns:** _[ArrayType](#code-genclassesarraytypemd)_

#### Properties

##### data

• **data**: _typeof baseData_

_Inherited from [TypeBuilder](#code-genclassestypebuildermd).[data](#data)_

---

##### `Static` baseData

▪ **baseData**: _object_

_Inherited from
[TypeBuilder](#code-genclassestypebuildermd).[baseData](#static-basedata)_

###### Type declaration:

- **defaultValue**? : _string_

- **docString**: _string_

- **group**? : _string_

- **isOptional**: _boolean_

- **name**? : _string_

- **type**? : _string_

#### Methods

##### build

▸ **build**(): _Record‹string, any›_

_Inherited from [TypeBuilder](#code-genclassestypebuildermd).[build](#build)_

Returns a shallow copy of the data object

**Returns:** _Record‹string, any›_

---

##### convert

▸ **convert**(): _this_

Validator converts single item to an array

**Returns:** _this_

---

##### default

▸ **default**(`rawString?`: string): _this_

_Inherited from
[TypeBuilder](#code-genclassestypebuildermd).[default](#default)_

Set a raw default value, also makes the type optional Can be reverted by calling
this function with undefined or null

**Parameters:**

| Name         | Type   |
| ------------ | ------ |
| `rawString?` | string |

**Returns:** _this_

---

##### docs

▸ **docs**(`docValue`: string): _this_

_Inherited from [TypeBuilder](#code-genclassestypebuildermd).[docs](#docs)_

Add a doc comment, some generators / types may support rendering this

**Parameters:**

| Name       | Type   |
| ---------- | ------ |
| `docValue` | string |

**Returns:** _this_

---

##### max

▸ **max**(`max`: number): _this_

Validator enforced maximum length inclusive

**Parameters:**

| Name  | Type   |
| ----- | ------ |
| `max` | number |

**Returns:** _this_

---

##### min

▸ **min**(`min`: number): _this_

Validator enforced minimum length inclusive

**Parameters:**

| Name  | Type   |
| ----- | ------ |
| `min` | number |

**Returns:** _this_

---

##### optional

▸ **optional**(): _this_

_Inherited from
[TypeBuilder](#code-genclassestypebuildermd).[optional](#optional)_

Value can be undefined

**Returns:** _this_

---

##### primary

▸ **primary**(): _this_

_Inherited from
[TypeBuilder](#code-genclassestypebuildermd).[primary](#primary)_

Set this field as primary for the 'sql' plugin

**Returns:** _this_

---

##### searchable

▸ **searchable**(): _this_

_Inherited from
[TypeBuilder](#code-genclassestypebuildermd).[searchable](#searchable)_

Set this field as searchable for the 'sql' plugin

**Returns:** _this_

---

##### values

▸ **values**(`value`: [TypeBuilderLike](#typebuilderlike)): _this_

**Parameters:**

| Name    | Type                                |
| ------- | ----------------------------------- |
| `value` | [TypeBuilderLike](#typebuilderlike) |

**Returns:** _this_

---

##### `Static` getBaseData

▸ **getBaseData**(): _typeof baseData_

_Inherited from
[TypeBuilder](#code-genclassestypebuildermd).[getBaseData](#static-getbasedata)_

**Returns:** _typeof baseData_

<a name="code-genclassesbooleantypemd"></a>

[@lbu/code-gen - v0.0.45](#code-genreadmemd) ›
[BooleanType](#code-genclassesbooleantypemd)

### Class: BooleanType

#### Hierarchy

- [TypeBuilder](#code-genclassestypebuildermd)

  ↳ **BooleanType**

#### Index

##### Constructors

- [constructor](#constructor)

##### Properties

- [data](#data)
- [baseData](#static-basedata)

##### Methods

- [build](#build)
- [convert](#convert)
- [default](#default)
- [docs](#docs)
- [oneOf](#oneof)
- [optional](#optional)
- [primary](#primary)
- [searchable](#searchable)
- [getBaseData](#static-getbasedata)

#### Constructors

##### constructor

\+ **new BooleanType**(`type`: string, `group?`: string, `name?`: string):
_[BooleanType](#code-genclassesbooleantypemd)_

_Inherited from
[TypeBuilder](#code-genclassestypebuildermd).[constructor](#constructor)_

Create a new TypeBuilder for the provided group

**Parameters:**

| Name     | Type   |
| -------- | ------ |
| `type`   | string |
| `group?` | string |
| `name?`  | string |

**Returns:** _[BooleanType](#code-genclassesbooleantypemd)_

#### Properties

##### data

• **data**: _typeof baseData_

_Inherited from [TypeBuilder](#code-genclassestypebuildermd).[data](#data)_

---

##### `Static` baseData

▪ **baseData**: _object_

_Inherited from
[TypeBuilder](#code-genclassestypebuildermd).[baseData](#static-basedata)_

###### Type declaration:

- **defaultValue**? : _string_

- **docString**: _string_

- **group**? : _string_

- **isOptional**: _boolean_

- **name**? : _string_

- **type**? : _string_

#### Methods

##### build

▸ **build**(): _Record‹string, any›_

_Inherited from [TypeBuilder](#code-genclassestypebuildermd).[build](#build)_

Returns a shallow copy of the data object

**Returns:** _Record‹string, any›_

---

##### convert

▸ **convert**(): _this_

Validator converts "true", "false", 0 and 1 to a boolean

**Returns:** _this_

---

##### default

▸ **default**(`rawString?`: string): _this_

_Inherited from
[TypeBuilder](#code-genclassestypebuildermd).[default](#default)_

Set a raw default value, also makes the type optional Can be reverted by calling
this function with undefined or null

**Parameters:**

| Name         | Type   |
| ------------ | ------ |
| `rawString?` | string |

**Returns:** _this_

---

##### docs

▸ **docs**(`docValue`: string): _this_

_Inherited from [TypeBuilder](#code-genclassestypebuildermd).[docs](#docs)_

Add a doc comment, some generators / types may support rendering this

**Parameters:**

| Name       | Type   |
| ---------- | ------ |
| `docValue` | string |

**Returns:** _this_

---

##### oneOf

▸ **oneOf**(`value`: boolean): _this_

Only accepts a specific value

**Parameters:**

| Name    | Type    |
| ------- | ------- |
| `value` | boolean |

**Returns:** _this_

---

##### optional

▸ **optional**(): _this_

_Inherited from
[TypeBuilder](#code-genclassestypebuildermd).[optional](#optional)_

Value can be undefined

**Returns:** _this_

---

##### primary

▸ **primary**(): _this_

_Inherited from
[TypeBuilder](#code-genclassestypebuildermd).[primary](#primary)_

Set this field as primary for the 'sql' plugin

**Returns:** _this_

---

##### searchable

▸ **searchable**(): _this_

_Inherited from
[TypeBuilder](#code-genclassestypebuildermd).[searchable](#searchable)_

Set this field as searchable for the 'sql' plugin

**Returns:** _this_

---

##### `Static` getBaseData

▸ **getBaseData**(): _typeof baseData_

_Inherited from
[TypeBuilder](#code-genclassestypebuildermd).[getBaseData](#static-getbasedata)_

**Returns:** _typeof baseData_

<a name="code-genclassesdatetypemd"></a>

[@lbu/code-gen - v0.0.45](#code-genreadmemd) ›
[DateType](#code-genclassesdatetypemd)

### Class: DateType

#### Hierarchy

- [TypeBuilder](#code-genclassestypebuildermd)

  ↳ **DateType**

#### Index

##### Constructors

- [constructor](#constructor)

##### Properties

- [data](#data)
- [baseData](#static-basedata)

##### Methods

- [build](#build)
- [default](#default)
- [defaultToNow](#defaulttonow)
- [docs](#docs)
- [optional](#optional)
- [primary](#primary)
- [searchable](#searchable)
- [getBaseData](#static-getbasedata)

#### Constructors

##### constructor

\+ **new DateType**(`type`: string, `group?`: string, `name?`: string):
_[DateType](#code-genclassesdatetypemd)_

_Inherited from
[TypeBuilder](#code-genclassestypebuildermd).[constructor](#constructor)_

Create a new TypeBuilder for the provided group

**Parameters:**

| Name     | Type   |
| -------- | ------ |
| `type`   | string |
| `group?` | string |
| `name?`  | string |

**Returns:** _[DateType](#code-genclassesdatetypemd)_

#### Properties

##### data

• **data**: _typeof baseData_

_Inherited from [TypeBuilder](#code-genclassestypebuildermd).[data](#data)_

---

##### `Static` baseData

▪ **baseData**: _object_

_Inherited from
[TypeBuilder](#code-genclassestypebuildermd).[baseData](#static-basedata)_

###### Type declaration:

- **defaultValue**? : _string_

- **docString**: _string_

- **group**? : _string_

- **isOptional**: _boolean_

- **name**? : _string_

- **type**? : _string_

#### Methods

##### build

▸ **build**(): _Record‹string, any›_

_Inherited from [TypeBuilder](#code-genclassestypebuildermd).[build](#build)_

Returns a shallow copy of the data object

**Returns:** _Record‹string, any›_

---

##### default

▸ **default**(`rawString?`: string): _this_

_Inherited from
[TypeBuilder](#code-genclassestypebuildermd).[default](#default)_

Set a raw default value, also makes the type optional Can be reverted by calling
this function with undefined or null

**Parameters:**

| Name         | Type   |
| ------------ | ------ |
| `rawString?` | string |

**Returns:** _this_

---

##### defaultToNow

▸ **defaultToNow**(): _this_

**Returns:** _this_

---

##### docs

▸ **docs**(`docValue`: string): _this_

_Inherited from [TypeBuilder](#code-genclassestypebuildermd).[docs](#docs)_

Add a doc comment, some generators / types may support rendering this

**Parameters:**

| Name       | Type   |
| ---------- | ------ |
| `docValue` | string |

**Returns:** _this_

---

##### optional

▸ **optional**(): _this_

_Inherited from
[TypeBuilder](#code-genclassestypebuildermd).[optional](#optional)_

Value can be undefined

**Returns:** _this_

---

##### primary

▸ **primary**(): _this_

_Inherited from
[TypeBuilder](#code-genclassestypebuildermd).[primary](#primary)_

Set this field as primary for the 'sql' plugin

**Returns:** _this_

---

##### searchable

▸ **searchable**(): _this_

_Inherited from
[TypeBuilder](#code-genclassestypebuildermd).[searchable](#searchable)_

Set this field as searchable for the 'sql' plugin

**Returns:** _this_

---

##### `Static` getBaseData

▸ **getBaseData**(): _typeof baseData_

_Inherited from
[TypeBuilder](#code-genclassestypebuildermd).[getBaseData](#static-getbasedata)_

**Returns:** _typeof baseData_

<a name="code-genclassesgenerictypemd"></a>

[@lbu/code-gen - v0.0.45](#code-genreadmemd) ›
[GenericType](#code-genclassesgenerictypemd)

### Class: GenericType

#### Hierarchy

- [TypeBuilder](#code-genclassestypebuildermd)

  ↳ **GenericType**

#### Index

##### Constructors

- [constructor](#constructor)

##### Properties

- [data](#data)
- [baseData](#static-basedata)

##### Methods

- [build](#build)
- [default](#default)
- [docs](#docs)
- [keys](#keys)
- [optional](#optional)
- [primary](#primary)
- [searchable](#searchable)
- [values](#values)
- [getBaseData](#static-getbasedata)

#### Constructors

##### constructor

\+ **new GenericType**(`type`: string, `group?`: string, `name?`: string):
_[GenericType](#code-genclassesgenerictypemd)_

_Inherited from
[TypeBuilder](#code-genclassestypebuildermd).[constructor](#constructor)_

Create a new TypeBuilder for the provided group

**Parameters:**

| Name     | Type   |
| -------- | ------ |
| `type`   | string |
| `group?` | string |
| `name?`  | string |

**Returns:** _[GenericType](#code-genclassesgenerictypemd)_

#### Properties

##### data

• **data**: _typeof baseData_

_Inherited from [TypeBuilder](#code-genclassestypebuildermd).[data](#data)_

---

##### `Static` baseData

▪ **baseData**: _object_

_Inherited from
[TypeBuilder](#code-genclassestypebuildermd).[baseData](#static-basedata)_

###### Type declaration:

- **defaultValue**? : _string_

- **docString**: _string_

- **group**? : _string_

- **isOptional**: _boolean_

- **name**? : _string_

- **type**? : _string_

#### Methods

##### build

▸ **build**(): _Record‹string, any›_

_Inherited from [TypeBuilder](#code-genclassestypebuildermd).[build](#build)_

Returns a shallow copy of the data object

**Returns:** _Record‹string, any›_

---

##### default

▸ **default**(`rawString?`: string): _this_

_Inherited from
[TypeBuilder](#code-genclassestypebuildermd).[default](#default)_

Set a raw default value, also makes the type optional Can be reverted by calling
this function with undefined or null

**Parameters:**

| Name         | Type   |
| ------------ | ------ |
| `rawString?` | string |

**Returns:** _this_

---

##### docs

▸ **docs**(`docValue`: string): _this_

_Inherited from [TypeBuilder](#code-genclassestypebuildermd).[docs](#docs)_

Add a doc comment, some generators / types may support rendering this

**Parameters:**

| Name       | Type   |
| ---------- | ------ |
| `docValue` | string |

**Returns:** _this_

---

##### keys

▸ **keys**(`key`: [TypeBuilderLike](#typebuilderlike)): _this_

**Parameters:**

| Name  | Type                                |
| ----- | ----------------------------------- |
| `key` | [TypeBuilderLike](#typebuilderlike) |

**Returns:** _this_

---

##### optional

▸ **optional**(): _this_

_Inherited from
[TypeBuilder](#code-genclassestypebuildermd).[optional](#optional)_

Value can be undefined

**Returns:** _this_

---

##### primary

▸ **primary**(): _this_

_Inherited from
[TypeBuilder](#code-genclassestypebuildermd).[primary](#primary)_

Set this field as primary for the 'sql' plugin

**Returns:** _this_

---

##### searchable

▸ **searchable**(): _this_

_Inherited from
[TypeBuilder](#code-genclassestypebuildermd).[searchable](#searchable)_

Set this field as searchable for the 'sql' plugin

**Returns:** _this_

---

##### values

▸ **values**(`value`: [TypeBuilderLike](#typebuilderlike)): _this_

**Parameters:**

| Name    | Type                                |
| ------- | ----------------------------------- |
| `value` | [TypeBuilderLike](#typebuilderlike) |

**Returns:** _this_

---

##### `Static` getBaseData

▸ **getBaseData**(): _typeof baseData_

_Inherited from
[TypeBuilder](#code-genclassestypebuildermd).[getBaseData](#static-getbasedata)_

**Returns:** _typeof baseData_

<a name="code-genclassesnumbertypemd"></a>

[@lbu/code-gen - v0.0.45](#code-genreadmemd) ›
[NumberType](#code-genclassesnumbertypemd)

### Class: NumberType

#### Hierarchy

- [TypeBuilder](#code-genclassestypebuildermd)

  ↳ **NumberType**

#### Index

##### Constructors

- [constructor](#constructor)

##### Properties

- [data](#data)
- [baseData](#static-basedata)

##### Methods

- [build](#build)
- [convert](#convert)
- [default](#default)
- [docs](#docs)
- [integer](#integer)
- [max](#max)
- [min](#min)
- [oneOf](#oneof)
- [optional](#optional)
- [primary](#primary)
- [searchable](#searchable)
- [getBaseData](#static-getbasedata)

#### Constructors

##### constructor

\+ **new NumberType**(`type`: string, `group?`: string, `name?`: string):
_[NumberType](#code-genclassesnumbertypemd)_

_Inherited from
[TypeBuilder](#code-genclassestypebuildermd).[constructor](#constructor)_

Create a new TypeBuilder for the provided group

**Parameters:**

| Name     | Type   |
| -------- | ------ |
| `type`   | string |
| `group?` | string |
| `name?`  | string |

**Returns:** _[NumberType](#code-genclassesnumbertypemd)_

#### Properties

##### data

• **data**: _typeof baseData_

_Inherited from [TypeBuilder](#code-genclassestypebuildermd).[data](#data)_

---

##### `Static` baseData

▪ **baseData**: _object_

_Inherited from
[TypeBuilder](#code-genclassestypebuildermd).[baseData](#static-basedata)_

###### Type declaration:

- **defaultValue**? : _string_

- **docString**: _string_

- **group**? : _string_

- **isOptional**: _boolean_

- **name**? : _string_

- **type**? : _string_

#### Methods

##### build

▸ **build**(): _Record‹string, any›_

_Inherited from [TypeBuilder](#code-genclassestypebuildermd).[build](#build)_

Returns a shallow copy of the data object

**Returns:** _Record‹string, any›_

---

##### convert

▸ **convert**(): _this_

Try to convert a string to a number in the validator

**Returns:** _this_

---

##### default

▸ **default**(`rawString?`: string): _this_

_Inherited from
[TypeBuilder](#code-genclassestypebuildermd).[default](#default)_

Set a raw default value, also makes the type optional Can be reverted by calling
this function with undefined or null

**Parameters:**

| Name         | Type   |
| ------------ | ------ |
| `rawString?` | string |

**Returns:** _this_

---

##### docs

▸ **docs**(`docValue`: string): _this_

_Inherited from [TypeBuilder](#code-genclassestypebuildermd).[docs](#docs)_

Add a doc comment, some generators / types may support rendering this

**Parameters:**

| Name       | Type   |
| ---------- | ------ |
| `docValue` | string |

**Returns:** _this_

---

##### integer

▸ **integer**(): _this_

Validator enforced integer

**Returns:** _this_

---

##### max

▸ **max**(`max`: number): _this_

Validator enforced maximum value inclusive

**Parameters:**

| Name  | Type   |
| ----- | ------ |
| `max` | number |

**Returns:** _this_

---

##### min

▸ **min**(`min`: number): _this_

Validator enforced minimum value inclusive

**Parameters:**

| Name  | Type   |
| ----- | ------ |
| `min` | number |

**Returns:** _this_

---

##### oneOf

▸ **oneOf**(...`value`: number[]): _this_

Only accepts a number from the provided set

**Parameters:**

| Name       | Type     |
| ---------- | -------- |
| `...value` | number[] |

**Returns:** _this_

---

##### optional

▸ **optional**(): _this_

_Inherited from
[TypeBuilder](#code-genclassestypebuildermd).[optional](#optional)_

Value can be undefined

**Returns:** _this_

---

##### primary

▸ **primary**(): _this_

_Inherited from
[TypeBuilder](#code-genclassestypebuildermd).[primary](#primary)_

Set this field as primary for the 'sql' plugin

**Returns:** _this_

---

##### searchable

▸ **searchable**(): _this_

_Inherited from
[TypeBuilder](#code-genclassestypebuildermd).[searchable](#searchable)_

Set this field as searchable for the 'sql' plugin

**Returns:** _this_

---

##### `Static` getBaseData

▸ **getBaseData**(): _typeof baseData_

_Inherited from
[TypeBuilder](#code-genclassestypebuildermd).[getBaseData](#static-getbasedata)_

**Returns:** _typeof baseData_

<a name="code-genclassesobjecttypemd"></a>

[@lbu/code-gen - v0.0.45](#code-genreadmemd) ›
[ObjectType](#code-genclassesobjecttypemd)

### Class: ObjectType

#### Hierarchy

- [TypeBuilder](#code-genclassestypebuildermd)

  ↳ **ObjectType**

#### Index

##### Constructors

- [constructor](#constructor)

##### Properties

- [data](#data)
- [baseData](#static-basedata)

##### Methods

- [build](#build)
- [default](#default)
- [docs](#docs)
- [enableQueries](#enablequeries)
- [keys](#keys)
- [optional](#optional)
- [primary](#primary)
- [searchable](#searchable)
- [strict](#strict)
- [getBaseData](#static-getbasedata)

#### Constructors

##### constructor

\+ **new ObjectType**(`type`: string, `group?`: string, `name?`: string):
_[ObjectType](#code-genclassesobjecttypemd)_

_Inherited from
[TypeBuilder](#code-genclassestypebuildermd).[constructor](#constructor)_

Create a new TypeBuilder for the provided group

**Parameters:**

| Name     | Type   |
| -------- | ------ |
| `type`   | string |
| `group?` | string |
| `name?`  | string |

**Returns:** _[ObjectType](#code-genclassesobjecttypemd)_

#### Properties

##### data

• **data**: _typeof baseData_

_Inherited from [TypeBuilder](#code-genclassestypebuildermd).[data](#data)_

---

##### `Static` baseData

▪ **baseData**: _object_

_Inherited from
[TypeBuilder](#code-genclassestypebuildermd).[baseData](#static-basedata)_

###### Type declaration:

- **defaultValue**? : _string_

- **docString**: _string_

- **group**? : _string_

- **isOptional**: _boolean_

- **name**? : _string_

- **type**? : _string_

#### Methods

##### build

▸ **build**(): _Record‹string, any›_

_Inherited from [TypeBuilder](#code-genclassestypebuildermd).[build](#build)_

Returns a shallow copy of the data object

**Returns:** _Record‹string, any›_

---

##### default

▸ **default**(`rawString?`: string): _this_

_Inherited from
[TypeBuilder](#code-genclassestypebuildermd).[default](#default)_

Set a raw default value, also makes the type optional Can be reverted by calling
this function with undefined or null

**Parameters:**

| Name         | Type   |
| ------------ | ------ |
| `rawString?` | string |

**Returns:** _this_

---

##### docs

▸ **docs**(`docValue`: string): _this_

_Inherited from [TypeBuilder](#code-genclassestypebuildermd).[docs](#docs)_

Add a doc comment, some generators / types may support rendering this

**Parameters:**

| Name       | Type   |
| ---------- | ------ |
| `docValue` | string |

**Returns:** _this_

---

##### enableQueries

▸ **enableQueries**(`options?`: object): _this_

Generate sql queries for this object Posibbly adding createdAt and updatedAt
fields. When withHistory is true, it automatically enables withDates. Added by
the 'sql' plugin

**Parameters:**

▪`Optional` **options**: _object_

| Name           | Type    |
| -------------- | ------- |
| `withDates?`   | boolean |
| `withHistory?` | boolean |

**Returns:** _this_

---

##### keys

▸ **keys**(`obj`: Record‹string, [TypeBuilderLike](#typebuilderlike)›): _this_

**Parameters:**

| Name  | Type                                                |
| ----- | --------------------------------------------------- |
| `obj` | Record‹string, [TypeBuilderLike](#typebuilderlike)› |

**Returns:** _this_

---

##### optional

▸ **optional**(): _this_

_Inherited from
[TypeBuilder](#code-genclassestypebuildermd).[optional](#optional)_

Value can be undefined

**Returns:** _this_

---

##### primary

▸ **primary**(): _this_

_Inherited from
[TypeBuilder](#code-genclassestypebuildermd).[primary](#primary)_

Set this field as primary for the 'sql' plugin

**Returns:** _this_

---

##### searchable

▸ **searchable**(): _this_

_Inherited from
[TypeBuilder](#code-genclassestypebuildermd).[searchable](#searchable)_

Set this field as searchable for the 'sql' plugin

**Returns:** _this_

---

##### strict

▸ **strict**(): _this_

Validator enforces no extra keys

**Returns:** _this_

---

##### `Static` getBaseData

▸ **getBaseData**(): _typeof baseData_

_Inherited from
[TypeBuilder](#code-genclassestypebuildermd).[getBaseData](#static-getbasedata)_

**Returns:** _typeof baseData_

<a name="code-genclassesreferencetypemd"></a>

[@lbu/code-gen - v0.0.45](#code-genreadmemd) ›
[ReferenceType](#code-genclassesreferencetypemd)

### Class: ReferenceType

#### Hierarchy

- [TypeBuilder](#code-genclassestypebuildermd)

  ↳ **ReferenceType**

#### Index

##### Constructors

- [constructor](#constructor)

##### Properties

- [data](#data)
- [baseData](#static-basedata)

##### Methods

- [build](#build)
- [default](#default)
- [docs](#docs)
- [optional](#optional)
- [primary](#primary)
- [searchable](#searchable)
- [getBaseData](#static-getbasedata)

#### Constructors

##### constructor

\+ **new ReferenceType**(`type`: string, `group?`: string, `name?`: string):
_[ReferenceType](#code-genclassesreferencetypemd)_

_Inherited from
[TypeBuilder](#code-genclassestypebuildermd).[constructor](#constructor)_

Create a new TypeBuilder for the provided group

**Parameters:**

| Name     | Type   |
| -------- | ------ |
| `type`   | string |
| `group?` | string |
| `name?`  | string |

**Returns:** _[ReferenceType](#code-genclassesreferencetypemd)_

#### Properties

##### data

• **data**: _typeof baseData_

_Inherited from [TypeBuilder](#code-genclassestypebuildermd).[data](#data)_

---

##### `Static` baseData

▪ **baseData**: _object_

_Inherited from
[TypeBuilder](#code-genclassestypebuildermd).[baseData](#static-basedata)_

###### Type declaration:

- **defaultValue**? : _string_

- **docString**: _string_

- **group**? : _string_

- **isOptional**: _boolean_

- **name**? : _string_

- **type**? : _string_

#### Methods

##### build

▸ **build**(): _Record‹string, any›_

_Inherited from [TypeBuilder](#code-genclassestypebuildermd).[build](#build)_

Returns a shallow copy of the data object

**Returns:** _Record‹string, any›_

---

##### default

▸ **default**(`rawString?`: string): _this_

_Inherited from
[TypeBuilder](#code-genclassestypebuildermd).[default](#default)_

Set a raw default value, also makes the type optional Can be reverted by calling
this function with undefined or null

**Parameters:**

| Name         | Type   |
| ------------ | ------ |
| `rawString?` | string |

**Returns:** _this_

---

##### docs

▸ **docs**(`docValue`: string): _this_

_Inherited from [TypeBuilder](#code-genclassestypebuildermd).[docs](#docs)_

Add a doc comment, some generators / types may support rendering this

**Parameters:**

| Name       | Type   |
| ---------- | ------ |
| `docValue` | string |

**Returns:** _this_

---

##### optional

▸ **optional**(): _this_

_Inherited from
[TypeBuilder](#code-genclassestypebuildermd).[optional](#optional)_

Value can be undefined

**Returns:** _this_

---

##### primary

▸ **primary**(): _this_

_Inherited from
[TypeBuilder](#code-genclassestypebuildermd).[primary](#primary)_

Set this field as primary for the 'sql' plugin

**Returns:** _this_

---

##### searchable

▸ **searchable**(): _this_

_Inherited from
[TypeBuilder](#code-genclassestypebuildermd).[searchable](#searchable)_

Set this field as searchable for the 'sql' plugin

**Returns:** _this_

---

##### `Static` getBaseData

▸ **getBaseData**(): _typeof baseData_

_Inherited from
[TypeBuilder](#code-genclassestypebuildermd).[getBaseData](#static-getbasedata)_

**Returns:** _typeof baseData_

<a name="code-genclassesrelationtypemd"></a>

[@lbu/code-gen - v0.0.45](#code-genreadmemd) ›
[RelationType](#code-genclassesrelationtypemd)

### Class: RelationType

Stores information about a relation between 2 objects. The App knows about a
manyToOne relation will add the leftKey based on the rightKey if needed. Other
than that, this type does nothing by itself and should only aid when used by
another generator like the sql generator

#### Hierarchy

- [TypeBuilder](#code-genclassestypebuildermd)

  ↳ **RelationType**

#### Index

##### Constructors

- [constructor](#constructor)

##### Properties

- [data](#data)
- [baseData](#static-basedata)

##### Methods

- [build](#build)
- [default](#default)
- [docs](#docs)
- [manyToOne](#manytoone)
- [oneToMany](#onetomany)
- [oneToOne](#onetoone)
- [optional](#optional)
- [primary](#primary)
- [searchable](#searchable)
- [getBaseData](#static-getbasedata)

#### Constructors

##### constructor

\+ **new RelationType**(): _[RelationType](#code-genclassesrelationtypemd)_

_Overrides
[TypeBuilder](#code-genclassestypebuildermd).[constructor](#constructor)_

**Returns:** _[RelationType](#code-genclassesrelationtypemd)_

#### Properties

##### data

• **data**: _typeof baseData_

_Inherited from [TypeBuilder](#code-genclassestypebuildermd).[data](#data)_

---

##### `Static` baseData

▪ **baseData**: _object_

_Inherited from
[TypeBuilder](#code-genclassestypebuildermd).[baseData](#static-basedata)_

###### Type declaration:

- **defaultValue**? : _string_

- **docString**: _string_

- **group**? : _string_

- **isOptional**: _boolean_

- **name**? : _string_

- **type**? : _string_

#### Methods

##### build

▸ **build**(): _Record‹string, any›_

_Inherited from [TypeBuilder](#code-genclassestypebuildermd).[build](#build)_

Returns a shallow copy of the data object

**Returns:** _Record‹string, any›_

---

##### default

▸ **default**(`rawString?`: string): _this_

_Inherited from
[TypeBuilder](#code-genclassestypebuildermd).[default](#default)_

Set a raw default value, also makes the type optional Can be reverted by calling
this function with undefined or null

**Parameters:**

| Name         | Type   |
| ------------ | ------ |
| `rawString?` | string |

**Returns:** _this_

---

##### docs

▸ **docs**(`docValue`: string): _this_

_Inherited from [TypeBuilder](#code-genclassestypebuildermd).[docs](#docs)_

Add a doc comment, some generators / types may support rendering this

**Parameters:**

| Name       | Type   |
| ---------- | ------ |
| `docValue` | string |

**Returns:** _this_

---

##### manyToOne

▸ **manyToOne**(`left`: [TypeBuilder](#code-genclassestypebuildermd), `leftKey`:
string, `right`: [TypeBuilder](#code-genclassestypebuildermd), `rightKey`:
string, `substituteKey`: string): _this_

Denote a N-1 relation i.e Item (left) is owned by User (right)

**Parameters:**

| Name            | Type                                         |
| --------------- | -------------------------------------------- |
| `left`          | [TypeBuilder](#code-genclassestypebuildermd) |
| `leftKey`       | string                                       |
| `right`         | [TypeBuilder](#code-genclassestypebuildermd) |
| `rightKey`      | string                                       |
| `substituteKey` | string                                       |

**Returns:** _this_

---

##### oneToMany

▸ **oneToMany**(`left`: [TypeBuilder](#code-genclassestypebuildermd), `leftKey`:
string, `right`: [TypeBuilder](#code-genclassestypebuildermd), `rightKey`:
string, `substituteKey`: string): _this_

Denote a 1-N relation i.e User (left) has multiple Item (right)

**Parameters:**

| Name            | Type                                         |
| --------------- | -------------------------------------------- |
| `left`          | [TypeBuilder](#code-genclassestypebuildermd) |
| `leftKey`       | string                                       |
| `right`         | [TypeBuilder](#code-genclassestypebuildermd) |
| `rightKey`      | string                                       |
| `substituteKey` | string                                       |

**Returns:** _this_

---

##### oneToOne

▸ **oneToOne**(`left`: [TypeBuilder](#code-genclassestypebuildermd), `leftKey`:
string, `right`: [TypeBuilder](#code-genclassestypebuildermd), `rightKey`:
string, `substituteKey`: string): _this_

Denote a 1-1 relation

**Parameters:**

| Name            | Type                                         |
| --------------- | -------------------------------------------- |
| `left`          | [TypeBuilder](#code-genclassestypebuildermd) |
| `leftKey`       | string                                       |
| `right`         | [TypeBuilder](#code-genclassestypebuildermd) |
| `rightKey`      | string                                       |
| `substituteKey` | string                                       |

**Returns:** _this_

---

##### optional

▸ **optional**(): _this_

_Inherited from
[TypeBuilder](#code-genclassestypebuildermd).[optional](#optional)_

Value can be undefined

**Returns:** _this_

---

##### primary

▸ **primary**(): _this_

_Inherited from
[TypeBuilder](#code-genclassestypebuildermd).[primary](#primary)_

Set this field as primary for the 'sql' plugin

**Returns:** _this_

---

##### searchable

▸ **searchable**(): _this_

_Inherited from
[TypeBuilder](#code-genclassestypebuildermd).[searchable](#searchable)_

Set this field as searchable for the 'sql' plugin

**Returns:** _this_

---

##### `Static` getBaseData

▸ **getBaseData**(): _typeof baseData_

_Inherited from
[TypeBuilder](#code-genclassestypebuildermd).[getBaseData](#static-getbasedata)_

**Returns:** _typeof baseData_

<a name="code-genclassesroutebuildermd"></a>

[@lbu/code-gen - v0.0.45](#code-genreadmemd) ›
[RouteBuilder](#code-genclassesroutebuildermd)

### Class: RouteBuilder

'Router' plugin provided custom builder for api routes

#### Hierarchy

- [TypeBuilder](#code-genclassestypebuildermd)

  ↳ **RouteBuilder**

#### Index

##### Constructors

- [constructor](#constructor)

##### Properties

- [data](#data)
- [baseData](#static-basedata)

##### Methods

- [body](#body)
- [build](#build)
- [default](#default)
- [docs](#docs)
- [optional](#optional)
- [params](#params)
- [primary](#primary)
- [query](#query)
- [response](#response)
- [searchable](#searchable)
- [tags](#tags)
- [getBaseData](#static-getbasedata)

#### Constructors

##### constructor

\+ **new RouteBuilder**(`type`: string, `group?`: string, `name?`: string):
_[RouteBuilder](#code-genclassesroutebuildermd)_

_Inherited from
[TypeBuilder](#code-genclassestypebuildermd).[constructor](#constructor)_

Create a new TypeBuilder for the provided group

**Parameters:**

| Name     | Type   |
| -------- | ------ |
| `type`   | string |
| `group?` | string |
| `name?`  | string |

**Returns:** _[RouteBuilder](#code-genclassesroutebuildermd)_

#### Properties

##### data

• **data**: _typeof baseData_

_Inherited from [TypeBuilder](#code-genclassestypebuildermd).[data](#data)_

---

##### `Static` baseData

▪ **baseData**: _object_

_Inherited from
[TypeBuilder](#code-genclassestypebuildermd).[baseData](#static-basedata)_

###### Type declaration:

- **defaultValue**? : _string_

- **docString**: _string_

- **group**? : _string_

- **isOptional**: _boolean_

- **name**? : _string_

- **type**? : _string_

#### Methods

##### body

▸ **body**(`builder`: [TypeBuilderLike](#typebuilderlike)): _this_

Type of accepted body parameters

**Parameters:**

| Name      | Type                                |
| --------- | ----------------------------------- |
| `builder` | [TypeBuilderLike](#typebuilderlike) |

**Returns:** _this_

---

##### build

▸ **build**(): _Record‹string, any›_

_Inherited from [TypeBuilder](#code-genclassestypebuildermd).[build](#build)_

Returns a shallow copy of the data object

**Returns:** _Record‹string, any›_

---

##### default

▸ **default**(`rawString?`: string): _this_

_Inherited from
[TypeBuilder](#code-genclassestypebuildermd).[default](#default)_

Set a raw default value, also makes the type optional Can be reverted by calling
this function with undefined or null

**Parameters:**

| Name         | Type   |
| ------------ | ------ |
| `rawString?` | string |

**Returns:** _this_

---

##### docs

▸ **docs**(`docValue`: string): _this_

_Inherited from [TypeBuilder](#code-genclassestypebuildermd).[docs](#docs)_

Add a doc comment, some generators / types may support rendering this

**Parameters:**

| Name       | Type   |
| ---------- | ------ |
| `docValue` | string |

**Returns:** _this_

---

##### optional

▸ **optional**(): _this_

_Inherited from
[TypeBuilder](#code-genclassestypebuildermd).[optional](#optional)_

Value can be undefined

**Returns:** _this_

---

##### params

▸ **params**(`builder`: [TypeBuilderLike](#typebuilderlike)): _this_

Type of accepted path parameters

**Parameters:**

| Name      | Type                                |
| --------- | ----------------------------------- |
| `builder` | [TypeBuilderLike](#typebuilderlike) |

**Returns:** _this_

---

##### primary

▸ **primary**(): _this_

_Inherited from
[TypeBuilder](#code-genclassestypebuildermd).[primary](#primary)_

Set this field as primary for the 'sql' plugin

**Returns:** _this_

---

##### query

▸ **query**(`builder`: [TypeBuilderLike](#typebuilderlike)): _this_

Type of accepted query parameters

**Parameters:**

| Name      | Type                                |
| --------- | ----------------------------------- |
| `builder` | [TypeBuilderLike](#typebuilderlike) |

**Returns:** _this_

---

##### response

▸ **response**(`builder`: [TypeBuilderLike](#typebuilderlike)): _this_

Route response type

**Parameters:**

| Name      | Type                                |
| --------- | ----------------------------------- |
| `builder` | [TypeBuilderLike](#typebuilderlike) |

**Returns:** _this_

---

##### searchable

▸ **searchable**(): _this_

_Inherited from
[TypeBuilder](#code-genclassestypebuildermd).[searchable](#searchable)_

Set this field as searchable for the 'sql' plugin

**Returns:** _this_

---

##### tags

▸ **tags**(...`value`: string[]): _this_

Add tags to this route. Tag handlers are executed before group and specific
route handlers

**Parameters:**

| Name       | Type     |
| ---------- | -------- |
| `...value` | string[] |

**Returns:** _this_

---

##### `Static` getBaseData

▸ **getBaseData**(): _typeof baseData_

_Inherited from
[TypeBuilder](#code-genclassestypebuildermd).[getBaseData](#static-getbasedata)_

**Returns:** _typeof baseData_

<a name="code-genclassesroutecreatormd"></a>

[@lbu/code-gen - v0.0.45](#code-genreadmemd) ›
[RouteCreator](#code-genclassesroutecreatormd)

### Class: RouteCreator

#### Hierarchy

- **RouteCreator**

#### Index

##### Methods

- [delete](#delete)
- [get](#get)
- [group](#group)
- [head](#head)
- [post](#post)
- [put](#put)

#### Methods

##### delete

▸ **delete**(`path?`: string, `name?`: string): _any_

DELETE route

**Parameters:**

| Name    | Type   |
| ------- | ------ |
| `path?` | string |
| `name?` | string |

**Returns:** _any_

---

##### get

▸ **get**(`path?`: string, `name?`: string): _any_

GET route

**Parameters:**

| Name    | Type   |
| ------- | ------ |
| `path?` | string |
| `name?` | string |

**Returns:** _any_

---

##### group

▸ **group**(`name`: string, `path`: string): _this_

Create a new route group Path will be concatenated with the current path of this
group

**Parameters:**

| Name   | Type   |
| ------ | ------ |
| `name` | string |
| `path` | string |

**Returns:** _this_

---

##### head

▸ **head**(`path?`: string, `name?`: string): _any_

HEAD route

**Parameters:**

| Name    | Type   |
| ------- | ------ |
| `path?` | string |
| `name?` | string |

**Returns:** _any_

---

##### post

▸ **post**(`path?`: string, `name?`: string): _any_

POST route

**Parameters:**

| Name    | Type   |
| ------- | ------ |
| `path?` | string |
| `name?` | string |

**Returns:** _any_

---

##### put

▸ **put**(`path?`: string, `name?`: string): _any_

PUT route

**Parameters:**

| Name    | Type   |
| ------- | ------ |
| `path?` | string |
| `name?` | string |

**Returns:** _any_

<a name="code-genclassesstringtypemd"></a>

[@lbu/code-gen - v0.0.45](#code-genreadmemd) ›
[StringType](#code-genclassesstringtypemd)

### Class: StringType

#### Hierarchy

- [TypeBuilder](#code-genclassestypebuildermd)

  ↳ **StringType**

#### Index

##### Constructors

- [constructor](#constructor)

##### Properties

- [data](#data)
- [baseData](#static-basedata)

##### Methods

- [build](#build)
- [convert](#convert)
- [default](#default)
- [docs](#docs)
- [lowerCase](#lowercase)
- [max](#max)
- [min](#min)
- [oneOf](#oneof)
- [optional](#optional)
- [pattern](#pattern)
- [primary](#primary)
- [searchable](#searchable)
- [trim](#trim)
- [upperCase](#uppercase)
- [getBaseData](#static-getbasedata)

#### Constructors

##### constructor

\+ **new StringType**(`type`: string, `group?`: string, `name?`: string):
_[StringType](#code-genclassesstringtypemd)_

_Inherited from
[TypeBuilder](#code-genclassestypebuildermd).[constructor](#constructor)_

Create a new TypeBuilder for the provided group

**Parameters:**

| Name     | Type   |
| -------- | ------ |
| `type`   | string |
| `group?` | string |
| `name?`  | string |

**Returns:** _[StringType](#code-genclassesstringtypemd)_

#### Properties

##### data

• **data**: _typeof baseData_

_Inherited from [TypeBuilder](#code-genclassestypebuildermd).[data](#data)_

---

##### `Static` baseData

▪ **baseData**: _object_

_Inherited from
[TypeBuilder](#code-genclassestypebuildermd).[baseData](#static-basedata)_

###### Type declaration:

- **defaultValue**? : _string_

- **docString**: _string_

- **group**? : _string_

- **isOptional**: _boolean_

- **name**? : _string_

- **type**? : _string_

#### Methods

##### build

▸ **build**(): _Record‹string, any›_

_Inherited from [TypeBuilder](#code-genclassestypebuildermd).[build](#build)_

Returns a shallow copy of the data object

**Returns:** _Record‹string, any›_

---

##### convert

▸ **convert**(): _this_

Validator tries to convert to string

**Returns:** _this_

---

##### default

▸ **default**(`rawString?`: string): _this_

_Inherited from
[TypeBuilder](#code-genclassestypebuildermd).[default](#default)_

Set a raw default value, also makes the type optional Can be reverted by calling
this function with undefined or null

**Parameters:**

| Name         | Type   |
| ------------ | ------ |
| `rawString?` | string |

**Returns:** _this_

---

##### docs

▸ **docs**(`docValue`: string): _this_

_Inherited from [TypeBuilder](#code-genclassestypebuildermd).[docs](#docs)_

Add a doc comment, some generators / types may support rendering this

**Parameters:**

| Name       | Type   |
| ---------- | ------ |
| `docValue` | string |

**Returns:** _this_

---

##### lowerCase

▸ **lowerCase**(): _this_

Validator lower cases the input

**Returns:** _this_

---

##### max

▸ **max**(`max`: number): _this_

Validator enforced maximum length inclusive

**Parameters:**

| Name  | Type   |
| ----- | ------ |
| `max` | number |

**Returns:** _this_

---

##### min

▸ **min**(`min`: number): _this_

Validator enforced minimum length inclusive

**Parameters:**

| Name  | Type   |
| ----- | ------ |
| `min` | number |

**Returns:** _this_

---

##### oneOf

▸ **oneOf**(...`values`: string[]): _this_

Only accepts a string from the provided set. Also the way to make enums

**Parameters:**

| Name        | Type     |
| ----------- | -------- |
| `...values` | string[] |

**Returns:** _this_

---

##### optional

▸ **optional**(): _this_

_Inherited from
[TypeBuilder](#code-genclassestypebuildermd).[optional](#optional)_

Value can be undefined

**Returns:** _this_

---

##### pattern

▸ **pattern**(`pattern`: RegExp): _this_

Validator enforced pattern

**Parameters:**

| Name      | Type   |
| --------- | ------ |
| `pattern` | RegExp |

**Returns:** _this_

---

##### primary

▸ **primary**(): _this_

_Inherited from
[TypeBuilder](#code-genclassestypebuildermd).[primary](#primary)_

Set this field as primary for the 'sql' plugin

**Returns:** _this_

---

##### searchable

▸ **searchable**(): _this_

_Inherited from
[TypeBuilder](#code-genclassestypebuildermd).[searchable](#searchable)_

Set this field as searchable for the 'sql' plugin

**Returns:** _this_

---

##### trim

▸ **trim**(): _this_

Validator trims the input

**Returns:** _this_

---

##### upperCase

▸ **upperCase**(): _this_

Validator upper cases the input

**Returns:** _this_

---

##### `Static` getBaseData

▸ **getBaseData**(): _typeof baseData_

_Inherited from
[TypeBuilder](#code-genclassestypebuildermd).[getBaseData](#static-getbasedata)_

**Returns:** _typeof baseData_

<a name="code-genclassestypebuildermd"></a>

[@lbu/code-gen - v0.0.45](#code-genreadmemd) ›
[TypeBuilder](#code-genclassestypebuildermd)

### Class: TypeBuilder

Provide base properties for types This includes the 'type', optional, docs and
default value. Also contains group and name information

#### Hierarchy

- **TypeBuilder**

  ↳ [RouteBuilder](#code-genclassesroutebuildermd)

  ↳ [AnyType](#code-genclassesanytypemd)

  ↳ [AnyOfType](#code-genclassesanyoftypemd)

  ↳ [ArrayType](#code-genclassesarraytypemd)

  ↳ [BooleanType](#code-genclassesbooleantypemd)

  ↳ [DateType](#code-genclassesdatetypemd)

  ↳ [GenericType](#code-genclassesgenerictypemd)

  ↳ [NumberType](#code-genclassesnumbertypemd)

  ↳ [ObjectType](#code-genclassesobjecttypemd)

  ↳ [RelationType](#code-genclassesrelationtypemd)

  ↳ [ReferenceType](#code-genclassesreferencetypemd)

  ↳ [StringType](#code-genclassesstringtypemd)

  ↳ [UuidType](#code-genclassesuuidtypemd)

#### Index

##### Constructors

- [constructor](#constructor)

##### Properties

- [data](#data)
- [baseData](#static-basedata)

##### Methods

- [build](#build)
- [default](#default)
- [docs](#docs)
- [optional](#optional)
- [primary](#primary)
- [searchable](#searchable)
- [getBaseData](#static-getbasedata)

#### Constructors

##### constructor

\+ **new TypeBuilder**(`type`: string, `group?`: string, `name?`: string):
_[TypeBuilder](#code-genclassestypebuildermd)_

Create a new TypeBuilder for the provided group

**Parameters:**

| Name     | Type   |
| -------- | ------ |
| `type`   | string |
| `group?` | string |
| `name?`  | string |

**Returns:** _[TypeBuilder](#code-genclassestypebuildermd)_

#### Properties

##### data

• **data**: _typeof baseData_

---

##### `Static` baseData

▪ **baseData**: _object_

###### Type declaration:

- **defaultValue**? : _string_

- **docString**: _string_

- **group**? : _string_

- **isOptional**: _boolean_

- **name**? : _string_

- **type**? : _string_

#### Methods

##### build

▸ **build**(): _Record‹string, any›_

Returns a shallow copy of the data object

**Returns:** _Record‹string, any›_

---

##### default

▸ **default**(`rawString?`: string): _this_

Set a raw default value, also makes the type optional Can be reverted by calling
this function with undefined or null

**Parameters:**

| Name         | Type   |
| ------------ | ------ |
| `rawString?` | string |

**Returns:** _this_

---

##### docs

▸ **docs**(`docValue`: string): _this_

Add a doc comment, some generators / types may support rendering this

**Parameters:**

| Name       | Type   |
| ---------- | ------ |
| `docValue` | string |

**Returns:** _this_

---

##### optional

▸ **optional**(): _this_

Value can be undefined

**Returns:** _this_

---

##### primary

▸ **primary**(): _this_

Set this field as primary for the 'sql' plugin

**Returns:** _this_

---

##### searchable

▸ **searchable**(): _this_

Set this field as searchable for the 'sql' plugin

**Returns:** _this_

---

##### `Static` getBaseData

▸ **getBaseData**(): _typeof baseData_

**Returns:** _typeof baseData_

<a name="code-genclassestypecreatormd"></a>

[@lbu/code-gen - v0.0.45](#code-genreadmemd) ›
[TypeCreator](#code-genclassestypecreatormd)

### Class: TypeCreator

Create new instances of registered types and manages grups Also keeps a Map of
registered types on TypeCreator.types

Note that all functions that return a `T extends TypeBuilder` are dynamically
added and provided by the core.

#### Hierarchy

- **TypeCreator**

#### Index

##### Constructors

- [constructor](#constructor)

##### Properties

- [types](#static-types)

##### Methods

- [any](#any)
- [anyOf](#anyof)
- [array](#array)
- [bool](#bool)
- [date](#date)
- [generic](#generic)
- [number](#number)
- [object](#object)
- [reference](#reference)
- [router](#router)
- [string](#string)
- [uuid](#uuid)
- [getTypesWithProperty](#static-gettypeswithproperty)

#### Constructors

##### constructor

\+ **new TypeCreator**(`group?`: string):
_[TypeCreator](#code-genclassestypecreatormd)_

**Parameters:**

| Name     | Type   |
| -------- | ------ |
| `group?` | string |

**Returns:** _[TypeCreator](#code-genclassestypecreatormd)_

#### Properties

##### `Static` types

▪ **types**: _Map‹string, [TypePlugin](#code-geninterfacestypepluginmd)‹any››_

Registry of all type plugins

#### Methods

##### any

▸ **any**(`name?`: string): _[AnyType](#code-genclassesanytypemd)_

**Parameters:**

| Name    | Type   |
| ------- | ------ |
| `name?` | string |

**Returns:** _[AnyType](#code-genclassesanytypemd)_

---

##### anyOf

▸ **anyOf**(`name?`: string): _[AnyOfType](#code-genclassesanyoftypemd)_

**Parameters:**

| Name    | Type   |
| ------- | ------ |
| `name?` | string |

**Returns:** _[AnyOfType](#code-genclassesanyoftypemd)_

---

##### array

▸ **array**(`name?`: string): _[ArrayType](#code-genclassesarraytypemd)_

**Parameters:**

| Name    | Type   |
| ------- | ------ |
| `name?` | string |

**Returns:** _[ArrayType](#code-genclassesarraytypemd)_

---

##### bool

▸ **bool**(`name?`: string): _[BooleanType](#code-genclassesbooleantypemd)_

**Parameters:**

| Name    | Type   |
| ------- | ------ |
| `name?` | string |

**Returns:** _[BooleanType](#code-genclassesbooleantypemd)_

---

##### date

▸ **date**(`name?`: string): _[DateType](#code-genclassesdatetypemd)_

**Parameters:**

| Name    | Type   |
| ------- | ------ |
| `name?` | string |

**Returns:** _[DateType](#code-genclassesdatetypemd)_

---

##### generic

▸ **generic**(`name?`: string): _[GenericType](#code-genclassesgenerictypemd)_

**Parameters:**

| Name    | Type   |
| ------- | ------ |
| `name?` | string |

**Returns:** _[GenericType](#code-genclassesgenerictypemd)_

---

##### number

▸ **number**(`name?`: string): _[NumberType](#code-genclassesnumbertypemd)_

**Parameters:**

| Name    | Type   |
| ------- | ------ |
| `name?` | string |

**Returns:** _[NumberType](#code-genclassesnumbertypemd)_

---

##### object

▸ **object**(`name?`: string): _[ObjectType](#code-genclassesobjecttypemd)_

**Parameters:**

| Name    | Type   |
| ------- | ------ |
| `name?` | string |

**Returns:** _[ObjectType](#code-genclassesobjecttypemd)_

---

##### reference

▸ **reference**(`groupOrOther?`: string |
[TypeBuilder](#code-genclassestypebuildermd), `name?`: string):
_[ReferenceType](#code-genclassesreferencetypemd)_

**Parameters:**

| Name            | Type                                                       |
| --------------- | ---------------------------------------------------------- |
| `groupOrOther?` | string &#124; [TypeBuilder](#code-genclassestypebuildermd) |
| `name?`         | string                                                     |

**Returns:** _[ReferenceType](#code-genclassesreferencetypemd)_

---

##### router

▸ **router**(`path`: string): _[RouteCreator](#code-genclassesroutecreatormd)_

Create a new RouteCreator Provided by the 'router' generator

**Parameters:**

| Name   | Type   |
| ------ | ------ |
| `path` | string |

**Returns:** _[RouteCreator](#code-genclassesroutecreatormd)_

---

##### string

▸ **string**(`name?`: string): _[StringType](#code-genclassesstringtypemd)_

**Parameters:**

| Name    | Type   |
| ------- | ------ |
| `name?` | string |

**Returns:** _[StringType](#code-genclassesstringtypemd)_

---

##### uuid

▸ **uuid**(`name?`: string): _[UuidType](#code-genclassesuuidtypemd)_

**Parameters:**

| Name    | Type   |
| ------- | ------ |
| `name?` | string |

**Returns:** _[UuidType](#code-genclassesuuidtypemd)_

---

##### `Static` getTypesWithProperty

▸ **getTypesWithProperty**(`property`: string):
_[TypePlugin](#code-geninterfacestypepluginmd)‹any›[]_

Return a list of type plugins that have the specified property

**Parameters:**

| Name       | Type   |
| ---------- | ------ |
| `property` | string |

**Returns:** _[TypePlugin](#code-geninterfacestypepluginmd)‹any›[]_

<a name="code-genclassesuuidtypemd"></a>

[@lbu/code-gen - v0.0.45](#code-genreadmemd) ›
[UuidType](#code-genclassesuuidtypemd)

### Class: UuidType

#### Hierarchy

- [TypeBuilder](#code-genclassestypebuildermd)

  ↳ **UuidType**

#### Index

##### Constructors

- [constructor](#constructor)

##### Properties

- [data](#data)
- [baseData](#static-basedata)

##### Methods

- [build](#build)
- [default](#default)
- [docs](#docs)
- [optional](#optional)
- [primary](#primary)
- [searchable](#searchable)
- [getBaseData](#static-getbasedata)

#### Constructors

##### constructor

\+ **new UuidType**(`type`: string, `group?`: string, `name?`: string):
_[UuidType](#code-genclassesuuidtypemd)_

_Inherited from
[TypeBuilder](#code-genclassestypebuildermd).[constructor](#constructor)_

Create a new TypeBuilder for the provided group

**Parameters:**

| Name     | Type   |
| -------- | ------ |
| `type`   | string |
| `group?` | string |
| `name?`  | string |

**Returns:** _[UuidType](#code-genclassesuuidtypemd)_

#### Properties

##### data

• **data**: _typeof baseData_

_Inherited from [TypeBuilder](#code-genclassestypebuildermd).[data](#data)_

---

##### `Static` baseData

▪ **baseData**: _object_

_Inherited from
[TypeBuilder](#code-genclassestypebuildermd).[baseData](#static-basedata)_

###### Type declaration:

- **defaultValue**? : _string_

- **docString**: _string_

- **group**? : _string_

- **isOptional**: _boolean_

- **name**? : _string_

- **type**? : _string_

#### Methods

##### build

▸ **build**(): _Record‹string, any›_

_Inherited from [TypeBuilder](#code-genclassestypebuildermd).[build](#build)_

Returns a shallow copy of the data object

**Returns:** _Record‹string, any›_

---

##### default

▸ **default**(`rawString?`: string): _this_

_Inherited from
[TypeBuilder](#code-genclassestypebuildermd).[default](#default)_

Set a raw default value, also makes the type optional Can be reverted by calling
this function with undefined or null

**Parameters:**

| Name         | Type   |
| ------------ | ------ |
| `rawString?` | string |

**Returns:** _this_

---

##### docs

▸ **docs**(`docValue`: string): _this_

_Inherited from [TypeBuilder](#code-genclassestypebuildermd).[docs](#docs)_

Add a doc comment, some generators / types may support rendering this

**Parameters:**

| Name       | Type   |
| ---------- | ------ |
| `docValue` | string |

**Returns:** _this_

---

##### optional

▸ **optional**(): _this_

_Inherited from
[TypeBuilder](#code-genclassestypebuildermd).[optional](#optional)_

Value can be undefined

**Returns:** _this_

---

##### primary

▸ **primary**(): _this_

_Inherited from
[TypeBuilder](#code-genclassestypebuildermd).[primary](#primary)_

Set this field as primary for the 'sql' plugin

**Returns:** _this_

---

##### searchable

▸ **searchable**(): _this_

_Inherited from
[TypeBuilder](#code-genclassestypebuildermd).[searchable](#searchable)_

Set this field as searchable for the 'sql' plugin

**Returns:** _this_

---

##### `Static` getBaseData

▸ **getBaseData**(): _typeof baseData_

_Inherited from
[TypeBuilder](#code-genclassestypebuildermd).[getBaseData](#static-getbasedata)_

**Returns:** _typeof baseData_

## Interfaces

<a name="code-geninterfacesappoptsmd"></a>

[@lbu/code-gen - v0.0.45](#code-genreadmemd) ›
[AppOpts](#code-geninterfacesappoptsmd)

### Interface: AppOpts

#### Hierarchy

- **AppOpts**

#### Index

##### Properties

- [verbose](#optional-verbose)

#### Properties

##### `Optional` verbose

• **verbose**? : _boolean_

<a name="code-geninterfacesgeneratedfilemd"></a>

[@lbu/code-gen - v0.0.45](#code-genreadmemd) ›
[GeneratedFile](#code-geninterfacesgeneratedfilemd)

### Interface: GeneratedFile

#### Hierarchy

- **GeneratedFile**

#### Index

##### Properties

- [path](#path)
- [source](#source)

#### Properties

##### path

• **path**: _string_

Relative path to the outputDirectory

---

##### source

• **source**: _string_

Generated source string

<a name="code-geninterfacesgenerateoptsmd"></a>

[@lbu/code-gen - v0.0.45](#code-genreadmemd) ›
[GenerateOpts](#code-geninterfacesgenerateoptsmd)

### Interface: GenerateOpts

#### Hierarchy

- **GenerateOpts**

#### Index

##### Properties

- [dumpStructure](#optional-dumpstructure)
- [enabledGenerators](#optional-enabledgenerators)
- [enabledGroups](#optional-enabledgroups)
- [fileHeader](#optional-fileheader)
- [outputDirectory](#outputdirectory)
- [useStubGenerators](#optional-usestubgenerators)
- [useTypescript](#optional-usetypescript)

#### Properties

##### `Optional` dumpStructure

• **dumpStructure**? : _boolean_

Dump a structure.js file with the used payload in it

---

##### `Optional` enabledGenerators

• **enabledGenerators**? : _string[]_

Enabling specific generators. If this is undefined, all registered generators
are enabled

---

##### `Optional` enabledGroups

• **enabledGroups**? : _string[]_

Enabling specific groups so different generator combinations can be used. The
machinery will automatically find referenced types and include those If this is
undefined, all groups will be enabled

---

##### `Optional` fileHeader

• **fileHeader**? : _string_

Custom file header to for example disable linting or something

---

##### outputDirectory

• **outputDirectory**: _string_

Directory to write the files to

---

##### `Optional` useStubGenerators

• **useStubGenerators**? : _boolean_

Some generators support so called stub generation. This often outputs the types
only and doesn't include any real code.

---

##### `Optional` useTypescript

• **useTypescript**? : _boolean_

Enable Typescript for the generators that support it

<a name="code-geninterfacesgeneratorpluginmd"></a>

[@lbu/code-gen - v0.0.45](#code-genreadmemd) ›
[GeneratorPlugin](#code-geninterfacesgeneratorpluginmd)

### Interface: GeneratorPlugin

#### Hierarchy

- **GeneratorPlugin**

#### Index

##### Properties

- [generate](#optional-generate)
- [init](#optional-init)
- [name](#name)
- [preGenerate](#optional-pregenerate)

#### Properties

##### `Optional` generate

• **generate**? : _function_

Compile dynamic templates, execute templates and return the GeneratedFiles Can
be called multiple times

###### Type declaration:

▸ (`app`: [App](#code-genclassesappmd), `data`: object, `options`:
[GenerateOpts](#code-geninterfacesgenerateoptsmd)):
_[GeneratedFile](#code-geninterfacesgeneratedfilemd) |
[GeneratedFile](#code-geninterfacesgeneratedfilemd)[] |
Promise‹[GeneratedFile](#code-geninterfacesgeneratedfilemd)› |
Promise‹[GeneratedFile](#code-geninterfacesgeneratedfilemd)[]›_

**Parameters:**

| Name      | Type                                              |
| --------- | ------------------------------------------------- |
| `app`     | [App](#code-genclassesappmd)                      |
| `data`    | object                                            |
| `options` | [GenerateOpts](#code-geninterfacesgenerateoptsmd) |

---

##### `Optional` init

• **init**? : _function_

Compile static templates and do other static checks

###### Type declaration:

▸ (): _void | Promise‹void›_

---

##### name

• **name**: _string_

Generator name

---

##### `Optional` preGenerate

• **preGenerate**? : _function_

Add dynamic types to app. Can be called multiple times

###### Type declaration:

▸ (`app`: [App](#code-genclassesappmd), `data`: object, `options`:
[GenerateOpts](#code-geninterfacesgenerateoptsmd)): _void | Promise‹void›_

**Parameters:**

| Name      | Type                                              |
| --------- | ------------------------------------------------- |
| `app`     | [App](#code-genclassesappmd)                      |
| `data`    | object                                            |
| `options` | [GenerateOpts](#code-geninterfacesgenerateoptsmd) |

<a name="code-geninterfacestypebuilderlikearraymd"></a>

[@lbu/code-gen - v0.0.45](#code-genreadmemd) ›
[TypeBuilderLikeArray](#code-geninterfacestypebuilderlikearraymd)

### Interface: TypeBuilderLikeArray

#### Hierarchy

- [Array](#array)‹[TypeBuilderLike](#typebuilderlike)›

  ↳ **TypeBuilderLikeArray**

#### Indexable

- \[ **n**: _number_\]: [TypeBuilderLike](#typebuilderlike)

#### Index

##### Properties

- [Array](#array)
- [length](#length)

##### Methods

- [[Symbol.iterator]](typebuilderlikearray.md#[symbol.iterator])
- [[Symbol.unscopables]](typebuilderlikearray.md#[symbol.unscopables])
- [concat](#concat)
- [copyWithin](#copywithin)
- [entries](#entries)
- [every](#every)
- [fill](#fill)
- [filter](#filter)
- [find](#find)
- [findIndex](#findindex)
- [forEach](#foreach)
- [includes](#includes)
- [indexOf](#indexof)
- [join](#join)
- [keys](#keys)
- [lastIndexOf](#lastindexof)
- [map](#map)
- [pop](#pop)
- [push](#push)
- [reduce](#reduce)
- [reduceRight](#reduceright)
- [reverse](#reverse)
- [shift](#shift)
- [slice](#slice)
- [some](#some)
- [sort](#sort)
- [splice](#splice)
- [toLocaleString](#tolocalestring)
- [toString](#tostring)
- [unshift](#unshift)
- [values](#values)

#### Properties

##### Array

• **Array**: _ArrayConstructor_

---

##### length

• **length**: _number_

_Inherited from
[TypeBuilderLikeArray](#code-geninterfacestypebuilderlikearraymd).[length](#length)_

Gets or sets the length of the array. This is a number one higher than the
highest element defined in an array.

#### Methods

##### [Symbol.iterator]

▸ **[Symbol.iterator]**():
_IterableIterator‹[TypeBuilderLike](#typebuilderlike)›_

_Inherited from
[TypeBuilderLikeArray](#code-geninterfacestypebuilderlikearraymd).[[Symbol.iterator]](typebuilderlikearray.md#[symbol.iterator])_

Iterator

**Returns:** _IterableIterator‹[TypeBuilderLike](#typebuilderlike)›_

---

##### [Symbol.unscopables]

▸ **[Symbol.unscopables]**(): _object_

_Inherited from
[TypeBuilderLikeArray](#code-geninterfacestypebuilderlikearraymd).[[Symbol.unscopables]](typebuilderlikearray.md#[symbol.unscopables])_

Returns an object whose properties have the value 'true' when they will be
absent when used in a 'with' statement.

**Returns:** _object_

- **copyWithin**: _boolean_

- **entries**: _boolean_

- **fill**: _boolean_

- **find**: _boolean_

- **findIndex**: _boolean_

- **keys**: _boolean_

- **values**: _boolean_

---

##### concat

▸ **concat**(...`items`: ConcatArray‹[TypeBuilderLike](#typebuilderlike)›[]):
_[TypeBuilderLike](#typebuilderlike)[]_

_Inherited from
[TypeBuilderLikeArray](#code-geninterfacestypebuilderlikearraymd).[concat](#concat)_

Combines two or more arrays.

**Parameters:**

| Name       | Type                                               | Description                                   |
| ---------- | -------------------------------------------------- | --------------------------------------------- |
| `...items` | ConcatArray‹[TypeBuilderLike](#typebuilderlike)›[] | Additional items to add to the end of array1. |

**Returns:** _[TypeBuilderLike](#typebuilderlike)[]_

▸ **concat**(...`items`: T | ConcatArray‹T›[]):
_[TypeBuilderLike](#typebuilderlike)[]_

_Inherited from
[TypeBuilderLikeArray](#code-geninterfacestypebuilderlikearraymd).[concat](#concat)_

Combines two or more arrays.

**Parameters:**

| Name       | Type                      | Description                                   |
| ---------- | ------------------------- | --------------------------------------------- |
| `...items` | T &#124; ConcatArray‹T›[] | Additional items to add to the end of array1. |

**Returns:** _[TypeBuilderLike](#typebuilderlike)[]_

---

##### copyWithin

▸ **copyWithin**(`target`: number, `start`: number, `end?`: number): _this_

_Inherited from
[TypeBuilderLikeArray](#code-geninterfacestypebuilderlikearraymd).[copyWithin](#copywithin)_

Returns the this object after copying a section of the array identified by start
and end to the same array starting at position target

**Parameters:**

| Name     | Type   | Description                                                                                           |
| -------- | ------ | ----------------------------------------------------------------------------------------------------- |
| `target` | number | If target is negative, it is treated as length+target where length is the length of the array.        |
| `start`  | number | If start is negative, it is treated as length+start. If end is negative, it is treated as length+end. |
| `end?`   | number | If not specified, length of the this object is used as its default value.                             |

**Returns:** _this_

---

##### entries

▸ **entries**(): _IterableIterator‹[number,
[TypeBuilderLike](#typebuilderlike)]›_

_Inherited from
[TypeBuilderLikeArray](#code-geninterfacestypebuilderlikearraymd).[entries](#entries)_

Returns an iterable of key, value pairs for every entry in the array

**Returns:** _IterableIterator‹[number, [TypeBuilderLike](#typebuilderlike)]›_

---

##### every

▸ **every**(`callbackfn`: function, `thisArg?`: any): _boolean_

_Inherited from
[TypeBuilderLikeArray](#code-geninterfacestypebuilderlikearraymd).[every](#every)_

Determines whether all the members of an array satisfy the specified test.

**Parameters:**

▪ **callbackfn**: _function_

A function that accepts up to three arguments. The every method calls the
callbackfn function for each element in the array until the callbackfn returns a
value which is coercible to the Boolean value false, or until the end of the
array.

▸ (`value`: [TypeBuilderLike](#typebuilderlike), `index`: number, `array`:
[TypeBuilderLike](#typebuilderlike)[]): _unknown_

**Parameters:**

| Name    | Type                                  |
| ------- | ------------------------------------- |
| `value` | [TypeBuilderLike](#typebuilderlike)   |
| `index` | number                                |
| `array` | [TypeBuilderLike](#typebuilderlike)[] |

▪`Optional` **thisArg**: _any_

An object to which the this keyword can refer in the callbackfn function. If
thisArg is omitted, undefined is used as the this value.

**Returns:** _boolean_

---

##### fill

▸ **fill**(`value`: [TypeBuilderLike](#typebuilderlike), `start?`: number,
`end?`: number): _this_

_Inherited from
[TypeBuilderLikeArray](#code-geninterfacestypebuilderlikearraymd).[fill](#fill)_

Returns the this object after filling the section identified by start and end
with value

**Parameters:**

| Name     | Type                                | Description                                                                                                                       |
| -------- | ----------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `value`  | [TypeBuilderLike](#typebuilderlike) | value to fill array section with                                                                                                  |
| `start?` | number                              | index to start filling the array at. If start is negative, it is treated as length+start where length is the length of the array. |
| `end?`   | number                              | index to stop filling the array at. If end is negative, it is treated as length+end.                                              |

**Returns:** _this_

---

##### filter

▸ **filter**‹**S**›(`callbackfn`: function, `thisArg?`: any): _S[]_

_Inherited from
[TypeBuilderLikeArray](#code-geninterfacestypebuilderlikearraymd).[filter](#filter)_

Returns the elements of an array that meet the condition specified in a callback
function.

**Type parameters:**

▪ **S**: _[TypeBuilderLike](#typebuilderlike)_

**Parameters:**

▪ **callbackfn**: _function_

A function that accepts up to three arguments. The filter method calls the
callbackfn function one time for each element in the array.

▸ (`value`: [TypeBuilderLike](#typebuilderlike), `index`: number, `array`:
[TypeBuilderLike](#typebuilderlike)[]): _value is S_

**Parameters:**

| Name    | Type                                  |
| ------- | ------------------------------------- |
| `value` | [TypeBuilderLike](#typebuilderlike)   |
| `index` | number                                |
| `array` | [TypeBuilderLike](#typebuilderlike)[] |

▪`Optional` **thisArg**: _any_

An object to which the this keyword can refer in the callbackfn function. If
thisArg is omitted, undefined is used as the this value.

**Returns:** _S[]_

▸ **filter**(`callbackfn`: function, `thisArg?`: any):
_[TypeBuilderLike](#typebuilderlike)[]_

_Inherited from
[TypeBuilderLikeArray](#code-geninterfacestypebuilderlikearraymd).[filter](#filter)_

Returns the elements of an array that meet the condition specified in a callback
function.

**Parameters:**

▪ **callbackfn**: _function_

A function that accepts up to three arguments. The filter method calls the
callbackfn function one time for each element in the array.

▸ (`value`: [TypeBuilderLike](#typebuilderlike), `index`: number, `array`:
[TypeBuilderLike](#typebuilderlike)[]): _unknown_

**Parameters:**

| Name    | Type                                  |
| ------- | ------------------------------------- |
| `value` | [TypeBuilderLike](#typebuilderlike)   |
| `index` | number                                |
| `array` | [TypeBuilderLike](#typebuilderlike)[] |

▪`Optional` **thisArg**: _any_

An object to which the this keyword can refer in the callbackfn function. If
thisArg is omitted, undefined is used as the this value.

**Returns:** _[TypeBuilderLike](#typebuilderlike)[]_

---

##### find

▸ **find**‹**S**›(`predicate`: function, `thisArg?`: any): _S | undefined_

_Inherited from
[TypeBuilderLikeArray](#code-geninterfacestypebuilderlikearraymd).[find](#find)_

Returns the value of the first element in the array where predicate is true, and
undefined otherwise.

**Type parameters:**

▪ **S**: _[TypeBuilderLike](#typebuilderlike)_

**Parameters:**

▪ **predicate**: _function_

find calls predicate once for each element of the array, in ascending order,
until it finds one where predicate returns true. If such an element is found,
find immediately returns that element value. Otherwise, find returns undefined.

▸ (`this`: void, `value`: [TypeBuilderLike](#typebuilderlike), `index`: number,
`obj`: [TypeBuilderLike](#typebuilderlike)[]): _value is S_

**Parameters:**

| Name    | Type                                  |
| ------- | ------------------------------------- |
| `this`  | void                                  |
| `value` | [TypeBuilderLike](#typebuilderlike)   |
| `index` | number                                |
| `obj`   | [TypeBuilderLike](#typebuilderlike)[] |

▪`Optional` **thisArg**: _any_

If provided, it will be used as the this value for each invocation of predicate.
If it is not provided, undefined is used instead.

**Returns:** _S | undefined_

▸ **find**(`predicate`: function, `thisArg?`: any):
_[TypeBuilderLike](#typebuilderlike) | undefined_

_Inherited from
[TypeBuilderLikeArray](#code-geninterfacestypebuilderlikearraymd).[find](#find)_

**Parameters:**

▪ **predicate**: _function_

▸ (`value`: [TypeBuilderLike](#typebuilderlike), `index`: number, `obj`:
[TypeBuilderLike](#typebuilderlike)[]): _unknown_

**Parameters:**

| Name    | Type                                  |
| ------- | ------------------------------------- |
| `value` | [TypeBuilderLike](#typebuilderlike)   |
| `index` | number                                |
| `obj`   | [TypeBuilderLike](#typebuilderlike)[] |

▪`Optional` **thisArg**: _any_

**Returns:** _[TypeBuilderLike](#typebuilderlike) | undefined_

---

##### findIndex

▸ **findIndex**(`predicate`: function, `thisArg?`: any): _number_

_Inherited from
[TypeBuilderLikeArray](#code-geninterfacestypebuilderlikearraymd).[findIndex](#findindex)_

Returns the index of the first element in the array where predicate is true, and
-1 otherwise.

**Parameters:**

▪ **predicate**: _function_

find calls predicate once for each element of the array, in ascending order,
until it finds one where predicate returns true. If such an element is found,
findIndex immediately returns that element index. Otherwise, findIndex returns
-1.

▸ (`value`: [TypeBuilderLike](#typebuilderlike), `index`: number, `obj`:
[TypeBuilderLike](#typebuilderlike)[]): _unknown_

**Parameters:**

| Name    | Type                                  |
| ------- | ------------------------------------- |
| `value` | [TypeBuilderLike](#typebuilderlike)   |
| `index` | number                                |
| `obj`   | [TypeBuilderLike](#typebuilderlike)[] |

▪`Optional` **thisArg**: _any_

If provided, it will be used as the this value for each invocation of predicate.
If it is not provided, undefined is used instead.

**Returns:** _number_

---

##### forEach

▸ **forEach**(`callbackfn`: function, `thisArg?`: any): _void_

_Inherited from
[TypeBuilderLikeArray](#code-geninterfacestypebuilderlikearraymd).[forEach](#foreach)_

Performs the specified action for each element in an array.

**Parameters:**

▪ **callbackfn**: _function_

A function that accepts up to three arguments. forEach calls the callbackfn
function one time for each element in the array.

▸ (`value`: [TypeBuilderLike](#typebuilderlike), `index`: number, `array`:
[TypeBuilderLike](#typebuilderlike)[]): _void_

**Parameters:**

| Name    | Type                                  |
| ------- | ------------------------------------- |
| `value` | [TypeBuilderLike](#typebuilderlike)   |
| `index` | number                                |
| `array` | [TypeBuilderLike](#typebuilderlike)[] |

▪`Optional` **thisArg**: _any_

An object to which the this keyword can refer in the callbackfn function. If
thisArg is omitted, undefined is used as the this value.

**Returns:** _void_

---

##### includes

▸ **includes**(`searchElement`: [TypeBuilderLike](#typebuilderlike),
`fromIndex?`: number): _boolean_

_Inherited from
[TypeBuilderLikeArray](#code-geninterfacestypebuilderlikearraymd).[includes](#includes)_

Determines whether an array includes a certain element, returning true or false
as appropriate.

**Parameters:**

| Name            | Type                                | Description                                                               |
| --------------- | ----------------------------------- | ------------------------------------------------------------------------- |
| `searchElement` | [TypeBuilderLike](#typebuilderlike) | The element to search for.                                                |
| `fromIndex?`    | number                              | The position in this array at which to begin searching for searchElement. |

**Returns:** _boolean_

---

##### indexOf

▸ **indexOf**(`searchElement`: [TypeBuilderLike](#typebuilderlike),
`fromIndex?`: number): _number_

_Inherited from
[TypeBuilderLikeArray](#code-geninterfacestypebuilderlikearraymd).[indexOf](#indexof)_

Returns the index of the first occurrence of a value in an array.

**Parameters:**

| Name            | Type                                | Description                                                                                          |
| --------------- | ----------------------------------- | ---------------------------------------------------------------------------------------------------- |
| `searchElement` | [TypeBuilderLike](#typebuilderlike) | The value to locate in the array.                                                                    |
| `fromIndex?`    | number                              | The array index at which to begin the search. If fromIndex is omitted, the search starts at index 0. |

**Returns:** _number_

---

##### join

▸ **join**(`separator?`: string): _string_

_Inherited from
[TypeBuilderLikeArray](#code-geninterfacestypebuilderlikearraymd).[join](#join)_

Adds all the elements of an array separated by the specified separator string.

**Parameters:**

| Name         | Type   | Description                                                                                                                                         |
| ------------ | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `separator?` | string | A string used to separate one element of an array from the next in the resulting String. If omitted, the array elements are separated with a comma. |

**Returns:** _string_

---

##### keys

▸ **keys**(): _IterableIterator‹number›_

_Inherited from
[TypeBuilderLikeArray](#code-geninterfacestypebuilderlikearraymd).[keys](#keys)_

Returns an iterable of keys in the array

**Returns:** _IterableIterator‹number›_

---

##### lastIndexOf

▸ **lastIndexOf**(`searchElement`: [TypeBuilderLike](#typebuilderlike),
`fromIndex?`: number): _number_

_Inherited from
[TypeBuilderLikeArray](#code-geninterfacestypebuilderlikearraymd).[lastIndexOf](#lastindexof)_

Returns the index of the last occurrence of a specified value in an array.

**Parameters:**

| Name            | Type                                | Description                                                                                                              |
| --------------- | ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `searchElement` | [TypeBuilderLike](#typebuilderlike) | The value to locate in the array.                                                                                        |
| `fromIndex?`    | number                              | The array index at which to begin the search. If fromIndex is omitted, the search starts at the last index in the array. |

**Returns:** _number_

---

##### map

▸ **map**‹**U**›(`callbackfn`: function, `thisArg?`: any): _U[]_

_Inherited from
[TypeBuilderLikeArray](#code-geninterfacestypebuilderlikearraymd).[map](#map)_

Calls a defined callback function on each element of an array, and returns an
array that contains the results.

**Type parameters:**

▪ **U**

**Parameters:**

▪ **callbackfn**: _function_

A function that accepts up to three arguments. The map method calls the
callbackfn function one time for each element in the array.

▸ (`value`: [TypeBuilderLike](#typebuilderlike), `index`: number, `array`:
[TypeBuilderLike](#typebuilderlike)[]): _U_

**Parameters:**

| Name    | Type                                  |
| ------- | ------------------------------------- |
| `value` | [TypeBuilderLike](#typebuilderlike)   |
| `index` | number                                |
| `array` | [TypeBuilderLike](#typebuilderlike)[] |

▪`Optional` **thisArg**: _any_

An object to which the this keyword can refer in the callbackfn function. If
thisArg is omitted, undefined is used as the this value.

**Returns:** _U[]_

---

##### pop

▸ **pop**(): _[TypeBuilderLike](#typebuilderlike) | undefined_

_Inherited from
[TypeBuilderLikeArray](#code-geninterfacestypebuilderlikearraymd).[pop](#pop)_

Removes the last element from an array and returns it.

**Returns:** _[TypeBuilderLike](#typebuilderlike) | undefined_

---

##### push

▸ **push**(...`items`: [TypeBuilderLike](#typebuilderlike)[]): _number_

_Inherited from
[TypeBuilderLikeArray](#code-geninterfacestypebuilderlikearraymd).[push](#push)_

Appends new elements to an array, and returns the new length of the array.

**Parameters:**

| Name       | Type                                  | Description                |
| ---------- | ------------------------------------- | -------------------------- |
| `...items` | [TypeBuilderLike](#typebuilderlike)[] | New elements of the Array. |

**Returns:** _number_

---

##### reduce

▸ **reduce**(`callbackfn`: function): _[TypeBuilderLike](#typebuilderlike)_

_Inherited from
[TypeBuilderLikeArray](#code-geninterfacestypebuilderlikearraymd).[reduce](#reduce)_

Calls the specified callback function for all the elements in an array. The
return value of the callback function is the accumulated result, and is provided
as an argument in the next call to the callback function.

**Parameters:**

▪ **callbackfn**: _function_

A function that accepts up to four arguments. The reduce method calls the
callbackfn function one time for each element in the array.

▸ (`previousValue`: [TypeBuilderLike](#typebuilderlike), `currentValue`:
[TypeBuilderLike](#typebuilderlike), `currentIndex`: number, `array`:
[TypeBuilderLike](#typebuilderlike)[]): _[TypeBuilderLike](#typebuilderlike)_

**Parameters:**

| Name            | Type                                  |
| --------------- | ------------------------------------- |
| `previousValue` | [TypeBuilderLike](#typebuilderlike)   |
| `currentValue`  | [TypeBuilderLike](#typebuilderlike)   |
| `currentIndex`  | number                                |
| `array`         | [TypeBuilderLike](#typebuilderlike)[] |

**Returns:** _[TypeBuilderLike](#typebuilderlike)_

▸ **reduce**(`callbackfn`: function, `initialValue`:
[TypeBuilderLike](#typebuilderlike)): _[TypeBuilderLike](#typebuilderlike)_

_Inherited from
[TypeBuilderLikeArray](#code-geninterfacestypebuilderlikearraymd).[reduce](#reduce)_

**Parameters:**

▪ **callbackfn**: _function_

▸ (`previousValue`: [TypeBuilderLike](#typebuilderlike), `currentValue`:
[TypeBuilderLike](#typebuilderlike), `currentIndex`: number, `array`:
[TypeBuilderLike](#typebuilderlike)[]): _[TypeBuilderLike](#typebuilderlike)_

**Parameters:**

| Name            | Type                                  |
| --------------- | ------------------------------------- |
| `previousValue` | [TypeBuilderLike](#typebuilderlike)   |
| `currentValue`  | [TypeBuilderLike](#typebuilderlike)   |
| `currentIndex`  | number                                |
| `array`         | [TypeBuilderLike](#typebuilderlike)[] |

▪ **initialValue**: _[TypeBuilderLike](#typebuilderlike)_

**Returns:** _[TypeBuilderLike](#typebuilderlike)_

▸ **reduce**‹**U**›(`callbackfn`: function, `initialValue`: U): _U_

_Inherited from
[TypeBuilderLikeArray](#code-geninterfacestypebuilderlikearraymd).[reduce](#reduce)_

Calls the specified callback function for all the elements in an array. The
return value of the callback function is the accumulated result, and is provided
as an argument in the next call to the callback function.

**Type parameters:**

▪ **U**

**Parameters:**

▪ **callbackfn**: _function_

A function that accepts up to four arguments. The reduce method calls the
callbackfn function one time for each element in the array.

▸ (`previousValue`: U, `currentValue`: [TypeBuilderLike](#typebuilderlike),
`currentIndex`: number, `array`: [TypeBuilderLike](#typebuilderlike)[]): _U_

**Parameters:**

| Name            | Type                                  |
| --------------- | ------------------------------------- |
| `previousValue` | U                                     |
| `currentValue`  | [TypeBuilderLike](#typebuilderlike)   |
| `currentIndex`  | number                                |
| `array`         | [TypeBuilderLike](#typebuilderlike)[] |

▪ **initialValue**: _U_

If initialValue is specified, it is used as the initial value to start the
accumulation. The first call to the callbackfn function provides this value as
an argument instead of an array value.

**Returns:** _U_

---

##### reduceRight

▸ **reduceRight**(`callbackfn`: function): _[TypeBuilderLike](#typebuilderlike)_

_Inherited from
[TypeBuilderLikeArray](#code-geninterfacestypebuilderlikearraymd).[reduceRight](#reduceright)_

Calls the specified callback function for all the elements in an array, in
descending order. The return value of the callback function is the accumulated
result, and is provided as an argument in the next call to the callback
function.

**Parameters:**

▪ **callbackfn**: _function_

A function that accepts up to four arguments. The reduceRight method calls the
callbackfn function one time for each element in the array.

▸ (`previousValue`: [TypeBuilderLike](#typebuilderlike), `currentValue`:
[TypeBuilderLike](#typebuilderlike), `currentIndex`: number, `array`:
[TypeBuilderLike](#typebuilderlike)[]): _[TypeBuilderLike](#typebuilderlike)_

**Parameters:**

| Name            | Type                                  |
| --------------- | ------------------------------------- |
| `previousValue` | [TypeBuilderLike](#typebuilderlike)   |
| `currentValue`  | [TypeBuilderLike](#typebuilderlike)   |
| `currentIndex`  | number                                |
| `array`         | [TypeBuilderLike](#typebuilderlike)[] |

**Returns:** _[TypeBuilderLike](#typebuilderlike)_

▸ **reduceRight**(`callbackfn`: function, `initialValue`:
[TypeBuilderLike](#typebuilderlike)): _[TypeBuilderLike](#typebuilderlike)_

_Inherited from
[TypeBuilderLikeArray](#code-geninterfacestypebuilderlikearraymd).[reduceRight](#reduceright)_

**Parameters:**

▪ **callbackfn**: _function_

▸ (`previousValue`: [TypeBuilderLike](#typebuilderlike), `currentValue`:
[TypeBuilderLike](#typebuilderlike), `currentIndex`: number, `array`:
[TypeBuilderLike](#typebuilderlike)[]): _[TypeBuilderLike](#typebuilderlike)_

**Parameters:**

| Name            | Type                                  |
| --------------- | ------------------------------------- |
| `previousValue` | [TypeBuilderLike](#typebuilderlike)   |
| `currentValue`  | [TypeBuilderLike](#typebuilderlike)   |
| `currentIndex`  | number                                |
| `array`         | [TypeBuilderLike](#typebuilderlike)[] |

▪ **initialValue**: _[TypeBuilderLike](#typebuilderlike)_

**Returns:** _[TypeBuilderLike](#typebuilderlike)_

▸ **reduceRight**‹**U**›(`callbackfn`: function, `initialValue`: U): _U_

_Inherited from
[TypeBuilderLikeArray](#code-geninterfacestypebuilderlikearraymd).[reduceRight](#reduceright)_

Calls the specified callback function for all the elements in an array, in
descending order. The return value of the callback function is the accumulated
result, and is provided as an argument in the next call to the callback
function.

**Type parameters:**

▪ **U**

**Parameters:**

▪ **callbackfn**: _function_

A function that accepts up to four arguments. The reduceRight method calls the
callbackfn function one time for each element in the array.

▸ (`previousValue`: U, `currentValue`: [TypeBuilderLike](#typebuilderlike),
`currentIndex`: number, `array`: [TypeBuilderLike](#typebuilderlike)[]): _U_

**Parameters:**

| Name            | Type                                  |
| --------------- | ------------------------------------- |
| `previousValue` | U                                     |
| `currentValue`  | [TypeBuilderLike](#typebuilderlike)   |
| `currentIndex`  | number                                |
| `array`         | [TypeBuilderLike](#typebuilderlike)[] |

▪ **initialValue**: _U_

If initialValue is specified, it is used as the initial value to start the
accumulation. The first call to the callbackfn function provides this value as
an argument instead of an array value.

**Returns:** _U_

---

##### reverse

▸ **reverse**(): _[TypeBuilderLike](#typebuilderlike)[]_

_Inherited from
[TypeBuilderLikeArray](#code-geninterfacestypebuilderlikearraymd).[reverse](#reverse)_

Reverses the elements in an Array.

**Returns:** _[TypeBuilderLike](#typebuilderlike)[]_

---

##### shift

▸ **shift**(): _[TypeBuilderLike](#typebuilderlike) | undefined_

_Inherited from
[TypeBuilderLikeArray](#code-geninterfacestypebuilderlikearraymd).[shift](#shift)_

Removes the first element from an array and returns it.

**Returns:** _[TypeBuilderLike](#typebuilderlike) | undefined_

---

##### slice

▸ **slice**(`start?`: number, `end?`: number):
_[TypeBuilderLike](#typebuilderlike)[]_

_Inherited from
[TypeBuilderLikeArray](#code-geninterfacestypebuilderlikearraymd).[slice](#slice)_

Returns a section of an array.

**Parameters:**

| Name     | Type   | Description                                                                                         |
| -------- | ------ | --------------------------------------------------------------------------------------------------- |
| `start?` | number | The beginning of the specified portion of the array.                                                |
| `end?`   | number | The end of the specified portion of the array. This is exclusive of the element at the index 'end'. |

**Returns:** _[TypeBuilderLike](#typebuilderlike)[]_

---

##### some

▸ **some**(`callbackfn`: function, `thisArg?`: any): _boolean_

_Inherited from
[TypeBuilderLikeArray](#code-geninterfacestypebuilderlikearraymd).[some](#some)_

Determines whether the specified callback function returns true for any element
of an array.

**Parameters:**

▪ **callbackfn**: _function_

A function that accepts up to three arguments. The some method calls the
callbackfn function for each element in the array until the callbackfn returns a
value which is coercible to the Boolean value true, or until the end of the
array.

▸ (`value`: [TypeBuilderLike](#typebuilderlike), `index`: number, `array`:
[TypeBuilderLike](#typebuilderlike)[]): _unknown_

**Parameters:**

| Name    | Type                                  |
| ------- | ------------------------------------- |
| `value` | [TypeBuilderLike](#typebuilderlike)   |
| `index` | number                                |
| `array` | [TypeBuilderLike](#typebuilderlike)[] |

▪`Optional` **thisArg**: _any_

An object to which the this keyword can refer in the callbackfn function. If
thisArg is omitted, undefined is used as the this value.

**Returns:** _boolean_

---

##### sort

▸ **sort**(`compareFn?`: function): _this_

_Inherited from
[TypeBuilderLikeArray](#code-geninterfacestypebuilderlikearraymd).[sort](#sort)_

Sorts an array.

**Parameters:**

▪`Optional` **compareFn**: _function_

Function used to determine the order of the elements. It is expected to return a
negative value if first argument is less than second argument, zero if they're
equal and a positive value otherwise. If omitted, the elements are sorted in
ascending, ASCII character order.

```ts
[11, 2, 22, 1].sort((a, b) => a - b);
```

▸ (`a`: [TypeBuilderLike](#typebuilderlike), `b`:
[TypeBuilderLike](#typebuilderlike)): _number_

**Parameters:**

| Name | Type                                |
| ---- | ----------------------------------- |
| `a`  | [TypeBuilderLike](#typebuilderlike) |
| `b`  | [TypeBuilderLike](#typebuilderlike) |

**Returns:** _this_

---

##### splice

▸ **splice**(`start`: number, `deleteCount?`: number):
_[TypeBuilderLike](#typebuilderlike)[]_

_Inherited from
[TypeBuilderLikeArray](#code-geninterfacestypebuilderlikearraymd).[splice](#splice)_

Removes elements from an array and, if necessary, inserts new elements in their
place, returning the deleted elements.

**Parameters:**

| Name           | Type   | Description                                                                 |
| -------------- | ------ | --------------------------------------------------------------------------- |
| `start`        | number | The zero-based location in the array from which to start removing elements. |
| `deleteCount?` | number | The number of elements to remove.                                           |

**Returns:** _[TypeBuilderLike](#typebuilderlike)[]_

▸ **splice**(`start`: number, `deleteCount`: number, ...`items`:
[TypeBuilderLike](#typebuilderlike)[]): _[TypeBuilderLike](#typebuilderlike)[]_

_Inherited from
[TypeBuilderLikeArray](#code-geninterfacestypebuilderlikearraymd).[splice](#splice)_

Removes elements from an array and, if necessary, inserts new elements in their
place, returning the deleted elements.

**Parameters:**

| Name          | Type                                  | Description                                                                 |
| ------------- | ------------------------------------- | --------------------------------------------------------------------------- |
| `start`       | number                                | The zero-based location in the array from which to start removing elements. |
| `deleteCount` | number                                | The number of elements to remove.                                           |
| `...items`    | [TypeBuilderLike](#typebuilderlike)[] | Elements to insert into the array in place of the deleted elements.         |

**Returns:** _[TypeBuilderLike](#typebuilderlike)[]_

---

##### toLocaleString

▸ **toLocaleString**(): _string_

_Inherited from
[TypeBuilderLikeArray](#code-geninterfacestypebuilderlikearraymd).[toLocaleString](#tolocalestring)_

Returns a string representation of an array. The elements are converted to
string using their toLocalString methods.

**Returns:** _string_

---

##### toString

▸ **toString**(): _string_

_Inherited from
[TypeBuilderLikeArray](#code-geninterfacestypebuilderlikearraymd).[toString](#tostring)_

Returns a string representation of an array.

**Returns:** _string_

---

##### unshift

▸ **unshift**(...`items`: [TypeBuilderLike](#typebuilderlike)[]): _number_

_Inherited from
[TypeBuilderLikeArray](#code-geninterfacestypebuilderlikearraymd).[unshift](#unshift)_

Inserts new elements at the start of an array.

**Parameters:**

| Name       | Type                                  | Description                                   |
| ---------- | ------------------------------------- | --------------------------------------------- |
| `...items` | [TypeBuilderLike](#typebuilderlike)[] | Elements to insert at the start of the Array. |

**Returns:** _number_

---

##### values

▸ **values**(): _IterableIterator‹[TypeBuilderLike](#typebuilderlike)›_

_Inherited from
[TypeBuilderLikeArray](#code-geninterfacestypebuilderlikearraymd).[values](#values)_

Returns an iterable of values in the array

**Returns:** _IterableIterator‹[TypeBuilderLike](#typebuilderlike)›_

<a name="code-geninterfacestypebuilderlikeobjectmd"></a>

[@lbu/code-gen - v0.0.45](#code-genreadmemd) ›
[TypeBuilderLikeObject](#code-geninterfacestypebuilderlikeobjectmd)

### Interface: TypeBuilderLikeObject

#### Hierarchy

- object

  ↳ **TypeBuilderLikeObject**

<a name="code-geninterfacestypepluginmd"></a>

[@lbu/code-gen - v0.0.45](#code-genreadmemd) ›
[TypePlugin](#code-geninterfacestypepluginmd)

### Interface: TypePlugin ‹**T**›

#### Type parameters

▪ **T**: _[TypeBuilder](#code-genclassestypebuildermd)_

#### Hierarchy

- **TypePlugin**

#### Index

##### Properties

- [class](#class)
- [jsType](#optional-jstype)
- [name](#name)
- [tsType](#optional-tstype)
- [validator](#optional-validator)

#### Properties

##### class

• **class**: _T | object_

---

##### `Optional` jsType

• **jsType**? : _function_

Return the template that should be used to create JSDoc for this type

###### Type declaration:

▸ (): _string_

---

##### name

• **name**: _string_

---

##### `Optional` tsType

• **tsType**? : _function_

Return the template that should be used to create Typescript types for this
type.

###### Type declaration:

▸ (): _string_

---

##### `Optional` validator

• **validator**? : _function_

Return the template that should be used to validate this type

###### Type declaration:

▸ (): _string_

# Insight

<a name="insightreadmemd"></a>

[@lbu/insight - v0.0.45](#insightreadmemd)

## @lbu/insight - v0.0.45

### Index

#### Interfaces

- [Logger](#insightinterfacesloggermd)
- [LoggerContext](#insightinterfacesloggercontextmd)
- [LoggerOptions](#insightinterfacesloggeroptionsmd)

#### Variables

- [log](#const-log)

#### Functions

- [bindLoggerContext](#bindloggercontext)
- [bytesToHumanReadable](#bytestohumanreadable)
- [newLogger](#newlogger)
- [printProcessMemoryUsage](#printprocessmemoryusage)

### Variables

#### `Const` log

• **log**: _[Logger](#insightinterfacesloggermd)_

Standard log instance

### Functions

#### bindLoggerContext

▸ **bindLoggerContext**‹**T**›(`logger`: [Logger](#insightinterfacesloggermd),
`ctx`: T): _[Logger](#insightinterfacesloggermd)_

Bind a context object to the logger functions and returns a new Logger The
context is always printed

**Type parameters:**

▪ **T**: _[LoggerContext](#insightinterfacesloggercontextmd)_

**Parameters:**

| Name     | Type                                 |
| -------- | ------------------------------------ |
| `logger` | [Logger](#insightinterfacesloggermd) |
| `ctx`    | T                                    |

**Returns:** _[Logger](#insightinterfacesloggermd)_

---

#### bytesToHumanReadable

▸ **bytesToHumanReadable**(`bytes?`: number): _string_

Format bytes, with up to 2 digits after the decimal point, in a more human
readable way Support up to a pebibyte

**Parameters:**

| Name     | Type   |
| -------- | ------ |
| `bytes?` | number |

**Returns:** _string_

---

#### newLogger

▸ **newLogger**‹**T**›(`options?`:
[LoggerOptions](#insightinterfacesloggeroptionsmd)‹T›):
_[Logger](#insightinterfacesloggermd)_

Create a new logger

**Type parameters:**

▪ **T**: _[LoggerContext](#insightinterfacesloggercontextmd)_

**Parameters:**

| Name       | Type                                                  |
| ---------- | ----------------------------------------------------- |
| `options?` | [LoggerOptions](#insightinterfacesloggeroptionsmd)‹T› |

**Returns:** _[Logger](#insightinterfacesloggermd)_

---

#### printProcessMemoryUsage

▸ **printProcessMemoryUsage**(`logger`: [Logger](#insightinterfacesloggermd)):
_void_

Prints the memory usage of the current process to the provided logger For more
info on the printed properties see:
https://nodejs.org/dist/latest-v13.x/docs/api/process.html#process_process_memoryusage

**Parameters:**

| Name     | Type                                 |
| -------- | ------------------------------------ |
| `logger` | [Logger](#insightinterfacesloggermd) |

**Returns:** _void_

## Interfaces

<a name="insightinterfacesloggermd"></a>

[@lbu/insight - v0.0.45](#insightreadmemd) ›
[Logger](#insightinterfacesloggermd)

### Interface: Logger

The logger only has two severities:

- info
- error

Either a log line is innocent enough and only provides debug information if
needed, or someone should be paged because something goes wrong. For example
handled 500 errors don't need any ones attention, but unhandled 500 errors do.

The log functions {@ee Logger#info} only accepts a single parameter. This
prevents magic outputs like automatic concatenating strings in to a single
message, or always having a top level array as a message.

#### Hierarchy

- **Logger**

#### Index

##### Methods

- [error](#error)
- [info](#info)
- [isProduction](#isproduction)

#### Methods

##### error

▸ **error**(`arg`: any): _void_

**Parameters:**

| Name  | Type |
| ----- | ---- |
| `arg` | any  |

**Returns:** _void_

---

##### info

▸ **info**(`arg`: any): _void_

**Parameters:**

| Name  | Type |
| ----- | ---- |
| `arg` | any  |

**Returns:** _void_

---

##### isProduction

▸ **isProduction**(): _boolean_

Check if this logger is using the pretty printer or NDJSON printer

**Returns:** _boolean_

<a name="insightinterfacesloggercontextmd"></a>

[@lbu/insight - v0.0.45](#insightreadmemd) ›
[LoggerContext](#insightinterfacesloggercontextmd)

### Interface: LoggerContext

Context that should be logged in all log lines. e.g a common request id.

#### Hierarchy

- **LoggerContext**

#### Index

##### Properties

- [type](#optional-type)

#### Properties

##### `Optional` type

• **type**? : _string_

<a name="insightinterfacesloggeroptionsmd"></a>

[@lbu/insight - v0.0.45](#insightreadmemd) ›
[LoggerOptions](#insightinterfacesloggeroptionsmd)

### Interface: LoggerOptions ‹**T**›

#### Type parameters

▪ **T**: _[LoggerContext](#insightinterfacesloggercontextmd)_

#### Hierarchy

- **LoggerOptions**

#### Index

##### Properties

- [ctx](#optional-ctx)
- [pretty](#optional-pretty)
- [stream](#optional-stream)

#### Properties

##### `Optional` ctx

• **ctx**? : _T_

Context that should be logged in all log lines. e.g a common request id.

---

##### `Optional` pretty

• **pretty**? : _boolean_

Use the pretty formatter instead of the NDJSON formatter

---

##### `Optional` stream

• **stream**? : _WritableStream_

The stream to write the logs to

# Server

<a name="serverreadmemd"></a>

[@lbu/server - v0.0.45](#serverreadmemd)

## @lbu/server - v0.0.45

### Index

#### Classes

- [Application](#serverclassesapplicationmd)

#### Interfaces

- [AppErrorHandler](#serverinterfacesapperrorhandlermd)
- [BodyParserPair](#serverinterfacesbodyparserpairmd)
- [CorsOptions](#serverinterfacescorsoptionsmd)
- [CustomErrorHandler](#serverinterfacescustomerrorhandlermd)
- [ErrorHandlerOptions](#serverinterfaceserrorhandleroptionsmd)
- [GetAppOptions](#serverinterfacesgetappoptionsmd)
- [HeaderOptions](#serverinterfacesheaderoptionsmd)

#### Type aliases

- [Context](#context)
- [Middleware](#middleware)
- [Next](#next)

#### Functions

- [closeTestApp](#closetestapp)
- [createBodyParsers](#createbodyparsers)
- [createTestAppAndClient](#createtestappandclient)
- [getApp](#getapp)
- [sendFile](#sendfile)
- [session](#session)

### Type aliases

#### Context

Ƭ **Context**: _ExtendableContext & object & CustomT_

---

#### Middleware

Ƭ **Middleware**: _function_

##### Type declaration:

▸ (`context`: [Context](#context)‹StateT, CustomT›, `next`: [Next](#next)):
_any_

**Parameters:**

| Name      | Type                                 |
| --------- | ------------------------------------ |
| `context` | [Context](#context)‹StateT, CustomT› |
| `next`    | [Next](#next)                        |

---

#### Next

Ƭ **Next**: _function_

##### Type declaration:

▸ (): _Promise‹any›_

### Functions

#### closeTestApp

▸ **closeTestApp**(`app`: [Application](#serverclassesapplicationmd)): _void |
Promise‹void›_

Stops the server created with `createTestAppAndClient`

**Parameters:**

| Name  | Type                                       |
| ----- | ------------------------------------------ |
| `app` | [Application](#serverclassesapplicationmd) |

**Returns:** _void | Promise‹void›_

---

#### createBodyParsers

▸ **createBodyParsers**(`options?`: IKoaBodyOptions):
_[BodyParserPair](#serverinterfacesbodyparserpairmd)_

Creates a body parser and a body parser with multipart enabled Note that
koa-body parses url-encoded, form data, json and text by default

**Parameters:**

| Name       | Type            |
| ---------- | --------------- |
| `options?` | IKoaBodyOptions |

**Returns:** _[BodyParserPair](#serverinterfacesbodyparserpairmd)_

---

#### createTestAppAndClient

▸ **createTestAppAndClient**(`app`: [Application](#serverclassesapplicationmd),
`axios`: AxiosInstance): _Promise‹void›_

Calls app.listen on a random port and sets the correct baseURL on the provided
axios instance

**Parameters:**

| Name    | Type                                       |
| ------- | ------------------------------------------ |
| `app`   | [Application](#serverclassesapplicationmd) |
| `axios` | AxiosInstance                              |

**Returns:** _Promise‹void›_

---

#### getApp

▸ **getApp**(`opts?`: [GetAppOptions](#serverinterfacesgetappoptionsmd)):
_[Application](#serverclassesapplicationmd)_

Create a new Koa instance with some default middleware

**Parameters:**

| Name    | Type                                              |
| ------- | ------------------------------------------------- |
| `opts?` | [GetAppOptions](#serverinterfacesgetappoptionsmd) |

**Returns:** _[Application](#serverclassesapplicationmd)_

---

#### sendFile

▸ **sendFile**(`ctx`: [Context](#context), `file`: unknown, `getStreamFn`:
GetStreamFn): _Promise‹void›_

Send any file to the ctx.body User is free to set Cache-Control

**Parameters:**

| Name          | Type                |
| ------------- | ------------------- |
| `ctx`         | [Context](#context) |
| `file`        | unknown             |
| `getStreamFn` | GetStreamFn         |

**Returns:** _Promise‹void›_

---

#### session

▸ **session**(`app`: [Application](#serverclassesapplicationmd), `options`:
SessionOptions): _[Middleware](#middleware)_

Session middleware Requires process.env.APP_KEYS To generate a key use something
like node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

**Parameters:**

| Name      | Type                                       |
| --------- | ------------------------------------------ |
| `app`     | [Application](#serverclassesapplicationmd) |
| `options` | SessionOptions                             |

**Returns:** _[Middleware](#middleware)_

## Classes

<a name="serverclassesapplicationmd"></a>

[@lbu/server - v0.0.45](#serverreadmemd) ›
[Application](#serverclassesapplicationmd)

### Class: Application ‹**StateT, CustomT**›

#### Type parameters

▪ **StateT**

▪ **CustomT**

#### Hierarchy

- EventEmitter

  ↳ **Application**

#### Index

##### Constructors

- [constructor](#constructor)

##### Properties

- [context](#context)
- [env](#env)
- [keys](#keys)
- [maxIpsCount](#maxipscount)
- [middleware](#middleware)
- [proxy](#proxy)
- [proxyIpHeader](#proxyipheader)
- [request](#request)
- [response](#response)
- [silent](#silent)
- [subdomainOffset](#subdomainoffset)
- [defaultMaxListeners](#static-defaultmaxlisteners)
- [errorMonitor](#static-readonly-errormonitor)

##### Methods

- [addListener](#addlistener)
- [callback](#callback)
- [createContext](#createcontext)
- [emit](#emit)
- [eventNames](#eventnames)
- [getMaxListeners](#getmaxlisteners)
- [inspect](#inspect)
- [listen](#listen)
- [listenerCount](#listenercount)
- [listeners](#listeners)
- [off](#off)
- [on](#on)
- [once](#once)
- [onerror](#onerror)
- [prependListener](#prependlistener)
- [prependOnceListener](#prependoncelistener)
- [rawListeners](#rawlisteners)
- [removeAllListeners](#removealllisteners)
- [removeListener](#removelistener)
- [setMaxListeners](#setmaxlisteners)
- [toJSON](#tojson)
- [use](#use)
- [listenerCount](#static-listenercount)

#### Constructors

##### constructor

\+ **new Application**(): _[Application](#serverclassesapplicationmd)_

_Overrides void_

**Returns:** _[Application](#serverclassesapplicationmd)_

#### Properties

##### context

• **context**: _BaseContext & CustomT_

---

##### env

• **env**: _string_

---

##### keys

• **keys**: _string[]_

---

##### maxIpsCount

• **maxIpsCount**: _number_

---

##### middleware

• **middleware**: _[Middleware](#middleware)‹StateT, CustomT›[]_

---

##### proxy

• **proxy**: _boolean_

---

##### proxyIpHeader

• **proxyIpHeader**: _string_

---

##### request

• **request**: _BaseRequest_

---

##### response

• **response**: _BaseResponse_

---

##### silent

• **silent**: _boolean_

---

##### subdomainOffset

• **subdomainOffset**: _number_

---

##### `Static` defaultMaxListeners

▪ **defaultMaxListeners**: _number_

_Inherited from
[Application](#serverclassesapplicationmd).[defaultMaxListeners](#static-defaultmaxlisteners)_

---

##### `Static` `Readonly` errorMonitor

▪ **errorMonitor**: _keyof symbol_

_Inherited from
[Application](#serverclassesapplicationmd).[errorMonitor](#static-readonly-errormonitor)_

This symbol shall be used to install a listener for only monitoring `'error'`
events. Listeners installed using this symbol are called before the regular
`'error'` listeners are called.

Installing a listener using this symbol does not change the behavior once an
`'error'` event is emitted, therefore the process will still crash if no regular
`'error'` listener is installed.

#### Methods

##### addListener

▸ **addListener**(`event`: string | symbol, `listener`: function): _this_

_Inherited from
[Application](#serverclassesapplicationmd).[addListener](#addlistener)_

**Parameters:**

▪ **event**: _string | symbol_

▪ **listener**: _function_

▸ (...`args`: any[]): _void_

**Parameters:**

| Name      | Type  |
| --------- | ----- |
| `...args` | any[] |

**Returns:** _this_

---

##### callback

▸ **callback**(): _function_

Return a request handler callback for node's native http/http2 server.

**Returns:** _function_

▸ (`req`: IncomingMessage, `res`: ServerResponse): _Promise‹void›_

**Parameters:**

| Name  | Type            |
| ----- | --------------- |
| `req` | IncomingMessage |
| `res` | ServerResponse  |

---

##### createContext

▸ **createContext**‹**StateT**›(`req`: IncomingMessage, `res`: ServerResponse):
_[Context](#context)‹StateT›_

Initialize a new context.

**`api`** private

**Type parameters:**

▪ **StateT**

**Parameters:**

| Name  | Type            |
| ----- | --------------- |
| `req` | IncomingMessage |
| `res` | ServerResponse  |

**Returns:** _[Context](#context)‹StateT›_

---

##### emit

▸ **emit**(`event`: string | symbol, ...`args`: any[]): _boolean_

_Inherited from [Application](#serverclassesapplicationmd).[emit](#emit)_

**Parameters:**

| Name      | Type                 |
| --------- | -------------------- |
| `event`   | string &#124; symbol |
| `...args` | any[]                |

**Returns:** _boolean_

---

##### eventNames

▸ **eventNames**(): _Array‹string | symbol›_

_Inherited from
[Application](#serverclassesapplicationmd).[eventNames](#eventnames)_

**Returns:** _Array‹string | symbol›_

---

##### getMaxListeners

▸ **getMaxListeners**(): _number_

_Inherited from
[Application](#serverclassesapplicationmd).[getMaxListeners](#getmaxlisteners)_

**Returns:** _number_

---

##### inspect

▸ **inspect**(): _any_

Return JSON representation. We only bother showing settings.

**Returns:** _any_

---

##### listen

▸ **listen**(`port?`: number, `hostname?`: string, `backlog?`: number,
`listeningListener?`: function): _Server_

Shorthand for:

http.createServer(app.callback()).listen(...)

**Parameters:**

▪`Optional` **port**: _number_

▪`Optional` **hostname**: _string_

▪`Optional` **backlog**: _number_

▪`Optional` **listeningListener**: _function_

▸ (): _void_

**Returns:** _Server_

▸ **listen**(`port`: number, `hostname?`: string, `listeningListener?`:
function): _Server_

**Parameters:**

▪ **port**: _number_

▪`Optional` **hostname**: _string_

▪`Optional` **listeningListener**: _function_

▸ (): _void_

**Returns:** _Server_

▸ **listen**(`port`: number, `backlog?`: number, `listeningListener?`:
function): _Server_

**Parameters:**

▪ **port**: _number_

▪`Optional` **backlog**: _number_

▪`Optional` **listeningListener**: _function_

▸ (): _void_

**Returns:** _Server_

▸ **listen**(`port`: number, `listeningListener?`: function): _Server_

**Parameters:**

▪ **port**: _number_

▪`Optional` **listeningListener**: _function_

▸ (): _void_

**Returns:** _Server_

▸ **listen**(`path`: string, `backlog?`: number, `listeningListener?`:
function): _Server_

**Parameters:**

▪ **path**: _string_

▪`Optional` **backlog**: _number_

▪`Optional` **listeningListener**: _function_

▸ (): _void_

**Returns:** _Server_

▸ **listen**(`path`: string, `listeningListener?`: function): _Server_

**Parameters:**

▪ **path**: _string_

▪`Optional` **listeningListener**: _function_

▸ (): _void_

**Returns:** _Server_

▸ **listen**(`options`: ListenOptions, `listeningListener?`: function): _Server_

**Parameters:**

▪ **options**: _ListenOptions_

▪`Optional` **listeningListener**: _function_

▸ (): _void_

**Returns:** _Server_

▸ **listen**(`handle`: any, `backlog?`: number, `listeningListener?`: function):
_Server_

**Parameters:**

▪ **handle**: _any_

▪`Optional` **backlog**: _number_

▪`Optional` **listeningListener**: _function_

▸ (): _void_

**Returns:** _Server_

▸ **listen**(`handle`: any, `listeningListener?`: function): _Server_

**Parameters:**

▪ **handle**: _any_

▪`Optional` **listeningListener**: _function_

▸ (): _void_

**Returns:** _Server_

---

##### listenerCount

▸ **listenerCount**(`type`: string | symbol): _number_

_Inherited from
[Application](#serverclassesapplicationmd).[listenerCount](#listenercount)_

**Parameters:**

| Name   | Type                 |
| ------ | -------------------- |
| `type` | string &#124; symbol |

**Returns:** _number_

---

##### listeners

▸ **listeners**(`event`: string | symbol): _Function[]_

_Inherited from
[Application](#serverclassesapplicationmd).[listeners](#listeners)_

**Parameters:**

| Name    | Type                 |
| ------- | -------------------- |
| `event` | string &#124; symbol |

**Returns:** _Function[]_

---

##### off

▸ **off**(`event`: string | symbol, `listener`: function): _this_

_Inherited from [Application](#serverclassesapplicationmd).[off](#off)_

**Parameters:**

▪ **event**: _string | symbol_

▪ **listener**: _function_

▸ (...`args`: any[]): _void_

**Parameters:**

| Name      | Type  |
| --------- | ----- |
| `...args` | any[] |

**Returns:** _this_

---

##### on

▸ **on**(`event`: string | symbol, `listener`: function): _this_

_Inherited from [Application](#serverclassesapplicationmd).[on](#on)_

**Parameters:**

▪ **event**: _string | symbol_

▪ **listener**: _function_

▸ (...`args`: any[]): _void_

**Parameters:**

| Name      | Type  |
| --------- | ----- |
| `...args` | any[] |

**Returns:** _this_

---

##### once

▸ **once**(`event`: string | symbol, `listener`: function): _this_

_Inherited from [Application](#serverclassesapplicationmd).[once](#once)_

**Parameters:**

▪ **event**: _string | symbol_

▪ **listener**: _function_

▸ (...`args`: any[]): _void_

**Parameters:**

| Name      | Type  |
| --------- | ----- |
| `...args` | any[] |

**Returns:** _this_

---

##### onerror

▸ **onerror**(`err`: Error): _void_

Default error handler.

**`api`** private

**Parameters:**

| Name  | Type  |
| ----- | ----- |
| `err` | Error |

**Returns:** _void_

---

##### prependListener

▸ **prependListener**(`event`: string | symbol, `listener`: function): _this_

_Inherited from
[Application](#serverclassesapplicationmd).[prependListener](#prependlistener)_

**Parameters:**

▪ **event**: _string | symbol_

▪ **listener**: _function_

▸ (...`args`: any[]): _void_

**Parameters:**

| Name      | Type  |
| --------- | ----- |
| `...args` | any[] |

**Returns:** _this_

---

##### prependOnceListener

▸ **prependOnceListener**(`event`: string | symbol, `listener`: function):
_this_

_Inherited from
[Application](#serverclassesapplicationmd).[prependOnceListener](#prependoncelistener)_

**Parameters:**

▪ **event**: _string | symbol_

▪ **listener**: _function_

▸ (...`args`: any[]): _void_

**Parameters:**

| Name      | Type  |
| --------- | ----- |
| `...args` | any[] |

**Returns:** _this_

---

##### rawListeners

▸ **rawListeners**(`event`: string | symbol): _Function[]_

_Inherited from
[Application](#serverclassesapplicationmd).[rawListeners](#rawlisteners)_

**Parameters:**

| Name    | Type                 |
| ------- | -------------------- |
| `event` | string &#124; symbol |

**Returns:** _Function[]_

---

##### removeAllListeners

▸ **removeAllListeners**(`event?`: string | symbol): _this_

_Inherited from
[Application](#serverclassesapplicationmd).[removeAllListeners](#removealllisteners)_

**Parameters:**

| Name     | Type                 |
| -------- | -------------------- |
| `event?` | string &#124; symbol |

**Returns:** _this_

---

##### removeListener

▸ **removeListener**(`event`: string | symbol, `listener`: function): _this_

_Inherited from
[Application](#serverclassesapplicationmd).[removeListener](#removelistener)_

**Parameters:**

▪ **event**: _string | symbol_

▪ **listener**: _function_

▸ (...`args`: any[]): _void_

**Parameters:**

| Name      | Type  |
| --------- | ----- |
| `...args` | any[] |

**Returns:** _this_

---

##### setMaxListeners

▸ **setMaxListeners**(`n`: number): _this_

_Inherited from
[Application](#serverclassesapplicationmd).[setMaxListeners](#setmaxlisteners)_

**Parameters:**

| Name | Type   |
| ---- | ------ |
| `n`  | number |

**Returns:** _this_

---

##### toJSON

▸ **toJSON**(): _any_

Return JSON representation. We only bother showing settings.

**Returns:** _any_

---

##### use

▸ **use**‹**NewStateT**, **NewCustomT**›(`middleware`:
[Middleware](#middleware)‹StateT & NewStateT, CustomT & NewCustomT›):
_[Application](#serverclassesapplicationmd)‹StateT & NewStateT, CustomT &
NewCustomT›_

Use the given middleware `fn`.

Old-style middleware will be converted.

**Type parameters:**

▪ **NewStateT**

▪ **NewCustomT**

**Parameters:**

| Name         | Type                                                                |
| ------------ | ------------------------------------------------------------------- |
| `middleware` | [Middleware](#middleware)‹StateT & NewStateT, CustomT & NewCustomT› |

**Returns:** _[Application](#serverclassesapplicationmd)‹StateT & NewStateT,
CustomT & NewCustomT›_

---

##### `Static` listenerCount

▸ **listenerCount**(`emitter`: EventEmitter, `event`: string | symbol): _number_

_Inherited from
[Application](#serverclassesapplicationmd).[listenerCount](#static-listenercount)_

**`deprecated`** since v4.0.0

**Parameters:**

| Name      | Type                 |
| --------- | -------------------- |
| `emitter` | EventEmitter         |
| `event`   | string &#124; symbol |

**Returns:** _number_

## Interfaces

<a name="serverinterfacesapperrorhandlermd"></a>

[@lbu/server - v0.0.45](#serverreadmemd) ›
[AppErrorHandler](#serverinterfacesapperrorhandlermd)

### Interface: AppErrorHandler

Extract data for the response from the AppError data

#### Hierarchy

- **AppErrorHandler**

#### Callable

▸ (`ctx`: [Context](#context), `key`: string, `info`: any): _Record‹string,
any›_

Extract data for the response from the AppError data

**Parameters:**

| Name   | Type                |
| ------ | ------------------- |
| `ctx`  | [Context](#context) |
| `key`  | string              |
| `info` | any                 |

**Returns:** _Record‹string, any›_

<a name="serverinterfacesbodyparserpairmd"></a>

[@lbu/server - v0.0.45](#serverreadmemd) ›
[BodyParserPair](#serverinterfacesbodyparserpairmd)

### Interface: BodyParserPair

#### Hierarchy

- **BodyParserPair**

#### Index

##### Properties

- [bodyParser](#bodyparser)
- [multipartBodyParser](#multipartbodyparser)

#### Properties

##### bodyParser

• **bodyParser**: _[Middleware](#middleware)_

---

##### multipartBodyParser

• **multipartBodyParser**: _[Middleware](#middleware)_

<a name="serverinterfacescorsoptionsmd"></a>

[@lbu/server - v0.0.45](#serverreadmemd) ›
[CorsOptions](#serverinterfacescorsoptionsmd)

### Interface: CorsOptions

#### Hierarchy

- **CorsOptions**

#### Index

##### Properties

- [allowHeaders](#optional-allowheaders)
- [allowMethods](#optional-allowmethods)
- [credentials](#optional-credentials)
- [exposeHeaders](#optional-exposeheaders)
- [maxAge](#optional-maxage)
- [origin](#optional-origin)

#### Properties

##### `Optional` allowHeaders

• **allowHeaders**? : _string[] | string_

`Access-Control-Allow-Headers`

---

##### `Optional` allowMethods

• **allowMethods**? : _string[] | string_

`Access-Control-Allow-Methods`, default is ['GET', 'PUT', 'POST', 'PATCH',
'DELETE', 'HEAD', 'OPTIONS']

---

##### `Optional` credentials

• **credentials**? : _boolean_

`Access-Control-Allow-Credentials`

---

##### `Optional` exposeHeaders

• **exposeHeaders**? : _string[] | string_

`Access-Control-Expose-Headers`

---

##### `Optional` maxAge

• **maxAge**? : _string | number_

`Access-Control-Max-Age` in seconds

---

##### `Optional` origin

• **origin**? : _string | function_

`Access-Control-Allow-Origin`, default is request Origin header

<a name="serverinterfacescustomerrorhandlermd"></a>

[@lbu/server - v0.0.45](#serverreadmemd) ›
[CustomErrorHandler](#serverinterfacescustomerrorhandlermd)

### Interface: CustomErrorHandler

Return truthy when handled or falsey when skipped

#### Hierarchy

- **CustomErrorHandler**

#### Callable

▸ (`ctx`: [Context](#context), `err`: Error): _boolean_

Return truthy when handled or falsey when skipped

**Parameters:**

| Name  | Type                |
| ----- | ------------------- |
| `ctx` | [Context](#context) |
| `err` | Error               |

**Returns:** _boolean_

<a name="serverinterfaceserrorhandleroptionsmd"></a>

[@lbu/server - v0.0.45](#serverreadmemd) ›
[ErrorHandlerOptions](#serverinterfaceserrorhandleroptionsmd)

### Interface: ErrorHandlerOptions

#### Hierarchy

- **ErrorHandlerOptions**

#### Index

##### Properties

- [leakError](#optional-leakerror)
- [onAppError](#optional-onapperror)
- [onError](#optional-onerror)

#### Properties

##### `Optional` leakError

• **leakError**? : _boolean_

Useful on development and staging environments to just dump the error to the
consumer

---

##### `Optional` onAppError

• **onAppError**? : _[AppErrorHandler](#serverinterfacesapperrorhandlermd)_

Called to set the initial body when the error is an AppError

---

##### `Optional` onError

• **onError**? : _[CustomErrorHandler](#serverinterfacescustomerrorhandlermd)_

Called before all others to let the user handle their own errors

<a name="serverinterfacesgetappoptionsmd"></a>

[@lbu/server - v0.0.45](#serverreadmemd) ›
[GetAppOptions](#serverinterfacesgetappoptionsmd)

### Interface: GetAppOptions

#### Hierarchy

- **GetAppOptions**

#### Index

##### Properties

- [disableHeaders](#optional-disableheaders)
- [disableHealthRoute](#optional-disablehealthroute)
- [errorOptions](#optional-erroroptions)
- [headers](#optional-headers)
- [proxy](#optional-proxy)

#### Properties

##### `Optional` disableHeaders

• **disableHeaders**? : _boolean_

Don't handle cors headers

---

##### `Optional` disableHealthRoute

• **disableHealthRoute**? : _boolean_

Disable GET /\_health

---

##### `Optional` errorOptions

• **errorOptions**? :
_[ErrorHandlerOptions](#serverinterfaceserrorhandleroptionsmd)_

Flexible error handling options

---

##### `Optional` headers

• **headers**? : _[HeaderOptions](#serverinterfacesheaderoptionsmd)_

Argument for defaultHeader middleware

---

##### `Optional` proxy

• **proxy**? : _boolean_

Trust proxy headers

<a name="serverinterfacesheaderoptionsmd"></a>

[@lbu/server - v0.0.45](#serverreadmemd) ›
[HeaderOptions](#serverinterfacesheaderoptionsmd)

### Interface: HeaderOptions

#### Hierarchy

- **HeaderOptions**

#### Index

##### Properties

- [cors](#optional-cors)

#### Properties

##### `Optional` cors

• **cors**? : _[CorsOptions](#serverinterfacescorsoptionsmd)_

# Stdlib

<a name="stdlibreadmemd"></a>

[@lbu/stdlib - v0.0.45](#stdlibreadmemd)

## @lbu/stdlib - v0.0.45

### Index

#### Classes

- [AppError](#stdlibclassesapperrormd)

#### Interfaces

- [MainFnCallback](#stdlibinterfacesmainfncallbackmd)
- [ProcessDirectoryOptions](#stdlibinterfacesprocessdirectoryoptionsmd)
- [TemplateContext](#stdlibinterfacestemplatecontextmd)
- [UuidFunc](#stdlibinterfacesuuidfuncmd)

#### Variables

- [uuid](#const-uuid)

#### Functions

- [camelToSnakeCase](#cameltosnakecase)
- [compileTemplate](#compiletemplate)
- [compileTemplateDirectory](#compiletemplatedirectory)
- [compileTemplateDirectorySync](#compiletemplatedirectorysync)
- [dirnameForModule](#dirnameformodule)
- [exec](#exec)
- [executeTemplate](#executetemplate)
- [filenameForModule](#filenameformodule)
- [flatten](#flatten)
- [gc](#gc)
- [getSecondsSinceEpoch](#getsecondssinceepoch)
- [isNil](#isnil)
- [isPlainObject](#isplainobject)
- [mainFn](#mainfn)
- [merge](#merge)
- [neTemplateContext](#netemplatecontext)
- [noop](#noop)
- [pathJoin](#pathjoin)
- [processDirectoryRecursive](#processdirectoryrecursive)
- [processDirectoryRecursiveSync](#processdirectoryrecursivesync)
- [spawn](#spawn)
- [unFlatten](#unflatten)

### Variables

#### `Const` uuid

• **uuid**: _[UuidFunc](#stdlibinterfacesuuidfuncmd)_

Return a new uuid v4

**`example`**

```js
uuid();
// => f3283b08-08c4-43fc-9fa6-e36c0ab2b61a
```

### Functions

#### camelToSnakeCase

▸ **camelToSnakeCase**(`input`: string): _string_

Convert a camelCase string to a snake_case string

**`example`**

```js
camelToSnakeCase("fooBBar");
// => "foo_b_bar"
```

**Parameters:**

| Name    | Type   |
| ------- | ------ |
| `input` | string |

**Returns:** _string_

---

#### compileTemplate

▸ **compileTemplate**(`tc`:
[TemplateContext](#stdlibinterfacestemplatecontextmd), `name`: string, `str`:
string, `opts?`: object): _any_

Compile templates add to TemplateContext. This function is unsafe for untrusted
inputs Fields need to be explicitly set to undefined or access them via
`it.field` Inspired by: https://johnresig.com/blog/javascript-micro-templating/

**Parameters:**

▪ **tc**: _[TemplateContext](#stdlibinterfacestemplatecontextmd)_

▪ **name**: _string_

Name that is exposed in the template it self and to be used with the
executeTemplate function

▪ **str**: _string_

Template string

▪`Optional` **opts**: _object_

| Name     | Type    |
| -------- | ------- |
| `debug?` | boolean |

**Returns:** _any_

---

#### compileTemplateDirectory

▸ **compileTemplateDirectory**(`tc`:
[TemplateContext](#stdlibinterfacestemplatecontextmd), `dir`: string,
`extension`: string, `opts?`:
[ProcessDirectoryOptions](#stdlibinterfacesprocessdirectoryoptionsmd)):
_Promise‹void›_

Compile all templates found in the provided directory with the provided
extension

**Parameters:**

| Name        | Type                                                                  |
| ----------- | --------------------------------------------------------------------- |
| `tc`        | [TemplateContext](#stdlibinterfacestemplatecontextmd)                 |
| `dir`       | string                                                                |
| `extension` | string                                                                |
| `opts?`     | [ProcessDirectoryOptions](#stdlibinterfacesprocessdirectoryoptionsmd) |

**Returns:** _Promise‹void›_

---

#### compileTemplateDirectorySync

▸ **compileTemplateDirectorySync**(`tc`:
[TemplateContext](#stdlibinterfacestemplatecontextmd), `dir`: string,
`extension`: string, `opts?`:
[ProcessDirectoryOptions](#stdlibinterfacesprocessdirectoryoptionsmd)): _void_

Compile all templates found in the provided directory with the provided
extension synchronously

**Parameters:**

| Name        | Type                                                                  |
| ----------- | --------------------------------------------------------------------- |
| `tc`        | [TemplateContext](#stdlibinterfacestemplatecontextmd)                 |
| `dir`       | string                                                                |
| `extension` | string                                                                |
| `opts?`     | [ProcessDirectoryOptions](#stdlibinterfacesprocessdirectoryoptionsmd) |

**Returns:** _void_

---

#### dirnameForModule

▸ **dirnameForModule**(`meta`: ImportMeta): _string_

Return dirname for ES Module Alternative to CommonJS \_\_dirname

**Parameters:**

| Name   | Type       |
| ------ | ---------- |
| `meta` | ImportMeta |

**Returns:** _string_

---

#### exec

▸ **exec**(`command`: string): _Promise‹object›_

Promisify version of child_process#exec

**`example`**

```js
exec("uname -m");
// => Promise<{ stdout: "x86_64\n", stderr: "" }>
```

**Parameters:**

| Name      | Type   |
| --------- | ------ |
| `command` | string |

**Returns:** _Promise‹object›_

---

#### executeTemplate

▸ **executeTemplate**(`tc`:
[TemplateContext](#stdlibinterfacestemplatecontextmd), `name`: string, `data`:
any): _string_

Execute a template, template should be compiled using compileTemplate

**Parameters:**

| Name   | Type                                                  |
| ------ | ----------------------------------------------------- |
| `tc`   | [TemplateContext](#stdlibinterfacestemplatecontextmd) |
| `name` | string                                                |
| `data` | any                                                   |

**Returns:** _string_

---

#### filenameForModule

▸ **filenameForModule**(`meta`: ImportMeta): _string_

Return filename for ES Module Alternative to CommonJS \_\_filename

**Parameters:**

| Name   | Type       |
| ------ | ---------- |
| `meta` | ImportMeta |

**Returns:** _string_

---

#### flatten

▸ **flatten**(`object`: any, `result?`: any, `path?`: string): _object_

Flattens the given nested object, skipping anything that is not a plain object

**`example`**

```js
flatten({ foo: { bar: 2 } });
// => { "foo.bar": 2 }
```

**Parameters:**

| Name      | Type   |
| --------- | ------ |
| `object`  | any    |
| `result?` | any    |
| `path?`   | string |

**Returns:** _object_

- \[ **key**: _string_\]: any

---

#### gc

▸ **gc**(): _void_

HACKY Let V8 know to please run the garbage collector.

**Returns:** _void_

---

#### getSecondsSinceEpoch

▸ **getSecondsSinceEpoch**(): _number_

Return seconds since unix epoch

**Returns:** _number_

---

#### isNil

▸ **isNil**‹**T**›(`value`: T | null | undefined): _value is null | undefined_

Check if item is null or undefined

**`example`**

```js
isNil(null);
// => true
isNil(undefined);
// => true
isNil({});
// => false
```

**Type parameters:**

▪ **T**

**Parameters:**

| Name    | Type                           |
| ------- | ------------------------------ |
| `value` | T &#124; null &#124; undefined |

**Returns:** _value is null | undefined_

---

#### isPlainObject

▸ **isPlainObject**(`obj`: any): _boolean_

Check if item is a plain javascript object Not completely bullet proof

**`example`**

```js
isPlainObject("foo");
// => false
isPlainObject(new (class Foo {})());
// => false
isPlainObject([]);
// => false
isPlainObject({});
// => true
```

**Parameters:**

| Name  | Type |
| ----- | ---- |
| `obj` | any  |

**Returns:** _boolean_

---

#### mainFn

▸ **mainFn**(`meta`: ImportMeta, `logger`: Logger, `cb`:
[MainFnCallback](#stdlibinterfacesmainfncallbackmd)): _Promise‹void›_

Run the provided cb if this file is the process entrypoint Will also load dotenv
before executing the provided callback. Another side effect is that a process
listener is added for warnings

**Parameters:**

| Name     | Type                                                |
| -------- | --------------------------------------------------- |
| `meta`   | ImportMeta                                          |
| `logger` | Logger                                              |
| `cb`     | [MainFnCallback](#stdlibinterfacesmainfncallbackmd) |

**Returns:** _Promise‹void›_

---

#### merge

▸ **merge**(`object`: any, ...`sources`: any[]): _any_

Re expose lodash.merge TODO: Note that lodash.merge is deprecated although it
doesnt say so when installing **Note:** This method mutates `object`.

**`example`**

```js
merge({}, {});
// => {}
merge({}, { foo: true });
// => { foo: true }
merge({ bar: 1 }, { bar: 2 });
// => { bar: 2 }
```

**Parameters:**

| Name         | Type  |
| ------------ | ----- |
| `object`     | any   |
| `...sources` | any[] |

**Returns:** _any_

---

#### neTemplateContext

▸ **neTemplateContext**():
_[TemplateContext](#stdlibinterfacestemplatecontextmd)_

Create a new TemplateContext Adds the `isNil` function as a global

**Returns:** _[TemplateContext](#stdlibinterfacestemplatecontextmd)_

---

#### noop

▸ **noop**(): _void_

An empty function, doing exactly nothing but returning undefined.

**Returns:** _void_

---

#### pathJoin

▸ **pathJoin**(...`parts`: string[]): _string_

Reexport of path#join

**`example`**

```js
pathJoin("/foo", "bar");
// => "/foo/bar"
```

**Parameters:**

| Name       | Type     |
| ---------- | -------- |
| `...parts` | string[] |

**Returns:** _string_

---

#### processDirectoryRecursive

▸ **processDirectoryRecursive**(`dir`: string, `cb`: function, `opts?`:
[ProcessDirectoryOptions](#stdlibinterfacesprocessdirectoryoptionsmd)):
_Promise‹void›_

Recursively walks directory async and calls cb on all files

**Parameters:**

▪ **dir**: _string_

▪ **cb**: _function_

▸ (`file`: string): _Promise‹void› | void_

**Parameters:**

| Name   | Type   |
| ------ | ------ |
| `file` | string |

▪`Optional` **opts**:
_[ProcessDirectoryOptions](#stdlibinterfacesprocessdirectoryoptionsmd)_

**Returns:** _Promise‹void›_

---

#### processDirectoryRecursiveSync

▸ **processDirectoryRecursiveSync**(`dir`: string, `cb`: function, `opts?`:
[ProcessDirectoryOptions](#stdlibinterfacesprocessdirectoryoptionsmd)): _void_

Recursively walks directory synchronous and calls cb on all files

**Parameters:**

▪ **dir**: _string_

▪ **cb**: _function_

▸ (`file`: string): _void_

**Parameters:**

| Name   | Type   |
| ------ | ------ |
| `file` | string |

▪`Optional` **opts**:
_[ProcessDirectoryOptions](#stdlibinterfacesprocessdirectoryoptionsmd)_

**Returns:** _void_

---

#### spawn

▸ **spawn**(`command`: string, `args`: string[], `opts?`: SpawnOptions):
_Promise‹object›_

A promise wrapper around child_process#spawn

**`example`**

```js
spawn("ls", ["-al"], { cwd: "/home" });
// => Promise<{ code: 0 }>
```

**Parameters:**

| Name      | Type         |
| --------- | ------------ |
| `command` | string       |
| `args`    | string[]     |
| `opts?`   | SpawnOptions |

**Returns:** _Promise‹object›_

---

#### unFlatten

▸ **unFlatten**(`data?`: object): _any_

Opposite of flatten

**`example`**

```js
unFlatten({ "foo.bar": 2 });
// => { foo: { bar: 2 } }
```

**Parameters:**

| Name    | Type   |
| ------- | ------ |
| `data?` | object |

**Returns:** _any_

## Classes

<a name="stdlibclassesapperrormd"></a>

[@lbu/stdlib - v0.0.45](#stdlibreadmemd) › [AppError](#stdlibclassesapperrormd)

### Class: AppError ‹**T**›

AppErrors represent errors, that should immediately stop the request and return
a status and other meta data directly

**`example`**

```js
new AppError(401, "error.server.unauthorized");
AppError.validationError("validation.string.length", {
  message: "String should have at least 3 characters",
});
AppError.serverError({}, new Error("Oopsie"));
```

#### Type parameters

▪ **T**: _any_

#### Hierarchy

- [Error](#static-error)

  ↳ **AppError**

#### Index

##### Constructors

- [constructor](#constructor)

##### Properties

- [info](#info)
- [key](#key)
- [message](#message)
- [name](#name)
- [originalError](#optional-originalerror)
- [stack](#optional-stack)
- [status](#status)
- [Error](#static-error)

##### Methods

- [instanceOf](#static-instanceof)
- [notFound](#static-notfound)
- [notImplemented](#static-notimplemented)
- [serverError](#static-servererror)
- [validationError](#static-validationerror)

#### Constructors

##### constructor

\+ **new AppError**(`key`: string, `status`: number, `info?`: T,
`originalError?`: [Error](#static-error)):
_[AppError](#stdlibclassesapperrormd)_

Create a new AppError

**Parameters:**

| Name             | Type                   |
| ---------------- | ---------------------- |
| `key`            | string                 |
| `status`         | number                 |
| `info?`          | T                      |
| `originalError?` | [Error](#static-error) |

**Returns:** _[AppError](#stdlibclassesapperrormd)_

#### Properties

##### info

• **info**: _T_

Extra information in the form of an object for the client to use

---

##### key

• **key**: _string_

Key is preferred to be in the following format

```
  "foo.bar"
  "error.server.notImplemented"
```

---

##### message

• **message**: _string_

_Inherited from [AppError](#stdlibclassesapperrormd).[message](#message)_

---

##### name

• **name**: _string_

_Inherited from [AppError](#stdlibclassesapperrormd).[name](#name)_

---

##### `Optional` originalError

• **originalError**? : _[Error](#static-error)_

Optional original error that was thrown

---

##### `Optional` stack

• **stack**? : _string_

_Inherited from [AppError](#stdlibclassesapperrormd).[stack](#optional-stack)_

---

##### status

• **status**: _number_

Status number to send to the api client

---

##### `Static` Error

▪ **Error**: _ErrorConstructor_

#### Methods

##### `Static` instanceOf

▸ **instanceOf**(`value`: unknown): _value is AppError<unknown>_

Check if value contains the properties to at least act like a valid AppError

**Parameters:**

| Name    | Type    |
| ------- | ------- |
| `value` | unknown |

**Returns:** _value is AppError<unknown>_

---

##### `Static` notFound

▸ **notFound**‹**T**›(`info?`: T, `error?`: [Error](#static-error)):
_[AppError](#stdlibclassesapperrormd)‹T›_

Create a new 404 not found error

**Type parameters:**

▪ **T**: _any_

**Parameters:**

| Name     | Type                   |
| -------- | ---------------------- |
| `info?`  | T                      |
| `error?` | [Error](#static-error) |

**Returns:** _[AppError](#stdlibclassesapperrormd)‹T›_

---

##### `Static` notImplemented

▸ **notImplemented**‹**T**›(`info?`: T, `error?`: [Error](#static-error)):
_[AppError](#stdlibclassesapperrormd)‹T›_

Create a new 405 not implemented error

**Type parameters:**

▪ **T**: _any_

**Parameters:**

| Name     | Type                   |
| -------- | ---------------------- |
| `info?`  | T                      |
| `error?` | [Error](#static-error) |

**Returns:** _[AppError](#stdlibclassesapperrormd)‹T›_

---

##### `Static` serverError

▸ **serverError**‹**T**›(`info?`: T, `error?`: [Error](#static-error)):
_[AppError](#stdlibclassesapperrormd)‹T›_

Create a new 500 internal server error

**Type parameters:**

▪ **T**: _any_

**Parameters:**

| Name     | Type                   |
| -------- | ---------------------- |
| `info?`  | T                      |
| `error?` | [Error](#static-error) |

**Returns:** _[AppError](#stdlibclassesapperrormd)‹T›_

---

##### `Static` validationError

▸ **validationError**‹**T**›(`key`: string, `info?`: T, `error?`:
[Error](#static-error)): _[AppError](#stdlibclassesapperrormd)‹T›_

Create a new 400 validation error

**Type parameters:**

▪ **T**: _any_

**Parameters:**

| Name     | Type                   |
| -------- | ---------------------- |
| `key`    | string                 |
| `info?`  | T                      |
| `error?` | [Error](#static-error) |

**Returns:** _[AppError](#stdlibclassesapperrormd)‹T›_

## Interfaces

<a name="stdlibinterfacesmainfncallbackmd"></a>

[@lbu/stdlib - v0.0.45](#stdlibreadmemd) ›
[MainFnCallback](#stdlibinterfacesmainfncallbackmd)

### Interface: MainFnCallback

#### Hierarchy

- **MainFnCallback**

#### Callable

▸ (`logger`: Logger): _void | Promise‹void›_

**Parameters:**

| Name     | Type   |
| -------- | ------ |
| `logger` | Logger |

**Returns:** _void | Promise‹void›_

<a name="stdlibinterfacesprocessdirectoryoptionsmd"></a>

[@lbu/stdlib - v0.0.45](#stdlibreadmemd) ›
[ProcessDirectoryOptions](#stdlibinterfacesprocessdirectoryoptionsmd)

### Interface: ProcessDirectoryOptions

Options for processDirectoryRecursive and processDirectoryRecursiveSync

#### Hierarchy

- **ProcessDirectoryOptions**

#### Index

##### Properties

- [skipDotFiles](#optional-skipdotfiles)
- [skipNodeModules](#optional-skipnodemodules)

#### Properties

##### `Optional` skipDotFiles

• **skipDotFiles**? : _boolean_

Skip files and directories starting with a '.', true by default

---

##### `Optional` skipNodeModules

• **skipNodeModules**? : _boolean_

Skip node_modules directory, true by default

<a name="stdlibinterfacestemplatecontextmd"></a>

[@lbu/stdlib - v0.0.45](#stdlibreadmemd) ›
[TemplateContext](#stdlibinterfacestemplatecontextmd)

### Interface: TemplateContext

Wraps the state needed for templates Globals are available to all templates
Templates are also available to all other templates when executing

#### Hierarchy

- **TemplateContext**

#### Index

##### Properties

- [globals](#globals)
- [strict](#strict)
- [templates](#templates)

#### Properties

##### globals

• **globals**: _object_

Functions available to all templates

###### Type declaration:

- \[ **key**: _string_\]: Function

---

##### strict

• **strict**: _boolean_

Throw on recompilation of a template Defaults to 'true'

---

##### templates

• **templates**: _Map‹string, Function›_

Compiled template functions

<a name="stdlibinterfacesuuidfuncmd"></a>

[@lbu/stdlib - v0.0.45](#stdlibreadmemd) ›
[UuidFunc](#stdlibinterfacesuuidfuncmd)

### Interface: UuidFunc

#### Hierarchy

- **UuidFunc**

#### Callable

▸ (): _string_

Return a new uuid v4

**Returns:** _string_

#### Index

##### Methods

- [isValid](#isvalid)

#### Methods

##### isValid

▸ **isValid**(`value`: any): _boolean_

Returns true if value conforms a basic uuid structure. This check is
case-insensitive.

**Parameters:**

| Name    | Type |
| ------- | ---- |
| `value` | any  |

**Returns:** _boolean_

# Store

<a name="storereadmemd"></a>

[@lbu/store - v0.0.45](#storereadmemd)

## @lbu/store - v0.0.45

### Index

#### Classes

- [FileCache](#storeclassesfilecachemd)
- [JobQueueWorker](#storeclassesjobqueueworkermd)

#### Interfaces

- [FileCacheOptions](#storeinterfacesfilecacheoptionsmd)
- [FileStoreContext](#storeinterfacesfilestorecontextmd)
- [JobData](#storeinterfacesjobdatamd)
- [JobInput](#storeinterfacesjobinputmd)
- [JobQueueWorkerOptions](#storeinterfacesjobqueueworkeroptionsmd)
- [MigrateContext](#storeinterfacesmigratecontextmd)
- [MigrateFile](#storeinterfacesmigratefilemd)
- [SessionStore](#storeinterfacessessionstoremd)
- [SessionStoreOptions](#storeinterfacessessionstoreoptionsmd)
- [StoreFileStore](#storeinterfacesstorefilestoremd)

#### Variables

- [migrations](#const-migrations)
- [minio](#const-minio)
- [postgres](#const-postgres)
- [storeStructure](#const-storestructure)

#### Functions

- [addJobToQueue](#addjobtoqueue)
- [cleanupTestPostgresDatabase](#cleanuptestpostgresdatabase)
- [copyFile](#copyfile)
- [createOrUpdateFile](#createorupdatefile)
- [createTestPostgresDatabase](#createtestpostgresdatabase)
- [deleteFile](#deletefile)
- [ensureBucket](#ensurebucket)
- [getFileById](#getfilebyid)
- [getFileStream](#getfilestream)
- [getMigrationsToBeApplied](#getmigrationstobeapplied)
- [listObjects](#listobjects)
- [newFileStoreContext](#newfilestorecontext)
- [newMigrationContext](#newmigrationcontext)
- [newMinioClient](#newminioclient)
- [newPostgresConnection](#newpostgresconnection)
- [newSessionStore](#newsessionstore)
- [removeBucket](#removebucket)
- [removeBucketAndObjectsInBucket](#removebucketandobjectsinbucket)
- [runMigrations](#runmigrations)
- [syncDeletedFiles](#syncdeletedfiles)

### Variables

#### `Const` migrations

• **migrations**: _string_

Migration directory

---

#### `Const` minio

• **minio**: _typeof minioVendor_

Reexported all of minio package

---

#### `Const` postgres

• **postgres**: _typeof postgresVendor_

Reexported all of postgres package

---

#### `Const` storeStructure

• **storeStructure**: _any_

LBU structure. Can be used to extend functionality or reference one of the
columns

### Functions

#### addJobToQueue

▸ **addJobToQueue**(`sql`: postgresVendor.Sql‹object›, `job`:
[JobInput](#storeinterfacesjobinputmd)): _Promise‹number›_

Add a new item to the job queue Defaults to `process.env.APP_NAME` if name is
not specified

**Parameters:**

| Name  | Type                                   |
| ----- | -------------------------------------- |
| `sql` | postgresVendor.Sql‹object›             |
| `job` | [JobInput](#storeinterfacesjobinputmd) |

**Returns:** _Promise‹number›_

---

#### cleanupTestPostgresDatabase

▸ **cleanupTestPostgresDatabase**(`sql`: postgresVendor.Sql‹object›):
_Promise‹void›_

Drop the test database created with `createTestPostgresDatabase` and end the
connection

**Parameters:**

| Name  | Type                       |
| ----- | -------------------------- |
| `sql` | postgresVendor.Sql‹object› |

**Returns:** _Promise‹void›_

---

#### copyFile

▸ **copyFile**(`fc`: [FileStoreContext](#storeinterfacesfilestorecontextmd),
`id`: string, `targetBucket?`: string):
_Promise‹[StoreFileStore](#storeinterfacesstorefilestoremd)›_

Create a file copy both in postgres and in minio

**Parameters:**

| Name            | Type                                                   |
| --------------- | ------------------------------------------------------ |
| `fc`            | [FileStoreContext](#storeinterfacesfilestorecontextmd) |
| `id`            | string                                                 |
| `targetBucket?` | string                                                 |

**Returns:** _Promise‹[StoreFileStore](#storeinterfacesstorefilestoremd)›_

---

#### createOrUpdateFile

▸ **createOrUpdateFile**(`fc`:
[FileStoreContext](#storeinterfacesfilestorecontextmd), `props`: object,
`streamOrPath`: string | ReadStream):
_Promise‹[StoreFileStore](#storeinterfacesstorefilestoremd)›_

Create or update a file. If you pass in a non-existent id, the function will not
error, but also not update the file

**Parameters:**

▪ **fc**: _[FileStoreContext](#storeinterfacesfilestorecontextmd)_

▪ **props**: _object_

| Name             | Type   |
| ---------------- | ------ |
| `bucketName?`    | string |
| `contentLength?` | number |
| `contentType?`   | string |
| `createdAt?`     | string |
| `filename`       | string |
| `id?`            | string |
| `updatedAt?`     | string |

▪ **streamOrPath**: _string | ReadStream_

**Returns:** _Promise‹[StoreFileStore](#storeinterfacesstorefilestoremd)›_

---

#### createTestPostgresDatabase

▸ **createTestPostgresDatabase**(`verboseSql?`: boolean):
_Promise‹postgresVendor.Sql‹object››_

Drops connections to 'normal' database and creates a new one based on the
'normal' database. It will truncate all tables and return a connection to the
new database.

**Parameters:**

| Name          | Type    |
| ------------- | ------- |
| `verboseSql?` | boolean |

**Returns:** _Promise‹postgresVendor.Sql‹object››_

---

#### deleteFile

▸ **deleteFile**(`fc`: [FileStoreContext](#storeinterfacesfilestorecontextmd),
`id`: string): _Promise‹void›_

Delete a file by id Does not remove the object from minio bucket

**Parameters:**

| Name | Type                                                   |
| ---- | ------------------------------------------------------ |
| `fc` | [FileStoreContext](#storeinterfacesfilestorecontextmd) |
| `id` | string                                                 |

**Returns:** _Promise‹void›_

---

#### ensureBucket

▸ **ensureBucket**(`minio`: Client, `bucketName`: string, `region`:
minioVendor.Region): _Promise‹void›_

Create a bucket if it doesn't exist

**Parameters:**

| Name         | Type               |
| ------------ | ------------------ |
| `minio`      | Client             |
| `bucketName` | string             |
| `region`     | minioVendor.Region |

**Returns:** _Promise‹void›_

---

#### getFileById

▸ **getFileById**(`fc`: [FileStoreContext](#storeinterfacesfilestorecontextmd),
`id`: string): _Promise‹[StoreFileStore](#storeinterfacesstorefilestoremd) |
undefined›_

Select a file by id

**Parameters:**

| Name | Type                                                   |
| ---- | ------------------------------------------------------ |
| `fc` | [FileStoreContext](#storeinterfacesfilestorecontextmd) |
| `id` | string                                                 |

**Returns:** _Promise‹[StoreFileStore](#storeinterfacesstorefilestoremd) |
undefined›_

---

#### getFileStream

▸ **getFileStream**(`fc`:
[FileStoreContext](#storeinterfacesfilestorecontextmd), `id`: string, `range?`:
object): _Promise‹ReadStream›_

Open a ReadStream for a (partial) file

**Parameters:**

▪ **fc**: _[FileStoreContext](#storeinterfacesfilestorecontextmd)_

▪ **id**: _string_

▪`Optional` **range**: _object_

| Name     | Type   |
| -------- | ------ |
| `end?`   | number |
| `start?` | number |

**Returns:** _Promise‹ReadStream›_

---

#### getMigrationsToBeApplied

▸ **getMigrationsToBeApplied**(`mc`:
[MigrateContext](#storeinterfacesmigratecontextmd)): _false | object[]_

Get a list of migrations to be applied Returns false if no migrations need to
run

**Parameters:**

| Name | Type                                               |
| ---- | -------------------------------------------------- |
| `mc` | [MigrateContext](#storeinterfacesmigratecontextmd) |

**Returns:** _false | object[]_

---

#### listObjects

▸ **listObjects**(`minio`: Client, `bucketName`: string, `filter?`: string):
_Promise‹object[]›_

List all objects in a bucket. Note that this is not a fast operation

**Parameters:**

| Name         | Type   |
| ------------ | ------ |
| `minio`      | Client |
| `bucketName` | string |
| `filter?`    | string |

**Returns:** _Promise‹object[]›_

---

#### newFileStoreContext

▸ **newFileStoreContext**(`sql`: postgresVendor.Sql‹object›, `minio`: Client,
`bucketName`: string): _[FileStoreContext](#storeinterfacesfilestorecontextmd)_

Create a new FileStoreContext

**Parameters:**

| Name         | Type                       |
| ------------ | -------------------------- |
| `sql`        | postgresVendor.Sql‹object› |
| `minio`      | Client                     |
| `bucketName` | string                     |

**Returns:** _[FileStoreContext](#storeinterfacesfilestorecontextmd)_

---

#### newMigrationContext

▸ **newMigrationContext**(`sql`: postgresVendor.Sql‹object›):
_Promise‹[MigrateContext](#storeinterfacesmigratecontextmd)›_

Create a new MigrateContext, requires an advisory lock and does the necessary
queries to get the state.

**Parameters:**

| Name  | Type                       |
| ----- | -------------------------- |
| `sql` | postgresVendor.Sql‹object› |

**Returns:** _Promise‹[MigrateContext](#storeinterfacesmigratecontextmd)›_

---

#### newMinioClient

▸ **newMinioClient**(`options`: ClientOptions): _Client_

Create a new minio client. By defaults reads configuration from environment
variables as specified in docs/env.md

**Parameters:**

| Name      | Type          |
| --------- | ------------- |
| `options` | ClientOptions |

**Returns:** _Client_

---

#### newPostgresConnection

▸ **newPostgresConnection**(`opts?`: postgresVendor.Options‹object› & object):
_postgresVendor.Sql‹object›_

Create a new postgres client. By defaults reads configuration from environment
variables as specified in docs/env.md

Will attempt database creation if `createIfNotExists` is set to true

**Parameters:**

| Name    | Type                                    |
| ------- | --------------------------------------- |
| `opts?` | postgresVendor.Options‹object› & object |

**Returns:** _postgresVendor.Sql‹object›_

---

#### newSessionStore

▸ **newSessionStore**(`sql`: postgresVendor.Sql‹object›, `opts?`:
[SessionStoreOptions](#storeinterfacessessionstoreoptionsmd)):
_[SessionStore](#storeinterfacessessionstoremd)_

Create a session store that can be used in combination with @lbu/server#session

**Parameters:**

| Name    | Type                                                         |
| ------- | ------------------------------------------------------------ |
| `sql`   | postgresVendor.Sql‹object›                                   |
| `opts?` | [SessionStoreOptions](#storeinterfacessessionstoreoptionsmd) |

**Returns:** _[SessionStore](#storeinterfacessessionstoremd)_

---

#### removeBucket

▸ **removeBucket**(`minio`: Client, `bucketName`: string): _Promise‹void›_

Remove a bucket

**Parameters:**

| Name         | Type   |
| ------------ | ------ |
| `minio`      | Client |
| `bucketName` | string |

**Returns:** _Promise‹void›_

---

#### removeBucketAndObjectsInBucket

▸ **removeBucketAndObjectsInBucket**(`minio`: Client, `bucketName`: string):
_Promise‹void›_

Removes all objects and then deletes the bucket

**Parameters:**

| Name         | Type   |
| ------------ | ------ |
| `minio`      | Client |
| `bucketName` | string |

**Returns:** _Promise‹void›_

---

#### runMigrations

▸ **runMigrations**(`mc`: [MigrateContext](#storeinterfacesmigratecontextmd)):
_Promise‹void›_

Run the migrations, as returned by `getMigrationsToBeApplied`

**Parameters:**

| Name | Type                                               |
| ---- | -------------------------------------------------- |
| `mc` | [MigrateContext](#storeinterfacesmigratecontextmd) |

**Returns:** _Promise‹void›_

---

#### syncDeletedFiles

▸ **syncDeletedFiles**(`fc`:
[FileStoreContext](#storeinterfacesfilestorecontextmd)): _any_

Sync deleted files to the minio bucket

**Parameters:**

| Name | Type                                                   |
| ---- | ------------------------------------------------------ |
| `fc` | [FileStoreContext](#storeinterfacesfilestorecontextmd) |

**Returns:** _any_

## Classes

<a name="storeclassesfilecachemd"></a>

[@lbu/store - v0.0.45](#storereadmemd) › [FileCache](#storeclassesfilecachemd)

### Class: FileCache

A relatively simple local file cache implementation. Supports saving files in
memory and on local disk Files#contentLength smaller than the provided threshold
will be stored in memory. A file will always be cached in full, and then the
range requests will be evaluated after The FileCache#clear does not remove files
from disk, but will overwrite the file when added to the cache again

FileCache#getFileStream is compatible with `sendFile` in @lbu/server

#### Hierarchy

- **FileCache**

#### Index

##### Constructors

- [constructor](#constructor)

##### Properties

- [fileCachePath](#static-filecachepath)

##### Methods

- [clear](#clear)
- [getFileSteam](#getfilesteam)

#### Constructors

##### constructor

\+ **new FileCache**(`fileStore`:
[FileStoreContext](#storeinterfacesfilestorecontextmd), `options?`:
[FileCacheOptions](#storeinterfacesfilecacheoptionsmd)):
_[FileCache](#storeclassesfilecachemd)_

**Parameters:**

| Name        | Type                                                   |
| ----------- | ------------------------------------------------------ |
| `fileStore` | [FileStoreContext](#storeinterfacesfilestorecontextmd) |
| `options?`  | [FileCacheOptions](#storeinterfacesfilecacheoptionsmd) |

**Returns:** _[FileCache](#storeclassesfilecachemd)_

#### Properties

##### `Static` fileCachePath

▪ **fileCachePath**: _string_

#### Methods

##### clear

▸ **clear**(`fileId`: string): _void_

Remove a file from cache, but not from local disk

**Parameters:**

| Name     | Type   |
| -------- | ------ |
| `fileId` | string |

**Returns:** _void_

---

##### getFileSteam

▸ **getFileSteam**(`file`: [StoreFileStore](#storeinterfacesstorefilestoremd),
`start?`: number, `end?`: number): _Promise‹object›_

Get a file(part) from the cache. If the file(part) does not exist, it will try
to fetch it from the FileStore If the file store throws an error / it doesn't
exist, the error is propagated to the caller

**Parameters:**

| Name     | Type                                               |
| -------- | -------------------------------------------------- |
| `file`   | [StoreFileStore](#storeinterfacesstorefilestoremd) |
| `start?` | number                                             |
| `end?`   | number                                             |

**Returns:** _Promise‹object›_

<a name="storeclassesjobqueueworkermd"></a>

[@lbu/store - v0.0.45](#storereadmemd) ›
[JobQueueWorker](#storeclassesjobqueueworkermd)

### Class: JobQueueWorker

Job Queue worker. Supports scheduling, priorities and parallel workers If a name
is provided, this worker will only accept jobs with the exact same name

#### Hierarchy

- **JobQueueWorker**

#### Index

##### Constructors

- [constructor](#constructor)

##### Methods

- [addJob](#addjob)
- [averageTimeToCompletion](#averagetimetocompletion)
- [pendingQueueSize](#pendingqueuesize)
- [start](#start)
- [stop](#stop)

#### Constructors

##### constructor

\+ **new JobQueueWorker**(`sql`: postgresVendor.Sql‹object›, `nameOrOptions`:
string | [JobQueueWorkerOptions](#storeinterfacesjobqueueworkeroptionsmd),
`options?`: [JobQueueWorkerOptions](#storeinterfacesjobqueueworkeroptionsmd)):
_[JobQueueWorker](#storeclassesjobqueueworkermd)_

**Parameters:**

| Name            | Type                                                                           |
| --------------- | ------------------------------------------------------------------------------ |
| `sql`           | postgresVendor.Sql‹object›                                                     |
| `nameOrOptions` | string &#124; [JobQueueWorkerOptions](#storeinterfacesjobqueueworkeroptionsmd) |
| `options?`      | [JobQueueWorkerOptions](#storeinterfacesjobqueueworkeroptionsmd)               |

**Returns:** _[JobQueueWorker](#storeclassesjobqueueworkermd)_

#### Methods

##### addJob

▸ **addJob**(`job`: [JobInput](#storeinterfacesjobinputmd)): _Promise‹number›_

Uses this queue name and connection to add a job to the queue. If name is
already set, it will not be overwritten

**Parameters:**

| Name  | Type                                   |
| ----- | -------------------------------------- |
| `job` | [JobInput](#storeinterfacesjobinputmd) |

**Returns:** _Promise‹number›_

---

##### averageTimeToCompletion

▸ **averageTimeToCompletion**(`startDate`: Date, `endDate`: Date):
_Promise‹number›_

Return the average time between scheduled and completed for jobs completed in
the provided time range in milliseconds

**Parameters:**

| Name        | Type |
| ----------- | ---- |
| `startDate` | Date |
| `endDate`   | Date |

**Returns:** _Promise‹number›_

---

##### pendingQueueSize

▸ **pendingQueueSize**(): _Promise‹object | undefined›_

Get the number of jobs that need to run

**Returns:** _Promise‹object | undefined›_

---

##### start

▸ **start**(): _void_

Start the JobQueueWorker

**Returns:** _void_

---

##### stop

▸ **stop**(): _void_

Stop the JobQueueWorker Running jobs will continue to run, but no new jobs are
fetched

**Returns:** _void_

## Interfaces

<a name="storeinterfacesfilecacheoptionsmd"></a>

[@lbu/store - v0.0.45](#storereadmemd) ›
[FileCacheOptions](#storeinterfacesfilecacheoptionsmd)

### Interface: FileCacheOptions

#### Hierarchy

- **FileCacheOptions**

#### Index

##### Properties

- [cacheControlHeader](#optional-cachecontrolheader)
- [inMemoryThreshold](#optional-inmemorythreshold)

#### Properties

##### `Optional` cacheControlHeader

• **cacheControlHeader**? : _string_

Customize default Cache-Control header to give back

---

##### `Optional` inMemoryThreshold

• **inMemoryThreshold**? : _number_

Maximum byte size of a file to be stored in memory

<a name="storeinterfacesfilestorecontextmd"></a>

[@lbu/store - v0.0.45](#storereadmemd) ›
[FileStoreContext](#storeinterfacesfilestorecontextmd)

### Interface: FileStoreContext

#### Hierarchy

- **FileStoreContext**

#### Index

##### Properties

- [bucketName](#bucketname)
- [minio](#minio)
- [sql](#sql)

#### Properties

##### bucketName

• **bucketName**: _string_

---

##### minio

• **minio**: _Client_

---

##### sql

• **sql**: _postgresVendor.Sql‹object›_

<a name="storeinterfacesjobdatamd"></a>

[@lbu/store - v0.0.45](#storereadmemd) › [JobData](#storeinterfacesjobdatamd)

### Interface: JobData

Raw data for a specific job

#### Hierarchy

- **JobData**

#### Index

##### Properties

- [createdAt](#createdat)
- [data](#data)
- [id](#id)
- [name](#name)
- [scheduledAt](#scheduledat)

#### Properties

##### createdAt

• **createdAt**: _Date_

---

##### data

• **data**: _any_

---

##### id

• **id**: _number_

---

##### name

• **name**: _string_

---

##### scheduledAt

• **scheduledAt**: _Date_

<a name="storeinterfacesjobinputmd"></a>

[@lbu/store - v0.0.45](#storereadmemd) › [JobInput](#storeinterfacesjobinputmd)

### Interface: JobInput

Job creation parameters

#### Hierarchy

- **JobInput**

#### Index

##### Properties

- [data](#optional-data)
- [name](#name)
- [priority](#optional-priority)
- [scheduledAt](#optional-scheduledat)

#### Properties

##### `Optional` data

• **data**? : _Record‹string, any›_

Defaults to empty object

---

##### name

• **name**: _string_

---

##### `Optional` priority

• **priority**? : _number_

Defaults to 0

---

##### `Optional` scheduledAt

• **scheduledAt**? : _Date_

Defaults to now

<a name="storeinterfacesjobqueueworkeroptionsmd"></a>

[@lbu/store - v0.0.45](#storereadmemd) ›
[JobQueueWorkerOptions](#storeinterfacesjobqueueworkeroptionsmd)

### Interface: JobQueueWorkerOptions

#### Hierarchy

- **JobQueueWorkerOptions**

#### Index

##### Properties

- [handler](#handler)
- [parallelCount](#optional-parallelcount)
- [pollInterval](#optional-pollinterval)

#### Properties

##### handler

• **handler**: _function_

###### Type declaration:

▸ (`sql`: postgresVendor.Sql‹object›, `data`:
[JobData](#storeinterfacesjobdatamd)): _void | Promise‹void›_

**Parameters:**

| Name   | Type                                 |
| ------ | ------------------------------------ |
| `sql`  | postgresVendor.Sql‹object›           |
| `data` | [JobData](#storeinterfacesjobdatamd) |

---

##### `Optional` parallelCount

• **parallelCount**? : _number_

Set the amount of parallel jobs to process. Defaults to 1. Make sure it is not
higher than the amount of Postgres connections in the pool

---

##### `Optional` pollInterval

• **pollInterval**? : _number_

Determine the poll interval in milliseconds if the queue was empty. Defaults to
1500 ms

<a name="storeinterfacesmigratecontextmd"></a>

[@lbu/store - v0.0.45](#storereadmemd) ›
[MigrateContext](#storeinterfacesmigratecontextmd)

### Interface: MigrateContext

Information used for doing migrations

#### Hierarchy

- **MigrateContext**

#### Index

##### Properties

- [files](#files)
- [namespaces](#namespaces)
- [sql](#sql)
- [storedHashes](#storedhashes)

#### Properties

##### files

• **files**: _[MigrateFile](#storeinterfacesmigratefilemd)[]_

---

##### namespaces

• **namespaces**: _string[]_

---

##### sql

• **sql**: _postgresVendor.Sql‹object›_

---

##### storedHashes

• **storedHashes**: _Record‹string, string›_

<a name="storeinterfacesmigratefilemd"></a>

[@lbu/store - v0.0.45](#storereadmemd) ›
[MigrateFile](#storeinterfacesmigratefilemd)

### Interface: MigrateFile

Internal representation of a migration file

#### Hierarchy

- **MigrateFile**

#### Index

##### Properties

- [fullPath](#fullpath)
- [hash](#hash)
- [isMigrated](#ismigrated)
- [name](#name)
- [namespace](#namespace)
- [number](#number)
- [repeatable](#repeatable)
- [source](#source)

#### Properties

##### fullPath

• **fullPath**: _string_

---

##### hash

• **hash**: _string_

---

##### isMigrated

• **isMigrated**: _boolean_

---

##### name

• **name**: _string_

---

##### namespace

• **namespace**: _string_

---

##### number

• **number**: _number_

---

##### repeatable

• **repeatable**: _boolean_

---

##### source

• **source**: _string_

<a name="storeinterfacessessionstoremd"></a>

[@lbu/store - v0.0.45](#storereadmemd) ›
[SessionStore](#storeinterfacessessionstoremd)

### Interface: SessionStore

Stripped down from @lbu/server SessionStore

#### Hierarchy

- **SessionStore**

#### Index

##### Methods

- [destroy](#destroy)
- [get](#get)
- [kill](#kill)
- [set](#set)

#### Methods

##### destroy

▸ **destroy**(`id`: string): _Promise‹void›_

**Parameters:**

| Name | Type   |
| ---- | ------ |
| `id` | string |

**Returns:** _Promise‹void›_

---

##### get

▸ **get**(`id`: string): _Promise‹object | boolean›_

**Parameters:**

| Name | Type   |
| ---- | ------ |
| `id` | string |

**Returns:** _Promise‹object | boolean›_

---

##### kill

▸ **kill**(): _void_

Stop the background job

**Returns:** _void_

---

##### set

▸ **set**(`id`: string, `session`: object, `age`: number): _Promise‹void›_

**Parameters:**

| Name      | Type   |
| --------- | ------ |
| `id`      | string |
| `session` | object |
| `age`     | number |

**Returns:** _Promise‹void›_

<a name="storeinterfacessessionstoreoptionsmd"></a>

[@lbu/store - v0.0.45](#storereadmemd) ›
[SessionStoreOptions](#storeinterfacessessionstoreoptionsmd)

### Interface: SessionStoreOptions

#### Hierarchy

- **SessionStoreOptions**

#### Index

##### Properties

- [cleanupInterval](#optional-cleanupinterval)
- [disableInterval](#optional-disableinterval)

#### Properties

##### `Optional` cleanupInterval

• **cleanupInterval**? : _number_

Interval at which a background job runs to remove expired sessions Defaults to
45 minutes

---

##### `Optional` disableInterval

• **disableInterval**? : _boolean_

Disable deletion interval completely

<a name="storeinterfacesstorefilestoremd"></a>

[@lbu/store - v0.0.45](#storereadmemd) ›
[StoreFileStore](#storeinterfacesstorefilestoremd)

### Interface: StoreFileStore

#### Hierarchy

- **StoreFileStore**

#### Index

##### Properties

- [bucketName](#bucketname)
- [contentLength](#contentlength)
- [contentType](#contenttype)
- [createdAt](#createdat)
- [filename](#filename)
- [id](#id)
- [updatedAt](#updatedat)

#### Properties

##### bucketName

• **bucketName**: _string_

---

##### contentLength

• **contentLength**: _number_

---

##### contentType

• **contentType**: _string_

---

##### createdAt

• **createdAt**: _Date_

---

##### filename

• **filename**: _string_

---

##### id

• **id**: _string_

---

##### updatedAt

• **updatedAt**: _Date_
