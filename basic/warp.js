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
            'warp',
            ['to', point],
            'forcedMove',
            ['chat:tpSpamWarning'],
            5000
        )
    }
}
