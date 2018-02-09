import config from './rollup.config.js'

config.input = 'build/restful.standalone.js';
config.output.file = 'dist/restful.standalone.js';

export default config