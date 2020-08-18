import test from "tape";
import { generatorTemplates } from "./templates.js";

const objectToQueryString = new Function(
  `return ${generatorTemplates.globals.objectToQueryString()}`,
)();

test("code-gen/generators/templates", (t) => {
  t.test("objectToQueryString | arrays", (t) => {
    // array
    t.equal(
      objectToQueryString("bar", [1, 2, 3]),
      "&bar[0]=1&bar[1]=2&bar[2]=3",
    );

    // array with mixed items
    t.equal(
      objectToQueryString("list", [{ item: ["a", "b", "c"] }, 2, true]),
      "&list[0][item]=&list[0][item][0]=a&list[0][item][1]=b&list[0][item][2]=c&list[1]=2&list[2]=true",
    );

    // object with mixed values; arrays, booleans
    t.equal(
      objectToQueryString("test", {
        firstName: "First",
        lastName: "Last",
        phoneNumber: "0303",
        email: "daniel@ligthbase.nl",
        isViewOnlyBroker: "false",
        disableIpAddressCheck: "true",
        zipCodeRanges: [{ item: ["a", "b", "c"] }, 2, 3],
      }),
      "&test[0][firstName]=First&test[0][lastName]=Last&test[0][phoneNumber]=0303&test[0][email]=daniel@ligthbase.nl&test[0][isViewOnlyBroker]=false&test[0][disableIpAddressCheck]=true&test[0][zipCodeRanges]=&test[0][item]=&test[0][item][0]=a&test[0][item][1]=b&test[0][item][2]=c&test[1]=2&test[2]=3",
    );

    t.end();
  });
});
