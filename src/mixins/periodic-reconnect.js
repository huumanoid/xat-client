'use strict';

/**
 * @param options
 *  interval - interval between reconnects in milliseconds. Default is 2 hours.
 *  only_connected - perform reconnect only if user is connected. Default is false.
 *
 */
function periodic_reconnect(user, options) {
    options = options || {};
    let interval = options.interval || 1000 * 60 * 60 * 2; //2 hours
    let only_connected = options.only_connected || false;

    setInterval(function () {
        if (!only_connected || user.isConnected) {
            user.end();
            user.once('close', function () {
                user.connect();
            });
        }
    }, interval);
}

module.exports.bind = periodic_reconnect;
