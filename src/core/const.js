xconst = {};

xconst.UserRank = Object.freeze({
    GUEST: 0,
    MEMBER: 3,
    MODERATOR: 2,
    OWNER: 4,
    MAIN_OWNER: 1
});

xconst.PWR_MAX_TRADE = 414;
xconst.MAX_PWR_INDEX = parseInt(xconst.PWR_MAX_TRADE / 32) + 1;

module.exports = xconst;
