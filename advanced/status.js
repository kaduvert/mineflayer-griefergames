// const EventEmitter = require('events')

module.exports = function inject(bot, options) {
    const status = bot.ggData.loadPatternsAndGetData('status')

    bot.status = {}

    bot.status.set = (message) => {
        return bot.chat.getChatActionResult(
            'status',
            ['set', message],
            'set',
            ['insufficientPermissionsError'],
            5000
        )
    }

    bot.status.toggle = () => {
        return bot.chat.getChatActionResult(
            'status',
            'toggle',
            ['activated', 'deactivated'],
            ['insufficientPermissionsError'],
            5000
        )
    }
}