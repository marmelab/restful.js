/* eslint-disable no-console */
export default function debug(type, data, config) {
    const logger = type === 'error' ? 'error' : 'log';

    if (!console.groupCollapsed) {
        if (data) {
            return console[logger](type, config.method.toUpperCase(), config.url, data, config);
        }

        return console[logger](type, config.method.toUpperCase(), config.url, config);
    }

    if (data) {
        console[logger](type, config.method.toUpperCase(), config.url, data);
    } else {
        console[logger](type, config.method.toUpperCase(), config.url);
    }

    console.groupCollapsed('config');
    for (let i in config) { // eslint-disable-line prefer-const
        if (!config.hasOwnProperty(i)) {
            continue;
        }

        console.log(i, config[i]);
    }
    console.groupEnd();
}
