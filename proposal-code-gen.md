# Proposal code-gen

A refactor proposal for @lbu/code-gen

## Goals

- Get an interconnected in memory graph of all types
  - Connected mocks
  - Better SQL generation with join support
- Purpose first code-generation
  - API client should be able to generated types inline
  - Router should be able to generate the needed validators inline
  - SQL should generate the needed types inline

## How

A few things 'need' to change:

- References: The current references supports referring to another type and if
  you are lucky, referring to a field may also work. The reference type was
  build to allow referring to another type without having recursion while
  generating. It also gave the option to reuse another type without having to
  'import' it somehow.

  The new way of referencing should allow for the following:

  - Using a type without having to 'import' it's definition
  - Embedding types: e.g. `User { data: Embed<UserData> }`
  - Soft linking types: e.g `User { data?: Link<UserData> }`
  - Specifying relation type: `1-N, N-1, N-N`

## Some current options

- Add more attributes to reference OR Add different reference types
- Don't ever pass 'structure' down after the initial `App.generate` call by
  referencing everything together e.g. `{ type: "router", routes: [...] }`
