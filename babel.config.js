module.exports = function config(api) {
  api.cache(true);

  return {
    presets: ['babel-preset-expo'],
    plugins: ['react-native-reanimated/plugin', '@babel/plugin-proposal-export-namespace-from'],
  };
};
