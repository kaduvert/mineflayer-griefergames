// const EventEmitter = require('events')

module.exports = function inject(bot, options) {
    bot.loadChatPatterns(bot.ggData.tpa)

	bot.tpa = {
        // events: new EventEmitter()
    }

    bot.tpa.request = (username) => {
        return bot.chat.getChatActionResult(`/tpa ${username}`, 'sentTpa', ['tpaToggled', 'tpaDisallowed'], 7500)
    }

    bot.tpa.requestHere = (username) => {
        return bot.chat.getChatActionResult(`/tpahere ${username}`, 'sentTpa', ['tpaToggled', 'tpaDisallowed'], 7500)
    }

    bot.tpa.accept = () => {
        return bot.chat.getChatActionResult('/tpaccept', 'tpaAccepted', ['tpaDisallowed', 'tpaNotFound', 'tpaExpired'], 7500)
    }

    bot.tpa.deny = () => {
        return bot.chat.getChatActionResult('/tpdeny', 'tpaDenied', ['tpaNotFound', 'tpaNull'], 7500)
    }

    bot.tpa.toggle = () => {
        return bot.chat.getChatActionResult('/tptoggle', ['tpaActivated', 'tpaDeactivated'], ['tpaNotFound', 'tpaNull'], 7500)
    }
}
