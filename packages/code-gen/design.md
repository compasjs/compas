# Code gen redesign

### Goals

- Compatible with current structure and way of inputs
- Mostly compatible with current outputs, improving and correcting where
  necessary
- Align current generators, don't support loading of external generators or
  custom types
- Fix type issues all alround
- Fix database relations

### Database relation design

Drop relations as they are currently and implement the following:

- On `T.object()` add method `.relations()`
- `T.oneToMany("key1", reference)`: (1) side of 1 - many
- `T.manyToOne("key2", reference, "key1")`: (m) side of many - 1. Containers
  reference to reference->key1. Never dangling
- `T.oneToOne("key3", reference, "key1")`: (1) side of 1 - 1. Contains reference
  to reference->key1. Never dangling. Other side automatically filled in.
- `T.manyToOne("key2", reference, "key1").optional()`: (m) side of many - 1.
  Containers reference to reference->key1. May dangle
- `T.oneToOne("key3", reference, "key1").optional()`: (1) side of 1 - 1.
  Contains reference to reference->key1. May dangle. Other side automatically
  filled in

### SQL Generation

Cleanly generate the basics:

- Select, Insert, Update, Delete
- Skip upserts for now
- Soft deletes need manual cascading soft deletes. Possible disabling it with a
  `{ skipCascading: true }`

### Generator design

More of a top down approach, or something like that. Move all logic to JS. More
extensive type generator, based on context. We start by building everything in a
graph, this also means the different generators can choose in reusing types or
not depending on the context. We try to make all generated files Typescript
compatible.

Random things:

- Build a full graph
- apiClient, reactQuery & validator file per group, with index.js exports
- Router stays single file since tree building.
- SQL can be whatever
- Reuse type definition functions, will probably get 'out-of-hand' real quick,
  but it's a goal to make it all correct.

### Breaking changes

- Both side of oneToMany / manyToOnes are required. However need less
  information per call. Also top level on `T.`
- Some exports may be defined in different files
