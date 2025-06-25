const { getDefaultConfig } = require("@expo/metro-config");

module.exports = (() => {
  const config = getDefaultConfig(__dirname);
  const { resolver } = config;

  config.resolver = {
    ...resolver,
    sourceExts: [...resolver.sourceExts, "cjs"], // Support .cjs files for Firebase
    unstable_enablePackageExports: false, // Disable package.json exports for Firebase compatibility
  };

  return config;
})();
