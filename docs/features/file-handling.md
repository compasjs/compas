# File handling

Compas also comes with various utilities across the stack to handle files in a
consistent way. See the [file-handling](/examples/file-handling.html) example
for a project implementing this.

## Generated router & validators

Let's start with looking at the code generators. Here we have the `T.file()`
type to represent files as can be seen in the following examples:

```js
const T = new TypeCreator();
const R = T.router("/");

R.post("/upload")
  .body({
    myFile: T.file(),
  })
  .response({ success: true });

R.get("/download").response(T.file());
```

Files are handled like any other 'POST'-body in Compas, but have some
restrictions. When a `T.file()` is used, we automatically switch the request
encoding to use `multipart/form-data` instead of `application/json`. We also add
restrictions on what other fields we can accept in the same request body. This
is limited to only use 'simple' types like `T.uuid()`, `T.string()`,
`T.number()`, `T.bool()`.

The generated api clients automatically determine which type it should generated
for the target library and runtime. For Fetch clients we use `Blob`, but for an
Axios & Node.js target, we generate a `ReadableStream` based type.

The default body parser created via `createBodyParser`, from `@compas/server`,
doesn't parse `multipart/form-data` by default. You can enable this via the
`multipart: true` option, and customize limitations via the `multipartOptions`
option.

## Saving files

`@compas/store` comes with [Postgres and S3](/features/postgres-and-s3.html)
which we combine in the various utilities for working with files.

### `fileCreateOrUpdate`

Creates a new file and stores it in both Postgres and S3. If an existing `id` is
provided the file is overwritten. This function only requires a file name and
the source and is able to infer `contentType` and `contentLength`. If
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

  await fileCreateOrUpdate(
    sql,
    s3Client,
    {
      bucketName: "my-bucket",
      allowedContentTypes: ["image/png", "application/x-sql"],
      schedulePlaceholderImageJob: true,
    },
    { name: files.uploadedFile.originalFilename },
    files.uploadedFile.filepath,
  );

  eventStop(event);
}
```

For placeholder image generation, the
[jobFileGeneratePlaceholderImage](/features/background-jobs.html#jobfilegenerateplaceholderimage)
needs to be used.

**Errors**:

- `file.createOrUpdate.invalidName` -> When name is not specified.
- `file.createOrUpdate.invalidContentType` -> When the content type is not one
  of `allowedContentTypes`.

## Securing file downloads

In some cases you want to have private files as well, you can accomplish this by
using `fileSignAccessToken` and `fileVerifyAccessToken`. When returning an image
url to the client, you can add a JWT based token to the url specific for that
file id, and with a short expiration date via `fileSignAccessToken`. Then, when
the user requests the file, `fileVerifyAccessToken` can be used to check if the
token is still valid and issued for that file id.

Let's look at a quick example;

**Definition**:

```js
const T = new TypeCreator();
const R = T.router("/");

R.get("/product", "getProduct").response({
  publicImageUrl: T.string(),
  privateAvatarUrl: T.string(),
});

R.get("/product/public-image", "publicImage").response(T.file());

R.get("/product/private-avatar", "privateAvatar")
  .query({
    accessToken: T.string(),
  })
  .response(T.file());
```

**Implementation**:

```js
// For the example :)
const [publicImage] = (
  await queryFile({
    where: {
      id: uuid(),
    },
  }).exec(sql)
)[0];
const [privateImage] = (
  await queryFile({
    where: {
      id: uuid(),
    },
  }).exec(sql)
)[0];

appController.getProduct = (ctx) => {
  // Do user checks here, so see if the privateAvatarUrl should be added.

  ctx.body = {
    publicImage: fileFormatMetadata(publicImage, {
      url: "https://example.com/product/public-image",
    }),
    privateImage: fileFormatMetadata(privateImage, {
      url: "https://example.com/product/private-image",
      signAccessToken: {
        signingKey: "secure key loaded from secure place",
        maxAgeInSeconds: 2 * 60, // User should load the image in 2 minutes
      },
    }),
  };
};

appController.publicImage = async (ctx) => {
  const file = await queryFile({ where: { id: publicImage.id } }).exec(sql);

  await fileSendResponse(s3Client, ctx, file);
};

appController.privateAvatar = async (ctx) => {
  const file = await queryFile({ where: { id: privateAvatar.id } }).exec(sql);

  // Throws if expired or invalid
  fileVerifyAccessToken({
    signingKey: "secure key loaded from secure place",
    expectedFileId: file.id,
    fileAccessToken: ctx.validatedQuery.accessToken,
  });

  await fileSendTransformedImageResponse(sql, s3Client, ctx, file);
};
```

An important note is that the tokens can't be revoked. So if you have that
requirement there are two options;

- Keep a blacklist of tokens somewhere
- Regenerate the `signingKey`, rendering all tokens invalid.

## Unified file responses

For a more complete metadata object to return from your api's, you can use
`StoreFileResponse`. It contains various properties, like the content type,
name, and if applicable, the image placeholder. To format this response object,
you could call `fileFormatMetadata`. It allows for formatting a secure file url
as well via its accepted options.
