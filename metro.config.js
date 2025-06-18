const { getDefaultConfig } = require("@expo/metro-config");

module.exports = (() => {
  const config = getDefaultConfig(__dirname);
  const { resolver } = config;

  config.resolver = {
    ...resolver,
    sourceExts: [...resolver.sourceExts, "cjs"], // Support .cjs for Firebase
    unstable_enablePackageExports: false, // Disable package.json exports
    resolveRequest: (context, moduleName, platform) => {
      // Fallback for native modules if needed
      if (moduleName.startsWith("react-native/")) {
        return context.resolveRequest(context, `react-native`, platform);
      }
      return context.resolveRequest(context, moduleName, platform);
    },
  };

  return config;
})();
