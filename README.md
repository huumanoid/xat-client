# xat-client

# Summary
Node.js implementation of xat client. It's not an application, it's a library. xat-client can be used to build bot or chat client.

# Simple example:
```js
var XatUser = require('xat-client').XatUser;

var user = new XatUser({
  todo: { 
    w_userno: 123456,
    w_k1: "deadbeef777",
    w_name: "nickname",
    w_avatar: "42",
    w_useroom: 123
  }
});

user.on('data', function (data) {
  console.log(data);
  if (data.done !== undefined) {
    user.send('<m t="hello!" u="123456" />')
  }
}).on('send', function (data) {
  console.log(data.xml);
});
```

# Design
![design diagram](https://cloud.githubusercontent.com/assets/3264579/1317361/fbe812e8-eba2-11e5-924c-e32d82d7aba5.png)

## Core
Core implements basic behavior for interaction with xat. 
Core designed to be flexible and fast-patchable.

Flexible: you can easily customize core (see more below).

Fast-patchable: sometimes xat may update it's protocol. Futhermore, new version of protocol may be incompatible with previous. Core can be easily patched, for some reasons. Pray the EcmaScript compatibility/portability!

Details of implemented behavior listed below.

When user connects to chat:
* First, client have to determine ip and port of a server.
* It have to send `<y>` packet with basic authentication info: user id, room, main-owner flag.
* Server sends response to sent `<y>` packet. Response contains some information required to process authentication.
* User responds to server's `<y>` packet with `<j2>` packet. `<j2>` packet contains quite full auth information, such as: nickname, avatar, homepage, k1, k3 (security keys), d4, d5,... (info about powers) and so on.
* Server sends current state of chat: settings, last 20 messages, last active users.

So, core implements first, second and fourth steps.

### Custom network transport
By default, xat-client uses tcp-socket, provided by node's net.connect. You can use your own, in case to use TOR/http proxy/something else.

### Determine ip and port
A long time ago, servers ip addresses was hardcoded in xat's client. Now, it download ips (or even domain naimes) from [external address](http://xat.com/web_gear/chat/ip2.php) (information is actual at 16 March 2016).
Actual scheme implemented in file src/core/ippick.js. You can use your own scheme (for example, if xat change ip picking scheme or if you would like to use xat-client for ixat server.

### Forming `<j2>` packet.
`<j2>` packet contains all user's authenication data. Client should send `<j2>` in order to pass authentication on server.
Original xat's client preprocesses content of chat.sol and form `<j2>`.
Format of `<j2>` packet is not strict, but sensitive in some cases (especially when we form `<j2>` packet for registered/subscriber user). [See more.](#xat-user-options)

<a name="perlin-noise"/>The most interesing part of this process is that you need to compute 'l5' attribute using pixel's rgb value, get from specially generated image overlapped by perlin noise. Seeds for perlin noise and image settings goes from 'p' attribute of server's `<y>` packet. This is how it's implement in original swf client. However, range of possible parameters, actually used by server, is quite small. So, the solution is to precalculate all required values of 'l5' and store it, for example, in file.
*Note: idea of implemented solution not belongs to me. Unfortunately, i don't remember, who gave me files with precalculated l5 values, but, anyway, thank you!*

The process described above is customizable.

## Core API
### xat-user options<a name="xat-user-options"/>
`todo` and `global` objects are similar to swf client's ones. This section contains as much options as possible, even if they are not implemented in xat-client or event should be ignored.
* `todo`: complex object, describing user. All values below have `String` type.
  * `w_userno`: id
  * `w_name`: nickname
  * `w_avatar`: avatar. Possible values, acceptable by swf clients: number from [0, 1758], link started with http:// or https://, without 'xat' substring and ended by .jpg, .png or .jpeg., smile code (example: "(cool)").
  * `w_homepage`: homepage. Swf client ignores homepage if it's length < 6.
  * `w_registered`: user's account name,if user registered, otherwise null/undefined. ![only for registered][badge-registered]
  * `w_userrev`: revision, or version of user's profile. In the xat swf client, initially, `w_userrev` is 0, and increments every name/avatar/homepage. Actually, you may ignore this parameter. Moreover, you even may pass arbitrary string to `w_userrev`, server only filters dangerous characters from it.
  * `Macros`:
    * `status`: status, shown below nickname.
    * `avatars`: when "off", do not show avatars. ![ignored][badge-ignored]
    * `animate`: when "off", do not animate smilies. ![ignored][badge-ignored]
    * `blast`: when "off", do not animate blast. ![ignored][badge-ignored]
    * `pcback`: when "off", disables private chat backgrounds. ![ignored][badge-ignored]
    * `flix`: when "off", disables flix chat background animations. ![ignored][badge-ignored]
  * `w_pool`: prefered pool.
  * `pass`: main owner's password from chat.php?id=chatid&pw=pass
  * `w_autologin`: bitmask of profile dialog box checkboxes.
    * +1: setting this bit is equivalent to unckecking "Don't sign me in automatically" in swf client.
    * +2: hide badwords. ![ignored][badge-ignored]
  * `w_k1`: primary auth key (hex value).
  * `w_k2`: web auth key, used for auth in web interactions such as: creating new account, buying xats etc. ![ignored][badge-ignored]
  * `w_k3`: registered auth key. ![required for registered][badge-registered]
  * `w_xats`: amount of xats. ![required for vip][badge-vip]
  * `w_Powers`: which powers does user have (array of masks). If we concat every number of this array in a single binary number, then set N'th bit means user have power with number N. Example: [0x00000001, 0x0, ..., 0x0] means that user has power (topman). ![required for vip][badge-vip]
  * `w_PowerO`: how much powers of each type does user have. Format: "1=105|2=10|3=|4=4|7=2". Explaination: this user has powers with id 1, 2, 3, 4, 7. It has 105 copies of 1, 10 copies of 2, 1 copy of 3, 4 copies of 4 and 2 copies of 7. You should specify all powers user has. You may omit amount, if amount is 1. ![required for vip][badge-vip]
  * `w_d0`: bitmask with some settings. You can't affect on this settings by changing d0 manually. ![required for registered][badge-registered]
    * +1: adds shadow to avatar. Shadow appears once user has edited it's xat.me page.
    * +2^21: user is celebrity (cyan pawn).
    * +2^24: unknown.
  * `w_d1`: when your days are gone (UNIX timestamp) ![required for vip][badge-vip]
  * `w_d2`: BFF/bride id. ![required for registered][badge-registered]
  * `w_d3`: unknown
  * `w_sn`: unknown
  * `w_cb`: unknown
  * `w_dt`: last login time (UNIX timestamp). ![required for registered][badge-registered]
* `global`:
  * `xc`: bitmask
    * +1: unknown ![ignored][badge-ignored]
    * +32: is user on xat or not
    * +0x200: do not sign me in authomatically. ![ignored][badge-ignored]
    * +0x400: unknown ![ignored][badge-ignored]
    * +0x800: unknown ![ignored][badge-ignored]
    * +0x1000: no radio. ![ignored][badge-ignored]
    * +0x2000: no custom sounds. ![ignored][badge-ignored]
    * +0x8000: do not show message history and background. ![ignored][badge-ignored]
* `ippicker`: object which choose ip (hostname) and port for client connection. Object should have method `pickIp`, that takes client and returning thenable promise. On success, promise should be resolved with `{ ip: ipaddress, port: port }`. Default: picker for xat.com.
* `createSocket`: function creates socket for connection. Default: function creates nodejs net.Socket.
* `perlinNoise`: function receives perlin noise parameters, sent by server, and returns perlin noise value.

### xat-user methods
* `connect`: connects client.
* `send`: send packet to server. Takes string or buffer which should be sent. If string taken, it sent with zero byte at the end (according to XMLSocket protocol). If buffer taken, it sent without changes.
* `end`: disconnects client.

### xat-user events
* `connect`: raised when inner socket connected to server.
* `close`:
* `error`.
* `data`: raised when data from server received. Passes parsed xml to listeners. Example: if `<m t="hello, world!' u="42" />` received, then `{ m: { attributes: { t: "Hello, world!", u: "42" }}}` will be passed.
* `send`: raised when something was sent by client.
* `captcha`: raised when client received captcha request.

## Mixins
xat-client mixin modifies lightweight plain xat-client with additional functionality. For instance, "user-actions" mixin adds methods `sendTextMessage`, `sendPCMessage` and others to xat-client object.
Every mixin should be representet as node.js module and exports method `bind(client)`.
Example of mixin:
```javascript
module.exports.bind = (client) => {
    client.on('data', (data) => {
        if (data.m && data.m.attributes.t === 'bang bang!') {
            console.error("I'm calling the police!");
        }
    });
}
```
To apply mixin to client instance, pass client to bind method of mixin's package.
```javascript
require('/path/to/my/custom/mixin.js').bind(client);
```

### user-actions
Adds several methods for interaction with chat.
#### Methods.
* `sendTextMessage`: sends message to main chat.
  * `message`
  * `options`:
    * `asLink`: when user sends link via swl client, client adds 'l' attribute to `<m>`, which prevents message from storing. This options adds 'l' attribute as well. Default: `false`.
* `sendPMMessage`: sends private message to user. 
  * `options`
    * `message`
    * `receiver`
    * `asLocal`: sends `<p>` message instead of `<z>`. `<p>` message reach it's destination only if sender and receiver are in same chat. Probably, it's easier for server to route `<p>` packet rather than `<z>`, but in case sender and receiver are in same chat, both packages routes in the same way. Default: `false`.
* `sendPCMessage`:
  * `options`: same as for sendPMMessage
* `sendLocate`: sends locate (/l) request to user.
  * `userno`: destination.
* `sendResponseToLocate`: sends at (/a) message, that usually responds to locate. 
  * `userno`: destination.
  * `options`: **note: nofollow option is stronger that isFriend. It means, if you set nofollow to true, no matter what is isFriend.**
    * `isFriend`: should response reveal client's location to requester. Default: `false`.
    * `nofollow`: should response state that client has activated (nofollow) power. Works even without power. Default: `false`.
* `sendGetFriendStatus`: sends list of friends whose status (online/offline) we want to know.
  * `friends`: list of friend's ids.
* `makeUser`:
* `makeGuest`: makes user specified by id a guest. 
  * `userno`: id
* `makeMember`:
  * `userno`
* `makeModerator`:
* `makeOwner`:
* `gagUser`:
* `banUser`: ban user.
  * `options`:
    * `userno`: id of user.
    * `duration`: duration of ban in **seconds**. 0 for forever ban.
    * `reason`
    * `puzzle`: id of ban game. Default: no puzzle.
* `muteUser`:
* `unbanUser`: unban user.
  * `userno`
* `kickUser`: kicks user.
  * `userno`
  * `reason`
* `sendKeepAlive`: sends /KEEPALIVE message. [Learn more.](#lurker-timeout)
* `setPool`: sets pool. Sends `<wPOOLID />` packet.
  * `poolId`: id of pool from `<w 0 0 1 2 ... />` packet.
* `sendK2`:

### lurker-timeout<a name="lurker-timeout" />
Prevents user from being kicked because of inactivity.
According to xat protocol, every active user sends `<c t="/KEEPALIVE" />` packet sometimes.
This mixin forces client to send KEEPALIVE periodically.
#### options
* interval - how often client sends KEEPALIVE. Default: 9 minutes. That's enougth.

### extended-events
Makes client emitting more high-level events compared to core `data` event.

### echo-behavior
Makes client responding to locate requests.
#### Options.
  * `nofollow`: if true, user responds NOFOLLOW to any locate request. Default: false.
  * `isFriend`: function decides is sender friend or not. Takes client, sender's userno, packet. Returns Boolean. Default: function returns false.
  
### periodic-reconnect

# Protocol
This section contains knowledge about protocol.
First subsection contains events, actions and corresponding behavior.
Second section contains packet descriptions.

## Events, actions and behaviors.

### Sign in.<a name="sign-in"/>

#### Unregistered user.

#### Guest

#### Registered user.

#### Subscriber user.

#### Don't sign me in automatically.<a name="dont-sign-me-in-automatically"/>
Initiated when client set "f" attribute of `<j2>` to 1.
Client receives all data like in [sign in case](#sign-in), but receives `<logout e="E12" />` instead of `<done />`.
Other clients don't receive `<u>`, but receive `<l>`

### Private messages.

### Locate & At.
Locate procedure used by clients *source* to fetch other client's (*target*) data.

Locate initiated when:
* Source clicks on target.
* Target sends PM/PC message and source's user list doesn't contain target.

Source sends locate packet:
```xml
<z u="sourceid" d="targetid" t="/l" />
```
Target receives this packet and sends at packet.
```xml
<z u="targetid" d ="sourceid" t="{response}"/>
```
* /a\_: when source is not friend of target.
* /a: when source is friend of target.
* /a\_NF: when target activated (nofollow)

Then source receives packet:
```xml
<z u="targetid" d ="sourceid" t="/a{location}" n="target_name" a="target_avatar" ... />
```
At packet contains target's profile data: `w_name`, `w_avatar`, `w_homepage`, `w_registered`, `w_d0`, `w_Powers`, `w_PowerO`, `q`
location can have three values:
* {chat-url}: when sourse is friend of target, location contains url of chat, where target was active the last time.
* \_: when source is not friend of target.
* \_NF: when target activated (nofollow).

### Pools

### Ranks

### Ban & Kick

### Idle

## Packets descriptions

### `<y>`
```xml
<y r="w_useroom" m="{pass !== undefined ? 1 : 0}" v="attempt" u="w_userno" [s="domain" p="port"] />
```
* `v`: number of attempt to connect, optional
* `s`: seems to be ignored.
* `p`: seems to be ignored.

### `<j2>`
```xml
<j2 Y="code" l5="perlinNoise" l4="jt3" l3="jt2" l2="jt1" q="onXat" y="" k="w_k1" k3="w_k3" p="w_pool" c="w_useroom" f="autologin" u="w_userno" n="w_name" a="w_avatar" h="w_homepage" v="w_userrev" b="GetGagTime" cb="w_cb" [e="1" sn="w_sn" N="w_registered" dt="w_dt" d0="w_d0" d1="w_d1" d2="w_d2" d3="w_d3" dx="w_xats" d0="w_PowerO" d[4-MAX_PWR_INDEX]="w_Powers[i-4]" />
```

#### Variables
* `perlinNoise`: [see more](#perlin-noise)
* `code`:
* `jt1`: always 0
* `jt2`: time passed between first attempt to connect and receiving `<y>`
* `jt3`: time passed between receiving `<y>` and sending `<j2>`
* `GetGagTime`:
* `autologin`: bitmask. If `autologin` = 1, [will not sign in automatically](#dont-sign-me-in-automatically).
  * +1: set if user haven't set "Don't sign in automatically".
  * +2: set if Login button pressed.
  * +4: set if pass was defined in flashvars.
* `e`: ?

#### Attributes
* `u`: optional, if specified in `<y>`
* `c`: optional, if specified in `<y r="w_useroom">`
* `f`: optional
* `v`: optional
* `k`: if not specified, chat sends invalid `<i>`, sends `<u u="0".. />` and `<v e="60" />`

### `<i>`
```xml
<i b="{background-url};={related-group-name};={related-group-room};=?;={radio-url};={buttoncolor}" f="FlagBits" cb="?" r="rank" B="bot_userno"/>
```

### `<gp>`
```xml
<gp p="group-powers-mask" gN1="settings of power N1" gN2="settings of power N2" />
```
* g74: (gline) list of smiles separated by commas: `smile1,smile2,..,smile12`
* g80: (gcontrol) chat gcontrol settings distinct with default ones.
* g90: (bad) list of bad words separated by commas.
* g96: (winter) winter flix.
* g100: (link) list of keywords followed by [bit.ly](//bit.ly) short links. e.g. "foo,1q2w3e,bar,2w3e4r". Example of bitly link: http://bit.ly/*1bdDlXc*
* g106: (gscol) code of color, appended to every smile in chat, e.g. "#clear"
* g112: (announce) welcome string.
* g114: (rankpool)
  * `m`: main pool name
  * `t`: private pool name
  * `rnk`: private pool required rank. Type: `Rank.No`
  * `b`: ban pool name (banpool). Type: `String`
  * `brk`: ban pool required rank of not banned user. Type: `Rank.No`
  * `v`: ?
* g180: (gsound) names of corresponding sounds
  * `m`: sound when someone sends message.
  * `d`: user sign in sound
  * `t`: tab sound
* g188: (doodlerace)
  * `st`: ?
  * `o`: ?
  * `v`: ?
* game: (g192), (g246), (g256) (g238). All possible fields listed below. Some games don't have some of this fields. Fields with default value are omited.
  * `rnk`: required rank to start game. Type: `Rank.No`
  * `dt`: default play time. Type: `Seconds`.
  * `lv`: default level. Type: `Integer`.
  * `rt`: default result display time. Type: `Seconds`.
  * `rc`: game type - race (not sure). Value: 1
  * `tg`: target score
  * `pz`: prize (rank).
  * `v`: ?
* g252: (redirect)
  * `id`: groupname of location
  * `v`: ?

### `<u>`

### `<o>`

### `<l>`
```xml
<l u="w_userno" />
```

### `<m>`
```xml
<m [u="{w_userno}_{w_userrev}"] t="message" [l="1"]/>
```
```xml
<m u="w_userno" d="w_userno" t="/m" p="rank" />
```

### `<p>`

### `<z>`

### `<x>`

### `<done>`

### `<logout>`
```xml
<logout e="error-code" />
```
* E03: incorrect `<j2 y="value" />`/ userno or room wasn't specified both in `<y>` and `<j2>`
* E07: `<j2 k="w_k1" />` omitted / `<j2 k="w_k1" u="w_userno" />` incorrect (with `<v e="60" />`)
* E12: [don't sign me in automatically](#dont-sign-me-in-automatically)
* E25: incorrect `<j2 l5="{perlin-noise}" k3="w_k3" />`
* E36-38: protect activated

### `<idle>`
```xml
<idle e="error-code" />
```
* I04: guest user idle. Comes after 1 minune from connection
* I01: regular user idle.

### `<q>`

### `<dup>`



[badge-registered]: https://img.shields.io/badge/required--for-registered-blue.svg?style=flat-square
[badge-vip]: https://img.shields.io/badge/required--for-vip-800080.svg?style=flat-square
[badge-ignored]: https://img.shields.io/badge/-ignored-964b00.svg?style=flat-square
