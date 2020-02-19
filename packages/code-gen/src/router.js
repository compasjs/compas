const init = ({ hasPlugin }) => {
  if (!hasPlugin("validators")) {
    throw new Error("Router requires validators");
  }
};

const run = ({ outputDir }) => {
  console.log(outputDir);
};

const getPlugin = () => ({
  name: "router",
  init,
  run,
});

module.exports = {
  getPlugin,
};
