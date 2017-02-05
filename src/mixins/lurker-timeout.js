'use strict'

module.exports.bind = (user, options) => {
  options = options || {}
  const interval = options.interval || 1000 * 60 * 9

  setInterval(() => {
    if (user.gotDone) {
      user.sendKeepAlive()
    }
  }, interval)
}
