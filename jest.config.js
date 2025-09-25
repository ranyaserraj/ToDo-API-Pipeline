module.exports = {
  testEnvironment: 'node',
  testMatch: [
    '**/tasks.unit.test.js',
    '**/tasks.integration.test.js', 
    '**/tasks.performance.test.js'
  ],
  collectCoverageFrom: [
    'server.js',
    'tasks.js',
    '!node_modules/**',
    '!cloud-carbon-footprint/**'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html', 'json', 'clover'],
  verbose: true,
  // Configuration LOURDE pour tests intensifs
  testTimeout: 120000, // 2 minutes par test
  maxWorkers: 1, // Un seul worker pour stress test
  logHeapUsage: true, // Monitoring mémoire
  detectOpenHandles: true, // Détection des fuites
  forceExit: true, // Force l'arrêt
  // Collecte de métriques lourdes
  collectCoverage: true,
  coverageThreshold: {
    global: {
      branches: 40,
      functions: 40,
      lines: 40,
      statements: 40
    }
  },
  // Reporters simples
  reporters: ['default'],
  // Cache désactivé pour tests lourds
  cache: false,
  // Monitoring avancé
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js']
};
