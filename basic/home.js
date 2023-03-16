// const EventEmitter = require('events')

module.exports = function inject(bot, options) {
    bot.loadChatPatterns(bot.ggData.home)
    // tpFailure
    // tpSpamWarning

	bot.home = {}

    bot.home.getRawList = () => {
        return bot.chat.getChatActionResult('/homes', ['homeList', 'homesUnset'], [], 5000)
    }

    bot.home.setHome = (homeIdentifier) => {
        return bot.chat.getChatActionResult(`/sethome ${homeIdentifier}`, 'homeSet', [], 5000)
    }

    bot.home.deleteHome = (homeIdentifier) => {
        return bot.chat.getChatActionResult(`/delhome ${homeIdentifier}`, 'homeDeleted', ['homeNotFoundError'], 5000)
    }

    bot.home.teleportTo = (homeIdentifier) => {
        return bot.chat.getChatActionResult(`/home ${homeIdentifier}`, 'forcedMove', ['homeNotFoundError', 'tpFailure', 'tpSpamWarning'], 5000)
    }

    bot.home.parseList = (str) => {
        if (str === 'keine') return []
        return str.split(', ')
    }
}
