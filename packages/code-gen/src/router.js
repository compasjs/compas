const init = ({ hasPlugin }) => {
  if (!hasPlugin("validators")) {
    throw new Error("Router requires validators");
  }
};

const generate = ({ outputDir }) => {
  console.log(outputDir);
};

const getPlugin = () => ({
  name: "router",
  init,
  generate,
});

module.exports = {
  getPlugin,
};
