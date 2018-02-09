import globals from 'rollup-plugin-node-globals';
import builtins from 'rollup-plugin-node-builtins';
import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';

export default {
    input: 'build/restful.fetch.js',
    output: {
        file: 'dist/restful.js',
        format: 'umd',
        name: 'restful.js'
    },
    plugins: [
        globals(),
        builtins(),
        nodeResolve({
            // use "module" field for ES6 module if possible
            module: true, // Default: true

            // use "jsnext:main" if possible
            // – see https://github.com/rollup/rollup/wiki/jsnext:main
            jsnext: true,  // Default: false

            // use "main" field or index.js, even if it's not an ES6 module
            // (needs to be converted from CommonJS to ES6
            // – see https://github.com/rollup/rollup-plugin-commonjs
            main: true,  // Default: true

            // some package.json files have a `browser` field which
            // specifies alternative files to load for people bundling
            // for the browser. If that's you, use this option, otherwise
            // pkg.browser will be ignored
            browser: true,  // Default: false

            // not all files you want to resolve are .js files
            // extensions: [ '.js', '.json' ],  // Default: ['.js']

            // whether to prefer built-in modules (e.g. `fs`, `path`) or
            // local ones with the same names
            preferBuiltins: true,  // Default: true

            // If true, inspect resolved files to check that they are
            // ES2015 modules
            modulesOnly: false, // Default: false
        }),
        commonjs({
            namedExports: {
                'node_modules/immutable/dist/immutable.js': [ 'fromJS', 'List', 'Map', 'Iterable' ]
            }
        })
    ]
};