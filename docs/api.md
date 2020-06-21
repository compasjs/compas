<a name="readmemd"></a>

# API

Per module documentation, generated from the Typescript declaration files.

# Cli


<a name="clireadmemd"></a>

[@lbu/cli - v0.0.29](#clireadmemd)

## @lbu/cli - v0.0.29

### Index

#### Interfaces

* [CollectedScript](#cliinterfacescollectedscriptmd)
* [ScriptCollection](#cliinterfacesscriptcollectionmd)

#### Functions

* [collectScripts](#collectscripts)

### Functions

####  collectScripts

▸ **collectScripts**(): *[ScriptCollection](#cliinterfacesscriptcollectionmd)*

Return collection of available named scripts
- type user: User defined scripts from process.cwd/scripts/*.js
- type package: User defined scripts in package.json. These override 'user' scripts

**Returns:** *[ScriptCollection](#cliinterfacesscriptcollectionmd)*

## Interfaces


<a name="cliinterfacescollectedscriptmd"></a>

[@lbu/cli - v0.0.29](#clireadmemd) › [CollectedScript](#cliinterfacescollectedscriptmd)

### Interface: CollectedScript

Represents either a file in the `scripts` directory or a script from the package.json
Depending on the type contains either script or path

#### Hierarchy

* **CollectedScript**

#### Index

##### Properties

* [name](#name)
* [path](#optional-path)
* [script](#optional-script)
* [type](#type)

#### Properties

#####  name

• **name**: *string*

___

##### `Optional` path

• **path**? : *string*

___

##### `Optional` script

• **script**? : *string*

___

#####  type

• **type**: *"user" | "package"*


<a name="cliinterfacesscriptcollectionmd"></a>

[@lbu/cli - v0.0.29](#clireadmemd) › [ScriptCollection](#cliinterfacesscriptcollectionmd)

### Interface: ScriptCollection

#### Hierarchy

* **ScriptCollection**

#### Indexable

* \[ **k**: *string*\]: [CollectedScript](#cliinterfacescollectedscriptmd)

# Code Gen


<a name="code-genreadmemd"></a>

[@lbu/code-gen - v0.0.29](#code-genreadmemd)

## @lbu/code-gen - v0.0.29

### Index

#### Classes

* [AnyOfType](#code-genclassesanyoftypemd)
* [AnyType](#code-genclassesanytypemd)
* [App](#code-genclassesappmd)
* [ArrayType](#code-genclassesarraytypemd)
* [BooleanType](#code-genclassesbooleantypemd)
* [DateType](#code-genclassesdatetypemd)
* [GenericType](#code-genclassesgenerictypemd)
* [NumberType](#code-genclassesnumbertypemd)
* [ObjectType](#code-genclassesobjecttypemd)
* [ReferenceType](#code-genclassesreferencetypemd)
* [RouteBuilder](#code-genclassesroutebuildermd)
* [RouteCreator](#code-genclassesroutecreatormd)
* [StringType](#code-genclassesstringtypemd)
* [TypeBuilder](#code-genclassestypebuildermd)
* [TypeCreator](#code-genclassestypecreatormd)
* [UuidType](#code-genclassesuuidtypemd)

#### Interfaces

* [AppOpts](#code-geninterfacesappoptsmd)
* [GenerateOpts](#code-geninterfacesgenerateoptsmd)
* [GeneratedFile](#code-geninterfacesgeneratedfilemd)
* [GeneratorPlugin](#code-geninterfacesgeneratorpluginmd)
* [TypePlugin](#code-geninterfacestypepluginmd)

#### Variables

* [generatorTemplates](#const-generatortemplates)
* [generators](#const-generators)

#### Functions

* [isNamedTypeBuilderLike](#isnamedtypebuilderlike)
* [loadFromOpenAPISpec](#loadfromopenapispec)
* [loadFromRemote](#loadfromremote)

### Variables

#### `Const` generatorTemplates

• **generatorTemplates**: *TemplateContext*

Shared templateContext for all generators

___

#### `Const` generators

• **generators**: *Map‹string, [GeneratorPlugin](#code-geninterfacesgeneratorpluginmd)›*

Generator registry, with all core provided generators already added

### Functions

####  isNamedTypeBuilderLike

▸ **isNamedTypeBuilderLike**(`value`: any): *boolean*

Check if value may be output object from a TypeBuilder

**Parameters:**

Name | Type |
------ | ------ |
`value` | any |

**Returns:** *boolean*

___

####  loadFromOpenAPISpec

▸ **loadFromOpenAPISpec**(`defaultGroup`: string, `data`: any): *any*

Try to convert a OpenAPI spec object to LBU structure

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`defaultGroup` | string | Default to group to use for non tagged items in the spec |
`data` | any | Raw OpenAPI 3 json object  |

**Returns:** *any*

___

####  loadFromRemote

▸ **loadFromRemote**(`axios`: AxiosInstance, `baseUrl`: string): *any*

Load a LBU structure from an LBU enabled API

**Parameters:**

Name | Type |
------ | ------ |
`axios` | AxiosInstance |
`baseUrl` | string |

**Returns:** *any*

## Classes


<a name="code-genclassesanyoftypemd"></a>

[@lbu/code-gen - v0.0.29](#code-genreadmemd) › [AnyOfType](#code-genclassesanyoftypemd)

### Class: AnyOfType

#### Hierarchy

* [TypeBuilder](#code-genclassestypebuildermd)

  ↳ **AnyOfType**

#### Index

##### Constructors

* [constructor](#constructor)

##### Properties

* [data](#data)
* [baseData](#static-basedata)

##### Methods

* [build](#build)
* [default](#default)
* [docs](#docs)
* [mock](#mock)
* [optional](#optional)
* [primary](#primary)
* [searchable](#searchable)
* [values](#values)
* [getBaseData](#static-getbasedata)

#### Constructors

#####  constructor

\+ **new AnyOfType**(`type`: string, `group?`: string, `name?`: string): *[AnyOfType](#code-genclassesanyoftypemd)*

*Inherited from [TypeBuilder](#code-genclassestypebuildermd).[constructor](#constructor)*

Create a new TypeBuilder for the provided group

**Parameters:**

Name | Type |
------ | ------ |
`type` | string |
`group?` | string |
`name?` | string |

**Returns:** *[AnyOfType](#code-genclassesanyoftypemd)*

#### Properties

#####  data

• **data**: *typeof baseData*

*Inherited from [TypeBuilder](#code-genclassestypebuildermd).[data](#data)*

___

##### `Static` baseData

▪ **baseData**: *object*

*Inherited from [TypeBuilder](#code-genclassestypebuildermd).[baseData](#static-basedata)*

###### Type declaration:

* **defaultValue**? : *string*

* **docString**: *string*

* **group**? : *string*

* **isOptional**: *boolean*

* **name**? : *string*

* **type**? : *string*

#### Methods

#####  build

▸ **build**(): *Record‹string, any›*

*Inherited from [TypeBuilder](#code-genclassestypebuildermd).[build](#build)*

Returns a shallow copy of the data object

**Returns:** *Record‹string, any›*

___

#####  default

▸ **default**(`rawString?`: string): *this*

*Inherited from [TypeBuilder](#code-genclassestypebuildermd).[default](#default)*

Set a raw default value, also makes the type optional
Can be reverted by calling this function with undefined or null

**Parameters:**

Name | Type |
------ | ------ |
`rawString?` | string |

**Returns:** *this*

___

#####  docs

▸ **docs**(`docValue`: string): *this*

*Inherited from [TypeBuilder](#code-genclassestypebuildermd).[docs](#docs)*

Add a doc comment, some generators / types may support rendering this

**Parameters:**

Name | Type |
------ | ------ |
`docValue` | string |

**Returns:** *this*

___

#####  mock

▸ **mock**(`mockFn`: string): *this*

*Inherited from [TypeBuilder](#code-genclassestypebuildermd).[mock](#mock)*

Raw mock string used with the 'mock' plugin.
Use '_mocker' or '__' to access the Chance instance

**Parameters:**

Name | Type |
------ | ------ |
`mockFn` | string |

**Returns:** *this*

___

#####  optional

▸ **optional**(): *this*

*Inherited from [TypeBuilder](#code-genclassestypebuildermd).[optional](#optional)*

Value can be undefined

**Returns:** *this*

___

#####  primary

▸ **primary**(): *this*

*Inherited from [TypeBuilder](#code-genclassestypebuildermd).[primary](#primary)*

Set this field as primary for the 'sql' plugin

**Returns:** *this*

___

#####  searchable

▸ **searchable**(): *this*

*Inherited from [TypeBuilder](#code-genclassestypebuildermd).[searchable](#searchable)*

Set this field as searchable for the 'sql' plugin

**Returns:** *this*

___

#####  values

▸ **values**(...`items`: [TypeBuilder](#code-genclassestypebuildermd)[]): *this*

**Parameters:**

Name | Type |
------ | ------ |
`...items` | [TypeBuilder](#code-genclassestypebuildermd)[] |

**Returns:** *this*

___

##### `Static` getBaseData

▸ **getBaseData**(): *typeof baseData*

*Inherited from [TypeBuilder](#code-genclassestypebuildermd).[getBaseData](#static-getbasedata)*

**Returns:** *typeof baseData*


<a name="code-genclassesanytypemd"></a>

[@lbu/code-gen - v0.0.29](#code-genreadmemd) › [AnyType](#code-genclassesanytypemd)

### Class: AnyType

#### Hierarchy

* [TypeBuilder](#code-genclassestypebuildermd)

  ↳ **AnyType**

#### Index

##### Constructors

* [constructor](#constructor)

##### Properties

* [data](#data)
* [baseData](#static-basedata)

##### Methods

* [build](#build)
* [default](#default)
* [docs](#docs)
* [instanceOf](#instanceof)
* [mock](#mock)
* [optional](#optional)
* [primary](#primary)
* [searchable](#searchable)
* [typeOf](#typeof)
* [getBaseData](#static-getbasedata)

#### Constructors

#####  constructor

\+ **new AnyType**(`type`: string, `group?`: string, `name?`: string): *[AnyType](#code-genclassesanytypemd)*

*Inherited from [TypeBuilder](#code-genclassestypebuildermd).[constructor](#constructor)*

Create a new TypeBuilder for the provided group

**Parameters:**

Name | Type |
------ | ------ |
`type` | string |
`group?` | string |
`name?` | string |

**Returns:** *[AnyType](#code-genclassesanytypemd)*

#### Properties

#####  data

• **data**: *typeof baseData*

*Inherited from [TypeBuilder](#code-genclassestypebuildermd).[data](#data)*

___

##### `Static` baseData

▪ **baseData**: *object*

*Inherited from [TypeBuilder](#code-genclassestypebuildermd).[baseData](#static-basedata)*

###### Type declaration:

* **defaultValue**? : *string*

* **docString**: *string*

* **group**? : *string*

* **isOptional**: *boolean*

* **name**? : *string*

* **type**? : *string*

#### Methods

#####  build

▸ **build**(): *Record‹string, any›*

*Inherited from [TypeBuilder](#code-genclassestypebuildermd).[build](#build)*

Returns a shallow copy of the data object

**Returns:** *Record‹string, any›*

___

#####  default

▸ **default**(`rawString?`: string): *this*

*Inherited from [TypeBuilder](#code-genclassestypebuildermd).[default](#default)*

Set a raw default value, also makes the type optional
Can be reverted by calling this function with undefined or null

**Parameters:**

Name | Type |
------ | ------ |
`rawString?` | string |

**Returns:** *this*

___

#####  docs

▸ **docs**(`docValue`: string): *this*

*Inherited from [TypeBuilder](#code-genclassestypebuildermd).[docs](#docs)*

Add a doc comment, some generators / types may support rendering this

**Parameters:**

Name | Type |
------ | ------ |
`docValue` | string |

**Returns:** *this*

___

#####  instanceOf

▸ **instanceOf**(`value`: string): *this*

**Parameters:**

Name | Type |
------ | ------ |
`value` | string |

**Returns:** *this*

___

#####  mock

▸ **mock**(`mockFn`: string): *this*

*Inherited from [TypeBuilder](#code-genclassestypebuildermd).[mock](#mock)*

Raw mock string used with the 'mock' plugin.
Use '_mocker' or '__' to access the Chance instance

**Parameters:**

Name | Type |
------ | ------ |
`mockFn` | string |

**Returns:** *this*

___

#####  optional

▸ **optional**(): *this*

*Inherited from [TypeBuilder](#code-genclassestypebuildermd).[optional](#optional)*

Value can be undefined

**Returns:** *this*

___

#####  primary

▸ **primary**(): *this*

*Inherited from [TypeBuilder](#code-genclassestypebuildermd).[primary](#primary)*

Set this field as primary for the 'sql' plugin

**Returns:** *this*

___

#####  searchable

▸ **searchable**(): *this*

*Inherited from [TypeBuilder](#code-genclassestypebuildermd).[searchable](#searchable)*

Set this field as searchable for the 'sql' plugin

**Returns:** *this*

___

#####  typeOf

▸ **typeOf**(`value`: string): *this*

**Parameters:**

Name | Type |
------ | ------ |
`value` | string |

**Returns:** *this*

___

##### `Static` getBaseData

▸ **getBaseData**(): *typeof baseData*

*Inherited from [TypeBuilder](#code-genclassestypebuildermd).[getBaseData](#static-getbasedata)*

**Returns:** *typeof baseData*


<a name="code-genclassesappmd"></a>

[@lbu/code-gen - v0.0.29](#code-genreadmemd) › [App](#code-genclassesappmd)

### Class: App

The entry-point to code generation
Provides the structure for creating types, and extending with external sources.
Also maintains the generators

#### Hierarchy

* **App**

#### Index

##### Properties

* [logger](#logger)
* [verbose](#verbose)
* [defaultEslintIgnore](#static-defaulteslintignore)

##### Methods

* [add](#add)
* [extend](#extend)
* [generate](#generate)
* [new](#static-new)

#### Properties

#####  logger

• **logger**: *Logger*

Internally used logger

___

#####  verbose

• **verbose**: *boolean*

Enable more logging while generating

___

##### `Static` defaultEslintIgnore

▪ **defaultEslintIgnore**: *string[]*

List used in the file header to ignore some eslint rules

#### Methods

#####  add

▸ **add**(...`builders`: [TypeBuilder](#code-genclassestypebuildermd)[]): *[App](#code-genclassesappmd)*

Add new TypeBuilders to this app

**Parameters:**

Name | Type |
------ | ------ |
`...builders` | [TypeBuilder](#code-genclassestypebuildermd)[] |

**Returns:** *[App](#code-genclassesappmd)*

___

#####  extend

▸ **extend**(`data`: any): *void*

Add all groups and items to this App instance

**Parameters:**

Name | Type |
------ | ------ |
`data` | any |

**Returns:** *void*

___

#####  generate

▸ **generate**(`options`: [GenerateOpts](#code-geninterfacesgenerateoptsmd)): *Promise‹void›*

Call the generators with the provided options
and writes the output

**Parameters:**

Name | Type |
------ | ------ |
`options` | [GenerateOpts](#code-geninterfacesgenerateoptsmd) |

**Returns:** *Promise‹void›*

___

##### `Static` new

▸ **new**(`options`: [AppOpts](#code-geninterfacesappoptsmd)): *Promise‹[App](#code-genclassesappmd)›*

Create a new App instance and inits generators

**Parameters:**

Name | Type |
------ | ------ |
`options` | [AppOpts](#code-geninterfacesappoptsmd) |

**Returns:** *Promise‹[App](#code-genclassesappmd)›*


<a name="code-genclassesarraytypemd"></a>

[@lbu/code-gen - v0.0.29](#code-genreadmemd) › [ArrayType](#code-genclassesarraytypemd)

### Class: ArrayType

#### Hierarchy

* [TypeBuilder](#code-genclassestypebuildermd)

  ↳ **ArrayType**

#### Index

##### Constructors

* [constructor](#constructor)

##### Properties

* [data](#data)
* [baseData](#static-basedata)

##### Methods

* [build](#build)
* [convert](#convert)
* [default](#default)
* [docs](#docs)
* [max](#max)
* [min](#min)
* [mock](#mock)
* [optional](#optional)
* [primary](#primary)
* [searchable](#searchable)
* [values](#values)
* [getBaseData](#static-getbasedata)

#### Constructors

#####  constructor

\+ **new ArrayType**(`type`: string, `group?`: string, `name?`: string): *[ArrayType](#code-genclassesarraytypemd)*

*Inherited from [TypeBuilder](#code-genclassestypebuildermd).[constructor](#constructor)*

Create a new TypeBuilder for the provided group

**Parameters:**

Name | Type |
------ | ------ |
`type` | string |
`group?` | string |
`name?` | string |

**Returns:** *[ArrayType](#code-genclassesarraytypemd)*

#### Properties

#####  data

• **data**: *typeof baseData*

*Inherited from [TypeBuilder](#code-genclassestypebuildermd).[data](#data)*

___

##### `Static` baseData

▪ **baseData**: *object*

*Inherited from [TypeBuilder](#code-genclassestypebuildermd).[baseData](#static-basedata)*

###### Type declaration:

* **defaultValue**? : *string*

* **docString**: *string*

* **group**? : *string*

* **isOptional**: *boolean*

* **name**? : *string*

* **type**? : *string*

#### Methods

#####  build

▸ **build**(): *Record‹string, any›*

*Inherited from [TypeBuilder](#code-genclassestypebuildermd).[build](#build)*

Returns a shallow copy of the data object

**Returns:** *Record‹string, any›*

___

#####  convert

▸ **convert**(): *this*

Validator converts single item to an array

**Returns:** *this*

___

#####  default

▸ **default**(`rawString?`: string): *this*

*Inherited from [TypeBuilder](#code-genclassestypebuildermd).[default](#default)*

Set a raw default value, also makes the type optional
Can be reverted by calling this function with undefined or null

**Parameters:**

Name | Type |
------ | ------ |
`rawString?` | string |

**Returns:** *this*

___

#####  docs

▸ **docs**(`docValue`: string): *this*

*Inherited from [TypeBuilder](#code-genclassestypebuildermd).[docs](#docs)*

Add a doc comment, some generators / types may support rendering this

**Parameters:**

Name | Type |
------ | ------ |
`docValue` | string |

**Returns:** *this*

___

#####  max

▸ **max**(`max`: number): *this*

Validator enforced maximum length inclusive

**Parameters:**

Name | Type |
------ | ------ |
`max` | number |

**Returns:** *this*

___

#####  min

▸ **min**(`min`: number): *this*

Validator enforced minimum length inclusive

**Parameters:**

Name | Type |
------ | ------ |
`min` | number |

**Returns:** *this*

___

#####  mock

▸ **mock**(`mockFn`: string): *this*

*Inherited from [TypeBuilder](#code-genclassestypebuildermd).[mock](#mock)*

Raw mock string used with the 'mock' plugin.
Use '_mocker' or '__' to access the Chance instance

**Parameters:**

Name | Type |
------ | ------ |
`mockFn` | string |

**Returns:** *this*

___

#####  optional

▸ **optional**(): *this*

*Inherited from [TypeBuilder](#code-genclassestypebuildermd).[optional](#optional)*

Value can be undefined

**Returns:** *this*

___

#####  primary

▸ **primary**(): *this*

*Inherited from [TypeBuilder](#code-genclassestypebuildermd).[primary](#primary)*

Set this field as primary for the 'sql' plugin

**Returns:** *this*

___

#####  searchable

▸ **searchable**(): *this*

*Inherited from [TypeBuilder](#code-genclassestypebuildermd).[searchable](#searchable)*

Set this field as searchable for the 'sql' plugin

**Returns:** *this*

___

#####  values

▸ **values**(`value`: [TypeBuilder](#code-genclassestypebuildermd)): *this*

**Parameters:**

Name | Type |
------ | ------ |
`value` | [TypeBuilder](#code-genclassestypebuildermd) |

**Returns:** *this*

___

##### `Static` getBaseData

▸ **getBaseData**(): *typeof baseData*

*Inherited from [TypeBuilder](#code-genclassestypebuildermd).[getBaseData](#static-getbasedata)*

**Returns:** *typeof baseData*


<a name="code-genclassesbooleantypemd"></a>

[@lbu/code-gen - v0.0.29](#code-genreadmemd) › [BooleanType](#code-genclassesbooleantypemd)

### Class: BooleanType

#### Hierarchy

* [TypeBuilder](#code-genclassestypebuildermd)

  ↳ **BooleanType**

#### Index

##### Constructors

* [constructor](#constructor)

##### Properties

* [data](#data)
* [baseData](#static-basedata)

##### Methods

* [build](#build)
* [convert](#convert)
* [default](#default)
* [docs](#docs)
* [mock](#mock)
* [oneOf](#oneof)
* [optional](#optional)
* [primary](#primary)
* [searchable](#searchable)
* [getBaseData](#static-getbasedata)

#### Constructors

#####  constructor

\+ **new BooleanType**(`type`: string, `group?`: string, `name?`: string): *[BooleanType](#code-genclassesbooleantypemd)*

*Inherited from [TypeBuilder](#code-genclassestypebuildermd).[constructor](#constructor)*

Create a new TypeBuilder for the provided group

**Parameters:**

Name | Type |
------ | ------ |
`type` | string |
`group?` | string |
`name?` | string |

**Returns:** *[BooleanType](#code-genclassesbooleantypemd)*

#### Properties

#####  data

• **data**: *typeof baseData*

*Inherited from [TypeBuilder](#code-genclassestypebuildermd).[data](#data)*

___

##### `Static` baseData

▪ **baseData**: *object*

*Inherited from [TypeBuilder](#code-genclassestypebuildermd).[baseData](#static-basedata)*

###### Type declaration:

* **defaultValue**? : *string*

* **docString**: *string*

* **group**? : *string*

* **isOptional**: *boolean*

* **name**? : *string*

* **type**? : *string*

#### Methods

#####  build

▸ **build**(): *Record‹string, any›*

*Inherited from [TypeBuilder](#code-genclassestypebuildermd).[build](#build)*

Returns a shallow copy of the data object

**Returns:** *Record‹string, any›*

___

#####  convert

▸ **convert**(): *this*

Validator converts "true", "false", 0 and 1 to a boolean

**Returns:** *this*

___

#####  default

▸ **default**(`rawString?`: string): *this*

*Inherited from [TypeBuilder](#code-genclassestypebuildermd).[default](#default)*

Set a raw default value, also makes the type optional
Can be reverted by calling this function with undefined or null

**Parameters:**

Name | Type |
------ | ------ |
`rawString?` | string |

**Returns:** *this*

___

#####  docs

▸ **docs**(`docValue`: string): *this*

*Inherited from [TypeBuilder](#code-genclassestypebuildermd).[docs](#docs)*

Add a doc comment, some generators / types may support rendering this

**Parameters:**

Name | Type |
------ | ------ |
`docValue` | string |

**Returns:** *this*

___

#####  mock

▸ **mock**(`mockFn`: string): *this*

*Inherited from [TypeBuilder](#code-genclassestypebuildermd).[mock](#mock)*

Raw mock string used with the 'mock' plugin.
Use '_mocker' or '__' to access the Chance instance

**Parameters:**

Name | Type |
------ | ------ |
`mockFn` | string |

**Returns:** *this*

___

#####  oneOf

▸ **oneOf**(`value`: boolean): *this*

Only accepts a specific value

**Parameters:**

Name | Type |
------ | ------ |
`value` | boolean |

**Returns:** *this*

___

#####  optional

▸ **optional**(): *this*

*Inherited from [TypeBuilder](#code-genclassestypebuildermd).[optional](#optional)*

Value can be undefined

**Returns:** *this*

___

#####  primary

▸ **primary**(): *this*

*Inherited from [TypeBuilder](#code-genclassestypebuildermd).[primary](#primary)*

Set this field as primary for the 'sql' plugin

**Returns:** *this*

___

#####  searchable

▸ **searchable**(): *this*

*Inherited from [TypeBuilder](#code-genclassestypebuildermd).[searchable](#searchable)*

Set this field as searchable for the 'sql' plugin

**Returns:** *this*

___

##### `Static` getBaseData

▸ **getBaseData**(): *typeof baseData*

*Inherited from [TypeBuilder](#code-genclassestypebuildermd).[getBaseData](#static-getbasedata)*

**Returns:** *typeof baseData*


<a name="code-genclassesdatetypemd"></a>

[@lbu/code-gen - v0.0.29](#code-genreadmemd) › [DateType](#code-genclassesdatetypemd)

### Class: DateType

#### Hierarchy

* [TypeBuilder](#code-genclassestypebuildermd)

  ↳ **DateType**

#### Index

##### Constructors

* [constructor](#constructor)

##### Properties

* [data](#data)
* [baseData](#static-basedata)

##### Methods

* [build](#build)
* [default](#default)
* [defaultToNow](#defaulttonow)
* [docs](#docs)
* [mock](#mock)
* [optional](#optional)
* [primary](#primary)
* [searchable](#searchable)
* [getBaseData](#static-getbasedata)

#### Constructors

#####  constructor

\+ **new DateType**(`type`: string, `group?`: string, `name?`: string): *[DateType](#code-genclassesdatetypemd)*

*Inherited from [TypeBuilder](#code-genclassestypebuildermd).[constructor](#constructor)*

Create a new TypeBuilder for the provided group

**Parameters:**

Name | Type |
------ | ------ |
`type` | string |
`group?` | string |
`name?` | string |

**Returns:** *[DateType](#code-genclassesdatetypemd)*

#### Properties

#####  data

• **data**: *typeof baseData*

*Inherited from [TypeBuilder](#code-genclassestypebuildermd).[data](#data)*

___

##### `Static` baseData

▪ **baseData**: *object*

*Inherited from [TypeBuilder](#code-genclassestypebuildermd).[baseData](#static-basedata)*

###### Type declaration:

* **defaultValue**? : *string*

* **docString**: *string*

* **group**? : *string*

* **isOptional**: *boolean*

* **name**? : *string*

* **type**? : *string*

#### Methods

#####  build

▸ **build**(): *Record‹string, any›*

*Inherited from [TypeBuilder](#code-genclassestypebuildermd).[build](#build)*

Returns a shallow copy of the data object

**Returns:** *Record‹string, any›*

___

#####  default

▸ **default**(`rawString?`: string): *this*

*Inherited from [TypeBuilder](#code-genclassestypebuildermd).[default](#default)*

Set a raw default value, also makes the type optional
Can be reverted by calling this function with undefined or null

**Parameters:**

Name | Type |
------ | ------ |
`rawString?` | string |

**Returns:** *this*

___

#####  defaultToNow

▸ **defaultToNow**(): *this*

**Returns:** *this*

___

#####  docs

▸ **docs**(`docValue`: string): *this*

*Inherited from [TypeBuilder](#code-genclassestypebuildermd).[docs](#docs)*

Add a doc comment, some generators / types may support rendering this

**Parameters:**

Name | Type |
------ | ------ |
`docValue` | string |

**Returns:** *this*

___

#####  mock

▸ **mock**(`mockFn`: string): *this*

*Inherited from [TypeBuilder](#code-genclassestypebuildermd).[mock](#mock)*

Raw mock string used with the 'mock' plugin.
Use '_mocker' or '__' to access the Chance instance

**Parameters:**

Name | Type |
------ | ------ |
`mockFn` | string |

**Returns:** *this*

___

#####  optional

▸ **optional**(): *this*

*Inherited from [TypeBuilder](#code-genclassestypebuildermd).[optional](#optional)*

Value can be undefined

**Returns:** *this*

___

#####  primary

▸ **primary**(): *this*

*Inherited from [TypeBuilder](#code-genclassestypebuildermd).[primary](#primary)*

Set this field as primary for the 'sql' plugin

**Returns:** *this*

___

#####  searchable

▸ **searchable**(): *this*

*Inherited from [TypeBuilder](#code-genclassestypebuildermd).[searchable](#searchable)*

Set this field as searchable for the 'sql' plugin

**Returns:** *this*

___

##### `Static` getBaseData

▸ **getBaseData**(): *typeof baseData*

*Inherited from [TypeBuilder](#code-genclassestypebuildermd).[getBaseData](#static-getbasedata)*

**Returns:** *typeof baseData*


<a name="code-genclassesgenerictypemd"></a>

[@lbu/code-gen - v0.0.29](#code-genreadmemd) › [GenericType](#code-genclassesgenerictypemd)

### Class: GenericType

#### Hierarchy

* [TypeBuilder](#code-genclassestypebuildermd)

  ↳ **GenericType**

#### Index

##### Constructors

* [constructor](#constructor)

##### Properties

* [data](#data)
* [baseData](#static-basedata)

##### Methods

* [build](#build)
* [default](#default)
* [docs](#docs)
* [keys](#keys)
* [mock](#mock)
* [optional](#optional)
* [primary](#primary)
* [searchable](#searchable)
* [values](#values)
* [getBaseData](#static-getbasedata)

#### Constructors

#####  constructor

\+ **new GenericType**(`type`: string, `group?`: string, `name?`: string): *[GenericType](#code-genclassesgenerictypemd)*

*Inherited from [TypeBuilder](#code-genclassestypebuildermd).[constructor](#constructor)*

Create a new TypeBuilder for the provided group

**Parameters:**

Name | Type |
------ | ------ |
`type` | string |
`group?` | string |
`name?` | string |

**Returns:** *[GenericType](#code-genclassesgenerictypemd)*

#### Properties

#####  data

• **data**: *typeof baseData*

*Inherited from [TypeBuilder](#code-genclassestypebuildermd).[data](#data)*

___

##### `Static` baseData

▪ **baseData**: *object*

*Inherited from [TypeBuilder](#code-genclassestypebuildermd).[baseData](#static-basedata)*

###### Type declaration:

* **defaultValue**? : *string*

* **docString**: *string*

* **group**? : *string*

* **isOptional**: *boolean*

* **name**? : *string*

* **type**? : *string*

#### Methods

#####  build

▸ **build**(): *Record‹string, any›*

*Inherited from [TypeBuilder](#code-genclassestypebuildermd).[build](#build)*

Returns a shallow copy of the data object

**Returns:** *Record‹string, any›*

___

#####  default

▸ **default**(`rawString?`: string): *this*

*Inherited from [TypeBuilder](#code-genclassestypebuildermd).[default](#default)*

Set a raw default value, also makes the type optional
Can be reverted by calling this function with undefined or null

**Parameters:**

Name | Type |
------ | ------ |
`rawString?` | string |

**Returns:** *this*

___

#####  docs

▸ **docs**(`docValue`: string): *this*

*Inherited from [TypeBuilder](#code-genclassestypebuildermd).[docs](#docs)*

Add a doc comment, some generators / types may support rendering this

**Parameters:**

Name | Type |
------ | ------ |
`docValue` | string |

**Returns:** *this*

___

#####  keys

▸ **keys**(`key`: [TypeBuilder](#code-genclassestypebuildermd)): *this*

**Parameters:**

Name | Type |
------ | ------ |
`key` | [TypeBuilder](#code-genclassestypebuildermd) |

**Returns:** *this*

___

#####  mock

▸ **mock**(`mockFn`: string): *this*

*Inherited from [TypeBuilder](#code-genclassestypebuildermd).[mock](#mock)*

Raw mock string used with the 'mock' plugin.
Use '_mocker' or '__' to access the Chance instance

**Parameters:**

Name | Type |
------ | ------ |
`mockFn` | string |

**Returns:** *this*

___

#####  optional

▸ **optional**(): *this*

*Inherited from [TypeBuilder](#code-genclassestypebuildermd).[optional](#optional)*

Value can be undefined

**Returns:** *this*

___

#####  primary

▸ **primary**(): *this*

*Inherited from [TypeBuilder](#code-genclassestypebuildermd).[primary](#primary)*

Set this field as primary for the 'sql' plugin

**Returns:** *this*

___

#####  searchable

▸ **searchable**(): *this*

*Inherited from [TypeBuilder](#code-genclassestypebuildermd).[searchable](#searchable)*

Set this field as searchable for the 'sql' plugin

**Returns:** *this*

___

#####  values

▸ **values**(`value`: [TypeBuilder](#code-genclassestypebuildermd)): *this*

**Parameters:**

Name | Type |
------ | ------ |
`value` | [TypeBuilder](#code-genclassestypebuildermd) |

**Returns:** *this*

___

##### `Static` getBaseData

▸ **getBaseData**(): *typeof baseData*

*Inherited from [TypeBuilder](#code-genclassestypebuildermd).[getBaseData](#static-getbasedata)*

**Returns:** *typeof baseData*


<a name="code-genclassesnumbertypemd"></a>

[@lbu/code-gen - v0.0.29](#code-genreadmemd) › [NumberType](#code-genclassesnumbertypemd)

### Class: NumberType

#### Hierarchy

* [TypeBuilder](#code-genclassestypebuildermd)

  ↳ **NumberType**

#### Index

##### Constructors

* [constructor](#constructor)

##### Properties

* [data](#data)
* [baseData](#static-basedata)

##### Methods

* [build](#build)
* [convert](#convert)
* [default](#default)
* [docs](#docs)
* [integer](#integer)
* [max](#max)
* [min](#min)
* [mock](#mock)
* [oneOf](#oneof)
* [optional](#optional)
* [primary](#primary)
* [searchable](#searchable)
* [getBaseData](#static-getbasedata)

#### Constructors

#####  constructor

\+ **new NumberType**(`type`: string, `group?`: string, `name?`: string): *[NumberType](#code-genclassesnumbertypemd)*

*Inherited from [TypeBuilder](#code-genclassestypebuildermd).[constructor](#constructor)*

Create a new TypeBuilder for the provided group

**Parameters:**

Name | Type |
------ | ------ |
`type` | string |
`group?` | string |
`name?` | string |

**Returns:** *[NumberType](#code-genclassesnumbertypemd)*

#### Properties

#####  data

• **data**: *typeof baseData*

*Inherited from [TypeBuilder](#code-genclassestypebuildermd).[data](#data)*

___

##### `Static` baseData

▪ **baseData**: *object*

*Inherited from [TypeBuilder](#code-genclassestypebuildermd).[baseData](#static-basedata)*

###### Type declaration:

* **defaultValue**? : *string*

* **docString**: *string*

* **group**? : *string*

* **isOptional**: *boolean*

* **name**? : *string*

* **type**? : *string*

#### Methods

#####  build

▸ **build**(): *Record‹string, any›*

*Inherited from [TypeBuilder](#code-genclassestypebuildermd).[build](#build)*

Returns a shallow copy of the data object

**Returns:** *Record‹string, any›*

___

#####  convert

▸ **convert**(): *this*

Try to convert a string to a number in the validator

**Returns:** *this*

___

#####  default

▸ **default**(`rawString?`: string): *this*

*Inherited from [TypeBuilder](#code-genclassestypebuildermd).[default](#default)*

Set a raw default value, also makes the type optional
Can be reverted by calling this function with undefined or null

**Parameters:**

Name | Type |
------ | ------ |
`rawString?` | string |

**Returns:** *this*

___

#####  docs

▸ **docs**(`docValue`: string): *this*

*Inherited from [TypeBuilder](#code-genclassestypebuildermd).[docs](#docs)*

Add a doc comment, some generators / types may support rendering this

**Parameters:**

Name | Type |
------ | ------ |
`docValue` | string |

**Returns:** *this*

___

#####  integer

▸ **integer**(): *this*

Validator enforced integer

**Returns:** *this*

___

#####  max

▸ **max**(`max`: number): *this*

Validator enforced maximum value inclusive

**Parameters:**

Name | Type |
------ | ------ |
`max` | number |

**Returns:** *this*

___

#####  min

▸ **min**(`min`: number): *this*

Validator enforced minimum value inclusive

**Parameters:**

Name | Type |
------ | ------ |
`min` | number |

**Returns:** *this*

___

#####  mock

▸ **mock**(`mockFn`: string): *this*

*Inherited from [TypeBuilder](#code-genclassestypebuildermd).[mock](#mock)*

Raw mock string used with the 'mock' plugin.
Use '_mocker' or '__' to access the Chance instance

**Parameters:**

Name | Type |
------ | ------ |
`mockFn` | string |

**Returns:** *this*

___

#####  oneOf

▸ **oneOf**(...`value`: number[]): *this*

Only accepts a number from the provided set

**Parameters:**

Name | Type |
------ | ------ |
`...value` | number[] |

**Returns:** *this*

___

#####  optional

▸ **optional**(): *this*

*Inherited from [TypeBuilder](#code-genclassestypebuildermd).[optional](#optional)*

Value can be undefined

**Returns:** *this*

___

#####  primary

▸ **primary**(): *this*

*Inherited from [TypeBuilder](#code-genclassestypebuildermd).[primary](#primary)*

Set this field as primary for the 'sql' plugin

**Returns:** *this*

___

#####  searchable

▸ **searchable**(): *this*

*Inherited from [TypeBuilder](#code-genclassestypebuildermd).[searchable](#searchable)*

Set this field as searchable for the 'sql' plugin

**Returns:** *this*

___

##### `Static` getBaseData

▸ **getBaseData**(): *typeof baseData*

*Inherited from [TypeBuilder](#code-genclassestypebuildermd).[getBaseData](#static-getbasedata)*

**Returns:** *typeof baseData*


<a name="code-genclassesobjecttypemd"></a>

[@lbu/code-gen - v0.0.29](#code-genreadmemd) › [ObjectType](#code-genclassesobjecttypemd)

### Class: ObjectType

#### Hierarchy

* [TypeBuilder](#code-genclassestypebuildermd)

  ↳ **ObjectType**

#### Index

##### Constructors

* [constructor](#constructor)

##### Properties

* [data](#data)
* [baseData](#static-basedata)

##### Methods

* [build](#build)
* [default](#default)
* [docs](#docs)
* [enableQueries](#enablequeries)
* [keys](#keys)
* [mock](#mock)
* [optional](#optional)
* [primary](#primary)
* [searchable](#searchable)
* [strict](#strict)
* [getBaseData](#static-getbasedata)

#### Constructors

#####  constructor

\+ **new ObjectType**(`type`: string, `group?`: string, `name?`: string): *[ObjectType](#code-genclassesobjecttypemd)*

*Inherited from [TypeBuilder](#code-genclassestypebuildermd).[constructor](#constructor)*

Create a new TypeBuilder for the provided group

**Parameters:**

Name | Type |
------ | ------ |
`type` | string |
`group?` | string |
`name?` | string |

**Returns:** *[ObjectType](#code-genclassesobjecttypemd)*

#### Properties

#####  data

• **data**: *typeof baseData*

*Inherited from [TypeBuilder](#code-genclassestypebuildermd).[data](#data)*

___

##### `Static` baseData

▪ **baseData**: *object*

*Inherited from [TypeBuilder](#code-genclassestypebuildermd).[baseData](#static-basedata)*

###### Type declaration:

* **defaultValue**? : *string*

* **docString**: *string*

* **group**? : *string*

* **isOptional**: *boolean*

* **name**? : *string*

* **type**? : *string*

#### Methods

#####  build

▸ **build**(): *Record‹string, any›*

*Inherited from [TypeBuilder](#code-genclassestypebuildermd).[build](#build)*

Returns a shallow copy of the data object

**Returns:** *Record‹string, any›*

___

#####  default

▸ **default**(`rawString?`: string): *this*

*Inherited from [TypeBuilder](#code-genclassestypebuildermd).[default](#default)*

Set a raw default value, also makes the type optional
Can be reverted by calling this function with undefined or null

**Parameters:**

Name | Type |
------ | ------ |
`rawString?` | string |

**Returns:** *this*

___

#####  docs

▸ **docs**(`docValue`: string): *this*

*Inherited from [TypeBuilder](#code-genclassestypebuildermd).[docs](#docs)*

Add a doc comment, some generators / types may support rendering this

**Parameters:**

Name | Type |
------ | ------ |
`docValue` | string |

**Returns:** *this*

___

#####  enableQueries

▸ **enableQueries**(`options`: object): *this*

Generate sql queries for this object
Posibbly adding createdAt and updatedAt fields.
When withHistory is true, it automatically enables withDates.
Added by the 'sql' plugin

**Parameters:**

▪ **options**: *object*

Name | Type |
------ | ------ |
`withDates?` | boolean |
`withHistory?` | boolean |

**Returns:** *this*

___

#####  keys

▸ **keys**(`obj`: Record‹string, [TypeBuilder](#code-genclassestypebuildermd)›): *this*

**Parameters:**

Name | Type |
------ | ------ |
`obj` | Record‹string, [TypeBuilder](#code-genclassestypebuildermd)› |

**Returns:** *this*

___

#####  mock

▸ **mock**(`mockFn`: string): *this*

*Inherited from [TypeBuilder](#code-genclassestypebuildermd).[mock](#mock)*

Raw mock string used with the 'mock' plugin.
Use '_mocker' or '__' to access the Chance instance

**Parameters:**

Name | Type |
------ | ------ |
`mockFn` | string |

**Returns:** *this*

___

#####  optional

▸ **optional**(): *this*

*Inherited from [TypeBuilder](#code-genclassestypebuildermd).[optional](#optional)*

Value can be undefined

**Returns:** *this*

___

#####  primary

▸ **primary**(): *this*

*Inherited from [TypeBuilder](#code-genclassestypebuildermd).[primary](#primary)*

Set this field as primary for the 'sql' plugin

**Returns:** *this*

___

#####  searchable

▸ **searchable**(): *this*

*Inherited from [TypeBuilder](#code-genclassestypebuildermd).[searchable](#searchable)*

Set this field as searchable for the 'sql' plugin

**Returns:** *this*

___

#####  strict

▸ **strict**(): *this*

Validator enforces no extra keys

**Returns:** *this*

___

##### `Static` getBaseData

▸ **getBaseData**(): *typeof baseData*

*Inherited from [TypeBuilder](#code-genclassestypebuildermd).[getBaseData](#static-getbasedata)*

**Returns:** *typeof baseData*


<a name="code-genclassesreferencetypemd"></a>

[@lbu/code-gen - v0.0.29](#code-genreadmemd) › [ReferenceType](#code-genclassesreferencetypemd)

### Class: ReferenceType

#### Hierarchy

* [TypeBuilder](#code-genclassestypebuildermd)

  ↳ **ReferenceType**

#### Index

##### Constructors

* [constructor](#constructor)

##### Properties

* [data](#data)
* [baseData](#static-basedata)

##### Methods

* [build](#build)
* [default](#default)
* [docs](#docs)
* [field](#field)
* [mock](#mock)
* [optional](#optional)
* [primary](#primary)
* [searchable](#searchable)
* [set](#set)
* [getBaseData](#static-getbasedata)

#### Constructors

#####  constructor

\+ **new ReferenceType**(`type`: string, `group?`: string, `name?`: string): *[ReferenceType](#code-genclassesreferencetypemd)*

*Inherited from [TypeBuilder](#code-genclassestypebuildermd).[constructor](#constructor)*

Create a new TypeBuilder for the provided group

**Parameters:**

Name | Type |
------ | ------ |
`type` | string |
`group?` | string |
`name?` | string |

**Returns:** *[ReferenceType](#code-genclassesreferencetypemd)*

#### Properties

#####  data

• **data**: *typeof baseData*

*Inherited from [TypeBuilder](#code-genclassestypebuildermd).[data](#data)*

___

##### `Static` baseData

▪ **baseData**: *object*

*Inherited from [TypeBuilder](#code-genclassestypebuildermd).[baseData](#static-basedata)*

###### Type declaration:

* **defaultValue**? : *string*

* **docString**: *string*

* **group**? : *string*

* **isOptional**: *boolean*

* **name**? : *string*

* **type**? : *string*

#### Methods

#####  build

▸ **build**(): *Record‹string, any›*

*Inherited from [TypeBuilder](#code-genclassestypebuildermd).[build](#build)*

Returns a shallow copy of the data object

**Returns:** *Record‹string, any›*

___

#####  default

▸ **default**(`rawString?`: string): *this*

*Inherited from [TypeBuilder](#code-genclassestypebuildermd).[default](#default)*

Set a raw default value, also makes the type optional
Can be reverted by calling this function with undefined or null

**Parameters:**

Name | Type |
------ | ------ |
`rawString?` | string |

**Returns:** *this*

___

#####  docs

▸ **docs**(`docValue`: string): *this*

*Inherited from [TypeBuilder](#code-genclassestypebuildermd).[docs](#docs)*

Add a doc comment, some generators / types may support rendering this

**Parameters:**

Name | Type |
------ | ------ |
`docValue` | string |

**Returns:** *this*

___

#####  field

▸ **field**(`referencing`: string, `replacement?`: string): *this*

**Parameters:**

Name | Type |
------ | ------ |
`referencing` | string |
`replacement?` | string |

**Returns:** *this*

___

#####  mock

▸ **mock**(`mockFn`: string): *this*

*Inherited from [TypeBuilder](#code-genclassestypebuildermd).[mock](#mock)*

Raw mock string used with the 'mock' plugin.
Use '_mocker' or '__' to access the Chance instance

**Parameters:**

Name | Type |
------ | ------ |
`mockFn` | string |

**Returns:** *this*

___

#####  optional

▸ **optional**(): *this*

*Inherited from [TypeBuilder](#code-genclassestypebuildermd).[optional](#optional)*

Value can be undefined

**Returns:** *this*

___

#####  primary

▸ **primary**(): *this*

*Inherited from [TypeBuilder](#code-genclassestypebuildermd).[primary](#primary)*

Set this field as primary for the 'sql' plugin

**Returns:** *this*

___

#####  searchable

▸ **searchable**(): *this*

*Inherited from [TypeBuilder](#code-genclassestypebuildermd).[searchable](#searchable)*

Set this field as searchable for the 'sql' plugin

**Returns:** *this*

___

#####  set

▸ **set**(`group`: string, `name`: string): *this*

**Parameters:**

Name | Type |
------ | ------ |
`group` | string |
`name` | string |

**Returns:** *this*

___

##### `Static` getBaseData

▸ **getBaseData**(): *typeof baseData*

*Inherited from [TypeBuilder](#code-genclassestypebuildermd).[getBaseData](#static-getbasedata)*

**Returns:** *typeof baseData*


<a name="code-genclassesroutebuildermd"></a>

[@lbu/code-gen - v0.0.29](#code-genreadmemd) › [RouteBuilder](#code-genclassesroutebuildermd)

### Class: RouteBuilder

'Router' plugin provided custom builder for api routes

#### Hierarchy

* [TypeBuilder](#code-genclassestypebuildermd)

  ↳ **RouteBuilder**

#### Index

##### Constructors

* [constructor](#constructor)

##### Properties

* [data](#data)
* [baseData](#static-basedata)

##### Methods

* [body](#body)
* [build](#build)
* [default](#default)
* [docs](#docs)
* [mock](#mock)
* [optional](#optional)
* [params](#params)
* [primary](#primary)
* [query](#query)
* [response](#response)
* [searchable](#searchable)
* [tags](#tags)
* [getBaseData](#static-getbasedata)

#### Constructors

#####  constructor

\+ **new RouteBuilder**(`type`: string, `group?`: string, `name?`: string): *[RouteBuilder](#code-genclassesroutebuildermd)*

*Inherited from [TypeBuilder](#code-genclassestypebuildermd).[constructor](#constructor)*

Create a new TypeBuilder for the provided group

**Parameters:**

Name | Type |
------ | ------ |
`type` | string |
`group?` | string |
`name?` | string |

**Returns:** *[RouteBuilder](#code-genclassesroutebuildermd)*

#### Properties

#####  data

• **data**: *typeof baseData*

*Inherited from [TypeBuilder](#code-genclassestypebuildermd).[data](#data)*

___

##### `Static` baseData

▪ **baseData**: *object*

*Inherited from [TypeBuilder](#code-genclassestypebuildermd).[baseData](#static-basedata)*

###### Type declaration:

* **defaultValue**? : *string*

* **docString**: *string*

* **group**? : *string*

* **isOptional**: *boolean*

* **name**? : *string*

* **type**? : *string*

#### Methods

#####  body

▸ **body**(`builder`: [TypeBuilder](#code-genclassestypebuildermd)): *this*

Type of accepted body parameters

**Parameters:**

Name | Type |
------ | ------ |
`builder` | [TypeBuilder](#code-genclassestypebuildermd) |

**Returns:** *this*

___

#####  build

▸ **build**(): *Record‹string, any›*

*Inherited from [TypeBuilder](#code-genclassestypebuildermd).[build](#build)*

Returns a shallow copy of the data object

**Returns:** *Record‹string, any›*

___

#####  default

▸ **default**(`rawString?`: string): *this*

*Inherited from [TypeBuilder](#code-genclassestypebuildermd).[default](#default)*

Set a raw default value, also makes the type optional
Can be reverted by calling this function with undefined or null

**Parameters:**

Name | Type |
------ | ------ |
`rawString?` | string |

**Returns:** *this*

___

#####  docs

▸ **docs**(`docValue`: string): *this*

*Inherited from [TypeBuilder](#code-genclassestypebuildermd).[docs](#docs)*

Add a doc comment, some generators / types may support rendering this

**Parameters:**

Name | Type |
------ | ------ |
`docValue` | string |

**Returns:** *this*

___

#####  mock

▸ **mock**(`mockFn`: string): *this*

*Inherited from [TypeBuilder](#code-genclassestypebuildermd).[mock](#mock)*

Raw mock string used with the 'mock' plugin.
Use '_mocker' or '__' to access the Chance instance

**Parameters:**

Name | Type |
------ | ------ |
`mockFn` | string |

**Returns:** *this*

___

#####  optional

▸ **optional**(): *this*

*Inherited from [TypeBuilder](#code-genclassestypebuildermd).[optional](#optional)*

Value can be undefined

**Returns:** *this*

___

#####  params

▸ **params**(`builder`: [TypeBuilder](#code-genclassestypebuildermd)): *this*

Type of accepted path parameters

**Parameters:**

Name | Type |
------ | ------ |
`builder` | [TypeBuilder](#code-genclassestypebuildermd) |

**Returns:** *this*

___

#####  primary

▸ **primary**(): *this*

*Inherited from [TypeBuilder](#code-genclassestypebuildermd).[primary](#primary)*

Set this field as primary for the 'sql' plugin

**Returns:** *this*

___

#####  query

▸ **query**(`builder`: [TypeBuilder](#code-genclassestypebuildermd)): *this*

Type of accepted query parameters

**Parameters:**

Name | Type |
------ | ------ |
`builder` | [TypeBuilder](#code-genclassestypebuildermd) |

**Returns:** *this*

___

#####  response

▸ **response**(`builder`: [TypeBuilder](#code-genclassestypebuildermd)): *this*

Route response type

**Parameters:**

Name | Type |
------ | ------ |
`builder` | [TypeBuilder](#code-genclassestypebuildermd) |

**Returns:** *this*

___

#####  searchable

▸ **searchable**(): *this*

*Inherited from [TypeBuilder](#code-genclassestypebuildermd).[searchable](#searchable)*

Set this field as searchable for the 'sql' plugin

**Returns:** *this*

___

#####  tags

▸ **tags**(...`value`: string[]): *this*

Add tags to this route.
Tag handlers are executed before group and specific route handlers

**Parameters:**

Name | Type |
------ | ------ |
`...value` | string[] |

**Returns:** *this*

___

##### `Static` getBaseData

▸ **getBaseData**(): *typeof baseData*

*Inherited from [TypeBuilder](#code-genclassestypebuildermd).[getBaseData](#static-getbasedata)*

**Returns:** *typeof baseData*


<a name="code-genclassesroutecreatormd"></a>

[@lbu/code-gen - v0.0.29](#code-genreadmemd) › [RouteCreator](#code-genclassesroutecreatormd)

### Class: RouteCreator

#### Hierarchy

* **RouteCreator**

#### Index

##### Methods

* [delete](#delete)
* [get](#get)
* [group](#group)
* [head](#head)
* [post](#post)
* [put](#put)

#### Methods

#####  delete

▸ **delete**(`path?`: string, `name?`: string): *any*

DELETE route

**Parameters:**

Name | Type |
------ | ------ |
`path?` | string |
`name?` | string |

**Returns:** *any*

___

#####  get

▸ **get**(`path?`: string, `name?`: string): *any*

GET route

**Parameters:**

Name | Type |
------ | ------ |
`path?` | string |
`name?` | string |

**Returns:** *any*

___

#####  group

▸ **group**(`name`: string, `path`: string): *this*

Create a new route group
Path will be concatenated with the current path of this group

**Parameters:**

Name | Type |
------ | ------ |
`name` | string |
`path` | string |

**Returns:** *this*

___

#####  head

▸ **head**(`path?`: string, `name?`: string): *any*

HEAD route

**Parameters:**

Name | Type |
------ | ------ |
`path?` | string |
`name?` | string |

**Returns:** *any*

___

#####  post

▸ **post**(`path?`: string, `name?`: string): *any*

POST route

**Parameters:**

Name | Type |
------ | ------ |
`path?` | string |
`name?` | string |

**Returns:** *any*

___

#####  put

▸ **put**(`path?`: string, `name?`: string): *any*

PUT route

**Parameters:**

Name | Type |
------ | ------ |
`path?` | string |
`name?` | string |

**Returns:** *any*


<a name="code-genclassesstringtypemd"></a>

[@lbu/code-gen - v0.0.29](#code-genreadmemd) › [StringType](#code-genclassesstringtypemd)

### Class: StringType

#### Hierarchy

* [TypeBuilder](#code-genclassestypebuildermd)

  ↳ **StringType**

#### Index

##### Constructors

* [constructor](#constructor)

##### Properties

* [data](#data)
* [baseData](#static-basedata)

##### Methods

* [build](#build)
* [convert](#convert)
* [default](#default)
* [docs](#docs)
* [lowerCase](#lowercase)
* [max](#max)
* [min](#min)
* [mock](#mock)
* [oneOf](#oneof)
* [optional](#optional)
* [pattern](#pattern)
* [primary](#primary)
* [searchable](#searchable)
* [trim](#trim)
* [upperCase](#uppercase)
* [getBaseData](#static-getbasedata)

#### Constructors

#####  constructor

\+ **new StringType**(`type`: string, `group?`: string, `name?`: string): *[StringType](#code-genclassesstringtypemd)*

*Inherited from [TypeBuilder](#code-genclassestypebuildermd).[constructor](#constructor)*

Create a new TypeBuilder for the provided group

**Parameters:**

Name | Type |
------ | ------ |
`type` | string |
`group?` | string |
`name?` | string |

**Returns:** *[StringType](#code-genclassesstringtypemd)*

#### Properties

#####  data

• **data**: *typeof baseData*

*Inherited from [TypeBuilder](#code-genclassestypebuildermd).[data](#data)*

___

##### `Static` baseData

▪ **baseData**: *object*

*Inherited from [TypeBuilder](#code-genclassestypebuildermd).[baseData](#static-basedata)*

###### Type declaration:

* **defaultValue**? : *string*

* **docString**: *string*

* **group**? : *string*

* **isOptional**: *boolean*

* **name**? : *string*

* **type**? : *string*

#### Methods

#####  build

▸ **build**(): *Record‹string, any›*

*Inherited from [TypeBuilder](#code-genclassestypebuildermd).[build](#build)*

Returns a shallow copy of the data object

**Returns:** *Record‹string, any›*

___

#####  convert

▸ **convert**(): *this*

Validator tries to convert to string

**Returns:** *this*

___

#####  default

▸ **default**(`rawString?`: string): *this*

*Inherited from [TypeBuilder](#code-genclassestypebuildermd).[default](#default)*

Set a raw default value, also makes the type optional
Can be reverted by calling this function with undefined or null

**Parameters:**

Name | Type |
------ | ------ |
`rawString?` | string |

**Returns:** *this*

___

#####  docs

▸ **docs**(`docValue`: string): *this*

*Inherited from [TypeBuilder](#code-genclassestypebuildermd).[docs](#docs)*

Add a doc comment, some generators / types may support rendering this

**Parameters:**

Name | Type |
------ | ------ |
`docValue` | string |

**Returns:** *this*

___

#####  lowerCase

▸ **lowerCase**(): *this*

Validator lower cases the input

**Returns:** *this*

___

#####  max

▸ **max**(`max`: number): *this*

Validator enforced maximum length inclusive

**Parameters:**

Name | Type |
------ | ------ |
`max` | number |

**Returns:** *this*

___

#####  min

▸ **min**(`min`: number): *this*

Validator enforced minimum length inclusive

**Parameters:**

Name | Type |
------ | ------ |
`min` | number |

**Returns:** *this*

___

#####  mock

▸ **mock**(`mockFn`: string): *this*

*Inherited from [TypeBuilder](#code-genclassestypebuildermd).[mock](#mock)*

Raw mock string used with the 'mock' plugin.
Use '_mocker' or '__' to access the Chance instance

**Parameters:**

Name | Type |
------ | ------ |
`mockFn` | string |

**Returns:** *this*

___

#####  oneOf

▸ **oneOf**(...`values`: string[]): *this*

Only accepts a string from the provided set.
Also the way to make enums

**Parameters:**

Name | Type |
------ | ------ |
`...values` | string[] |

**Returns:** *this*

___

#####  optional

▸ **optional**(): *this*

*Inherited from [TypeBuilder](#code-genclassestypebuildermd).[optional](#optional)*

Value can be undefined

**Returns:** *this*

___

#####  pattern

▸ **pattern**(`pattern`: RegExp): *this*

Validator enforced pattern

**Parameters:**

Name | Type |
------ | ------ |
`pattern` | RegExp |

**Returns:** *this*

___

#####  primary

▸ **primary**(): *this*

*Inherited from [TypeBuilder](#code-genclassestypebuildermd).[primary](#primary)*

Set this field as primary for the 'sql' plugin

**Returns:** *this*

___

#####  searchable

▸ **searchable**(): *this*

*Inherited from [TypeBuilder](#code-genclassestypebuildermd).[searchable](#searchable)*

Set this field as searchable for the 'sql' plugin

**Returns:** *this*

___

#####  trim

▸ **trim**(): *this*

Validator trims the input

**Returns:** *this*

___

#####  upperCase

▸ **upperCase**(): *this*

Validator upper cases the input

**Returns:** *this*

___

##### `Static` getBaseData

▸ **getBaseData**(): *typeof baseData*

*Inherited from [TypeBuilder](#code-genclassestypebuildermd).[getBaseData](#static-getbasedata)*

**Returns:** *typeof baseData*


<a name="code-genclassestypebuildermd"></a>

[@lbu/code-gen - v0.0.29](#code-genreadmemd) › [TypeBuilder](#code-genclassestypebuildermd)

### Class: TypeBuilder

Provide base properties for types
This includes the 'type', optional, docs and default value.
Also contains group and name information

#### Hierarchy

* **TypeBuilder**

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

* [constructor](#constructor)

##### Properties

* [data](#data)
* [baseData](#static-basedata)

##### Methods

* [build](#build)
* [default](#default)
* [docs](#docs)
* [mock](#mock)
* [optional](#optional)
* [primary](#primary)
* [searchable](#searchable)
* [getBaseData](#static-getbasedata)

#### Constructors

#####  constructor

\+ **new TypeBuilder**(`type`: string, `group?`: string, `name?`: string): *[TypeBuilder](#code-genclassestypebuildermd)*

Create a new TypeBuilder for the provided group

**Parameters:**

Name | Type |
------ | ------ |
`type` | string |
`group?` | string |
`name?` | string |

**Returns:** *[TypeBuilder](#code-genclassestypebuildermd)*

#### Properties

#####  data

• **data**: *typeof baseData*

___

##### `Static` baseData

▪ **baseData**: *object*

###### Type declaration:

* **defaultValue**? : *string*

* **docString**: *string*

* **group**? : *string*

* **isOptional**: *boolean*

* **name**? : *string*

* **type**? : *string*

#### Methods

#####  build

▸ **build**(): *Record‹string, any›*

Returns a shallow copy of the data object

**Returns:** *Record‹string, any›*

___

#####  default

▸ **default**(`rawString?`: string): *this*

Set a raw default value, also makes the type optional
Can be reverted by calling this function with undefined or null

**Parameters:**

Name | Type |
------ | ------ |
`rawString?` | string |

**Returns:** *this*

___

#####  docs

▸ **docs**(`docValue`: string): *this*

Add a doc comment, some generators / types may support rendering this

**Parameters:**

Name | Type |
------ | ------ |
`docValue` | string |

**Returns:** *this*

___

#####  mock

▸ **mock**(`mockFn`: string): *this*

Raw mock string used with the 'mock' plugin.
Use '_mocker' or '__' to access the Chance instance

**Parameters:**

Name | Type |
------ | ------ |
`mockFn` | string |

**Returns:** *this*

___

#####  optional

▸ **optional**(): *this*

Value can be undefined

**Returns:** *this*

___

#####  primary

▸ **primary**(): *this*

Set this field as primary for the 'sql' plugin

**Returns:** *this*

___

#####  searchable

▸ **searchable**(): *this*

Set this field as searchable for the 'sql' plugin

**Returns:** *this*

___

##### `Static` getBaseData

▸ **getBaseData**(): *typeof baseData*

**Returns:** *typeof baseData*


<a name="code-genclassestypecreatormd"></a>

[@lbu/code-gen - v0.0.29](#code-genreadmemd) › [TypeCreator](#code-genclassestypecreatormd)

### Class: TypeCreator

Create new instances of registered types and manages grups
Also keeps a Map of registered types on TypeCreator.types

Note that all functions that return a `T extends TypeBuilder` are dynamically added and
provided by the core.

#### Hierarchy

* **TypeCreator**

#### Index

##### Constructors

* [constructor](#constructor)

##### Properties

* [types](#static-types)

##### Methods

* [any](#any)
* [anyOf](#anyof)
* [array](#array)
* [bool](#bool)
* [date](#date)
* [generic](#generic)
* [number](#number)
* [object](#object)
* [reference](#reference)
* [router](#router)
* [string](#string)
* [uuid](#uuid)
* [getTypesWithProperty](#static-gettypeswithproperty)

#### Constructors

#####  constructor

\+ **new TypeCreator**(`group?`: string): *[TypeCreator](#code-genclassestypecreatormd)*

**Parameters:**

Name | Type |
------ | ------ |
`group?` | string |

**Returns:** *[TypeCreator](#code-genclassestypecreatormd)*

#### Properties

##### `Static` types

▪ **types**: *Map‹string, [TypePlugin](#code-geninterfacestypepluginmd)‹any››*

Registry of all type plugins

#### Methods

#####  any

▸ **any**(`name?`: string): *[AnyType](#code-genclassesanytypemd)*

**Parameters:**

Name | Type |
------ | ------ |
`name?` | string |

**Returns:** *[AnyType](#code-genclassesanytypemd)*

___

#####  anyOf

▸ **anyOf**(`name?`: string | [TypeBuilder](#code-genclassestypebuildermd)[], ...`values`: [TypeBuilder](#code-genclassestypebuildermd)[]): *[AnyOfType](#code-genclassesanyoftypemd)*

**Parameters:**

Name | Type |
------ | ------ |
`name?` | string &#124; [TypeBuilder](#code-genclassestypebuildermd)[] |
`...values` | [TypeBuilder](#code-genclassestypebuildermd)[] |

**Returns:** *[AnyOfType](#code-genclassesanyoftypemd)*

___

#####  array

▸ **array**(`name?`: string | [TypeBuilder](#code-genclassestypebuildermd), `value?`: [TypeBuilder](#code-genclassestypebuildermd)): *[ArrayType](#code-genclassesarraytypemd)*

**Parameters:**

Name | Type |
------ | ------ |
`name?` | string &#124; [TypeBuilder](#code-genclassestypebuildermd) |
`value?` | [TypeBuilder](#code-genclassestypebuildermd) |

**Returns:** *[ArrayType](#code-genclassesarraytypemd)*

___

#####  bool

▸ **bool**(`name?`: string): *[BooleanType](#code-genclassesbooleantypemd)*

**Parameters:**

Name | Type |
------ | ------ |
`name?` | string |

**Returns:** *[BooleanType](#code-genclassesbooleantypemd)*

___

#####  date

▸ **date**(`name?`: string): *[DateType](#code-genclassesdatetypemd)*

**Parameters:**

Name | Type |
------ | ------ |
`name?` | string |

**Returns:** *[DateType](#code-genclassesdatetypemd)*

___

#####  generic

▸ **generic**(`name?`: string): *[GenericType](#code-genclassesgenerictypemd)*

**Parameters:**

Name | Type |
------ | ------ |
`name?` | string |

**Returns:** *[GenericType](#code-genclassesgenerictypemd)*

___

#####  number

▸ **number**(`name?`: string): *[NumberType](#code-genclassesnumbertypemd)*

**Parameters:**

Name | Type |
------ | ------ |
`name?` | string |

**Returns:** *[NumberType](#code-genclassesnumbertypemd)*

___

#####  object

▸ **object**(`name?`: string | Record‹string, [TypeBuilder](#code-genclassestypebuildermd)›, `obj?`: Record‹string, [TypeBuilder](#code-genclassestypebuildermd)›): *[ObjectType](#code-genclassesobjecttypemd)*

**Parameters:**

Name | Type |
------ | ------ |
`name?` | string &#124; Record‹string, [TypeBuilder](#code-genclassestypebuildermd)› |
`obj?` | Record‹string, [TypeBuilder](#code-genclassestypebuildermd)› |

**Returns:** *[ObjectType](#code-genclassesobjecttypemd)*

___

#####  reference

▸ **reference**(`groupOrOther?`: string | [TypeBuilder](#code-genclassestypebuildermd), `name?`: string): *[ReferenceType](#code-genclassesreferencetypemd)*

**Parameters:**

Name | Type |
------ | ------ |
`groupOrOther?` | string &#124; [TypeBuilder](#code-genclassestypebuildermd) |
`name?` | string |

**Returns:** *[ReferenceType](#code-genclassesreferencetypemd)*

___

#####  router

▸ **router**(`path`: string): *[RouteCreator](#code-genclassesroutecreatormd)*

Create a new RouteCreator
Provided by the 'router' generator

**Parameters:**

Name | Type |
------ | ------ |
`path` | string |

**Returns:** *[RouteCreator](#code-genclassesroutecreatormd)*

___

#####  string

▸ **string**(`name?`: string): *[StringType](#code-genclassesstringtypemd)*

**Parameters:**

Name | Type |
------ | ------ |
`name?` | string |

**Returns:** *[StringType](#code-genclassesstringtypemd)*

___

#####  uuid

▸ **uuid**(`name?`: string): *[UuidType](#code-genclassesuuidtypemd)*

**Parameters:**

Name | Type |
------ | ------ |
`name?` | string |

**Returns:** *[UuidType](#code-genclassesuuidtypemd)*

___

##### `Static` getTypesWithProperty

▸ **getTypesWithProperty**(`property`: string): *[TypePlugin](#code-geninterfacestypepluginmd)‹any›[]*

Return a list of type plugins that have the specified property

**Parameters:**

Name | Type |
------ | ------ |
`property` | string |

**Returns:** *[TypePlugin](#code-geninterfacestypepluginmd)‹any›[]*


<a name="code-genclassesuuidtypemd"></a>

[@lbu/code-gen - v0.0.29](#code-genreadmemd) › [UuidType](#code-genclassesuuidtypemd)

### Class: UuidType

#### Hierarchy

* [TypeBuilder](#code-genclassestypebuildermd)

  ↳ **UuidType**

#### Index

##### Constructors

* [constructor](#constructor)

##### Properties

* [data](#data)
* [baseData](#static-basedata)

##### Methods

* [build](#build)
* [default](#default)
* [docs](#docs)
* [mock](#mock)
* [optional](#optional)
* [primary](#primary)
* [searchable](#searchable)
* [getBaseData](#static-getbasedata)

#### Constructors

#####  constructor

\+ **new UuidType**(`type`: string, `group?`: string, `name?`: string): *[UuidType](#code-genclassesuuidtypemd)*

*Inherited from [TypeBuilder](#code-genclassestypebuildermd).[constructor](#constructor)*

Create a new TypeBuilder for the provided group

**Parameters:**

Name | Type |
------ | ------ |
`type` | string |
`group?` | string |
`name?` | string |

**Returns:** *[UuidType](#code-genclassesuuidtypemd)*

#### Properties

#####  data

• **data**: *typeof baseData*

*Inherited from [TypeBuilder](#code-genclassestypebuildermd).[data](#data)*

___

##### `Static` baseData

▪ **baseData**: *object*

*Inherited from [TypeBuilder](#code-genclassestypebuildermd).[baseData](#static-basedata)*

###### Type declaration:

* **defaultValue**? : *string*

* **docString**: *string*

* **group**? : *string*

* **isOptional**: *boolean*

* **name**? : *string*

* **type**? : *string*

#### Methods

#####  build

▸ **build**(): *Record‹string, any›*

*Inherited from [TypeBuilder](#code-genclassestypebuildermd).[build](#build)*

Returns a shallow copy of the data object

**Returns:** *Record‹string, any›*

___

#####  default

▸ **default**(`rawString?`: string): *this*

*Inherited from [TypeBuilder](#code-genclassestypebuildermd).[default](#default)*

Set a raw default value, also makes the type optional
Can be reverted by calling this function with undefined or null

**Parameters:**

Name | Type |
------ | ------ |
`rawString?` | string |

**Returns:** *this*

___

#####  docs

▸ **docs**(`docValue`: string): *this*

*Inherited from [TypeBuilder](#code-genclassestypebuildermd).[docs](#docs)*

Add a doc comment, some generators / types may support rendering this

**Parameters:**

Name | Type |
------ | ------ |
`docValue` | string |

**Returns:** *this*

___

#####  mock

▸ **mock**(`mockFn`: string): *this*

*Inherited from [TypeBuilder](#code-genclassestypebuildermd).[mock](#mock)*

Raw mock string used with the 'mock' plugin.
Use '_mocker' or '__' to access the Chance instance

**Parameters:**

Name | Type |
------ | ------ |
`mockFn` | string |

**Returns:** *this*

___

#####  optional

▸ **optional**(): *this*

*Inherited from [TypeBuilder](#code-genclassestypebuildermd).[optional](#optional)*

Value can be undefined

**Returns:** *this*

___

#####  primary

▸ **primary**(): *this*

*Inherited from [TypeBuilder](#code-genclassestypebuildermd).[primary](#primary)*

Set this field as primary for the 'sql' plugin

**Returns:** *this*

___

#####  searchable

▸ **searchable**(): *this*

*Inherited from [TypeBuilder](#code-genclassestypebuildermd).[searchable](#searchable)*

Set this field as searchable for the 'sql' plugin

**Returns:** *this*

___

##### `Static` getBaseData

▸ **getBaseData**(): *typeof baseData*

*Inherited from [TypeBuilder](#code-genclassestypebuildermd).[getBaseData](#static-getbasedata)*

**Returns:** *typeof baseData*

## Interfaces


<a name="code-geninterfacesappoptsmd"></a>

[@lbu/code-gen - v0.0.29](#code-genreadmemd) › [AppOpts](#code-geninterfacesappoptsmd)

### Interface: AppOpts

#### Hierarchy

* **AppOpts**

#### Index

##### Properties

* [verbose](#optional-verbose)

#### Properties

##### `Optional` verbose

• **verbose**? : *boolean*


<a name="code-geninterfacesgeneratedfilemd"></a>

[@lbu/code-gen - v0.0.29](#code-genreadmemd) › [GeneratedFile](#code-geninterfacesgeneratedfilemd)

### Interface: GeneratedFile

#### Hierarchy

* **GeneratedFile**

#### Index

##### Properties

* [path](#path)
* [source](#source)

#### Properties

#####  path

• **path**: *string*

Relative path to the outputDirectory

___

#####  source

• **source**: *string*

Generated source string


<a name="code-geninterfacesgenerateoptsmd"></a>

[@lbu/code-gen - v0.0.29](#code-genreadmemd) › [GenerateOpts](#code-geninterfacesgenerateoptsmd)

### Interface: GenerateOpts

#### Hierarchy

* **GenerateOpts**

#### Index

##### Properties

* [dumpStructure](#optional-dumpstructure)
* [enabledGenerators](#optional-enabledgenerators)
* [enabledGroups](#optional-enabledgroups)
* [fileHeader](#optional-fileheader)
* [outputDirectory](#outputdirectory)
* [useStubGenerators](#optional-usestubgenerators)
* [useTypescript](#optional-usetypescript)

#### Properties

##### `Optional` dumpStructure

• **dumpStructure**? : *boolean*

Dump a structure.js file with the used payload in it

___

##### `Optional` enabledGenerators

• **enabledGenerators**? : *string[]*

Enabling specific generators.
If this is undefined, all registered generators are enabled

___

##### `Optional` enabledGroups

• **enabledGroups**? : *string[]*

Enabling specific groups so different generator combinations can be used.
The machinery will automatically find referenced types and include those
If this is undefined, all groups will be enabled

___

##### `Optional` fileHeader

• **fileHeader**? : *string*

Custom file header to for example disable linting or something

___

#####  outputDirectory

• **outputDirectory**: *string*

Directory to write the files to

___

##### `Optional` useStubGenerators

• **useStubGenerators**? : *boolean*

Some generators support so called stub generation.
This often outputs the types only and doesn't include any real code.

___

##### `Optional` useTypescript

• **useTypescript**? : *boolean*

Enable Typescript for the generators that support it


<a name="code-geninterfacesgeneratorpluginmd"></a>

[@lbu/code-gen - v0.0.29](#code-genreadmemd) › [GeneratorPlugin](#code-geninterfacesgeneratorpluginmd)

### Interface: GeneratorPlugin

#### Hierarchy

* **GeneratorPlugin**

#### Index

##### Properties

* [generate](#optional-generate)
* [init](#optional-init)
* [name](#name)
* [preGenerate](#optional-pregenerate)

#### Properties

##### `Optional` generate

• **generate**? : *function*

Compile dynamic templates, execute templates and return the GeneratedFiles
Can be called multiple times

###### Type declaration:

▸ (`app`: [App](#code-genclassesappmd), `data`: object, `options`: [GenerateOpts](#code-geninterfacesgenerateoptsmd)): *[GeneratedFile](#code-geninterfacesgeneratedfilemd) | [GeneratedFile](#code-geninterfacesgeneratedfilemd)[] | Promise‹[GeneratedFile](#code-geninterfacesgeneratedfilemd)› | Promise‹[GeneratedFile](#code-geninterfacesgeneratedfilemd)[]›*

**Parameters:**

Name | Type |
------ | ------ |
`app` | [App](#code-genclassesappmd) |
`data` | object |
`options` | [GenerateOpts](#code-geninterfacesgenerateoptsmd) |

___

##### `Optional` init

• **init**? : *function*

Compile static templates and do other static checks

###### Type declaration:

▸ (): *void | Promise‹void›*

___

#####  name

• **name**: *string*

Generator name

___

##### `Optional` preGenerate

• **preGenerate**? : *function*

Add dynamic types to app.
Can be called multiple times

###### Type declaration:

▸ (`app`: [App](#code-genclassesappmd), `data`: object, `options`: [GenerateOpts](#code-geninterfacesgenerateoptsmd)): *void | Promise‹void›*

**Parameters:**

Name | Type |
------ | ------ |
`app` | [App](#code-genclassesappmd) |
`data` | object |
`options` | [GenerateOpts](#code-geninterfacesgenerateoptsmd) |


<a name="code-geninterfacestypepluginmd"></a>

[@lbu/code-gen - v0.0.29](#code-genreadmemd) › [TypePlugin](#code-geninterfacestypepluginmd)

### Interface: TypePlugin ‹**T**›

#### Type parameters

▪ **T**: *[TypeBuilder](#code-genclassestypebuildermd)*

#### Hierarchy

* **TypePlugin**

#### Index

##### Properties

* [class](#class)
* [jsType](#optional-jstype)
* [mock](#optional-mock)
* [name](#name)
* [tsType](#optional-tstype)
* [validator](#optional-validator)

#### Properties

#####  class

• **class**: *T | object*

___

##### `Optional` jsType

• **jsType**? : *function*

Return the template that should be used to create JSDoc for this type

###### Type declaration:

▸ (): *string*

___

##### `Optional` mock

• **mock**? : *function*

Return the template that should be used to mock this type

###### Type declaration:

▸ (): *string*

___

#####  name

• **name**: *string*

___

##### `Optional` tsType

• **tsType**? : *function*

Return the template that should be used to create Typescript types for this type.

###### Type declaration:

▸ (): *string*

___

##### `Optional` validator

• **validator**? : *function*

Return the template that should be used to validate this type

###### Type declaration:

▸ (): *string*

# Insight


<a name="insightreadmemd"></a>

[@lbu/insight - v0.0.29](#insightreadmemd)

## @lbu/insight - v0.0.29

### Index

#### Interfaces

* [LogParserContext](#insightinterfaceslogparsercontextmd)
* [Logger](#insightinterfacesloggermd)
* [LoggerContext](#insightinterfacesloggercontextmd)
* [LoggerOptions](#insightinterfacesloggeroptionsmd)

#### Variables

* [log](#const-log)

#### Functions

* [bindLoggerContext](#bindloggercontext)
* [bytesToHumanReadable](#bytestohumanreadable)
* [executeLogParser](#executelogparser)
* [newLogParserContext](#newlogparsercontext)
* [newLogger](#newlogger)
* [printProcessMemoryUsage](#printprocessmemoryusage)

### Variables

#### `Const` log

• **log**: *[Logger](#insightinterfacesloggermd)*

Standard log instance.
Comes with a depth of 4, prevents printing deeply nested objects

### Functions

####  bindLoggerContext

▸ **bindLoggerContext**‹**T**›(`logger`: [Logger](#insightinterfacesloggermd), `ctx`: T): *[Logger](#insightinterfacesloggermd)*

Bind a context object to the logger functions and returns a new Logger
The context is always printed

**Type parameters:**

▪ **T**: *[LoggerContext](#insightinterfacesloggercontextmd)*

**Parameters:**

Name | Type |
------ | ------ |
`logger` | [Logger](#insightinterfacesloggermd) |
`ctx` | T |

**Returns:** *[Logger](#insightinterfacesloggermd)*

___

####  bytesToHumanReadable

▸ **bytesToHumanReadable**(`bytes?`: number): *string*

Format bytes, with up to 2 digits after the decimal point, in a more human readable way
Support up to a pebibyte

**Parameters:**

Name | Type |
------ | ------ |
`bytes?` | number |

**Returns:** *string*

___

####  executeLogParser

▸ **executeLogParser**(`lpc`: [LogParserContext](#insightinterfaceslogparsercontextmd)): *ReadableStream*

Run the parser, splits the in stream onn lines and call either the jsonProcessor or
textProcessor with the value. The original value is written to the returned stream

**Parameters:**

Name | Type |
------ | ------ |
`lpc` | [LogParserContext](#insightinterfaceslogparsercontextmd) |

**Returns:** *ReadableStream*

___

####  newLogParserContext

▸ **newLogParserContext**(`stream`: ReadableStream): *[LogParserContext](#insightinterfaceslogparsercontextmd)*

Create a new parser context

**Parameters:**

Name | Type |
------ | ------ |
`stream` | ReadableStream |

**Returns:** *[LogParserContext](#insightinterfaceslogparsercontextmd)*

___

####  newLogger

▸ **newLogger**‹**T**›(`options?`: [LoggerOptions](#insightinterfacesloggeroptionsmd)‹T›): *[Logger](#insightinterfacesloggermd)*

Create a new logger

**Type parameters:**

▪ **T**: *[LoggerContext](#insightinterfacesloggercontextmd)*

**Parameters:**

Name | Type |
------ | ------ |
`options?` | [LoggerOptions](#insightinterfacesloggeroptionsmd)‹T› |

**Returns:** *[Logger](#insightinterfacesloggermd)*

___

####  printProcessMemoryUsage

▸ **printProcessMemoryUsage**(`logger`: [Logger](#insightinterfacesloggermd)): *void*

Prints the memory usage of the current process to the provided logger
For more info on the printed properties see:
https://nodejs.org/dist/latest-v13.x/docs/api/process.html#process_process_memoryusage

**Parameters:**

Name | Type |
------ | ------ |
`logger` | [Logger](#insightinterfacesloggermd) |

**Returns:** *void*

## Interfaces


<a name="insightinterfacesloggermd"></a>

[@lbu/insight - v0.0.29](#insightreadmemd) › [Logger](#insightinterfacesloggermd)

### Interface: Logger

The logger only has two severities:
- info
- error

Either a log line is innocent enough and only provides debug information if needed, or
  someone should be paged because something goes wrong. For example handled 500 errors
  don't need any ones attention, but unhandled 500 errors do.

The log functions {@ee Logger#info} only accepts a single parameter. This prevents magic
outputs like automatic concatenating strings in to a single message, or always having a top
level array as a message.

#### Hierarchy

* **Logger**

#### Index

##### Methods

* [error](#error)
* [info](#info)
* [isProduction](#isproduction)

#### Methods

#####  error

▸ **error**(`arg`: any): *void*

**Parameters:**

Name | Type |
------ | ------ |
`arg` | any |

**Returns:** *void*

___

#####  info

▸ **info**(`arg`: any): *void*

**Parameters:**

Name | Type |
------ | ------ |
`arg` | any |

**Returns:** *void*

___

#####  isProduction

▸ **isProduction**(): *boolean*

Check if this logger is using the pretty
  printer or NDJSON printer

**Returns:** *boolean*


<a name="insightinterfacesloggercontextmd"></a>

[@lbu/insight - v0.0.29](#insightreadmemd) › [LoggerContext](#insightinterfacesloggercontextmd)

### Interface: LoggerContext

Context that should be logged in all log lines. e.g
  a common request id.

#### Hierarchy

* **LoggerContext**

#### Index

##### Properties

* [type](#optional-type)

#### Properties

##### `Optional` type

• **type**? : *string*


<a name="insightinterfacesloggeroptionsmd"></a>

[@lbu/insight - v0.0.29](#insightreadmemd) › [LoggerOptions](#insightinterfacesloggeroptionsmd)

### Interface: LoggerOptions ‹**T**›

#### Type parameters

▪ **T**: *[LoggerContext](#insightinterfacesloggercontextmd)*

#### Hierarchy

* **LoggerOptions**

#### Index

##### Properties

* [ctx](#optional-ctx)
* [depth](#optional-depth)
* [pretty](#optional-pretty)
* [stream](#optional-stream)

#### Properties

##### `Optional` ctx

• **ctx**? : *T*

Context that should be logged in all log lines. e.g
  a common request id.

___

##### `Optional` depth

• **depth**? : *number*

Max-depth printed

___

##### `Optional` pretty

• **pretty**? : *boolean*

Use the pretty formatter instead of the NDJSON formatter

___

##### `Optional` stream

• **stream**? : *WritableStream*

The stream to write the logs to


<a name="insightinterfaceslogparsercontextmd"></a>

[@lbu/insight - v0.0.29](#insightreadmemd) › [LogParserContext](#insightinterfaceslogparsercontextmd)

### Interface: LogParserContext

The LogParserContext enables you too analyze logs produced by this Logger

#### Hierarchy

* **LogParserContext**

#### Index

##### Properties

* [jsonProcessor](#optional-jsonprocessor)
* [stream](#stream)
* [textProcessor](#optional-textprocessor)

#### Properties

##### `Optional` jsonProcessor

• **jsonProcessor**? : *function*

###### Type declaration:

▸ (`data`: object): *void*

**Parameters:**

Name | Type |
------ | ------ |
`data` | object |

___

#####  stream

• **stream**: *ReadableStream*

___

##### `Optional` textProcessor

• **textProcessor**? : *function*

###### Type declaration:

▸ (`data`: string): *void*

**Parameters:**

Name | Type |
------ | ------ |
`data` | string |

# Stdlib


<a name="stdlibreadmemd"></a>

[@lbu/stdlib - v0.0.29](#stdlibreadmemd)

## @lbu/stdlib - v0.0.29

### Index

#### Classes

* [AppError](#stdlibclassesapperrormd)

#### Interfaces

* [MainFnCallback](#stdlibinterfacesmainfncallbackmd)
* [ProcessDirectoryOptions](#stdlibinterfacesprocessdirectoryoptionsmd)
* [TemplateContext](#stdlibinterfacestemplatecontextmd)
* [UuidFunc](#stdlibinterfacesuuidfuncmd)

#### Variables

* [uuid](#const-uuid)

#### Functions

* [camelToSnakeCase](#cameltosnakecase)
* [compileTemplate](#compiletemplate)
* [compileTemplateDirectory](#compiletemplatedirectory)
* [compileTemplateDirectorySync](#compiletemplatedirectorysync)
* [dirnameForModule](#dirnameformodule)
* [exec](#exec)
* [executeTemplate](#executetemplate)
* [filenameForModule](#filenameformodule)
* [flatten](#flatten)
* [gc](#gc)
* [getSecondsSinceEpoch](#getsecondssinceepoch)
* [isNil](#isnil)
* [isPlainObject](#isplainobject)
* [mainFn](#mainfn)
* [merge](#merge)
* [neTemplateContext](#netemplatecontext)
* [noop](#noop)
* [pathJoin](#pathjoin)
* [processDirectoryRecursive](#processdirectoryrecursive)
* [processDirectoryRecursiveSync](#processdirectoryrecursivesync)
* [spawn](#spawn)
* [unFlatten](#unflatten)

### Variables

#### `Const` uuid

• **uuid**: *[UuidFunc](#stdlibinterfacesuuidfuncmd)*

Return a new uuid v4

### Functions

####  camelToSnakeCase

▸ **camelToSnakeCase**(`input`: string): *string*

Convert a camelCase string to a snake_case string

```js
  camelToSnakeCase("fooBBar");
  // => "foo_b_bar"
```

**Parameters:**

Name | Type |
------ | ------ |
`input` | string |

**Returns:** *string*

___

####  compileTemplate

▸ **compileTemplate**(`tc`: [TemplateContext](#stdlibinterfacestemplatecontextmd), `name`: string, `str`: string, `opts?`: object): *any*

Compile templates add to TemplateContext.
This function is unsafe for untrusted inputs
Fields need to be explicitly set to undefined or access them via `it.field`
Inspired by: https://johnresig.com/blog/javascript-micro-templating/

**Parameters:**

▪ **tc**: *[TemplateContext](#stdlibinterfacestemplatecontextmd)*

▪ **name**: *string*

Name that is exposed in the template it self and to be used with
  the executeTemplate function

▪ **str**: *string*

Template string

▪`Optional`  **opts**: *object*

Name | Type |
------ | ------ |
`debug?` | boolean |

**Returns:** *any*

___

####  compileTemplateDirectory

▸ **compileTemplateDirectory**(`tc`: [TemplateContext](#stdlibinterfacestemplatecontextmd), `dir`: string, `extension`: string, `opts?`: [ProcessDirectoryOptions](#stdlibinterfacesprocessdirectoryoptionsmd)): *Promise‹void›*

Compile all templates found in the provided directory with the provided extension

**Parameters:**

Name | Type |
------ | ------ |
`tc` | [TemplateContext](#stdlibinterfacestemplatecontextmd) |
`dir` | string |
`extension` | string |
`opts?` | [ProcessDirectoryOptions](#stdlibinterfacesprocessdirectoryoptionsmd) |

**Returns:** *Promise‹void›*

___

####  compileTemplateDirectorySync

▸ **compileTemplateDirectorySync**(`tc`: [TemplateContext](#stdlibinterfacestemplatecontextmd), `dir`: string, `extension`: string, `opts?`: [ProcessDirectoryOptions](#stdlibinterfacesprocessdirectoryoptionsmd)): *void*

Compile all templates found in the provided directory with the provided extension synchronously

**Parameters:**

Name | Type |
------ | ------ |
`tc` | [TemplateContext](#stdlibinterfacestemplatecontextmd) |
`dir` | string |
`extension` | string |
`opts?` | [ProcessDirectoryOptions](#stdlibinterfacesprocessdirectoryoptionsmd) |

**Returns:** *void*

___

####  dirnameForModule

▸ **dirnameForModule**(`meta`: ImportMeta): *string*

Return dirname for ES Module
Alternative to CommonJS __dirname

**Parameters:**

Name | Type |
------ | ------ |
`meta` | ImportMeta |

**Returns:** *string*

___

####  exec

▸ **exec**(`command`: string): *Promise‹object›*

Promisify version of child_process#exec

**Parameters:**

Name | Type |
------ | ------ |
`command` | string |

**Returns:** *Promise‹object›*

___

####  executeTemplate

▸ **executeTemplate**(`tc`: [TemplateContext](#stdlibinterfacestemplatecontextmd), `name`: string, `data`: any): *string*

Execute a template, template should be compiled using compileTemplate

**Parameters:**

Name | Type |
------ | ------ |
`tc` | [TemplateContext](#stdlibinterfacestemplatecontextmd) |
`name` | string |
`data` | any |

**Returns:** *string*

___

####  filenameForModule

▸ **filenameForModule**(`meta`: ImportMeta): *string*

Return filename for ES Module
Alternative to CommonJS __filename

**Parameters:**

Name | Type |
------ | ------ |
`meta` | ImportMeta |

**Returns:** *string*

___

####  flatten

▸ **flatten**(`object`: any, `result?`: any, `path?`: string): *object*

Flattens the given nested object, skipping anything that is not a plain object

**Parameters:**

Name | Type |
------ | ------ |
`object` | any |
`result?` | any |
`path?` | string |

**Returns:** *object*

* \[ **key**: *string*\]: any

___

####  gc

▸ **gc**(): *void*

HACKY
Let V8 know to please run the garbage collector.

**Returns:** *void*

___

####  getSecondsSinceEpoch

▸ **getSecondsSinceEpoch**(): *number*

Return seconds since unix epoch

**Returns:** *number*

___

####  isNil

▸ **isNil**‹**T**›(`value`: T | null | undefined): *value is null | undefined*

Check if item is null or undefined

**Type parameters:**

▪ **T**

**Parameters:**

Name | Type |
------ | ------ |
`value` | T &#124; null &#124; undefined |

**Returns:** *value is null | undefined*

___

####  isPlainObject

▸ **isPlainObject**(`obj`: any): *boolean*

Check if item is a plain javascript object
Not completely bullet proof

**Parameters:**

Name | Type |
------ | ------ |
`obj` | any |

**Returns:** *boolean*

___

####  mainFn

▸ **mainFn**(`meta`: ImportMeta, `logger`: Logger, `cb`: [MainFnCallback](#stdlibinterfacesmainfncallbackmd)): *Promise‹void›*

Run the provided cb if this file is the process entrypoint
Will also load dotenv before executing the provided callback.
Another side effect is that a process listener is added for warnings

**Parameters:**

Name | Type |
------ | ------ |
`meta` | ImportMeta |
`logger` | Logger |
`cb` | [MainFnCallback](#stdlibinterfacesmainfncallbackmd) |

**Returns:** *Promise‹void›*

___

####  merge

▸ **merge**(`object`: any, ...`sources`: any[]): *any*

Re expose lodash.merge
TODO: Note that lodash.merge is deprecated although it doesnt say so when installing
**Note:** This method mutates `object`.

**Parameters:**

Name | Type |
------ | ------ |
`object` | any |
`...sources` | any[] |

**Returns:** *any*

___

####  neTemplateContext

▸ **neTemplateContext**(): *[TemplateContext](#stdlibinterfacestemplatecontextmd)*

Create a new TemplateContext
Adds the `isNil` function as a global

**Returns:** *[TemplateContext](#stdlibinterfacestemplatecontextmd)*

___

####  noop

▸ **noop**(): *void*

An empty function, doing exactly nothing but returning undefined.

**Returns:** *void*

___

####  pathJoin

▸ **pathJoin**(...`parts`: string[]): *string*

Reexport of path#join

**Parameters:**

Name | Type |
------ | ------ |
`...parts` | string[] |

**Returns:** *string*

___

####  processDirectoryRecursive

▸ **processDirectoryRecursive**(`dir`: string, `cb`: function, `opts?`: [ProcessDirectoryOptions](#stdlibinterfacesprocessdirectoryoptionsmd)): *Promise‹void›*

Recursively walks directory async and calls cb on all files

**Parameters:**

▪ **dir**: *string*

▪ **cb**: *function*

▸ (`file`: string): *Promise‹void› | void*

**Parameters:**

Name | Type |
------ | ------ |
`file` | string |

▪`Optional`  **opts**: *[ProcessDirectoryOptions](#stdlibinterfacesprocessdirectoryoptionsmd)*

**Returns:** *Promise‹void›*

___

####  processDirectoryRecursiveSync

▸ **processDirectoryRecursiveSync**(`dir`: string, `cb`: function, `opts?`: [ProcessDirectoryOptions](#stdlibinterfacesprocessdirectoryoptionsmd)): *void*

Recursively walks directory synchronous and calls cb on all files

**Parameters:**

▪ **dir**: *string*

▪ **cb**: *function*

▸ (`file`: string): *void*

**Parameters:**

Name | Type |
------ | ------ |
`file` | string |

▪`Optional`  **opts**: *[ProcessDirectoryOptions](#stdlibinterfacesprocessdirectoryoptionsmd)*

**Returns:** *void*

___

####  spawn

▸ **spawn**(`command`: string, `args`: string[], `opts?`: SpawnOptions): *Promise‹object›*

A promise wrapper around child_process#spawn

**Parameters:**

Name | Type |
------ | ------ |
`command` | string |
`args` | string[] |
`opts?` | SpawnOptions |

**Returns:** *Promise‹object›*

___

####  unFlatten

▸ **unFlatten**(`data?`: object): *any*

Opposite of flatten

**Parameters:**

Name | Type |
------ | ------ |
`data?` | object |

**Returns:** *any*

## Classes


<a name="stdlibclassesapperrormd"></a>

[@lbu/stdlib - v0.0.29](#stdlibreadmemd) › [AppError](#stdlibclassesapperrormd)

### Class: AppError ‹**T**›

AppErrors represent errors, that should immediately stop the request and return a
status and other meta data directly

#### Type parameters

▪ **T**: *any*

#### Hierarchy

* [Error](#static-error)

  ↳ **AppError**

#### Index

##### Constructors

* [constructor](#constructor)

##### Properties

* [info](#info)
* [key](#key)
* [message](#message)
* [name](#name)
* [originalError](#optional-originalerror)
* [stack](#optional-stack)
* [status](#status)
* [Error](#static-error)

##### Methods

* [notFound](#static-notfound)
* [notImplemented](#static-notimplemented)
* [serverError](#static-servererror)
* [validationError](#static-validationerror)

#### Constructors

#####  constructor

\+ **new AppError**(`key`: string, `status`: number, `info?`: T, `originalError?`: [Error](#static-error)): *[AppError](#stdlibclassesapperrormd)*

Create a new AppError

**Parameters:**

Name | Type |
------ | ------ |
`key` | string |
`status` | number |
`info?` | T |
`originalError?` | [Error](#static-error) |

**Returns:** *[AppError](#stdlibclassesapperrormd)*

#### Properties

#####  info

• **info**: *T*

Extra information in the form of an object for the client to use

___

#####  key

• **key**: *string*

Key is preferred to be in the following format
```
  "foo.bar"
  "error.server.notImplemented"
```

___

#####  message

• **message**: *string*

*Inherited from [AppError](#stdlibclassesapperrormd).[message](#message)*

___

#####  name

• **name**: *string*

*Inherited from [AppError](#stdlibclassesapperrormd).[name](#name)*

___

##### `Optional` originalError

• **originalError**? : *[Error](#static-error)*

Optional original error that was thrown

___

##### `Optional` stack

• **stack**? : *string*

*Inherited from [AppError](#stdlibclassesapperrormd).[stack](#optional-stack)*

___

#####  status

• **status**: *number*

Status number to send to the api client

___

##### `Static` Error

▪ **Error**: *ErrorConstructor*

#### Methods

##### `Static` notFound

▸ **notFound**‹**T**›(`info?`: T, `error?`: [Error](#static-error)): *[AppError](#stdlibclassesapperrormd)‹T›*

Create a new 404 not found error

**Type parameters:**

▪ **T**: *any*

**Parameters:**

Name | Type |
------ | ------ |
`info?` | T |
`error?` | [Error](#static-error) |

**Returns:** *[AppError](#stdlibclassesapperrormd)‹T›*

___

##### `Static` notImplemented

▸ **notImplemented**‹**T**›(`info?`: T, `error?`: [Error](#static-error)): *[AppError](#stdlibclassesapperrormd)‹T›*

Create a new 405 not implemented error

**Type parameters:**

▪ **T**: *any*

**Parameters:**

Name | Type |
------ | ------ |
`info?` | T |
`error?` | [Error](#static-error) |

**Returns:** *[AppError](#stdlibclassesapperrormd)‹T›*

___

##### `Static` serverError

▸ **serverError**‹**T**›(`info?`: T, `error?`: [Error](#static-error)): *[AppError](#stdlibclassesapperrormd)‹T›*

Create a new 500 internal server error

**Type parameters:**

▪ **T**: *any*

**Parameters:**

Name | Type |
------ | ------ |
`info?` | T |
`error?` | [Error](#static-error) |

**Returns:** *[AppError](#stdlibclassesapperrormd)‹T›*

___

##### `Static` validationError

▸ **validationError**‹**T**›(`key`: string, `info?`: T, `error?`: [Error](#static-error)): *[AppError](#stdlibclassesapperrormd)‹T›*

Create a new 400 validation error

**Type parameters:**

▪ **T**: *any*

**Parameters:**

Name | Type |
------ | ------ |
`key` | string |
`info?` | T |
`error?` | [Error](#static-error) |

**Returns:** *[AppError](#stdlibclassesapperrormd)‹T›*

## Interfaces


<a name="stdlibinterfacesmainfncallbackmd"></a>

[@lbu/stdlib - v0.0.29](#stdlibreadmemd) › [MainFnCallback](#stdlibinterfacesmainfncallbackmd)

### Interface: MainFnCallback

#### Hierarchy

* **MainFnCallback**

#### Callable

▸ (`logger`: Logger): *void | Promise‹void›*

**Parameters:**

Name | Type |
------ | ------ |
`logger` | Logger |

**Returns:** *void | Promise‹void›*


<a name="stdlibinterfacesprocessdirectoryoptionsmd"></a>

[@lbu/stdlib - v0.0.29](#stdlibreadmemd) › [ProcessDirectoryOptions](#stdlibinterfacesprocessdirectoryoptionsmd)

### Interface: ProcessDirectoryOptions

Options for processDirectoryRecursive and processDirectoryRecursiveSync

#### Hierarchy

* **ProcessDirectoryOptions**

#### Index

##### Properties

* [skipDotFiles](#optional-skipdotfiles)
* [skipNodeModules](#optional-skipnodemodules)

#### Properties

##### `Optional` skipDotFiles

• **skipDotFiles**? : *boolean*

Skip files and directories starting with a '.', true
  by default

___

##### `Optional` skipNodeModules

• **skipNodeModules**? : *boolean*

Skip node_modules directory, true by default


<a name="stdlibinterfacestemplatecontextmd"></a>

[@lbu/stdlib - v0.0.29](#stdlibreadmemd) › [TemplateContext](#stdlibinterfacestemplatecontextmd)

### Interface: TemplateContext

Wraps the state needed for templates
Globals are available to all templates
Templates are also available to all other templates when executing

#### Hierarchy

* **TemplateContext**

#### Index

##### Properties

* [globals](#globals)
* [strict](#strict)
* [templates](#templates)

#### Properties

#####  globals

• **globals**: *object*

Functions available to all templates

###### Type declaration:

* \[ **key**: *string*\]: Function

___

#####  strict

• **strict**: *boolean*

Throw on recompilation of a template
Defaults to 'true'

___

#####  templates

• **templates**: *Map‹string, Function›*

Compiled template functions


<a name="stdlibinterfacesuuidfuncmd"></a>

[@lbu/stdlib - v0.0.29](#stdlibreadmemd) › [UuidFunc](#stdlibinterfacesuuidfuncmd)

### Interface: UuidFunc

#### Hierarchy

* **UuidFunc**

#### Callable

▸ (): *string*

Return a new uuid v4

**Returns:** *string*

#### Index

##### Methods

* [isValid](#isvalid)

#### Methods

#####  isValid

▸ **isValid**(`value`: any): *boolean*

Returns true if value conforms a basic uuid structure.
This check is case-insensitive.

**Parameters:**

Name | Type |
------ | ------ |
`value` | any |

**Returns:** *boolean*