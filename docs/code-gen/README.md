# Code generator

The code generator provides various generators to generate code across a common
interface. Say that you want to build an api. You would have to create the
routers, validators, documentation and various other bits and pieces. The code
generators will help you with that. By using a programmatic fluent interface for
type declarations the core code generators can currently generate a router,
JSDoc or Typescript types, validators, mocks and an api client. The consumers of
your api can then access the api structure and generate the same api client.

## Table of Contents:

- [Custom types](./custom-types.md)

## Compared to...

- OpenAPI: Generators want to provide a structure, but once you generate again,
  all your work is lost. (Note this may be incorrect at the time...) Also the
  flexibility of adding custom types for your domain is not there. And the
  writing of the spec compliant document is a daunting task.

- GraphQL: GraphQL code generators often provide types and a scaffold to
  implement resolvers. Scalars are about the same as custom types in
  @lbu/code-gen. The main point missing is integrated validators that do more
  than just a nullability & structural check

- Prisma: Prisma dictates a lot about your database schema. It also at the time
  of writing missed transactions, and is more usable as read-only endpoint in
  for example Next.js applications
