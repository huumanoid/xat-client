'use strict';
var UserRank = require('../core/const.js').UserRank

function rankToString(rank) {
    switch (rank) {
    case UserRank.GUEST:
        return 'r';
    case UserRank.MEMBER:
        return 'e';
    case UserRank.MODERATOR:
        return 'm';
    case UserRank.OWNER:
        return 'M';
    default:
        throw new Exception('InvalidRank');
    }
}

module.exports.bind = userActionsBind;

function userActionsBind(user) {
    user.sendTextMessage = function sendTextMessage(message, options) {
        // compatibility
        if (typeof options === 'boolean') {
            options = { asLink: options };
        }

        options = options || {};
        const asLink = options.asLink || false;

        const hooks = user._NetworkSendMsgHooks;
        const countlinks = hooks.CountLinks;
        hooks.CountLinks = asLink ? _ => 1 : _ => 0;

        const ret = user._NetworkSendMsg(user.todo.w_userno, message, 0);

        hooks.CountLinks = countlinks;
        return ret;
    }
    user.sendPCMessage = function sendPCMessage(options) {
        // compatibility
        if (typeof options === 'string') {
            options = { asLocal: arguments[3], message: arguments[0], destination: arguments[1] };
        }

        options = options || {};
        const asLocal = options.asLocal || false;
        const message = options.message;
        const receiver = options.receiver;
        if (message === undefined || receiver === undefined) {
            throw new Error("unspecified message or destination passed");
        }

        const hooks = user._NetworkSendMsgHooks;
        const onuserlist = hooks.OnUserList;
        hooks.OnUserList = asLocal ? _ => true : _ => false;
        const ret = user._NetworkSendMsg(user.todo.w_userno, message, receiver);
        hooks.OnUserList = onuserlist;
        return ret;
    }
    user.sendPMMessage = function sendPMMessage(options) {
        // compatibility
        if (typeof options === 'string') {
            options = { asLocal: arguments[3], message: arguments[0], destination: arguments[1] };
        }

        options = options || {};
        const asLocal = options.asLocal || false;
        const message = options.message;
        const receiver = options.receiver;
        if (message === undefined || receiver === undefined) {
            throw new Error("unspecified message or destination passed");
        }

        const hooks = user._NetworkSendMsgHooks;
        const onuserlist = hooks.OnUserList;
        hooks.OnUserList = asLocal ? _ => true : _ => false;
        const ret = user._NetworkSendMsg(user.todo.w_userno, message, 0, receiver);
        hooks.OnUserList = onuserlist;
        return ret;
    }
    user.sendLocate = function sendLocate(locating) {
        return user._NetworkSendMsg(user.todo.w_userno, "/l", 0, locating, 0);
    }
    user.sendResponseToLocate = function sendResponseToLocate(responseTo, options) {
        // compatibility
        if (typeof options === 'boolean') {
            options = { isFriend: options, nofollow: arguments[2] };
        }

        options = options || {};
        let isFriend = options.isFriend || false;
        let nofollow = options.nofollow || false;
        let resp = '/a';
        if (nofollow) {
            resp += '_NF';
        } else if (!isFriend) {
            resp += '_';
        }
        return user._NetworkSendMsg(user.todo.w_userno, resp, 0, responseTo);
    }
    user.sendGetFriendStatus = function sendGetFriendStatus(friends) {
        return user.send(`<f ${friends.join(' ')} />`);
    }
    user.makeUser = function makeUser(userno, rank) {
        return user._NetworkSendMsg(user.todo.w_userno, "/" + rankToString(rank), 0, 0, userno);
    }
    user.makeGuest = function makeUser(userno) {
        return user.makeUser(userno, UserRank.GUEST);
    }
    user.makeMember = function makeUser(userno) {
        return user.makeUser(userno, UserRank.MEMBER);
    }
    user.makeModerator = function makeUser(userno, rank) {
        return user.makeUser(userno, UserRank.MODERATOR);
    }
    user.makeOwner = function makeUser(userno, rank) {
        return user.makeUser(userno, UserRank.OWNER);
    }

    user.gagUser = function gagUser(args) {
        return user._NetworkSendMsg(user.todo.w_userno, "/gg" + args.duration, 0, 0, args.userno, args.reason, "");
    }

    user.banUser = function banUser(args) {
        return user._NetworkSendMsg(user.todo.w_userno, "/g" + args.duration, 0, 0, args.userno, args.reason, "", args.puzzle);
    }

    user.muteUser = function muteUser(args) {
        return user._NetworkSendMsg(user.todo.w_userno, "/gm" + args.duration, 0, 0, args.userno, args.reason, "");
    }

    user.unbanUser = function unbanUser(userno){
        return user._NetworkSendMsg(user.todo.w_userno, "/u", 0, 0, userno);
    }

    user.kickUser = function kickUser(userno, reason) {
        return user._NetworkSendMsg(user.todo.w_userno, "/k", 0, 0, userno, reason);
    }
    user.sendKeepAlive = function keepAlive() {
        return user._NetworkSendMsg(user.todo.w_userno, "/KEEPALIVE", 0, 0, 1);
    }

    user.setPool = function setPool(pool) {
        return user.send('<w' + pool + ' />');
    }

    user.sendK2 = function sendK2() {
        return user._NetworkSendMsg(1, "/K2", 0, 0, 1);
    }
}
