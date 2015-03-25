import response from 'model/response';

export default function(serverResponse, memberFactory) {
    return new Promise(function(resolve, reject) {
        var status = serverResponse.status;

        if (status >= 200 && status < 400) {
            return resolve(response(
                serverResponse,
                memberFactory
            ));
        }

        reject(response(serverResponse));
    });
}
