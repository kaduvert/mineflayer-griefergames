// const EventEmitter = require('events')

module.exports = function inject(bot, options) {
    const status = bot.ggData.status
    bot.chat.loadPatterns(status)

    bot.status = {}

    bot.status.set = (message) => {
        return bot.chat.getChatActionResult(
            bot.chat.buildCommand(status.commands.set, message),
            'chat:statusMessageSet',
            ['chat:statusInsufficientPermissionsError'],
            5000
        )
    }

    bot.status.toggle = () => {
        return bot.chat.getChatActionResult(status.commands.toggle, ['chat:statusActivated', 'chat:statusDeactivated'], ['chat:statusInsufficientPermissionsError'], 5000)
    }
}