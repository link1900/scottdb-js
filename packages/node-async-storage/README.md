# `@link1900/node-async-storage`

> Node async storage

## Install

Using npm:

```sh
npm install @link1900/node-async-storage
```

or using yarn:

```sh
yarn add @link1900/node-async-storage
```

## Usage

This a smaller wrapper around the nodejs [AsyncLocalStorage](https://nodejs.org/docs/latest-v16.x/api/async_context.html#class-asynclocalstorage) class.
It will create one main storage global that will contain a Map<string, any>. Items can be added to the map can be retrieved later in the call chain without having to pass a parameter reference.

To store a value you need to set them with a key:

```typescript
setLocalItem("requestId", 1);
```

Keys must be a string but value can be any javascript value.

Finally, to retrieve the stored value:

```typescript
getLocalItem("requestId");
// 1
```

⚠️ Warning - setLocalItem() when called from a synchronous function (any non-async function) will have global state.
The best way to think about setLocalItem when called from a normal function is that you are setting a global var i.e `var key = value`.
This can lead to share memory bugs if you are not careful is how it is accessed and used.
This problem does not apply when calling from an async function.

## Examples

### Basic

```typescript
import { getLocalItem, setLocalItem } from "@link1900/node-async-storage";

function run() {
  setLocalItem("someKey", { requestId: 1, context: "other" });
  exampleServiceCall();
}

function exampleServiceCall() {
  console.log(getLocalItem("someKey"));
  // logs { requestId: 1, context: "other" }
}
```

### Multiple values

```typescript
import { getLocalItem, setLocalItem } from "@link1900/node-async-storage";

async function run() {
  setLocalItem("trace", { requestId: 1 });
  setLocalItem("context", "step 1");
  await exampleServiceCall();
}

async function exampleServiceCall() {
  setLocalItem("context", "step 2");
  await exampleRepositoryCall();
}

async function exampleRepositoryCall() {
  console.log(getLocalItem("trace"));
  // { requestId: 1 }
  console.log(getLocalItem("context"));
  // "step 2"
}
```

### Trace logging in express example

Note: this example uses a middleware helper from node-express package.
For a guide on using the trace middleware helper please see [node express readme](../node-express/README.MD)

```typescript
import express from "express";
import { logger } from "@link1900/node-logger";
import { applyTraceMiddleware } from "@link1900/node-express";

const app = express();
app.use(applyTraceMiddleware());

// call with a header x-od-trace-id
app.get("/example", (req, res) => {
  logger.info("log should have trace ids");
  res.json({ success: true });
});

app.listen({ port: 3000 }, () => {
  console.info(`🚀 Server ready`);
});
```
