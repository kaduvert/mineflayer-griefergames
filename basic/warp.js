// const EventEmitter = require('events')

module.exports = function inject(bot, options) {
    const pluginId = bot.loadPatternsAndGetData('warp')

    // tpSpamWarning

    bot.warp = {}

    bot.warp.getList = () => {
        return bot.chat.getChatActionResult(
            'warp',
            'getList',
            'list',
            [],
            5000
        )
    }

    bot.warp.to = (point) => {
        return bot.chat.getChatActionResult(
            ['warp', 'teleport'],
            ['to', point],
            'forcedMove',
            ['spamWarning'],
            5000
        )
    }
}
