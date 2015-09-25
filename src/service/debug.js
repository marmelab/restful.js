import assign from 'object-assign';

function emitDebug(payload) {
    const message = assign({
        jsonrpc: '2.0',
        method: 'restful:debug',
    }, payload);

    window.postMessage(message, '*');
}

export default function(endpoint) {
    if (typeof(window) === 'undefined' || !window.addEventListener || !window.postMessage) {
        return;
    }

    endpoint.on('error', (error, config) => {
        const propertiesNames = Object.getOwnPropertyNames(error);
        const serializedError = {};

        for (const i in propertiesNames) {
            if (!propertiesNames.hasOwnProperty(i)) {
                return;
            }

            serializedError[propertiesNames[i]] = error[propertiesNames[i]];
        }

        emitDebug({
            config,
            error: serializedError,
            type: 'error',
            url: endpoint.url(),
        });
    });

    endpoint.on('request', (config) => emitDebug({
        config,
        type: 'request',
        url: endpoint.url(),
    }));

    endpoint.on('response', (response, config) => emitDebug({
        config,
        response: {
            body: response.body(false),
            headers: response.headers(),
            statusCode: response.statusCode(),
        },
        type: 'response',
        url: endpoint.url(),
    }));
}
