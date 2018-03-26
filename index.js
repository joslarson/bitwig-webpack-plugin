const ConcatSource = require('webpack-sources').ConcatSource;
const sortChunks = require('html-webpack-plugin/lib/chunksorter.js').dependency;

class BitwigWebpackPlugin {
    optimizeChunkAssets(compilation) {
        compilation.plugin('optimize-chunk-assets', (chunks, callback) => {
            const orderedChunks = sortChunks(chunks, compilation.chunkGroups);
            const files = orderedChunks.reduce((result, chunk) => [...result, ...chunk.files], []);
            const entries = files.filter(file => file.match(/\.control\.js$/));
            const commons = files.filter(file => !file.match(/\.control\.js$/));

            entries.forEach(entryFile => {
                const banner = `window = this;\n${commons
                    .map(commonsFile => `load('${commonsFile}');`)
                    .join('\n')}\n`;
                compilation.assets[entryFile] = new ConcatSource(
                    banner,
                    compilation.assets[entryFile]
                );
            });
            callback();
        });
    }
    apply(compiler) {
        // setup hooks for webpack 4
        if (compiler.hooks) {
            compiler.hooks.compilation.tap('BitwigWebpackPlugin', this.optimizeChunkAssets);
        } else {
            compiler.plugin('compilation', this.optimizeChunkAssets);
        }
    }
}

module.exports = BitwigWebpackPlugin;
