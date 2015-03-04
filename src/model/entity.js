export default function entity(id, response, member) {
    var model = {
        one(name, id) {
            return member.one(name, id);
        },

        all(name) {
            return member.all(name);
        },

        save(headers) {
            return member.put(response.data, headers);
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
    };

    return Object.assign(function () {
        return response;
    }, model);
};
