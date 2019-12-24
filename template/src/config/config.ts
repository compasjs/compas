export default {
  env: process.env.NODE_ENV,
  myKey: "none",
  codegen: {
    input: "./src/gen/index.ts",
    output: "./src/generated/",
  },
};
