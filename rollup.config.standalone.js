import builtins from 'rollup-plugin-node-builtins';
import config from './rollup.config.js'

config.plugins.push.apply(config.plugins, [
    builtins(),
]);

config.input = 'build/restful.standalone.js';
config.output.file = 'dist/restful.standalone.js';

export default config