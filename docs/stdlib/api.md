# @lbu/stdlib API

**AppError**

Standard error class for Application errors that can propagate to the client.

**AppError#constructor(key, status, info?, originalError?)**

Create a new AppError instance.

**AppError#notFound(info?, error?)**

Return a `404 Not Found` error.

**AppError#notImplemented(info?, error?)**

Return a `405 Not Implemented` error.

**AppError#serverError(info?, error?)**

Return a `500 Internal Server Error` error

**AppError#validationError(key, info?, error?)**

Return a `400 Bad Request` error
