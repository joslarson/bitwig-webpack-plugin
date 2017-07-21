# Bitwig Webpack Plugin

Webpack compatibility layer for Bitwig's scripting environment.

Currently this plugin just adds support for chunking by adding the appropriate ordered `load` calls to the top of entry files.


## Installation

```
npm install --save-dev bitwig-webpack-plugin
```

## Usage

```js
// webpack.config.js
const BitwigWebpackPlugin = require('bitwig-webpack-plugin');

module.exports = {
    ...
    plugins: [
        new BitwigWebpackPlugin(),
        ...
    ],
    ...
}
```
