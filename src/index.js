const fs = require('fs')
const path = require('path');

module.exports = Object.assign((function inject(bot, options) {
    const modules = fs.readdirSync(path.join(__dirname, 'modules')).map(id =>
    ({
        name: id,
        load: (fs.existsSync(path.join(__dirname, 'modules', id, 'index.js')) ? require(`./modules/${id}/index.js`) : null),
        data: (fs.existsSync(path.join(__dirname, 'modules', id, 'data.js')) ? require(`./modules/${id}/data.js`) : null)
    }))

    const mfcmsbase = require('mineflayer-cms-base')('gg', require('./regexAliases'), modules)

    bot.loadPlugin(mfcmsbase)

    const ns = bot.gg

    ns.getPlayerInfo = (username) => {
        const player = bot.players[username]

        return {
            uuid: player.uuid,
            username: player.username,
            rank: ns.playerUtils.getRank(player.username),
            prefix: ns.prefix.get(player.username)
        }
    }
}), {
    antiAfk: require('./addons/antiAfk'),
    chatTerminal: require('./addons/chatTerminal'),
    logging: require('./addons/logging'),
    mysteryModSpoof: require('./addons/mysteryModSpoof')
})
