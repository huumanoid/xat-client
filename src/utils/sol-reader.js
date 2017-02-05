'use strict'
const amf = require('amflib/node-amf/amf')

const read = (buffer) => {
  const object = {}

  const d = amf.deserializer(buffer.toString('binary'))
  d.readU16() // magic
  d.readU32() // length

  for (let i = 0; i < 10; ++i) {
    d.readU8()
  }

  d.readUTF8(amf.AMF0)

  // padding
  d.readU8()
  d.readU8()
  d.readU8()

  const version = d.readU8()

  do {
    const name = d.readUTF8(version)
    const value = d.readValue(version)
    d.readU8() // padding

    object[name] = value
  } while (d.i !== buffer.length)

  return object
}

module.exports = {
  read,
}
