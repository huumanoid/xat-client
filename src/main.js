'use strict';

const path = require('path');
const fs = require('fs');

const XatUser = require('./core/xat-user.js').XatUser;
const solReader = require('./utils/sol-reader.js');

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
        require('./' + path.join('/mixins/', name)).bind.apply(null, [this].concat(options.slice(1)));
        return this;
    }
}

const fromSol = (fileName, options) => new Promise((resolve, reject) => {
    fs.readFile(fileName, (err, res) => {
        options = options || {};
        if (err) {
            return reject(err);
        }

        const sol = solReader.read(res);
        for (const key in sol) {
          let value = sol[key]
          if (typeof(value) === 'number') {
            sol[key] = value.toString()
          }
        }

        sol.w_k1 = sol.w_k1c
        delete sol.w_k1c

        sol.w_autologin = sol.w_autologin != null ? sol.w_autlogin : 1

        options = Object.assign({}, options, {
            todo: Object.assign({},
                options.todo,
                sol)
        });

        resolve(new ExtendableUser(options));
    });
});

module.exports = {
    XatUser: ExtendableUser,
    fromSol
};
