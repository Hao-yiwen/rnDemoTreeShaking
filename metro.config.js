const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');
const path = require('path');

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: true,
        inlineRequires: true,
      },
    }),
    unstable_treeShaking: true,
  },
  watchFolders: [
    path.resolve(__dirname, './node_modules'),
    // Include necessary file paths for `yarn link`ed modules
    path.resolve(__dirname, '/Users/yw.hao/Documents/rn/metro/packages'),
    path.resolve(__dirname, '/Users/yw.hao/Documents/rn/metro/node_modules'),
  ],
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
