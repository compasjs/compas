# Store

@lbu/store provides some common abstractions on top of persistent datastores. It
depends on postgres and Minio and provides the following abstractions.

- Forward only postgres migrations
- Postgres client creation
- Minio client creation
- File store
- Various utilities around Minio methods

## Table of contents

- [Postgres migrations](./postgres-migrations.md)
- [File store](./file-store.md)
- [JobQueue](./queue.md)
