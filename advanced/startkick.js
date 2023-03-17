const EventEmitter = require('events')

module.exports = function inject(bot, options) {
    const startkick = bot.ggData.startkick
    bot.loadChatPatterns(startkick)

	bot.startkick = {
        listening: false,
        current: [],
        events: new EventEmitter()
	}

	bot.startkick.parse = (raw) => {
        const startkickInfo = raw.join('\n').match(startkick.multiLineRegex)
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