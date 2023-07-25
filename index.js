const { version } = require("./package.json");
const {
  defaultConfig,
  fetchSavedConfig,
  config,
} = require(`./managers/utils.js`);
const run = require("./managers/run.js");

const main = async () => {
  global.version = version;
  if (!(await fetchSavedConfig())) {
    config.set("voro-cli", defaultConfig);
  }
  global.run = run;
  global.run();
};

main();
