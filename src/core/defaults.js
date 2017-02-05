'use strict'

const fs = require('fs')
const net = require('net')
const path = require('path')

const ippick = require('./ippick.js')
const xatlib = require('./xatlib.js')

function createSocket(opts, onConnect) {
  return net.connect(opts, onConnect)
}

function perlinNoise(join) {
  return new Promise(function (resolve, reject) {
    fs.readFile(path.join(__dirname, join.p + '.txt'), function (err, data) {
      if (err) {
        return reject(err)
      }
      data = data.toString()
      data = data.split('\r\n')
      let coord = join.p_x + ',' + join.p_y
      for (let i = 0; i < data.length; ++i) {
        let t = data[i].split(':')
        if (t[0] === coord) {
          return resolve(t[1])
        }
      }
      reject(new Error('Pixel (p_x, p_y) not found'))
    })
  })
}

module.exports = {
  xatlib: xatlib,
  ippicker: ippick.defaultPicker,
  perlinNoise: perlinNoise,
  createSocket: createSocket,
}
