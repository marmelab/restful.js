module.exports = {
    entry: {
        restful: './src/index.js',
    },
    module: {
        loaders: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
        }],
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
        }),
    ],
    output: {
        path: './dist',
        filename: '[name].js',
        library: 'restful',
        libraryTarget: 'umd',
    },
};
