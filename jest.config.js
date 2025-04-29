module.exports = {
  preset: 'jest-expo',
  setupFiles: ['<rootDir>/jest.setup.js'],
  setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?react-native|@react-native|@react-navigation|expo(nent)?|@expo|expo-font|react-native-safe-area-context|@react-native-community|@react-native-async-storage|@react-native-picker)'
  ],
  testPathIgnorePatterns: ['/node_modules/', '/android/', '/ios/'],
};
