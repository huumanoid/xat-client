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
        this.createSocket = options.createSocket || defaultSocketProvider;
        this.join = {};
        this.socket = null;
    }

    connect() {
        this.join.sjt = getTimer();
        this.pickIp().then(function (res) {
            this.emit('ip-pick', res);
            this.socket = this.createSocket(res, this._myOnConnect);

            let buf = new Buffer(0);

            client.on('error', this._myOnError);

            client.on('data', function (data) {
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

            client.on('end', this._myOnClose);
        }).catch(function (e) {
            this.emit('error', e) 
        });
    }

    
}
