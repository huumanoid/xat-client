'use strict';



function lurkerTimeout(user, options) {
    setInterval(function () {
        if (user.gotDone) {
            user.sendKeepAlive();
        }
    }, 1000 * 60 * 9);
}

module.exports.bind = lurkerTimeout;
