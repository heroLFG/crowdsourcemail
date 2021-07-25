const path = require('path');

module.exports = {
  entry: './js/src/app.js',
  output: {
    path: path.resolve(__dirname, 'js/dist'),
    filename: 'app.bundle.js',
  },
};