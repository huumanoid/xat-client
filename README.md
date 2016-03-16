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
![design diagram](https://cloud.githubusercontent.com/assets/3264579/13817361/fbe812e8-eba2-11e5-924c-e32d82d7aba5.png)

## Core
Core implements basic behavior for interaction with xat. 
Core designed (if it is appropriate word :)) to be flexible and fast-patchable.
First word means that you can easily customize core (see more below).
About second word. Sometimes xat may update it's protocol. Futhermore, new version of protocol may be incompatible with previous. Attentive code reader may notice, that there are some reasons what makes easier to patch core. Pray the EcmaScript compatibility/portability!

Details of implemented behavior listed below.

When user connects to chat:
* First, client have to determine ip and port of a server.
* It have to send 'y'-packet with basic authentication info: user id, room, main-owner flag.
* Server sends response to sent 'y'-packet. Response contains some information required to process authentication.
* User responds to server's 'y'-packet with 'j2'-packet. 'j2' packet contains quite full auth information, such as: nickname, avatar, homepage, k1, k3 (security keys), d4, d5, ... (info about powers) and so on.
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

The most interesting part of this process is that you need to compute 'l5' attribute using pixel's rgb value, get from specially generated image overlapped by perlin noise. Seeds for perlin noise and image settings goes from 'p' attribute of server's 'y'-packet. This is how it's implement in original swp client. However, range of possible parameters, actually used by server, is quite small. So, the solution is to precalculate all required values of 'l5' and store it, for example, in file.

The process described above is customizable.
