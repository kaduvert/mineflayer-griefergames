// const EventEmitter = require('events')

module.exports = function inject(bot, options) {
    const tpa = bot.ggData.tpa
    bot.loadChatPatterns(tpa)

	bot.tpa = {
        // events: new EventEmitter()
    }

    bot.tpa.request = (username) => {
        return bot.chat.getChatActionResult(tpa.commands.request(username), 'chat:sentTpa', ['chat:tpaToggled', 'chat:tpaDisallowed'], 7500)
    }

    bot.tpa.requestHere = (username) => {
        return bot.chat.getChatActionResult(tpa.commands.requestHere(username), 'chat:sentTpa', ['chat:tpaToggled', 'chat:tpaDisallowed'], 7500)
    }

    bot.tpa.accept = () => {
        return bot.chat.getChatActionResult(tpa.commands.accept(), 'chat:tpaAccepted', ['chat:tpaDisallowed', 'chat:tpaNotFound', 'chat:tpaExpired'], 7500)
    }

    bot.tpa.deny = () => {
        return bot.chat.getChatActionResult(tpa.commands.deny(), 'chat:tpaDenied', ['chat:tpaNotFound', 'chat:tpaNull'], 7500)
    }

    bot.tpa.toggle = () => {
        return bot.chat.getChatActionResult(tpa.commands.toggle(), ['chat:tpaActivated', 'chat:tpaDeactivated'], ['tpaNotFound', 'tpaNull'], 7500)
    }
}
