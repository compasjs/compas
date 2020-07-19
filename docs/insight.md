# Insight

The insight package provides a logger and a few other utilities to make process
information available in the logs. There are a few basic limitations put up to
improve logging:

- There are only two log levels: info and error
- The log methods (`info` and `error`) only accept a single parameter
- The logs are serialized to json in production

The idea is that you don't need more than two log levels for a web server
running in production. A log line is either information that is used for
statistics, e.g. response times, information used for debugging purposes or
something unexpected.

For the first two of the above scenario's we use `info` and for the last one we
use `error`. Then we can have a trigger in the log aggregator that actively
warns when it sees an 'error' log. This also means that we only use error logs
on 500 / 5xx http status codes and not for things like `401` or `404`, since
that is correctly handled already.
