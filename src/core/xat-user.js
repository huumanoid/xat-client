'use strict';
const emitter = require('events').EventEmitter;


function getTimer() {
    return new Date().getTime();
}

class XatUser extends emitter {


    constructor(options) {
        this.todo = options.todo || {};
        this.global = options.global || {};
        this._pickIp = options.pickIp || defaultIpPicker;
        this._createSocket = options.createSocket || defaultSocketProvider;
        this._join = {};
        this._socket = null;
        this._connect = { appempt: 0 };
    }

    connect() {
        this._join.sjt = getTimer();
        this._pickIp().then(function (res) {
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
}
