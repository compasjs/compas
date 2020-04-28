# File Store

@lbu/store also provides a way to store files in S3 and keeping a reference to
the file in Postgres. This is not designed to be strict about things. The user
should do checks if the user may access or not.

Some features:

- Multiple buckets supported
- Create and 'overwrite' files
- Get file info, file stream or partial file stream
- Delete files
- Sync deleted files to the s3 bucket
