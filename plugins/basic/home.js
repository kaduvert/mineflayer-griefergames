// const EventEmitter = require('events')

module.exports = function inject(bot, options) {
    bot.chatAddPattern(/^\[GrieferGames\] Deine Home-Punkte: (.+)$/, 'homeList')
    bot.chatAddPattern(/^\[GrieferGames\] Du hast bisher (keine)n Home-Punkt erstellt\.$/, 'homesUnset')

    bot.chatAddPattern(/^\[GrieferGames\] Der Home-Punkt wurde auf deine aktuelle Position gesetzt\.$/, 'homeSet')
    bot.chatAddPattern(/^\[GrieferGames\] Der Home-Punkt (\S+) wurde gelöscht\.$/, 'homeDeleted')

    bot.chatAddPattern(/^\[GrieferGames\] Der Home-Punkt (\S+) wurde nicht gefunden. Nutze \/sethome, um diesen zu setzen\.$/, 'homeNotFoundError')
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
