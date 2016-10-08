# xat-client

# Summary
Node.js implementation of xat client. It's not an application, it's a library. xat-client can be user to build bot or chat client.

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
First word means that you can easily customize core (see more below).
About second word. Sometimes xat may update it's protocol. Futhermore, new version of protocol may be incompatible with previous. Attentive code reader may notice, that there are some reasons what makes easier to patch core. Pray the EcmaScript compatibility/portability!

Details of implemented behavior listed below.

When user connects to chat:
* First, client have to determine ip and port of a server.
* It have to send 'y'-packet with basic authentication info: user id, room, main-owner flag.
* Server sends response to sent 'y'-packet. Response contains some information required to process authentication.
* User responds to server's 'y'-packet with 'j2'-packet. 'j2' packet contains quite full auth information, such as: nickname, avatar, homepage, k1, k3 (security keys), d4, d5,... (info about powers) and so on.
* Server sends current state of chat: settings, last 20 messages, last active users.

So, core implements first, second and fourth steps.
### Custom network transport
By default, xat-client uses tcp-socket, provided by node's net.connect. You can use your own, in case to use TOR/http proxy/something else.

### Determine ip and port
A long time ago, servers ip addresses was hardcoded in xat's client. Now, it download ips (or even domain naimes) from [external address](http://xat.com/web_gear/chat/ip2.php) (information is actual at 16 March 2016).
Actual scheme implemented in file src/core/ippick.js. You can use your own scheme (for example, if xat change ip picking scheme or if you would like to use xat-client for ixat server.

### Forming 'j2'-packet.
Original xat's client preprocesses content of chat.sol and form a response.
Format of 'j2'-packet is not strict, but sensitive in some cases (especially when we form j2-packet for registered/subscriber user).

The most interesing part of this process is that you need to compute 'l5' attribute using pixel's rgb value, get from specially generated image overlapped by perlin noise. Seeds for perlin noise and image settings goes from 'p' attribute of server's 'y'-packet. This is how it's implement in original swp client. However, range of possible parameters, actually used by server, is quite small. So, the solution is to precalculate all required values of 'l5' and store it, for example, in file.

The process described above is customizable.

## Core API
### xat-user options
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
### lurker-timeout
Prevents user from being kicked because of inactivity.
According to xat protocol, every active user sends `<c t="/KEEPALIVE" />` packet sometimes.
This mixin forces client to send KEEPALIVE periodically.
#### options
* interval - how often client sends KEEPALIVE. Default: 9 minutes. That's enougth.
### extended-events
### echo-behavior
### periodic-reconnect

  
[badge-registered]: https://img.shields.io/badge/required--for-registered-blue.svg?style=flat-square
[badge-vip]: https://img.shields.io/badge/required--for-vip-800080.svg?style=flat-square
[badge-ignored]: https://img.shields.io/badge/-ignored-964b00.svg?style=flat-square

