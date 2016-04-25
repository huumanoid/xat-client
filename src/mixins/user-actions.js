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
    user.sendTextMessage = function sendTextMessage(message, isAsLink) {
        if (isAsLink) {
            message = '/link' + message;
        }
        return user._NetworkSendMsg(user.todo.w_userno, message, 0);
    }
    user.sendPCMessage = function sendPCMessage(message, receiver, isAsLocal) {
        if (isAsLocal)
            message = "/local" + message;
        return user._NetworkSendMsg(user.todo.w_userno, message, receiver);
    }
    user.sendPMMessage = function sendPMMessage(message, receiver, isAsLocal) {
        if (isAsLocal)
            message = "/local" + message;
        return user._NetworkSendMsg(user.todo.w_userno, message, 0, receiver);
    }
    user.sendLocate = function sendLocate(locating) {
        return user._NetworkSendMsg(user.todo.w_userno, "/l", 0, locating, 0);
    }
    user.sendResponseToLocate = function sendResponseToLocate(responseTo, asToFriend, noFollow) {
        return user._NetworkSendMsg(user.todo.w_userno, "/a" + (asToFriend ? "" : (noFollow ? "_NF": "_")), 0, responseTo);
    }
    user.sendGetFriendStatus = function sendGetFriendStatus(friends) {
        var nodeName = 'f';
        for (var i = 0; i < friends.Length; i++)
            nodeName += ' ' + friends[i].ToString();
        return user.send('<' + nodeName + ' />');
    }
    user.makeUser = function makeUser(userno, rank) {
        user._NetworkSendMsg(user.todo.w_userno, "/" + rankToString(rank), 0, 0, userno);
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
        user._NetworkSendMsg(user.todo.w_userno, "/gg" + args.duration, 0, 0, args.userno, args.reason, "");
    }

    user.banUser = function banUser(args, puzzle) {
        user._NetworkSendMsg(user.todo.w_userno, "/g" + args.duration, 0, 0, args.userno, args.reason, "", puzzle);
    }

    user.muteUser = function muteUser(args) {
        user._NetworkSendMsg(user.todo.w_userno, "/gm" + args.duration, 0, 0, args.userno, args.reason, "");
    }

    user.unbanUser = function unbanUser(userno){
        user._NetworkSendMsg(user.todo.w_userno, "/u", 0, 0, userno);
    }

    user.kickUser = function kickUser(userno, reason) {
        user._NetworkSendMsg(user.todo.w_userno, "/k", 0, 0, userno, reason);
    }
    user.sendKeepAlive = function keepAlive() {
        user._NetworkSendMsg(user.todo.w_userno, "/KEEPALIVE", 0, 0, 1);
    }
}
