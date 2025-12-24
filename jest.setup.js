// Mock React Native modules before anything else
jest.mock('react-native/Libraries/TurboModule/TurboModuleRegistry', () => ({
  getEnforcing: jest.fn(() => ({})),
  get: jest.fn(() => null),
}));

jest.mock('react-native/Libraries/Utilities/PixelRatio', () => ({
  get: jest.fn(() => 2),
  getFontScale: jest.fn(() => 1),
  getPixelSizeForLayoutSize: jest.fn((size) => size * 2),
  roundToNearestPixel: jest.fn((size) => Math.round(size * 2) / 2),
}));

jest.mock('react-native/Libraries/StyleSheet/StyleSheet', () => ({
  create: jest.fn((styles) => styles),
  flatten: jest.fn((style) => style),
  compose: jest.fn((style1, style2) => [style1, style2]),
}));

jest.mock('react-native/Libraries/Utilities/Dimensions', () => ({
  get: jest.fn(() => ({
    window: { width: 375, height: 812, scale: 2, fontScale: 1 },
    screen: { width: 375, height: 812, scale: 2, fontScale: 1 },
  })),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
}));

jest.mock('react-native/Libraries/BatchedBridge/NativeModules', () => ({
  DevMenu: {
    getConstants: jest.fn(() => ({})),
  },
  DeviceInfo: {
    getConstants: jest.fn(() => ({
      Dimensions: {
        window: { width: 375, height: 812 },
        screen: { width: 375, height: 812 },
      },
    })),
  },
}));


jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  return {
    ...RN,
    Platform: {
      OS: 'ios',
      select: jest.fn((dict) => dict.ios),
    },
    NativeModules: {
      DevMenu: {
        getConstants: jest.fn(() => ({})),
      },
      DeviceInfo: {
        getConstants: jest.fn(() => ({
          Dimensions: {
            window: { width: 375, height: 812 },
            screen: { width: 375, height: 812 },
          },
        })),
      },
    },
    Dimensions: {
      get: jest.fn(() => ({
        window: { width: 375, height: 812, scale: 2, fontScale: 1 },
        screen: { width: 375, height: 812, scale: 2, fontScale: 1 },
      })),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    },
    PixelRatio: {
      get: jest.fn(() => 2),
      getFontScale: jest.fn(() => 1),
      getPixelSizeForLayoutSize: jest.fn((size) => size * 2),
      roundToNearestPixel: jest.fn((size) => Math.round(size * 2) / 2),
    },
  };
});

jest.mock('react-native-fast-image', () => ({
  default: 'FastImage',
  preload: jest.fn(),
}));

jest.mock('react-native-linear-gradient', () => 'LinearGradient');

jest.mock('react-native-vector-icons/Ionicons', () => 'Icon');

jest.mock('react-native-safe-area-context', () => ({
  SafeAreaProvider: ({ children }) => children,
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

jest.mock('@react-navigation/native', () => ({
  NavigationContainer: ({ children }) => children,
  useNavigation: () => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
    setOptions: jest.fn(),
  }),
}));

jest.mock('@react-navigation/native-stack', () => ({
  createNativeStackNavigator: () => ({
    Navigator: ({ children }) => children,
    Screen: ({ children }) => children,
  }),
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}));

jest.mock('react-native-config', () => ({
  default: {
    OMDB_API_KEY: 'test-api-key',
  },
}));

