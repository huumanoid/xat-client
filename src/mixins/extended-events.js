'use strict';

function extendedEvents(user, options) {
    let prefix = options.usePrefix === undefined || options.usePrefix ? 'ee-' : '';
  
    user.on('data', function (data) {
	let types = classifyMessage(JSON.parse(JSON.stringify(data)));
	if (!(types instanceof Array)) {
	    types = [types];
	}
	
	for (let i = 0; i < types.length; ++i) {
	    let type = prefix + types[i].type;
	    user.emit(type, { type: type, xml: data, args: types[i].args });
	}
    });
}


        
function classifyMessage(e) {
    var IsPrivateMessage = false;
    var IsPrivateChat = false;
    var IsNew = false;
    var IsDeleteMessage = undefined;
    var IsGagUser = undefined;
    var IsUnGagUser = undefined;
    var IsMakeUser = undefined;
    var IsUnMakeUser = undefined;
    var IsKickUser = undefined;
    var IsUnknown = undefined;
    var IsControlMessage = undefined;
    var IsLocateUser = undefined;
    var IsAtUser = undefined;
    var IsScroller = undefined;
    var FirstTwo = undefined;
    var IsSlash = undefined;
    if (e != null){

        for (var nodeName in e)
            e.nodeName = nodeName;
	
	if (e.nodeName == "y"){
	    if (e.attributes.C){
		return { type: 'captcha' };
	    };
	    return { type: 'auth-data' };
	} else {
	    if (e.nodeName == "x"){
		return { type: 'app' };
	    } else {
		if (e.nodeName == "a"){
		} else {
		    if (e.nodeName == "bl"){
		    } else {
			if (e.nodeName == "v"){
			    return { type: 'login-result' };
			} else {
			    if (e.nodeName == "ap"){
				return { type: 'assign-power' };
			    } else {
				if (e.nodeName == "gp"){
				    return { type: 'group-powers' };
				} else {
				    if ((((((((e.nodeName == "m")) || ((e.nodeName == "p")))) || ((e.nodeName == "c")))) || ((e.nodeName == "z")))){
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
					    e.attributes.t = "";
					};
					FirstTwo = e.attributes.t.substr(0, 2);
					IsSlash = (FirstTwo.substr(0, 1) == "/");
					if ((((e.nodeName == "p")) || ((e.nodeName == "z")))){
					    IsPrivateMessage = true;
					    if (((IsPrivateMessage) && ((e.attributes.s & 2)))){
						IsPrivateChat = true;
					    };
					    
					    return [{ type: 'private-message' }, 
						{ type: IsPrivateChat ? 'private-message-pc' : 'private-message-pm' },
						{ type: e.nodeName == 'p' ? 'private-message-local' : 'private-message-super' }
					    ];
					};
					if (e.nodeName == "c"){
					    IsControlMessage = true;
					};
					if ((e.attributes.s & 1)){
					    IsNew = false;
					};
					if (((((!(IsSlash)) && ((e.nodeName == "m")))) && ((e.attributes.u == undefined)))){
					    //return;
					};
					if (e.attributes.t.indexOf("<inf7>") != -1){
					    IsSlash = true;
					};
					if (IsSlash){
					    if (FirstTwo == "/d"){
						return { type: 'delete' };
					    };
					    if (FirstTwo == "/s"){
						return { type: 'scroller' };
					    };
					    if ((((e.nodeName == "c")) && ((FirstTwo == "/g")))){
						return { type: 'gag' };
					    };
					    if ((((e.nodeName == "c")) && ((FirstTwo == "/u")))){
						return { type: 'ungag' };
					    };
					    if ((((e.nodeName == "c")) || ((e.nodeName == "p")))){
						if (FirstTwo == "/m"){
						    IsMakeUser = true;//make user
						};
						if (FirstTwo == "/r"){
						    IsUnMakeUser = true;//unmake user
						};
						if (FirstTwo == "/k"){
						    return { type: 'kick' };
						};
					    };
					    if (e.nodeName == "z"){
						if (FirstTwo == "/l"){
						    return { type: 'locate-user' };
						};
						if (FirstTwo == "/a"){
						    return { type: 'at-user'};
						};
					    };
					    if (FirstTwo == "/R"){//typing
						return { type: 'typing' };
					    };
					    if (FirstTwo == "/b"){//friend (learn more!)
					    };
					    if (FirstTwo == "/t"){//ttth
					    };
					    return { type: 'main-chat-message' };
					};
				    } else {
					if (e.nodeName == "g"){
					} else {
					    if ((((e.nodeName == "u")) || ((e.nodeName == "o")))){
						  return [{ type: 'user' }, 
							  { type: e.nodeName == 'u' ? 'user-signin': 'old-user' }						    
						  ];
					    } else {
						if (e.nodeName == "l"){
						    return { type: 'user-signout' };
						} else {
						    if (e.nodeName == "i"){
							return { type: 'chat-meta' };
						    } else {
							if (e.nodeName == "w"){
							    return { type: 'pool-list' };
							} else {
							    if (e.nodeName == "f"){
								return { type: 'online-friends' };
							    } else {
								if (e.nodeName == "k"){
								    return { type: 'not-on-super' };
								} else {
								    if (e.nodeName == "dup"){
									return [ { type: 'dup' }, { type: 'disconnect' }];
								    } else {
									if (e.nodeName == "q"){
									    return [ { type: 'connection-settings' }];
									} else {
									    if (e.nodeName == "logout"){
										return [ { type: 'logout' }, { type: 'disconnect' }];
									    } else {
										if (e.nodeName == "idle"){
										    return [ { type: 'idle' }, { type: 'disconnect' }];
										} else {
										    if (e.nodeName == "abort"){
											return [ { type: 'abort' }, { type: 'disconnect' }];
										    } else {
											if (e.nodeName == "BB"){
											} else {
											    if (e.nodeName == "done"){
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
    };
}


module.exports.bind = extendedEvents;
