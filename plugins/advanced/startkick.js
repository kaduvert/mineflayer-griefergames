// const EventEmitter = require('events')

module.exports = function inject(bot, options) {
    bot.chatAddPattern(/^\[StartKick\] Soll der Spieler (\S+) rausgeworfen werden\? \/ja \/nein$/, 'startkickStart')
    bot.chatAddPattern(/^\[StartKick\] Stimme für oder gegen den Rauswurf von (\S+) ab:$/, 'startkickEnd')

    const startkickReg = /^\[StartKick\] Ersteller: (\S+)\n\[StartKick\] Dauer: (\S+) Sekunden\n\[StartKick\] Begründung: (.*)\n\[StartKick\] Stimme für oder gegen den Rauswurf von (\S+) ab:$/s

    bot.chatAddPattern(/^\[GrieferGames\] Die Abstimmung, den Spieler (\S+) zu bestrafen, endet in (\d+) Sekunden!$/, 'startkickCountdown')
    bot.chatAddPattern(/^\[GrieferGames\] Die Abstimmung, ging (\d+) zu (\d+) aus!$/, 'startkickVoting')
    bot.chatAddPattern(/^\[GrieferGames\] (\S+) wurde nicht bestraft$/, 'startkickResult')

	bot.startkick = {
        listening: false,
        current: [],
        events: new EventEmitter()
	}

	bot.startkick.parse = (raw) => {
        const startkickInfo = raw.join('\n').match(startkickReg)
        if (!startkickInfo) return null
        const [_, creator, duration, reasoning, target] = startkickInfo
        return {
            creator,
            duration: +duration,
            reasoning,
            target
        }
    }

	bot.on('message', (msg, pos) => {
        if (!bot.startkick.listening || pos !== 'system' || msg === '»') return
        bot.startkick.current.push(msg)
    })

    bot.on('startkickStart', () => {
        bot.startkick.listening = true
        bot.startkick.current = []
    })

    bot.on('startkickEnd', () => {
        bot.startkick.listening = false
        bot.startkick.events.emit('startkick', [...bot.startkick.current]) // clone it!
    })

    
}