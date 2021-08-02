const ConcatSource = require('webpack-sources').ConcatSource

class BitwigWebpackPlugin {
  apply(compiler) {
    compiler.hooks.thisCompilation.tap('BitwigWebpackPlugin', (compilation) => {
      compilation.hooks.processAssets.tap(
        {
          name: 'BitwigWebpackPlugin',
          stage:
            compiler.webpack.Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE_INLINE,
        },
        () => {
          const entryNames = [...compilation.entrypoints.keys()]
          entryNames.forEach((entryName) => {
            const entryFile = `${entryName}.js`
            const files = compilation.entrypoints
              .get(entryName)
              .getFiles()
              .filter((f) => f !== entryFile)
            const header = `window = globalThis;\n${files
              .map((file) => `load('${file}');`)
              .join('\n')}\n`
            compilation.assets[entryFile] = new ConcatSource(
              header,
              compilation.assets[entryFile]
            )
          })
        }
      )
    })
  }
}

module.exports = BitwigWebpackPlugin
