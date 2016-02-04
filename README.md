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
