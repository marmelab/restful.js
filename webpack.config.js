module.exports = {
    entry: {
        restful: './src/restful.js',
    },
    module: {
        loaders: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
        }],
    },
    output: {
        path: './dist',
        filename: '[name].js',
        library: 'restful',
        libraryTarget: 'umd',
    },
};
