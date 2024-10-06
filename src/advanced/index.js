const plugins = [
    require('./adventure'),
    require('./orbs'),
    require('./perks'),
    require('./antiCopy'),
    require('./auctionHouse'),
    require('./bank'),
    require('./disguise'),
    require('./itemSign'),
    require('./lift'),
    require('./mapInfo'),
    require('./npc'),
    require('./prefix'),
    require('./punishment'),
    require('./spawner'),
    require('./startJail'),
    require('./teleporter')
]

module.exports = function load(bot, ns) {
    plugins.forEach(plugin => plugin(bot, ns))
}
