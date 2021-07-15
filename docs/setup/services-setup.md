# Services setup

A lot of the time you have variables that need a setup, and are then long-lived
while your server is running. A pattern that was often used is to use
singletons, or directly exported values.

This pattern makes testing hard, as these values are not replaceable or mockable
anymore. Because all places use it directly. It also introduces some mental
gymnastics, because primitives like a number behaved differently when required,
than an object.

## ES Module live bindings

Enter ES Module live bindings. ES Module live bindings allow you to export a
variable and in the same file replace it. Let's look at an example.

Create the following file in `src/services/counter.js`

```js
export let counter = undefined;

export function setCounter(newValue) {
  counter = newValue;
}
```

Then using it would look like the following:

```js
import { counter, setCounter } from "./serverices/counter.js";

console.log(counter); // undefined
setCounter(5);
console.log(counter); // 5
```

As you can see, code can use the imported variable directly when doing read
operations. When exporting a ' setXx'-function, you can replace the variable
anytime; when your application is starting up, or replacing it with a mock when
testing. Some useful things to keep as services include a logger, postgres
connection, s3 bucket names, s3 connection and constructed body parsers.
