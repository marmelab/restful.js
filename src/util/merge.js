'use strict';

function merge(master, slave) {
    var merged = {};

    for (var i in slave) {
        merged[i] = slave[i];
    }

    for (var i in master) {
        merged[i] = master[i];
    }

    return merged;
}

module.exports = merge;
