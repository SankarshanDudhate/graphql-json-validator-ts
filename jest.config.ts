export default {
  testMatch: ['**/**.test.[jt]s'],
  verbose: true,
  transform: {
    '^.+\\.(ts|tsx)?$': 'ts-jest',
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
}
