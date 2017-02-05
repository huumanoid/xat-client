'use strict'

var http = require('http')

var xatlib = require('./xatlib.js')

class XatPicker {
  constructor() {
    this.iprules = null
    this.users = {}
  }

  pickIp(user) {
    return new Promise((resolve, reject) => {
      const userno = user.todo.w_userno

      if (this.users[userno] == null) {
        this.users[userno] = { attempt: 0, prevpool: -1 }
      }

      if (this.iprules) {
        return resolve(this._pickIp(user))
      }

      http.get('http://xat.com/web_gear/chat/ip2.php', (res) => {
        let body = ''
        res.on('data', (data) => {
          body += data
        }).on('end', () => {
          try {
            this.iprules = JSON.parse(body)
            resolve(this._pickIp(user))
          } catch (e) {
            reject(e)
          }
        }).on('error', (err) => {
          reject(err)
        })
      })
    })
  }

  /* eslint-disable */
  _pickIp(user) {
      let iprules = this.iprules;
      let users = this.users;

      function arrayToRet(ta) {
          return { host: ta[0], port: ta[1] };
      }

      var _arg1 = user.todo.w_useroom;
      var _local5;
      var _local6;
      var _local7;
      var _local8;
      var _local9;
      var _local10;
      var _local11;
      var attempt = users[user.todo.w_userno].attempt;
      var prevrpool = users[user.todo.w_userno].prevpool;

      var order = user.todo.w_registered && iprules['rorder'] ? iprules['rorder'] : iprules['order'];
      var order = iprules['order'];
      var ret = { }
      if (attempt >= order.length){
          return arrayToRet(new Array("0", 0, 0));
      };
      var _local2 = order[attempt][0];
      var _local3 = iprules[_local2];
      var _local4 = order[attempt][1];
      if ((_local3[0] & 1) == 1){
          _local5 = 0;
          if (prevrpool == -1){
              _local5 = (Math.floor((Math.random() * (_local3.length - 1))) + 1);
          } else {
              _local5 = ((_local5 % (_local3.length - 1)) + 1);
          };
          _local6 = Math.floor((Math.random() * _local3[_local5].length));
          _local7 = _local3[_local5][_local6].split(":");
          if (_local7[1] == undefined){
              _local7[1] = 10000;
          };
          if (_local7[2] == undefined){
              _local7[2] = 39;
          };
          _local8 = (xatlib.xInt(_local7[1]) + Math.floor((Math.random() * xatlib.xInt(_local7[2]))));
          prevrpool = _local5;
          return arrayToRet(new Array(_local7[0], _local8, _local4));
      };
      _local9 = GetDom(_arg1);
      _local10 = GetPort(_arg1);
      _local11 = _local3[1][((4 * _local9) + Math.floor((Math.random() * 4)))];

      return arrayToRet(new Array(_local11, _local10, _local4));
  }
  
  
  _GetDom(_arg1) {
      if (iprules["xFlag"] & 8){
          return (Math.floor((Math.random() * 4)));
      };
      if (xatlib.xInt(_arg1) == 8){
          return (0);
      };
      return (((xatlib.xInt(_arg1))<8) ? 3 : ((xatlib.xInt(_arg1) & 96) >> 5));
  }
  
  _GetPort(_arg1) {
      if (iprules["xFlag"] & 8){
          return 10000 + 7 + Math.floor(Math.random() * 32);
      };
      if (xatlib.xInt(_arg1) == 8){
          return 10000;
      };
      return ((xatlib.xInt(_arg1))<8) ? ((10000 - 1) + xatlib.xInt(_arg1)) : ((10000 + 7) + (xatlib.xInt(_arg1) % 32));
  }
  /* eslint-enable */
}

module.exports = {
  XatPicker: XatPicker,
  defaultPicker: new XatPicker(),
}
