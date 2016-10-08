'use strict';



function lurkerTimeout(user, options) {
    options = options || {};
    var interval = options.interval || 1000 * 60 * 9;
    setInterval(function () {
        if (user.gotDone) {
            user.sendKeepAlive();
        }
    }, interval);
}

module.exports.bind = lurkerTimeout;
