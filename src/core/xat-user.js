'use strict';
const emitter = require('events').EventEmitter;
const defaults = require('./defaults.js');

class XatUser extends emitter {


    constructor(options) {
        this.todo = options.todo || {};
        this.todo.MAX_PWR_INDEX = this.todo.MAX_PWR_INDEX || parseInt(414 / 32) + 1
        this.global = options.global || {};
        this._ipPicker = options.picker || defaults.picker;
        this._createSocket = options.createSocket || defaults.createSocket;
        this._join = {};
        this._socket = null;
        this._connect = { appempt: 0 };
        this._xatlib = options.xatlib || defaults.xatlib;
        this._perlinNoise = options.perlinNoise || defaults.perlinNoise;
        this.gotDone = false;
    }

    connect() {
        this._join.sjt = getTimer();
        this._ipPicker.pickIp(this).then(function (res) {
            this.emit('ip-pick', res);
            let socket = this._socket = this.createSocket(res, this._myOnConnect);

            let buf = new Buffer(0);

            socket.on('error', this._myOnError);

            socket.on('data', function (data) {
                buf = Buffer.concat([buf, data]);

                let lastZero = -1;
                do {
                    lastZero = buf.indexOf(0, lastZero);
                    if (lastZero === -1) {
                        break;
                    }
                    this._myOnXML(buf.slice(lastZero + 1, i));
                } while (true);
                buf.splice(0, lastZero);
            });

            socket.on('end', this._myOnClose);
        }).catch(function (e) {
            this.emit('error', e) 
        });
    }

    send(packet) {
        return new Promise(function (resolve, reject) {
            if (typeof packet === 'string') {
                this._socket.write(packet + '\0', 'utf8', resolve);
            } else if (packet instanceof Buffer) {
                this._socket.write(packet, '', resolve);
            } else {
                this._buildXML(packet).then(function () {
                    this._socket.write(packet + '\0', 'utf8', resolve);
                }).catch(reject);
            }
        });
    }

    _myOnConnect() {
        this.connected = true
        this.emit('connect')

        let y = { attributes: { }};

        if (this.todo.useport == 80){
            y.attrubutes.p = this._GetPort(this.todo.w_useroom);
            y.attrubutes.s = this._GetDom(this.todo.w_useroom);
        }
        if (this.todo.pass != undefined) {
            y.attrubutes.m = 1;
        }

        y.attrubutes.r = this.todo.w_useroom;
        y.attrubutes.v = this._connect.attempt;
        y.attrubutes.u = this.todo.w_userno;
        xml = this._xatlib.XMLOrder({ y: y }, ["w", "r", "m", "s", "p", "v", "u"]);
        this.send(xml);
    }

    _myOnJoin() {
        let todo = this.todo;
        let global = this.global;
        let xatlib = this._xatlib;
        let jt1 = this._join.jt1;
        let jt2 = this._join.jt2;
        let sjt = this._join.sjt;
        let l5 = this._join.l5;
        let WC = 2;
        let J2_Order;

        var _local8;
        //SetNetworkState(4, -1);
        //todo.DoUserSnd = true;
        var _local1 = xatlib.CleanTextNoXat(todo.w_name);
        var _local2 = xatlib.CleanText(todo.w_avatar);
        var _local3 = xatlib.CleanText(todo.w_homepage);
        if (_local1 == null){
            _local1 = "";
        };
        if (_local2 == null){
            _local2 = "";
        };
        if (_local3 == null){
            _local3 = "";
        };
        this.gotDone = false;
        var _local4 = {};
        var _local5 = _local4.j2 = {};
        //var _local4:* = new XMLDocument();
        //var _local5:* = _local4.createElement("j2");
        _local5.attributes.v = ((todo.w_userrev)==undefined) ? 0 : todo.w_userrev;
        _local5.attributes.h = _local3.substr(0, 128);
        _local5.attributes.a = _local2.substr(0, 128);
        _local5.attributes.n = _local1.substr(0, 0x0100);
        if (todo.Macros != undefined){
            if (todo.Macros["status"] != undefined){
                _local5.attributes.n = (_local5.attributes.n + ("##" + todo.Macros["status"].substr(0, 128)));
            };
        };
        if (todo.w_registered != undefined){
            _local5.attributes.N = todo.w_registered;
        };
        if (todo.w_dt){
            _local5.attributes.dt = todo.w_dt;
        };
        if (todo.w_xats){
            _local5.attributes.dx = todo.w_xats;
        };
        if (todo.w_sn){
            _local5.attributes.sn = todo.w_sn;
        };
        if (todo.w_PowerO != undefined){
            _local5.attributes.dO = todo.w_PowerO;
        };
        if (todo.w_Powers != null){
            _local8 = 0;
            while (_local8 < todo.MAX_PWR_INDEX) {
                if (todo.w_Powers[_local8]){
                    _local5.attributes[("d" + (_local8 + 4))] = todo.w_Powers[_local8];
                };
                _local8++;
            };
        };
        if (todo.w_d3){
            _local5.attributes.d3 = todo.w_d3;
        };
        if (todo.w_d2){
            _local5.attributes.d2 = todo.w_d2;
        };
        if (todo.w_d0 != undefined){
            _local5.attributes.d0 = todo.w_d0;
        };
        if (todo.w_Mask != null){
            _local8 = 0;
            while (_local8 < todo.MAX_PWR_INDEX) {
                if (todo.w_Mask[_local8]){
                    _local5.attributes[("m" + _local8)] = todo.w_Mask[_local8];
                };
                _local8++;
            };
        };
        _local5.attributes.u = ((todo.w_userrev)==undefined) ? 2 : todo.w_userno;
        if (global.rf){
            _local5.attributes.e = "1";
        };
        _local5.attributes.f = ((((global.um)!=undefined) ? 0 : (((todo.w_autologin & 1)) ? 0 : 1) | ((todo.LoginPressed) ? 2 : 0)) | ((global.pass)!=undefined) ? 4 : 0);
        todo.w_autologin = (todo.w_autologin | 1);
        if (((todo.pass) || (!((global.pass == undefined))))){
            _local5.attributes.r = ((global.pass)!=undefined) ? global.pass : todo.pass;
        };
        if (OnGagList(todo.w_useroom)){
            _local5.attributes.b = GetGagTime(todo.w_useroom);
        };
        _local5.attributes.c = todo.w_useroom;
        if (todo.w_pool != undefined){
            _local5.attributes.p = todo.w_pool;
        };
        if (todo.w_d1){
            _local5.attributes.d1 = todo.w_d1;
        };
        _local5.attributes.k3 = xatlib.xInt(todo.w_k3);
        _local5.attributes.k = todo.w_k1;
        _local5.attributes.y = YI;
        if ((global.xc & 32)){
            _local5.attributes.q = 1;
        };
        _local5.attributes.l2 = jt1;
        _local5.attributes.l3 = jt2;
        _local5.attributes.l4 = (getTimer() - sjt);
        _local5.attributes.l5 = l5;
        if (WC > 1){
            _local5.attributes.Y = WC;
        };
        _local5.attributes.cb = todo.w_cb;
        _local6.dispose();

        //_local4.appendChild(_local5);
        if (!J2_Order){
            J2_Order = "cb,Y,l5,l4,l3,l2,q,y,k,k3,d1,z,p,c,b,r,f,e,u";
            _local8 = 0;
            while (_local8 < todo.MAX_PWR_INDEX) {
                J2_Order = (J2_Order + (",m" + _local8));
                _local8++;
            };
            J2_Order = (J2_Order + ",d0");
            _local8 = 2;
            while (_local8 < (todo.MAX_PWR_INDEX + 4)) {
                J2_Order = (J2_Order + (",d" + _local8));
                _local8++;
            };
            J2_Order = (J2_Order + ",dO,sn,dx,dt,N,n,a,h,v");
            J2_Order = J2_Order.split(",");
        };
        var _local7 = xatlib.XMLOrder(_local4, J2_Order);
        this.send(_local7);
    }
}


function getTimer() {
    return new Date().getTime();
}

function OnGagList() {
    return false;
}
