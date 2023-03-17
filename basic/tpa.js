// const EventEmitter = require('events')

module.exports = function inject(bot, options) {
    const tpa = bot.ggData.tpa
    bot.loadChatPatterns(tpa)

	bot.tpa = {
        // events: new EventEmitter()
    }

    bot.tpa.request = (username) => {
        return bot.chat.getChatActionResult(tpa.commands.request(username), 'sentTpa', ['tpaToggled', 'tpaDisallowed'], 7500)
    }

    bot.tpa.requestHere = (username) => {
        return bot.chat.getChatActionResult(tpa.commands.requestHere(username), 'sentTpa', ['tpaToggled', 'tpaDisallowed'], 7500)
    }

    bot.tpa.accept = () => {
        return bot.chat.getChatActionResult(tpa.commands.accept(), 'tpaAccepted', ['tpaDisallowed', 'tpaNotFound', 'tpaExpired'], 7500)
    }

    bot.tpa.deny = () => {
        return bot.chat.getChatActionResult(tpa.commands.deny(), 'tpaDenied', ['tpaNotFound', 'tpaNull'], 7500)
    }

    bot.tpa.toggle = () => {
        return bot.chat.getChatActionResult(tpa.commands.toggle(), ['tpaActivated', 'tpaDeactivated'], ['tpaNotFound', 'tpaNull'], 7500)
    }
}
