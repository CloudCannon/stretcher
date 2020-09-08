const path = require('path');
const webpack = require('webpack');
const WebpackOnBuildPlugin = require('on-build-webpack');

let outputPath = path.resolve(__dirname, 'dev');

webpack({
    mode: 'production',
    entry: path.resolve(__dirname, 'example.js'),
    output: {
        path: outputPath,
        filename: 'output.js'
    },
    module: {
        rules: [{
            test: /\.scss$/,
            use: [{
                    loader: require.resolve('file-loader'),
                    options: {
                        name: '[path][name].[ext]',
                    }
                }, {
                    loader: require.resolve('extract-loader')
                }, {
                    loader: require.resolve('raw-loader')
                }, {
                	loader: require.resolve('./lib/index.js')
                }
            ]
        }]
    },
    plugins: [
        new WebpackOnBuildPlugin(function() {
            fs.unlinkSync(path.resolve(outputPath, 'output.js'));
        }),
    ],
    watch: true,
    watchOptions: {
        aggregateTimeout: 500,
        ignored: ['.git/**', 'node_modules/**', 'dist/**']
    }
}, (err, stats) => {
    if (err || stats.hasErrors()) {
        console.log("Error");
        console.log(err);
        stats = stats.toJson();
        if (stats.errors) {
            for (let e of stats.errors) {
                console.log(e);
            }
        }
    }
    console.log("Complete.");
});