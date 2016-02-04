function nooneIsFriend(user, id, data) {
    return false;
}

function everyoneIsFriend(user, id, data) {
    return true;
}

module.exports.bind = function echo(user, opts) {
    opts = opts || {}
    opts.nofollow = opts.nofollow || false
    opts.isFriend = opts.isFriend || noOneIsFriend
    user.on('data', function (data) {
        var node = data.z || data.p
        if (node && node.attributes.t.substr(0, 2) == '/l') {
            user.sendResponseToLocate(node.attributes.u.split('_')[0], opts.isFriend(user, node.attributes.u.split('_')[0], data), opts.nofollow);
        }
    })
}
