import assign from 'object-assign';
import endpoint from 'model/endpoint';
import responseBuilder from 'service/responseBuilder';
import member from 'model/member';
import resource from 'model/resource';

export default function collection(name, parent) {
    let url = parent.customUrl && parent.customUrl() ? parent.customUrl() : [parent.url(), name].join('/');

    let refEndpoint = endpoint(url, parent());

    function refEndpointFactory(id) {
        let _endpoint = endpoint(url + '/' + id, parent());

        // Configure the endpoint
        // We do it this way because the request must have an endpoint which inherits from this collection config
        _endpoint
            .headers(refEndpoint.headers())
            .responseInterceptors(refEndpoint.responseInterceptors())
            .requestInterceptors(refEndpoint.requestInterceptors());

        return _endpoint;
    }

    function memberFactory(id) {
        let _member = member(name, id, parent);

        // Configure the endpoint
        // We do it this way because the response must have a member which inherits from this collection config
        _member()
            .headers(refEndpoint.headers())
            .responseInterceptors(refEndpoint.responseInterceptors())
            .requestInterceptors(refEndpoint.requestInterceptors());

        return _member;
    }

    function _request(config) {
        let reqEndpoint = config.hasOwnProperty('id') ? refEndpointFactory(config.id) : refEndpoint;

        let args = [];

        if (config.hasOwnProperty('data')) {
            args.push(config.data);
        }

        if (config.hasOwnProperty('params')) {
            args.push(config.params);
        }

        if (config.hasOwnProperty('headers')) {
            args.push(config.headers);
        }

        return reqEndpoint[config.method].apply(reqEndpoint, args)
            .then((serverResponse) => {
                return responseBuilder(serverResponse, config.method === 'get' ? memberFactory : undefined);
            });
    }

    let model = {
        get: (id, params, headers) => _request({ method: 'get', id, params, headers }),
        getAll: (params, headers) => _request({ method: 'get', params, headers }),
        post: (data, headers) => _request({ method: 'post', data, headers }),
        put: (id, data, headers) => _request({ method: 'put', id, data, headers }),
        patch: (id, data, headers) => _request({ method: 'patch', id, data, headers }),
        head: (id, headers) => _request({ method: 'head', id, headers }),
        delete: (id, data, headers) => _request({ method: 'delete', id, data, headers }),
        url: () => url,
    };

    return assign(resource(refEndpoint), model);
}
