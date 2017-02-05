const nooneIsFriend = () => false

const everyoneIsFriend = (user, sender, data) => true

const bind = (user, opts) => {
  opts = opts || {}
  const { nofollow = false, isFriend = nooneIsFriend } = opts
  user.on('data', (data) => {
    const node = data.z || data.p
    if (node && node.attributes.t.substr(0, 2) === '/l') {
      const sender = node.attributes.u.split('_')[0]

      user.sendResponseToLocate(sender, isFriend(user, sender, data), nofollow)
    }
  })
}

module.exports = { bind, nooneIsFriend, everyoneIsFriend }
