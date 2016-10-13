'use strict';
var xInt = require('../core/xatlib.js').xInt;

module.exports.bind = function chatData(user, opts) {
    opts = opts || {}
    
    opts.maxMessages = opts.maxMessages || 1500
    opts.maxUsers = opts.maxUsers || 200
    
    var max_i = 0
    function FindUser(u) {
        let users = user.chatbox.users;
        for (let i = 0; i < users.length; ++i) {
            if (users[i].u === u) {
                return i;
            }
        }
        return -1;
    }
    
    user.chatbox = { 
        users: [],
        messages: [],
        findUser: function (u) {
            let index = FindUser(u)
            return index >= 0 ? user.chatbox.users[index] : null
        },
        findMessage: function (i) {
            let messages = user.chatbox.messages;
            for (let cc = 0; cc < messages.length; ++cc) {
                if (messages[cc].i == i) {
                    return messages[cc];
                }
            }
            return null;
        },
        settings: { },
        pools: [],
        defaultPool: null
    }
    
    
    user.on('data', function (data) {
        var todo = user.todo
        var Users = user.chatbox.users
        var Message = user.chatbox.messages

        var UserIndex;
        var n;
        
        if (data.i) {
            var b = data.i.attributes.b && data.i.attributes.b.split(';=')
            if (b instanceof Array) {
              user.chatbox.settings = {
                  background: b[0] && b[0].split('#')[0] || undefined,
                  radio: b[4],
                  buttonColor: b[5],
                  flagbits: data.i.attributes.f,
                  memberOnly: Boolean(data.i.attributes.f & (128 | 0x100000)),
                  registeredOnly: Boolean(data.i.attributes.f & 0x100000),
                  vipOnly: Boolean(data.i.attributes.f & 0x100000) 
                      && Boolean(data.i.attributes.f & 128),
              }
            }
        }

        if (data.w) {
            let v = data.w.attributes.v.split(' ');
            user.chatbox.pools = v.slice(1);
            user.chatbox.defaultPool = v[0];
        }

        if (data.o || data.u) {
            var e = data.o || data.u
            var u = e.attributes.u
            
            if (e.attributes.n == null || e.attributes.n == undefined) {
                e.attributes.n = "";
            }
            if (e.attributes.a == null || e.attributes.a == undefined) {
                e.attributes.a = "";
            }
            if (e.attributes.h == null || e.attributes.h == undefined) {
                e.attributes.h = "";
            }
            var IsMainOwner = false;
            var IsOwner = false;
            var IsModerator = false;
            var IsMember = false;
            var IsOnline = false;
            var IsBanned = false;
            var IsForever = false;
            var IsGagged = false;
            var IsNew = Boolean(data.u);
            var OnXat = !(((xInt(e.attributes.q) & 1) == 0));
            var IsVIP = ((!(((xInt(e.attributes.f) & 32) == 0))) || (!(((xInt(e.attributes.q) & 2) == 0))));
            var Powers = [];
            if (IsVIP){
                var t = 0;
                while (t < todo.MAX_PWR_INDEX) {
                    Powers.push(xInt(e.attributes[("p" + t)]));
                    t = (t + 1);
                };
            };
            if ((e.attributes.f & 7) == 1){
                IsMainOwner = true;
            };
            if ((e.attributes.f & 7) == 2){
                IsModerator = true;
            };
            if ((e.attributes.f & 7) == 3){
                IsMember = true;
            };
            if ((e.attributes.f & 7) == 4){
                IsOwner = true;
            };
            if (data.u){
                IsOnline = true;
            };
            if ((((e.attributes.s & 1)) || ((e.attributes.f & 8)))){
                IsNew = false;
            };
            if ((e.attributes.f & 16)){
                IsBanned = true;
            };
            if ((e.attributes.f & 64)){
                IsForever = true;
            };
            if ((e.attributes.f & 0x0100)){
                IsGagged = true;
            };
            if (((((((IsNew) && ((todo.w_sound & 1)))) && (!(IsBanned)))) && ((u <= (0x77359400 - 100000))))){
                /*if (((main.ctabsmc.TabIsPrivate()) && (!((main.ctabsmc.TabUser() == u))))){
                } else {
                    todo.DoUserSnd = true;
                };*/
            };
            if (u != todo.w_userno){
                UserIndex = FindUser(u);
                var IsStealth = false;
                if (((!((e.attributes.n == undefined))) && ((e.attributes.n.substr(0, 1) == "attributes")))){
                    IsStealth = ((IsOwner) || (IsMainOwner));
                    e.attributes.n = e.attributes.n.substr(1);
                };
                if (UserIndex == -1){
                    if (e.attributes.n == ""){
                        //e.attributes.n = xatlib.GetDefaultName(u);
                    };
                    if (e.attributes.a == ""){
                        //e.attributes.a = xatlib.GetDefaultAvatar(u);
                    };
                    if (e.attributes.h == ""){
                        e.attributes.h = "";
                    };
                    UserIndex = (Users.push({}) - 1);
                } else {
                };
                Users[UserIndex].n = e.attributes.n;
                Users[UserIndex].s = '';
                Users[UserIndex].v = xInt(e.attributes.v);
                Users[UserIndex].u = u;
                Users[UserIndex].a = e.attributes.a;
                Users[UserIndex].h = e.attributes.h;
                Users[UserIndex].cb = e.attributes.cb;
                Users[UserIndex].online = IsOnline;
                Users[UserIndex].mainowner = IsMainOwner;
                Users[UserIndex].owner = IsOwner;
                Users[UserIndex].moderator = IsModerator;
                Users[UserIndex].member = IsMember;
                Users[UserIndex].onsuper = undefined;
                Users[UserIndex].available = undefined;
                Users[UserIndex].OnXat = OnXat;
                Users[UserIndex].Stealth = IsStealth;
                Users[UserIndex].friend = false;
                Users[UserIndex].registered = e.attributes.N;
                Users[UserIndex].sn = '';
                Users[UserIndex].VIP = IsVIP;
                Users[UserIndex].Powers = Powers;
                Users[UserIndex].Bride = xInt(e.attributes.d2);
                Users[UserIndex].aFlags = xInt(e.attributes.d0);
                Users[UserIndex].flag0 = xInt(e.attributes.f);
                Users[UserIndex].w = xInt(e.attributes.w);
                // AddGiftPower(UserIndex);
                Users[UserIndex].xNum = e.attributes.x;
                if (Users[UserIndex].u == 0xFFFFFFFF){
                    Users[UserIndex].n = (Users[UserIndex].n + " Spectators");
                };
                /*if (((IsNew) && (main.ctabsmc.TabIsPrivate()))){
                    if (w_useroom == w_room){
                        main.ctabsmc.ColorTab(0, 0x9900);
                    } else {
                        if (w_useroom == group){
                            main.ctabsmc.ColorTab(1, 0x9900);
                        };
                    };
                };*//*
                if (UserIndex > -1){
                    Users[UserIndex].banned = IsBanned;
                    Users[UserIndex].forever = IsForever;
                    Users[UserIndex].gagged = IsGagged;
                    len = Message.length;
                    cc = 0;
                    while (cc < len) {
                        if (xatlib.xInt(Message[cc].u) == xatlib.xInt(Users[UserIndex].u)){
                            if (IsBanned){
                                Message[cc].ignored = true;
                            };
                        };
                        cc = (cc + 1);
                    };
                };
                
                if (Users[UserIndex].friend){
                    len = todo.w_friendlist.length;
                    g = 0;
                    while (g < len) {
                        if (todo.w_friendlist[g].u == u){
                            if (((((!((xatlib.StripSpace_(todo.Users[UserIndex].n) == xatlib.StripSpace_(todo.w_friendlist[g].n)))) || (!((todo.Users[UserIndex].a == todo.w_friendlist[g].a))))) || (!((todo.Users[UserIndex].h == todo.w_friendlist[g].h))))){
                                UpdateFriendList(u, ((todo.w_friendlist[g].f) ? todo.w_friendlist[g].f : 1));
                            };
                            break;
                        };
                        g = (g + 1);
                    };
                };
                if (todo.messageecho == "a"){
                    if ((((todo.Users[UserIndex].banned == true)) || (OnIgnoreList(u)))){
                        if (chat.sending_lc){
                            chat.sending_lc.send(chat.fromxat, "onMsg", 4, u, "l");
                        };
                    } else {
                        if (chat.sending_lc){
                            chat.sending_lc.send(chat.fromxat, "onMsg", 4, u, ("u" + e.attributes.a));
                        };
                    };
                };*/
                // if (UserIndex >= opts.maxUsers) {
                    
                // }
            }
        }
        
        if (data.m) {
            if (data.m.attributes.i !== undefined) {
                max_i = data.m.attributes.i === '0' ? max_i + 1 : Math.max(data.m.attributes.i, max_i)
            } 
            var e = data.m
            var u = e.attributes.u
            if (u) {
                u = u.split('_')[0]
            }
            var IsSlash,
            FirstTwo,
            IsPrivateMessage = false,
            IsPrivateChat = false,
            IsNew = true,
            IsDeleteMessage = false,
            IsGagUser = false,
            IsUnGagUser = false,
            IsMakeUser = false,
            IsUnMakeUser = false,
            IsKickUser = false,
            IsUnknown = false,
            IsControlMessage = false,
            IsLocateUser = false,
            IsAtUser = false,
            IsScroller = false,
            IsIgnored = false;
            n = Message.push({
                i:max_i,
                n:max_i,
                t:e.attributes.t,
                u:u,
                ignored:IsIgnored,
                s:e.attributes.s,
                d:((IsPrivateChat) ? u : 0),
                p:IsPrivateMessage,
                pb:e.attributes.pb
            });
            if (Message.length > opts.maxMessages) {
                Message.splice(0, Message.length - opts.maxMessages)
            }
        }
    
    })
}
