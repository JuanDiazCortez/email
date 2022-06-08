const nrwlConfig = require("@nrwl/react/plugins/webpack.js");

module.exports = (config, context) => {
  // first call it so that @nrwl/react plugin adds its configs
  nrwlConfig(config);

  return {
    ...config,
    resolve: {
      ...config.resolve,
      alias: {
        ...config.resolve.alias,
        stream: require.resolve('stream-browserify'),
        zlib: require.resolve('browserify-zlib'),  
      }
    }
  };
};