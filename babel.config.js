module.exports = {
  presets: [
    [
      'module:metro-react-native-babel-preset',
      {
        disableImportExportTransform: true, // 这里作为 metro-react-native-babel-preset 的配置选项
      },
    ],
  ],
};