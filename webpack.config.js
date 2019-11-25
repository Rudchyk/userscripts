const path = require('path');

module.exports = {
  entry: {
    lora: __dirname + '/src/lora.js',
    jira: __dirname + '/src/jira.js'
  },
  mode: 'production',
  watch: true,
  watchOptions: {
    ignored: /node_modules/
  },
  output: {
    filename: '[name].js',
    path: __dirname + '/dist'
  }
};