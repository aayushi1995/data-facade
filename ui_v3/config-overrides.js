const TerserPlugin = require("terser-webpack-plugin");

module.exports = function override(webpackConfig) {
  webpackConfig.module.rules.push({
    test: /\.mjs$/,
    include: /node_modules/,
    type: "javascript/auto",
  });
  webpackConfig.plugins =
    process.env.NODE_ENV === "production"
      ? webpackConfig.plugins.filter(
          (plugin) => !(plugin.options && plugin.options.eslintPath)
        )
      : webpackConfig.plugins;

  if (process.env.NODE_ENV === "production") {
    webpackConfig.optimization = {
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            compress: {
              warnings: false,
              drop_console: true,
              drop_debugger: true
            },
            output: {
              comments: false
            }
          },
        }),
      ],
    };
  }

  webpackConfig.optimization.splitChunks = {
    chunks: "all",
  };

  

  return webpackConfig;
};
