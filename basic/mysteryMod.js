// const EventEmitter = require('events')

module.exports = function inject(bot, options) {
    const mysteryMod = bot.ggData.mysteryMod
    bot.loadChatPatterns(bot.ggData.mysteryMod)
    
	bot.mysteryMod = {
        // events: new EventEmitter()
    }

    bot._client.on('packet', (data, meta) => {
        if (meta.name !== 'custom_payload' || data.channel !== mysteryMod.packetChannelName) return
        const check = Buffer.from(data.data).toString()
        // console.log(check)
        if (check.includes('mysterymod_user_check')) {
            bot._client.write('custom_payload', { channel: mysteryMod.packetChannelName, data: Buffer.from(check.substring(check.indexOf('@'))) })
        } // TODO: handle other payloads
    })
}
