import assign from 'object-assign';

export default function entity(id, data, member) {
    var model = {
        _url: null,

        customUrl(url) {
            if (typeof url === 'undefined') {
                return this._url;
            }

            this._url = url;

            return this;
        },

        one(name, id) {
            return member.one(name, id);
        },

        oneUrl(name, url) {
            this.customUrl(url);

            return this.one(name, null);
        },

        all(name) {
            return member.all(name);
        },

        allUrl(name, url) {
            this.customUrl(url);

            return this.all(name);
        },

        save(headers) {
            return member.put(data, headers);
        },

        remove(headers) {
            return member.delete(headers);
        },

        url() {
            return member.url();
        },

        id() {
            return id;
        },

        data() {
            return data;
        }
    };

    return assign(function () {
        return data;
    }, model);
};
