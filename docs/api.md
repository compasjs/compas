<a name="readmemd"></a>

# API

Per module documentation, generated from the Typescript declaration files.

# Cli

<a name="clireadmemd"></a>

[@lbu/cli - v0.0.34](#clireadmemd)

## @lbu/cli - v0.0.34

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

[@lbu/cli - v0.0.34](#clireadmemd) ›
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

[@lbu/cli - v0.0.34](#clireadmemd) ›
[ScriptCollection](#cliinterfacesscriptcollectionmd)

### Interface: ScriptCollection

#### Hierarchy

- **ScriptCollection**

#### Indexable

- \[ **k**: _string_\]: [CollectedScript](#cliinterfacescollectedscriptmd)

# Code Gen

<a name="code-genreadmemd"></a>

[@lbu/code-gen - v0.0.34](#code-genreadmemd)

## @lbu/code-gen - v0.0.34

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
- [TypePlugin](#code-geninterfacestypepluginmd)

#### Variables

- [generatorTemplates](#const-generatortemplates)
- [generators](#const-generators)

#### Functions

- [isNamedTypeBuilderLike](#isnamedtypebuilderlike)
- [loadFromOpenAPISpec](#loadfromopenapispec)
- [loadFromRemote](#loadfromremote)

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

[@lbu/code-gen - v0.0.34](#code-genreadmemd) ›
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
- [disable](#disable)
- [docs](#docs)
- [mock](#mock)
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

- **disabled**(): _object_

  - **mock**: _false_

  - **validator**: _false_

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

##### disable

▸ **disable**(`values`: Partial‹typeof disabled›): _this_

_Inherited from
[TypeBuilder](#code-genclassestypebuildermd).[disable](#disable)_

Disable specific generators for this type. Not all generators support this
feature

**Parameters:**

| Name     | Type                     |
| -------- | ------------------------ |
| `values` | Partial‹typeof disabled› |

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

##### mock

▸ **mock**(`mockFn`: string): _this_

_Inherited from [TypeBuilder](#code-genclassestypebuildermd).[mock](#mock)_

Raw mock string used with the 'mock' plugin. Use '\_mocker' or '\_\_' to access
the Chance instance

**Parameters:**

| Name     | Type   |
| -------- | ------ |
| `mockFn` | string |

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

▸ **values**(...`items`: [TypeBuilder](#code-genclassestypebuildermd)[]): _this_

**Parameters:**

| Name       | Type                                           |
| ---------- | ---------------------------------------------- |
| `...items` | [TypeBuilder](#code-genclassestypebuildermd)[] |

**Returns:** _this_

---

##### `Static` getBaseData

▸ **getBaseData**(): _typeof baseData_

_Inherited from
[TypeBuilder](#code-genclassestypebuildermd).[getBaseData](#static-getbasedata)_

**Returns:** _typeof baseData_

<a name="code-genclassesanytypemd"></a>

[@lbu/code-gen - v0.0.34](#code-genreadmemd) ›
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
- [disable](#disable)
- [docs](#docs)
- [instanceOf](#instanceof)
- [mock](#mock)
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

- **disabled**(): _object_

  - **mock**: _false_

  - **validator**: _false_

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

##### disable

▸ **disable**(`values`: Partial‹typeof disabled›): _this_

_Inherited from
[TypeBuilder](#code-genclassestypebuildermd).[disable](#disable)_

Disable specific generators for this type. Not all generators support this
feature

**Parameters:**

| Name     | Type                     |
| -------- | ------------------------ |
| `values` | Partial‹typeof disabled› |

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

##### mock

▸ **mock**(`mockFn`: string): _this_

_Inherited from [TypeBuilder](#code-genclassestypebuildermd).[mock](#mock)_

Raw mock string used with the 'mock' plugin. Use '\_mocker' or '\_\_' to access
the Chance instance

**Parameters:**

| Name     | Type   |
| -------- | ------ |
| `mockFn` | string |

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

[@lbu/code-gen - v0.0.34](#code-genreadmemd) › [App](#code-genclassesappmd)

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

[@lbu/code-gen - v0.0.34](#code-genreadmemd) ›
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
- [disable](#disable)
- [docs](#docs)
- [max](#max)
- [min](#min)
- [mock](#mock)
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

- **disabled**(): _object_

  - **mock**: _false_

  - **validator**: _false_

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

##### disable

▸ **disable**(`values`: Partial‹typeof disabled›): _this_

_Inherited from
[TypeBuilder](#code-genclassestypebuildermd).[disable](#disable)_

Disable specific generators for this type. Not all generators support this
feature

**Parameters:**

| Name     | Type                     |
| -------- | ------------------------ |
| `values` | Partial‹typeof disabled› |

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

##### mock

▸ **mock**(`mockFn`: string): _this_

_Inherited from [TypeBuilder](#code-genclassestypebuildermd).[mock](#mock)_

Raw mock string used with the 'mock' plugin. Use '\_mocker' or '\_\_' to access
the Chance instance

**Parameters:**

| Name     | Type   |
| -------- | ------ |
| `mockFn` | string |

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

▸ **values**(`value`: [TypeBuilder](#code-genclassestypebuildermd)): _this_

**Parameters:**

| Name    | Type                                         |
| ------- | -------------------------------------------- |
| `value` | [TypeBuilder](#code-genclassestypebuildermd) |

**Returns:** _this_

---

##### `Static` getBaseData

▸ **getBaseData**(): _typeof baseData_

_Inherited from
[TypeBuilder](#code-genclassestypebuildermd).[getBaseData](#static-getbasedata)_

**Returns:** _typeof baseData_

<a name="code-genclassesbooleantypemd"></a>

[@lbu/code-gen - v0.0.34](#code-genreadmemd) ›
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
- [disable](#disable)
- [docs](#docs)
- [mock](#mock)
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

- **disabled**(): _object_

  - **mock**: _false_

  - **validator**: _false_

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

##### disable

▸ **disable**(`values`: Partial‹typeof disabled›): _this_

_Inherited from
[TypeBuilder](#code-genclassestypebuildermd).[disable](#disable)_

Disable specific generators for this type. Not all generators support this
feature

**Parameters:**

| Name     | Type                     |
| -------- | ------------------------ |
| `values` | Partial‹typeof disabled› |

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

##### mock

▸ **mock**(`mockFn`: string): _this_

_Inherited from [TypeBuilder](#code-genclassestypebuildermd).[mock](#mock)_

Raw mock string used with the 'mock' plugin. Use '\_mocker' or '\_\_' to access
the Chance instance

**Parameters:**

| Name     | Type   |
| -------- | ------ |
| `mockFn` | string |

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

[@lbu/code-gen - v0.0.34](#code-genreadmemd) ›
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
- [disable](#disable)
- [docs](#docs)
- [mock](#mock)
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

- **disabled**(): _object_

  - **mock**: _false_

  - **validator**: _false_

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

##### disable

▸ **disable**(`values`: Partial‹typeof disabled›): _this_

_Inherited from
[TypeBuilder](#code-genclassestypebuildermd).[disable](#disable)_

Disable specific generators for this type. Not all generators support this
feature

**Parameters:**

| Name     | Type                     |
| -------- | ------------------------ |
| `values` | Partial‹typeof disabled› |

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

##### mock

▸ **mock**(`mockFn`: string): _this_

_Inherited from [TypeBuilder](#code-genclassestypebuildermd).[mock](#mock)_

Raw mock string used with the 'mock' plugin. Use '\_mocker' or '\_\_' to access
the Chance instance

**Parameters:**

| Name     | Type   |
| -------- | ------ |
| `mockFn` | string |

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

[@lbu/code-gen - v0.0.34](#code-genreadmemd) ›
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
- [disable](#disable)
- [docs](#docs)
- [keys](#keys)
- [mock](#mock)
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

- **disabled**(): _object_

  - **mock**: _false_

  - **validator**: _false_

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

##### disable

▸ **disable**(`values`: Partial‹typeof disabled›): _this_

_Inherited from
[TypeBuilder](#code-genclassestypebuildermd).[disable](#disable)_

Disable specific generators for this type. Not all generators support this
feature

**Parameters:**

| Name     | Type                     |
| -------- | ------------------------ |
| `values` | Partial‹typeof disabled› |

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

▸ **keys**(`key`: [TypeBuilder](#code-genclassestypebuildermd)): _this_

**Parameters:**

| Name  | Type                                         |
| ----- | -------------------------------------------- |
| `key` | [TypeBuilder](#code-genclassestypebuildermd) |

**Returns:** _this_

---

##### mock

▸ **mock**(`mockFn`: string): _this_

_Inherited from [TypeBuilder](#code-genclassestypebuildermd).[mock](#mock)_

Raw mock string used with the 'mock' plugin. Use '\_mocker' or '\_\_' to access
the Chance instance

**Parameters:**

| Name     | Type   |
| -------- | ------ |
| `mockFn` | string |

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

▸ **values**(`value`: [TypeBuilder](#code-genclassestypebuildermd)): _this_

**Parameters:**

| Name    | Type                                         |
| ------- | -------------------------------------------- |
| `value` | [TypeBuilder](#code-genclassestypebuildermd) |

**Returns:** _this_

---

##### `Static` getBaseData

▸ **getBaseData**(): _typeof baseData_

_Inherited from
[TypeBuilder](#code-genclassestypebuildermd).[getBaseData](#static-getbasedata)_

**Returns:** _typeof baseData_

<a name="code-genclassesnumbertypemd"></a>

[@lbu/code-gen - v0.0.34](#code-genreadmemd) ›
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
- [disable](#disable)
- [docs](#docs)
- [integer](#integer)
- [max](#max)
- [min](#min)
- [mock](#mock)
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

- **disabled**(): _object_

  - **mock**: _false_

  - **validator**: _false_

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

##### disable

▸ **disable**(`values`: Partial‹typeof disabled›): _this_

_Inherited from
[TypeBuilder](#code-genclassestypebuildermd).[disable](#disable)_

Disable specific generators for this type. Not all generators support this
feature

**Parameters:**

| Name     | Type                     |
| -------- | ------------------------ |
| `values` | Partial‹typeof disabled› |

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

##### mock

▸ **mock**(`mockFn`: string): _this_

_Inherited from [TypeBuilder](#code-genclassestypebuildermd).[mock](#mock)_

Raw mock string used with the 'mock' plugin. Use '\_mocker' or '\_\_' to access
the Chance instance

**Parameters:**

| Name     | Type   |
| -------- | ------ |
| `mockFn` | string |

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

[@lbu/code-gen - v0.0.34](#code-genreadmemd) ›
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
- [disable](#disable)
- [docs](#docs)
- [enableQueries](#enablequeries)
- [keys](#keys)
- [mock](#mock)
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

- **disabled**(): _object_

  - **mock**: _false_

  - **validator**: _false_

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

##### disable

▸ **disable**(`values`: Partial‹typeof disabled›): _this_

_Inherited from
[TypeBuilder](#code-genclassestypebuildermd).[disable](#disable)_

Disable specific generators for this type. Not all generators support this
feature

**Parameters:**

| Name     | Type                     |
| -------- | ------------------------ |
| `values` | Partial‹typeof disabled› |

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

▸ **enableQueries**(`options`: object): _this_

Generate sql queries for this object Posibbly adding createdAt and updatedAt
fields. When withHistory is true, it automatically enables withDates. Added by
the 'sql' plugin

**Parameters:**

▪ **options**: _object_

| Name           | Type    |
| -------------- | ------- |
| `withDates?`   | boolean |
| `withHistory?` | boolean |

**Returns:** _this_

---

##### keys

▸ **keys**(`obj`: Record‹string, [TypeBuilder](#code-genclassestypebuildermd)›):
_this_

**Parameters:**

| Name  | Type                                                         |
| ----- | ------------------------------------------------------------ |
| `obj` | Record‹string, [TypeBuilder](#code-genclassestypebuildermd)› |

**Returns:** _this_

---

##### mock

▸ **mock**(`mockFn`: string): _this_

_Inherited from [TypeBuilder](#code-genclassestypebuildermd).[mock](#mock)_

Raw mock string used with the 'mock' plugin. Use '\_mocker' or '\_\_' to access
the Chance instance

**Parameters:**

| Name     | Type   |
| -------- | ------ |
| `mockFn` | string |

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

[@lbu/code-gen - v0.0.34](#code-genreadmemd) ›
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
- [disable](#disable)
- [docs](#docs)
- [field](#field)
- [mock](#mock)
- [optional](#optional)
- [primary](#primary)
- [searchable](#searchable)
- [set](#set)
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

- **disabled**(): _object_

  - **mock**: _false_

  - **validator**: _false_

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

##### disable

▸ **disable**(`values`: Partial‹typeof disabled›): _this_

_Inherited from
[TypeBuilder](#code-genclassestypebuildermd).[disable](#disable)_

Disable specific generators for this type. Not all generators support this
feature

**Parameters:**

| Name     | Type                     |
| -------- | ------------------------ |
| `values` | Partial‹typeof disabled› |

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

##### field

▸ **field**(`referencing`: string, `replacement?`: string): _this_

**Parameters:**

| Name           | Type   |
| -------------- | ------ |
| `referencing`  | string |
| `replacement?` | string |

**Returns:** _this_

---

##### mock

▸ **mock**(`mockFn`: string): _this_

_Inherited from [TypeBuilder](#code-genclassestypebuildermd).[mock](#mock)_

Raw mock string used with the 'mock' plugin. Use '\_mocker' or '\_\_' to access
the Chance instance

**Parameters:**

| Name     | Type   |
| -------- | ------ |
| `mockFn` | string |

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

##### set

▸ **set**(`group`: string, `name`: string): _this_

**Parameters:**

| Name    | Type   |
| ------- | ------ |
| `group` | string |
| `name`  | string |

**Returns:** _this_

---

##### `Static` getBaseData

▸ **getBaseData**(): _typeof baseData_

_Inherited from
[TypeBuilder](#code-genclassestypebuildermd).[getBaseData](#static-getbasedata)_

**Returns:** _typeof baseData_

<a name="code-genclassesroutebuildermd"></a>

[@lbu/code-gen - v0.0.34](#code-genreadmemd) ›
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
- [disable](#disable)
- [docs](#docs)
- [mock](#mock)
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

- **disabled**(): _object_

  - **mock**: _false_

  - **validator**: _false_

- **docString**: _string_

- **group**? : _string_

- **isOptional**: _boolean_

- **name**? : _string_

- **type**? : _string_

#### Methods

##### body

▸ **body**(`builder`: [TypeBuilder](#code-genclassestypebuildermd)): _this_

Type of accepted body parameters

**Parameters:**

| Name      | Type                                         |
| --------- | -------------------------------------------- |
| `builder` | [TypeBuilder](#code-genclassestypebuildermd) |

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

##### disable

▸ **disable**(`values`: Partial‹typeof disabled›): _this_

_Inherited from
[TypeBuilder](#code-genclassestypebuildermd).[disable](#disable)_

Disable specific generators for this type. Not all generators support this
feature

**Parameters:**

| Name     | Type                     |
| -------- | ------------------------ |
| `values` | Partial‹typeof disabled› |

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

##### mock

▸ **mock**(`mockFn`: string): _this_

_Inherited from [TypeBuilder](#code-genclassestypebuildermd).[mock](#mock)_

Raw mock string used with the 'mock' plugin. Use '\_mocker' or '\_\_' to access
the Chance instance

**Parameters:**

| Name     | Type   |
| -------- | ------ |
| `mockFn` | string |

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

▸ **params**(`builder`: [TypeBuilder](#code-genclassestypebuildermd)): _this_

Type of accepted path parameters

**Parameters:**

| Name      | Type                                         |
| --------- | -------------------------------------------- |
| `builder` | [TypeBuilder](#code-genclassestypebuildermd) |

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

▸ **query**(`builder`: [TypeBuilder](#code-genclassestypebuildermd)): _this_

Type of accepted query parameters

**Parameters:**

| Name      | Type                                         |
| --------- | -------------------------------------------- |
| `builder` | [TypeBuilder](#code-genclassestypebuildermd) |

**Returns:** _this_

---

##### response

▸ **response**(`builder`: [TypeBuilder](#code-genclassestypebuildermd)): _this_

Route response type

**Parameters:**

| Name      | Type                                         |
| --------- | -------------------------------------------- |
| `builder` | [TypeBuilder](#code-genclassestypebuildermd) |

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

[@lbu/code-gen - v0.0.34](#code-genreadmemd) ›
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

[@lbu/code-gen - v0.0.34](#code-genreadmemd) ›
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
- [disable](#disable)
- [docs](#docs)
- [lowerCase](#lowercase)
- [max](#max)
- [min](#min)
- [mock](#mock)
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

- **disabled**(): _object_

  - **mock**: _false_

  - **validator**: _false_

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

##### disable

▸ **disable**(`values`: Partial‹typeof disabled›): _this_

_Inherited from
[TypeBuilder](#code-genclassestypebuildermd).[disable](#disable)_

Disable specific generators for this type. Not all generators support this
feature

**Parameters:**

| Name     | Type                     |
| -------- | ------------------------ |
| `values` | Partial‹typeof disabled› |

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

##### mock

▸ **mock**(`mockFn`: string): _this_

_Inherited from [TypeBuilder](#code-genclassestypebuildermd).[mock](#mock)_

Raw mock string used with the 'mock' plugin. Use '\_mocker' or '\_\_' to access
the Chance instance

**Parameters:**

| Name     | Type   |
| -------- | ------ |
| `mockFn` | string |

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

[@lbu/code-gen - v0.0.34](#code-genreadmemd) ›
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
- [disable](#disable)
- [docs](#docs)
- [mock](#mock)
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

- **disabled**(): _object_

  - **mock**: _false_

  - **validator**: _false_

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

##### disable

▸ **disable**(`values`: Partial‹typeof disabled›): _this_

Disable specific generators for this type. Not all generators support this
feature

**Parameters:**

| Name     | Type                     |
| -------- | ------------------------ |
| `values` | Partial‹typeof disabled› |

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

##### mock

▸ **mock**(`mockFn`: string): _this_

Raw mock string used with the 'mock' plugin. Use '\_mocker' or '\_\_' to access
the Chance instance

**Parameters:**

| Name     | Type   |
| -------- | ------ |
| `mockFn` | string |

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

[@lbu/code-gen - v0.0.34](#code-genreadmemd) ›
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

▸ **anyOf**(`name?`: string | [TypeBuilder](#code-genclassestypebuildermd)[],
...`values`: [TypeBuilder](#code-genclassestypebuildermd)[]):
_[AnyOfType](#code-genclassesanyoftypemd)_

**Parameters:**

| Name        | Type                                                         |
| ----------- | ------------------------------------------------------------ |
| `name?`     | string &#124; [TypeBuilder](#code-genclassestypebuildermd)[] |
| `...values` | [TypeBuilder](#code-genclassestypebuildermd)[]               |

**Returns:** _[AnyOfType](#code-genclassesanyoftypemd)_

---

##### array

▸ **array**(`name?`: string | [TypeBuilder](#code-genclassestypebuildermd),
`value?`: [TypeBuilder](#code-genclassestypebuildermd)):
_[ArrayType](#code-genclassesarraytypemd)_

**Parameters:**

| Name     | Type                                                       |
| -------- | ---------------------------------------------------------- |
| `name?`  | string &#124; [TypeBuilder](#code-genclassestypebuildermd) |
| `value?` | [TypeBuilder](#code-genclassestypebuildermd)               |

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

▸ **object**(`name?`: string | Record‹string,
[TypeBuilder](#code-genclassestypebuildermd)›, `obj?`: Record‹string,
[TypeBuilder](#code-genclassestypebuildermd)›):
_[ObjectType](#code-genclassesobjecttypemd)_

**Parameters:**

| Name    | Type                                                                       |
| ------- | -------------------------------------------------------------------------- |
| `name?` | string &#124; Record‹string, [TypeBuilder](#code-genclassestypebuildermd)› |
| `obj?`  | Record‹string, [TypeBuilder](#code-genclassestypebuildermd)›               |

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

[@lbu/code-gen - v0.0.34](#code-genreadmemd) ›
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
- [disable](#disable)
- [docs](#docs)
- [mock](#mock)
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

- **disabled**(): _object_

  - **mock**: _false_

  - **validator**: _false_

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

##### disable

▸ **disable**(`values`: Partial‹typeof disabled›): _this_

_Inherited from
[TypeBuilder](#code-genclassestypebuildermd).[disable](#disable)_

Disable specific generators for this type. Not all generators support this
feature

**Parameters:**

| Name     | Type                     |
| -------- | ------------------------ |
| `values` | Partial‹typeof disabled› |

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

##### mock

▸ **mock**(`mockFn`: string): _this_

_Inherited from [TypeBuilder](#code-genclassestypebuildermd).[mock](#mock)_

Raw mock string used with the 'mock' plugin. Use '\_mocker' or '\_\_' to access
the Chance instance

**Parameters:**

| Name     | Type   |
| -------- | ------ |
| `mockFn` | string |

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

[@lbu/code-gen - v0.0.34](#code-genreadmemd) ›
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

[@lbu/code-gen - v0.0.34](#code-genreadmemd) ›
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

[@lbu/code-gen - v0.0.34](#code-genreadmemd) ›
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

[@lbu/code-gen - v0.0.34](#code-genreadmemd) ›
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

<a name="code-geninterfacestypepluginmd"></a>

[@lbu/code-gen - v0.0.34](#code-genreadmemd) ›
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
- [mock](#optional-mock)
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

##### `Optional` mock

• **mock**? : _function_

Return the template that should be used to mock this type

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

[@lbu/insight - v0.0.34](#insightreadmemd)

## @lbu/insight - v0.0.34

### Index

#### Interfaces

- [LogParserContext](#insightinterfaceslogparsercontextmd)
- [Logger](#insightinterfacesloggermd)
- [LoggerContext](#insightinterfacesloggercontextmd)
- [LoggerOptions](#insightinterfacesloggeroptionsmd)

#### Variables

- [log](#const-log)

#### Functions

- [bindLoggerContext](#bindloggercontext)
- [bytesToHumanReadable](#bytestohumanreadable)
- [executeLogParser](#executelogparser)
- [newLogParserContext](#newlogparsercontext)
- [newLogger](#newlogger)
- [printProcessMemoryUsage](#printprocessmemoryusage)

### Variables

#### `Const` log

• **log**: _[Logger](#insightinterfacesloggermd)_

Standard log instance. Comes with a depth of 4, prevents printing deeply nested
objects

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

#### executeLogParser

▸ **executeLogParser**(`lpc`:
[LogParserContext](#insightinterfaceslogparsercontextmd)): _ReadableStream_

Run the parser, splits the in stream onn lines and call either the jsonProcessor
or textProcessor with the value. The original value is written to the returned
stream

**Parameters:**

| Name  | Type                                                     |
| ----- | -------------------------------------------------------- |
| `lpc` | [LogParserContext](#insightinterfaceslogparsercontextmd) |

**Returns:** _ReadableStream_

---

#### newLogParserContext

▸ **newLogParserContext**(`stream`: ReadableStream):
_[LogParserContext](#insightinterfaceslogparsercontextmd)_

Create a new parser context

**Parameters:**

| Name     | Type           |
| -------- | -------------- |
| `stream` | ReadableStream |

**Returns:** _[LogParserContext](#insightinterfaceslogparsercontextmd)_

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

[@lbu/insight - v0.0.34](#insightreadmemd) ›
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

[@lbu/insight - v0.0.34](#insightreadmemd) ›
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

[@lbu/insight - v0.0.34](#insightreadmemd) ›
[LoggerOptions](#insightinterfacesloggeroptionsmd)

### Interface: LoggerOptions ‹**T**›

#### Type parameters

▪ **T**: _[LoggerContext](#insightinterfacesloggercontextmd)_

#### Hierarchy

- **LoggerOptions**

#### Index

##### Properties

- [ctx](#optional-ctx)
- [depth](#optional-depth)
- [pretty](#optional-pretty)
- [stream](#optional-stream)

#### Properties

##### `Optional` ctx

• **ctx**? : _T_

Context that should be logged in all log lines. e.g a common request id.

---

##### `Optional` depth

• **depth**? : _number_

Max-depth printed

---

##### `Optional` pretty

• **pretty**? : _boolean_

Use the pretty formatter instead of the NDJSON formatter

---

##### `Optional` stream

• **stream**? : _WritableStream_

The stream to write the logs to

<a name="insightinterfaceslogparsercontextmd"></a>

[@lbu/insight - v0.0.34](#insightreadmemd) ›
[LogParserContext](#insightinterfaceslogparsercontextmd)

### Interface: LogParserContext

The LogParserContext enables you too analyze logs produced by this Logger

#### Hierarchy

- **LogParserContext**

#### Index

##### Properties

- [jsonProcessor](#optional-jsonprocessor)
- [stream](#stream)
- [textProcessor](#optional-textprocessor)

#### Properties

##### `Optional` jsonProcessor

• **jsonProcessor**? : _function_

###### Type declaration:

▸ (`data`: object): _void_

**Parameters:**

| Name   | Type   |
| ------ | ------ |
| `data` | object |

---

##### stream

• **stream**: _ReadableStream_

---

##### `Optional` textProcessor

• **textProcessor**? : _function_

###### Type declaration:

▸ (`data`: string): _void_

**Parameters:**

| Name   | Type   |
| ------ | ------ |
| `data` | string |

# Server

<a name="serverreadmemd"></a>

[@lbu/server - v0.0.34](#serverreadmemd)

## @lbu/server - v0.0.34

### Index

#### Classes

- [Application](#serverclassesapplicationmd)

#### Interfaces

- [AppErrorHandler](#serverinterfacesapperrorhandlermd)
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
- [isServerLog](#isserverlog)
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

▸ **createBodyParsers**(`options?`: IKoaBodyOptions): _object_

Creates a body parser and a body parser with multipart enabled Note that
koa-body parses url-encoded, form data, json and text by default

**Parameters:**

| Name       | Type            |
| ---------- | --------------- |
| `options?` | IKoaBodyOptions |

**Returns:** _object_

- **bodyParser**: _[Middleware](#middleware)_

- **multipartBodyParsers**: _[Middleware](#middleware)_

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

#### isServerLog

▸ **isServerLog**(`value`: Record‹string, unknown›): _boolean_

Given a logged object, check if it is a request log

**Parameters:**

| Name    | Type                    |
| ------- | ----------------------- |
| `value` | Record‹string, unknown› |

**Returns:** _boolean_

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

[@lbu/server - v0.0.34](#serverreadmemd) ›
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

[@lbu/server - v0.0.34](#serverreadmemd) ›
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

<a name="serverinterfacescorsoptionsmd"></a>

[@lbu/server - v0.0.34](#serverreadmemd) ›
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
- [returnNext](#optional-returnnext)

#### Properties

##### `Optional` allowHeaders

• **allowHeaders**? : _string[]_

`Access-Control-Allow-Headers`

---

##### `Optional` allowMethods

• **allowMethods**? : _string[]_

`Access-Control-Allow-Methods`, default is ['GET', 'PUT', 'POST', 'PATCH',
'DELETE', 'HEAD', 'OPTIONS']

---

##### `Optional` credentials

• **credentials**? : _boolean_

`Access-Control-Allow-Credentials`

---

##### `Optional` exposeHeaders

• **exposeHeaders**? : _string[]_

`Access-Control-Expose-Headers`

---

##### `Optional` maxAge

• **maxAge**? : _string | number_

`Access-Control-Max-Age` in seconds

---

##### `Optional` origin

• **origin**? : _string | function_

`Access-Control-Allow-Origin`, default is request Origin header

---

##### `Optional` returnNext

• **returnNext**? : _boolean_

By default, and if false, won't call next, but just returns undefined

<a name="serverinterfacescustomerrorhandlermd"></a>

[@lbu/server - v0.0.34](#serverreadmemd) ›
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

[@lbu/server - v0.0.34](#serverreadmemd) ›
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

[@lbu/server - v0.0.34](#serverreadmemd) ›
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

[@lbu/server - v0.0.34](#serverreadmemd) ›
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

[@lbu/stdlib - v0.0.34](#stdlibreadmemd)

## @lbu/stdlib - v0.0.34

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

### Functions

#### camelToSnakeCase

▸ **camelToSnakeCase**(`input`: string): _string_

Convert a camelCase string to a snake_case string

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

**Parameters:**

| Name    | Type   |
| ------- | ------ |
| `data?` | object |

**Returns:** _any_

## Classes

<a name="stdlibclassesapperrormd"></a>

[@lbu/stdlib - v0.0.34](#stdlibreadmemd) › [AppError](#stdlibclassesapperrormd)

### Class: AppError ‹**T**›

AppErrors represent errors, that should immediately stop the request and return
a status and other meta data directly

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

[@lbu/stdlib - v0.0.34](#stdlibreadmemd) ›
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

[@lbu/stdlib - v0.0.34](#stdlibreadmemd) ›
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

[@lbu/stdlib - v0.0.34](#stdlibreadmemd) ›
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

[@lbu/stdlib - v0.0.34](#stdlibreadmemd) ›
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
