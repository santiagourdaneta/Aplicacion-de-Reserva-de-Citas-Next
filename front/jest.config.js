module.exports = {
 
  // Define el entorno de prueba para simular un navegador
  testEnvironment: 'jsdom',

  // Ignora las carpetas que no deben ser escaneadas por Jest
  testPathIgnorePatterns: ['/node_modules/', '/e2e/'],

  // Permite resolver alias de rutas como `@/components`
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    // Mockea el CSS para que Jest no falle al importarlo
    '\\.css$': require.resolve('./__mocks__/styleMock.js'),
    // Mockea `react-calendar` si no puedes transformarlo
    'react-calendar': require.resolve('./__mocks__/reactCalendarMock.js'),
  },
};