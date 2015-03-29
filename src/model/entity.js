import assign from 'object-assign';

export default function entity(id, data, member) {
    var model = {
        one(name, id) {
            return member.one(name, id);
        },

        all(name) {
            return member.all(name);
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
