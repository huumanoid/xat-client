'use strict';

const fs = require('fs');
const net = require('net');
const ippick = require('./ippick.js');
const xatlib = require('./xatlib.js');

module.exports = {
    xatlib: xatlib,
    ippicker: ippick.defaultPicker,
    perlinNoise: perlinNoise,
    createSocket: createSocket
};

function createSocket(opts, onConnect) {
    return net.connect(opts, onConnect);
}

function perlinNoise(join) {
    return new Promise(function (resolve, reject) {
        fs.readFile(__dirname + '/' + join.p + '.txt', function (err, data) {
            if (err) {
                reject(err);
            }
            data = data.toString();
            data = data.split('\r\n');
            let coord = join.p_x + ',' + join.p_y;
            for (let i = 0; i < data.length; ++i) {
                let t = data[i].split(':');
                if (t[0] === coord) {
                    resolve(t[1]);
                }
            }
            reject(new Error('Pixel (p_x, p_y) not found.'));
        });
    });
}
