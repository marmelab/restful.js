module.exports = function(config) {
    config.set({
        browsers: ['PhantomJS'],
        files: [
            { pattern: 'test-context.js', watched: false }
        ],
        frameworks: ['jasmine'],
        preprocessors: {
            'test-context.js': ['webpack']
        },
        reporters: ['spec'],
        webpack: {
            module: {
                loaders: [
                    { test: /\.js/, exclude: /node_modules/, loader: 'babel-loader' }
                ]
            },
            resolve:{
                modulesDirectories: [
                    '../node_modules',
                    '../src',
                ]
            },
            watch: true
        },
        webpackServer: {
            noInfo: true
        }
    });
};
