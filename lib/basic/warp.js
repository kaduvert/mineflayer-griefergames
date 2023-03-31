// const EventEmitter = require('events')

module.exports = function inject(bot, options) {
    const pluginId = bot.loadPatternsAndGetData('warp')

    // tpSpamWarning

    bot.warp = {}

    bot.warp.getList = () => {
        return bot.chat.sendFallible({
            patternHead: 'warp',
            command: 'getList',
            successEvent: 'list',
            timeout: 5000
        })
    }

    bot.warp.to = (point) => {
        return bot.chat.sendFallible({
            patternHeads: ['warp', 'teleport'],
            command: ['to', point],
            successEvent: 'forcedMove',
            failureEvent: 'spamWarning',
            timeout: 5000
        })
    }
}
