# File handling

Compas also comes with various utilities across the stack to handle files in a
consistent way.

## Generated router & validators

Let's start with looking at the code generators. Here we have the `T.file()`
type to represent files as can be seen in the following examples:

```js
const T = new TypeCreator();
const R = T.router("/");

R.post("/upload")
  .files({
    myFile: T.file(),
  })
  .response({ success: true });

R.get("/download").response(T.file());
```

Files are handled separately by the generator and validators, and are put on
`ctx.validatedFiles` with help from
[formidable](https://www.npmjs.com/package/formidable). In the generated api
clients we generate the correct type (`ReadableStream` or `Blob`) depending on
the context. And allow for setting custom file parsing options
`createBodyParsers` provided by `@compas/server`

## Saving files

`@compas/store` comes with
[Postgres and minio](/features/postgres-and-minio.html) which we let work
together in the various utilities for files.

### `createOrUpdateFile`

Creates a new file and stores it in both Postgres and Minio (S3). If an existing
`id` is provided the file is overwritten. This function only requires a file
name and the source and is able to infer `contentType` and `contentLength`. If
`allowedContentTypes` is provided, an error will be thrown if the inferred
content type is not one of the allowed content types.

**Example**

```js
/**
 *
 * @param {InsightEvent} event
 * @param {AppSaveFileFiles} files
 * @return {Promise<void>}
 */
export async function appSaveFile(event, files) {
  eventStart(event, "app.saveFile");

  await createOrUpdateFile(
    sql,
    minio,
    "myBucket",
    { name: files.uploadedFile.originalFilename },
    files.uploadedFile.filepath,
    {
      allowedContentTypes: ["image/png", "application/x-sql"],
    },
  );

  eventStop(event);
}
```

**Errors**:

- `store.createOrUpdateFile.invalidName` -> When name is not specified.
- `store.createOrUpdateFile.invalidContentType` -> When the content type is not
  one of `allowedContentTypes`.
