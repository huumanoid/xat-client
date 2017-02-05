'use strict'

/**
 * @param options
 *  interval - interval between reconnects in milliseconds. Default is 2 hours.
 *  only_connected - perform reconnect only if user is connected. Default is false.
 *
 */
module.exports.bind = (user, options) => {
  options = options || {}
  const interval = options.interval || 1000 * 60 * 60 * 2 // 2 hours

  let onlyConnected = options.onlyConnected || false

  // backward compatibility
  if (options.only_connected != null) {
    onlyConnected = options.only_connected
  }

  setInterval(() => {
    if (!onlyConnected || user.isConnected) {
      user.end()
      user.once('close', () => user.connect())
    }
  }, interval)
}
