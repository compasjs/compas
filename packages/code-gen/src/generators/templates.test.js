import test from "tape";
import { generatorTemplates } from "./templates.js";

const objectToQueryString = new Function(
  `return ${generatorTemplates.globals.objectToQueryString().trim()}`,
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
      "&list[0][item][0]=a&list[0][item][1]=b&list[0][item][2]=c&list[1]=2&list[2]=true",
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
      "&test[firstName]=First&test[lastName]=Last&test[phoneNumber]=0303&test[email]=daniel@ligthbase.nl&test[isViewOnlyBroker]=false&test[disableIpAddressCheck]=true&test[zipCodeRanges][0][item][0]=a&test[zipCodeRanges][0][item][1]=b&test[zipCodeRanges][0][item][2]=c&test[zipCodeRanges][1]=2&test[zipCodeRanges][2]=3",
    );

    t.end();
  });
});
