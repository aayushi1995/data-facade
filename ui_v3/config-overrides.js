module.exports = function override(webpackConfig) {
    webpackConfig.module.rules.push({
        test: /\.mjs$/,
        include: /node_modules/,
        type: "javascript/auto"
    });
    webpackConfig.plugins = process.env.NODE_ENV === 'production' ? webpackConfig.plugins.filter(
        (plugin) => !(plugin.options && plugin.options.eslintPath)
    ) : webpackConfig.plugins;
    return webpackConfig;
}