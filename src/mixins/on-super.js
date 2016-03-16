
function bind(user, options) {
    options = options || {};
    options.perform_behavior = options.perform.behavior || false;

    user.sendK2 = function userSendK2() {
        return user._NetworkSendMsg(1, '/K2', 0, 0, 1);
    }

    if (options.perform_behavior) {
        user.on_super = user.gotDone
        user.on('data', function (data) {
            if (data.done !== undefined) {
                user.on_super = true
            }
            if (data.k) {
                user.on_super = false
            }
        }).on('close', function () {
            user.on_super = false
        }).on('send', function (data) {
            if (!data.xml) {
                return;
            }

            data = data.xml;

            if (data.c && data.c.attributes.t == '/K2') {
                user.on_super = true;
            }

            if ((!data.c || data.c.attributes.t != '/KEEPALIVE') && user.gotDone 
                    && !user.on_super) {
                user.sendK2();
            }
        })
    }
}

module.exports.bind = bind;
