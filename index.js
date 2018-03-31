const ConcatSource = require('webpack-sources').ConcatSource;
const sortChunks = require('html-webpack-plugin/lib/chunksorter.js').dependency;

class BitwigWebpackPlugin {
    optimizeChunkAssets(compilation, chunks) {
        const orderedChunks = sortChunks(chunks, compilation.chunkGroups);
        const files = orderedChunks.reduce((result, chunk) => [...result, ...chunk.files], []);
        const entries = files.filter(file => file.match(/\.control\.js$/));
        const commons = files.filter(file => !file.match(/\.control\.js$/));

        entries.forEach(entryFile => {
            const banner = `window = this;\n${commons
                .map(commonsFile => `load('${commonsFile}');`)
                .join('\n')}\n`;
            compilation.assets[entryFile] = new ConcatSource(banner, compilation.assets[entryFile]);
        });
    }

    apply(compiler) {
        if (compiler.hooks) {
            // setup hooks for webpack 4+
            compiler.hooks.compilation.tap('BitwigWebpackPlugin', compilation =>
                compilation.hooks.optimizeChunkAssets.tap('BitwigWebpackPlugin', chunks =>
                    this.optimizeChunkAssets(compilation, chunks)
                )
            );
        } else {
            // setup hooks for pre webpack 4
            compiler.plugin('compilation', compilation =>
                compilation.plugin('optimize-chunk-assets', (chunks, callback) => {
                    this.optimizeChunkAssets(compilation, chunks);
                    callback();
                })
            );
        }
    }
}

module.exports = BitwigWebpackPlugin;
