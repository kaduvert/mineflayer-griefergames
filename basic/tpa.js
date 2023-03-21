// const EventEmitter = require('events')

module.exports = function inject(bot, options) {
    const tpa = bot.ggData.tpa
    bot.chat.loadPatterns(tpa)

    bot.tpa = {
        // events: new EventEmitter()
    }

    bot.tpa.request = (username) => {
        return bot.chat.getChatActionResult(
            bot.chat.buildCommand(tpa.commands.request, username),
            'sent',
            ['toggledError', 'disallowedError'],
            7500
        )
    }

    bot.tpa.requestHere = (username) => {
        return bot.chat.getChatActionResult(
            bot.chat.buildCommand(tpa.commands.requestHere, username),
            'sent',
            ['toggledError', 'disallowedError'],
            7500
        )
    }

    bot.tpa.accept = () => {
        return bot.chat.getChatActionResult(
            tpa.commands.accept,
            'accepted',
            ['disallowedError', 'notFoundError', 'expiredError'],
            7500
        )
    }

    bot.tpa.deny = () => {
        return bot.chat.getChatActionResult(
            tpa.commands.deny,
            'denied',
            ['notFoundError', 'nullError'],
            7500
        )
    }

    bot.tpa.toggle = () => {
        return bot.chat.getChatActionResult(
            tpa.commands.toggle,
            ['activated', 'deactivated'],
            ['notFoundError', 'nullError'],
            7500
        )
    }
}
