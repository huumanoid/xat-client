'use strict';

const path = require('path');
const XatUser = require('./src/core/xat-user.js').XatUser;

class ExtendableUser extends XatUser {
    constructor(options) {
        super(options);
    }

    addExtension(name) {
        if (name.indexOf('.js') !== name.length - 3) {
            name += '.js';
        }
        let options = [];
        for (let key in arguments) {
            options[key] = arguments[key];
        }
        require('./' + path.join('src/mixins/', name)).bind.apply(null, [this].concat(options.slice(1)));
    }
}

module.exports.XatUser = ExtendableUser;

