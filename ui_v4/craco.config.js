const CracoAlias = require("craco-alias");

module.exports = {
  useBabelConfig: true,
  plugins: [
    {
      plugin: CracoAlias,
      options: {
        source: "tsconfig",
        baseUrl: ".",
        tsConfigPath: "./tsconfig.path.json",
      },
    },
  ],
};
