module.exports = function(config) {
    'use strict';

    config.set({
        basePath: '../',
        browsers: [process.env.CI ? 'PhantomJS' : 'Chrome'],
        files: [
            {pattern: 'dist/restful.min.js', included: true},

            {pattern: 'test/promise-mock.js', included: true},

            // test files
            {pattern: 'test/src/**/*.js', included: true},
        ],
        reporters: ['spec'],
        frameworks: ['jasmine'],
    });
};
