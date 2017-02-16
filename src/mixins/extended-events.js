'use strict'

/*
Each event discribed by name, related data-object and arguments, parsed from it's content.
For example, user-signout event has one argument: user's id.
Arguments are parsed from related data-object.

Options arguments:
usePrefix - switch on/off adding prefix to event names to prevent naming conflicts (default: yes)
*/
function extendedEvents(user, options) {
  options = options || {}
  const prefix = options.usePrefix == null || options.usePrefix ? 'ee-' : ''

  user.on('data', function (data) {
    let types = classifyMessage(data)
    if (!(types instanceof Array)) {
      types = [types]
    }

    for (let i = 0; i < types.length; ++i) {
      const type = prefix + types[i].type
      user.emit(type, { type: type, xml: data, args: types[i].args })
    }
    user.emit('ee-event', {
      xml: data,
      types: types.map(x => x.type),
      args: types.map(x => x.args),
    })
  })
}

function clone(obj) {
  return JSON.parse(JSON.stringify(obj))
}

function classifyMessage(e) {
  /* eslint-disable */
  var IsPrivateMessage = false
  var IsPrivateChat = false
  var IsNew = false
  var IsDeleteMessage = undefined
  var IsGagUser = undefined
  var IsUnGagUser = undefined
  var IsMakeUser = undefined
  var IsUnMakeUser = undefined
  var IsKickUser = undefined
  var IsUnknown = undefined
  var IsControlMessage = undefined
  var IsLocateUser = undefined
  var IsAtUser = undefined
  var IsScroller = undefined
  var FirstTwo = undefined
  var IsSlash = undefined
  /* eslint-enable */

  if (e != null) {
    e = clone(e)

    for (const nodeName in e) {
      e.nodeName = nodeName
      e.attributes = e[nodeName].attributes
    }

    /* eslint-disable */
    if (e.nodeName === 'y'){
        if (e.attributes.C){
            return { type: 'captcha' };
        };
        return { type: 'auth-data' };
    } else {
        if (e.nodeName === 'x'){
            return { type: 'app' };
        } else {
            if (e.nodeName === 'a'){
            } else {
                if (e.nodeName === 'bl'){
                } else {
                    if (e.nodeName === 'v'){
                        return { type: 'login-result' };
                    } else {
                        if (e.nodeName === 'ap'){
                            return { type: 'assign-power' };
                        } else {
                            if (e.nodeName === 'gp'){
                                return { type: 'group-powers' };
                            } else {
                                if ((((((((e.nodeName === 'm')) || ((e.nodeName === 'p')))) || ((e.nodeName === 'c')))) || ((e.nodeName === 'z')))){
                                    IsPrivateMessage = false;
                                    IsPrivateChat = false;
                                    IsNew = true;
                                    IsDeleteMessage = false;
                                    IsGagUser = false;
                                    IsUnGagUser = false;
                                    IsMakeUser = false;
                                    IsUnMakeUser = false;
                                    IsKickUser = false;
                                    IsUnknown = false;
                                    IsControlMessage = false;
                                    IsLocateUser = false;
                                    IsAtUser = false;
                                    IsScroller = false;
                                    if (!e.attributes.t){
                                        e.attributes.t = '';
                                    };
                                    if (e.attributes.t.startsWith('Limit')
                                      && e.attributes.u === '0'
                                      && e.attributes.s === '0') {
                                      let duration = e.attributes.t.split(' ')[1]
                                      if (duration) {
                                        duration = duration.replace('s').trim()
                                        duration = parseInt(duration)
                                        return { type: 'limit', args: {
                                          duration,
                                        }}
                                      }
                                    }
                                    FirstTwo = e.attributes.t.substr(0, 2);
                                    IsSlash = (FirstTwo.substr(0, 1) === '/');
                                    if (!IsSlash && (((e.nodeName === 'p')) || ((e.nodeName === 'z')))){
                                        IsPrivateMessage = true;
                                        if (((IsPrivateMessage) && ((e.attributes.s & 2)))){
                                            IsPrivateChat = true;
                                        };
                                        
                                        return [{ type: 'text-message' },
                                                { type: 'private-message' }, 
                                                { type: IsPrivateChat ? 'private-message-pc' : 'private-message-pm' },
                                                { type: e.nodeName === 'p' ? 'private-message-local' : 'private-message-super' }
                                        ];
                                    };
                                    if (e.nodeName === 'c'){
                                        IsControlMessage = true;
                                    };
                                    if ((e.attributes.s & 1)){
                                        IsNew = false;
                                    };
                                    if (((((!(IsSlash)) && ((e.nodeName === 'm')))) && ((e.attributes.u === undefined)))){
                                        //return;
                                    };
                                    if (e.attributes.t.indexOf('<inf7>') != -1){
                                        IsSlash = true;
                                    };
                                    if (IsSlash){
                                        if (FirstTwo === '/d'){
                                            return { type: 'delete',
                                                args: {
                                                    userId: e.attributes.u,
                                                    deletedId: e.attributes.t.substr(2),
                                                    timestamp: e.attributes.E,
                                                    roomId: e.attributes.r } };
                                        };
                                        if (FirstTwo === '/s'){
                                            return { type: 'scroller',
                                                args: {
                                                    setterId: e.attributes.d,
                                                    scrollerContent: e.attributes.t.substr(2) } };
                                        };
                                        if ((((e.nodeName === 'c')) && ((FirstTwo === '/g')))){
                                            let duration = '0';
                                            let bannedUntil = '0';
                                            if (e.nodeName === 'c') {
                                                bannedUntil = parseInt(e.attributes.t.substr(2));
                                                duration = bannedUntil === 0 ? 0 : (bannedUntil - (new Date().getTime() / 1000 | 0));
                                            } else {
                                                duration = parseInt(e.attributes.t.substr(2));
                                                bannedUntil = (new Date().getTime() / 1000 | 0) + duration;
                                            }

                                            let args = {
                                                reason: e.attributes.p,
                                                banned: e.attributes.d,
                                                bannedBy: e.attributes.u,
                                                duration: duration,
                                                bannedUntil: bannedUntil,
                                            };
                                            return { type: 'control-gag', args };
                                        };
                                        if ((((e.nodeName === 'c')) && ((FirstTwo === '/u')))){
                                            return { type: 'control-ungag', args: {
                                                unbanned: e.attributes.d,
                                                unbannedBy: e.attributes.u,
                                            }};
                                        };
                                        if ((((e.nodeName === 'c')) || ((e.nodeName === 'p')))){
                                            if (FirstTwo === '/m'){
                                                IsMakeUser = true;//make user
                                                return { type: 'control-make-user' };
                                            };
                                            if (FirstTwo === '/r'){
                                                IsUnMakeUser = true;//unmake user
                                                return { type: 'control-unmake-user' };
                                            };
                                            if (FirstTwo === '/k'){
                                                return { type: 'control-kick',
                                                    args: {
                                                        reason: e.attributes.p,
                                                        kickedBy: e.attributes.u,
                                                        kicked: e.attributes.d,
                                                    }};
                                            };
                                        };
                                        if (e.nodeName === 'z'){
                                            if (FirstTwo === '/l'){
                                                return { type: 'locate-user',
                                                    args: {
                                                        sender: e.attributes.u.split('_')[0],
                                                        destination: e.attributes.d,
                                                    } };
                                            };
                                            if (FirstTwo === '/a'){
                                                let loc = e.attributes.t.substr(2);
                                                return { type: 'at-user',
                                                    args: {
                                                        timestamp: e.attributes.E,
                                                        destination: e.attributes.d,
                                                        sender: e.attributes.u.split('_')[0],
                                                        nofollow: loc === '_NF',
                                                        location: loc[0] === '_' ? null : loc.substr(1),
                                                    }};
                                            };
                                        };
                                        if (FirstTwo === '/R'){//typing
                                            return { type: 'typing' };
                                        };
                                        if (FirstTwo === '/b'){//friend (learn more!)
                                        };
                                        if (FirstTwo === '/t'){//ttth
                                        };
                                        if (e.nodeName == "m")
                                        {
                                            if ((((FirstTwo == "/k")) && ((e.attributes.t.charAt(2) == "a"))))
                                            {
                                                IsSlash = false;
                                                return { type: 'kick-all' };
                                            } else
                                            {
                                                if ((((((((((((FirstTwo == "/g")) || ((FirstTwo == "/u")))) || ((FirstTwo == "/m")))) || ((FirstTwo == "/r")))) || ((FirstTwo == "/k")))) || ((FirstTwo == "/n"))))
                                                {
                                                    {
                                                        if (FirstTwo == "/g")
                                                        {
                                                            return { type: 'gag' };
                                                        } else
                                                        {
                                                            if (FirstTwo == "/u")
                                                            {
                                                                return { type: 'ungag' };
                                                            } else
                                                            {
                                                                if (FirstTwo == "/m")
                                                                {
                                                                    return { type: 'make-user' };
                                                                } else
                                                                {
                                                                    if (FirstTwo == "/r")
                                                                    {
                                                                        return { type: 'unmake-user' };
                                                                    } else
                                                                    {
                                                                        if (FirstTwo == "/k")
                                                                        {
                                                                            return { type: 'kick' };
                                                                        } else
                                                                        {
                                                                            if (FirstTwo == "/n")
                                                                            {
                                                                            };
                                                                        };
                                                                    };
                                                                };
                                                            };
                                                        };
                                                        IsSlash = false;
                                                    };
                                                };
                                            };
                                        };
                                        return { type: 'unknown' }
                                    };
                                    let args = { 
                                        message: e.attributes.t, 
                                        sender: (typeof e.attributes.u === 'string' ?  e.attributes.u.split('_')[0] : null), 
                                        timestamp: e.attributes.E,
                                        roomId: e.attributes.r
                                    }
                                    return [{ type: 'text-message', args }, { type: 'main-chat-message', args }];
                                } else {
                                    if (e.nodeName === 'g'){
                                    } else {
                                        if ((((e.nodeName === 'u')) || ((e.nodeName === 'o')))){
                                            let events = [{ type: 'user' }];

                                            if (e.attributes.s & 1) {
                                                events.push({ type: 'old-user' });

                                                events.push(e.nodeName === 'o' ? { type: 'old-user-offline' } : { type: 'old-user-online' });
                                            } else {
                                                events.push({ type: 'user-signin' });
                                            }
                                            return events;
                                        } else {
                                            if (e.nodeName === 'l'){
                                                return { type: 'user-signout', args: { userId: e.attributes.u } };
                                            } else {
                                                if (e.nodeName === 'i'){
                                                    return { type: 'chat-meta', args: {
                                                        background: e.attributes.b,
                                                        botId: e.attributes.B,
                                                        flags: e.attributes.f,
                                                        rank: e.attributes.r,
                                                    }};
                                                } else {
                                                    if (e.nodeName === 'w'){
                                                        return { type: 'pool-list' };
                                                    } else {
                                                        if (e.nodeName === 'f'){
                                                            return { type: 'online-friends' };
                                                        } else {
                                                            if (e.nodeName === 'k'){
                                                                return { type: 'not-on-super' };
                                                            } else {
                                                                if (e.nodeName === 'dup'){
                                                                    return [ { type: 'dup' }, { type: 'disconnect' }];
                                                                } else {
                                                                    if (e.nodeName === 'q'){
                                                                        return [ { type: 'connection-settings' }];
                                                                    } else {
                                                                        if (e.nodeName === 'logout'){
                                                                            return [ { type: 'logout' }, { type: 'disconnect' }];
                                                                        } else {
                                                                            if (e.nodeName === 'idle'){
                                                                                return [ { type: 'idle' }, { type: 'disconnect' }];
                                                                            } else {
                                                                                if (e.nodeName === 'abort'){
                                                                                    return [ { type: 'abort' }, { type: 'disconnect' }];
                                                                                } else {
                                                                                    if (e.nodeName === 'BB'){
                                                                                    } else {
                                                                                        if (e.nodeName === 'done'){
                                                                                            return { type: 'done' };
                                                                                        };
                                                                                    };
                                                                                };
                                                                            };
                                                                        };
                                                                    };
                                                                };
                                                            };
                                                        };
                                                    };
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            };
        };
    };
    /* eslint-enable */
  }
  return { type: 'unknown' }
}

module.exports = {
  bind: extendedEvents,
  classifyMessage,
}
