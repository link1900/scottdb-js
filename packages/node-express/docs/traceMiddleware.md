# Trace middleware

The trace middleware is a function that setups an express middleware that will read the configured headers of each
request for that express server (or route depending on how it is configured) and store those header values
into local storage. It will also configure the logger to include those header values is each log out.

This middleware does the following:

* Reads the headers of each request to check if any are trace ids and persists the headers that are to local storage.
* Configures the global logger to check local storage for any saved trace ids and include them in each log.

## Usage

The trace middleware works like any other express middleware. You can apply on the express app using `use` and
before server start.

```typescript
import express from "express";
import { applyTraceMiddleware } from "@link1900/node-express";

const app = express();
app.use(applyTraceMiddleware());
```

⚠️ Warning - unlike other express middlewares this one should only be used at the app level not the route level.
This has to do with the limitations of the local storage that must be cleared for each request otherwise
it will cause issues. See the [stale state example](../examples/staleStateTraceLogging.ts) for why you should not
use this middleware on a route level. If you require different trace logging per route you can do so by making sure
each route is supplied with a `applyTraceMiddleware` that has different settings. There are two ways to do this

_using ignored paths_

```typescript
import express from "express";
import { applyTraceMiddleware } from "@link1900/node-express";

const app = express();
app.use(
  applyTraceMiddleware({
    ignoredPaths: ["/ignoreTraceForPath"]
  })
);
```

_using different config for each route_

```typescript
import express from "express";
import { applyTraceMiddleware } from "@link1900/node-express";

const app = express();

app.get(
  "/example-route-one",
  applyTraceMiddleware({ logMetaDataField: "trace" }),
  someController
);

app.get(
  "/example-route-two",
  applyTraceMiddleware({ logMetaDataField: "requestIds" }),
  someOtherController
);
```

Note that each route must still must have `applyTraceMiddleware`

## Configuration

The middleware takes a number of configuration options to alter it behaviour.
These are passed to the middleware like so:

```typescript
import express from "express";
import { applyTraceMiddleware } from "@link1900/node-express";

const app = express();
app.use(
  applyTraceMiddleware({
    traceHeaders: ["x-some-customer-header"],
    addTraceToLogs: true,
    logMetaDataField: "trace",
    ignoredPaths: ["/ignored-path"],
    addRequestId: true,
    logRequest: true
  })
);
```

### Trace headers mappings

This is option is a list of header key values to check for in the incoming request headers. This value will be spread onto the log.
_field_: traceHeaders
_default value_: ["x-od-trace-id"]
_example_:

```typescript
app.use(applyTraceMiddleware({ traceHeaders: ["x-some-customer-header"] }));
```

will result in the log

```json
{ "message": "some log", "x-extra-header": "value" }
```

for header

```
x-some-customer-header: value
```

### Trace fields added to logs

This is option to control if the trace headers should be added to each log for that request.
_field_: addTraceToLogs
_default value_: true
_example_:

```typescript
app.use(applyTraceMiddleware({ addTraceToLogs: true }));
```

will result in the log

```json
{ "message": "some log", "x-extra-header": "value" }
```

for header

```
x-some-customer-header: value
```

### Log format of the trace fields

This option controls how the trace headers are added to the log statements.
_field_: logMetaDataField
_default value_: true
_example_:

```typescript
app.use(applyTraceMiddleware({ logMetaDataField: "trace" }));
```

will result in the log

```json
{ "message": "some log", "trace": { "x-extra-header": "value" } }
```

for header

```
x-some-customer-header: value
```

### Ignored paths

This option controls which paths are ignored for getting the trace headers.
_field_: ignoredPaths
_default value_: []
_example_:

```typescript
app.use(applyTraceMiddleware({ ignoredPaths: ["/health"] }));
```

will result in the log

```json
{ "message": "some log" }
```

when request path was

```
/health
```

### Add request id

This option if a requestId should be added to each log. This id will be an uuid that is added to each log
regardless of any headers on the request. This value can be considered the id of the request.
_field_: addRequestId
_default value_: true
_example_:

```typescript
app.use(applyTraceMiddleware({ addRequestId: true }));
```

will result in the log

```json
{ "message": "some log", "requestId": "cfe0fd66-4883-4c85-8958-aedf30f56b0d" }
```

### Logging each request

This option enables a log message for each new request.
_field_: logRequest
_default value_: true
_example_:

```typescript
app.use(applyTraceMiddleware({ logRequest: true }));
```

will result in the log

```json
{
  "message": "`[GET][/info] received request`",
  "requestId": "cfe0fd66-4883-4c85-8958-aedf30f56b0d"
}
```

## Examples

* [Express example](../examples/expressTraceLogging.ts)
* [Graphql example](../examples/graphqlTraceLogging.ts)

To run an example then use the following command from the root of this package

```bash
yarn script ./examples/expressTraceLogging.ts
```
