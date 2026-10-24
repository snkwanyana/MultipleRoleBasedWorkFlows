module.exports = {
  default: {
    paths: ['features/**/*.feature'],
    requireModule: ['dotenv/config', 'ts-node/register'],
    require: ['src/stepdefinitions/**/*.ts', 'src/support/**/*.ts'],
    format: ['progress', 'allure-cucumberjs/reporter'],
    formatOptions: {
      resultsDir: 'allure-results',
    },
    publishQuiet: true,
  },
};
